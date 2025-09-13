import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT || "AmalaAtlas/1.0 (contact@example.com)";

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY not set. /api/agent/parse will fail unless provided."
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = (body?.text ?? "").toString();
    const conversation = body?.conversation ?? [];

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const systemPrompt = `You are a data extraction assistant for Amala Atlas.
Given a user message describing a food spot, extract structured fields (name, address, city, category, cuisine, tags (array), rating (0-5), priceBand, description, latitude, longitude).
If any REQUIRED fields (name, address, category) are missing or ambiguous, respond with needsClarification=true and provide a single clarifyingQuestion string. Do NOT assume missing required fields.
Return a JSON object with: parsed, confidence, needsClarification, clarifyingQuestion.
`;

    // init Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // build prompt (Gemini does not support function_call like OpenAI, so force JSON)
    const messages = [
      systemPrompt,
      ...(Array.isArray(conversation)
        ? conversation.map((m: any) => m.text)
        : []),
      text,
    ].join("\n\n");

    const result = await model.generateContent(messages);
    const responseText = result.response.text();

    let parsed: any = {};
    try {
      // try to parse JSON from Gemini output
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("JSON parse error", e);
    }

    parsed = parsed || {};
    parsed.confidence = parsed.confidence ?? 0.7;

    // required fields enforcement
    const required: (keyof typeof parsed)[] = ["name", "address", "category"];
    const missing = required.filter((f) => !parsed[f]);
    if (missing.length > 0) {
      parsed.needsClarification = true;
      parsed.clarifyingQuestion =
        parsed.clarifyingQuestion ||
        `I need a bit more info: could you provide the ${missing.join(
          " and "
        )}?`;
    }

    // coords via Nominatim
    let suggestedCoordinates = null;
    if ((!parsed.latitude || !parsed.longitude) && parsed.address) {
      try {
        const q = encodeURIComponent(parsed.address);
        const nomUrl = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
        const nomRes = await fetch(nomUrl, {
          headers: { "User-Agent": NOMINATIM_USER_AGENT },
        });
        if (nomRes.ok) {
          const nomJson = await nomRes.json();
          if (Array.isArray(nomJson) && nomJson.length > 0) {
            const top = nomJson[0];
            suggestedCoordinates = {
              latitude: parseFloat(top.lat),
              longitude: parseFloat(top.lon),
              source: "geocode" as const,
            };
          }
        }
      } catch (e) {
        console.warn("Nominatim failure", e);
      }
    }

    // nudges
    const nudges: string[] = [];
    if ((!parsed.tags || parsed.tags.length === 0) && parsed.confidence < 0.8) {
      nudges.push("Add tags to help others find this spot.");
    }
    if (!parsed.description)
      nudges.push("A short description (1–2 lines) helps users decide.");

    return NextResponse.json({
      parsed,
      suggestedCoordinates,
      duplicates: [],
      nudges,
      message: parsed.needsClarification
        ? parsed.clarifyingQuestion
        : "Parsed fields",
      needsClarification: !!parsed.needsClarification,
    });
  } catch (err: any) {
    console.error("Agent parse error:", err);
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
