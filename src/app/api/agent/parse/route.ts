// app/api/agent/parse/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type ParsedSpot = {
  name?: string;
  address?: string;
  city?: string;
  category?: string;
  cuisine?: string;
  tags?: string[];
  rating?: number;
  priceBand?: string | null;
  description?: string;
  latitude?: number;
  longitude?: number;
  confidence?: number;
  needsClarification?: boolean;
  clarifyingQuestion?: string | null;
  //eslint-disable-next-line
  provenance?: any;
};

type AgentResponse = {
  parsed: ParsedSpot;
  suggestedCoordinates?: {
    latitude: number;
    longitude: number;
    source: "geocode" | "heuristic" | "user";
  } | null;
  //eslint-disable-next-line
  duplicates?: any[];
  nudges?: string[];
  message: string;
  needsClarification: boolean;
};

const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT || "AmalaAtlas/1.0 (contact@example.com)";

const ai = new GoogleGenAI({});

function extractJSON(text: string) {
  try {
    if (!text) return {};

    // Remove markdown fences like ```json ... ```
    text = text
      .replace(/```[a-z]*\n?/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find first {...} block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return {};

    return JSON.parse(match[0]);
  } catch (e) {
    console.warn("Failed to parse AI JSON:", e, text);
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = (body?.text ?? "").toString();
    const conversation = body?.conversation ?? [];

    if (!text.trim()) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const systemPrompt = `You are a data extraction assistant for Amala Atlas, 
a community platform for mapping ONLY "Amala" spots in Nigeria. 
"Amala" is a traditional Yoruba dish made from yam, cassava, or plantain flour.

Your tasks:
1. If the user is describing an **Amala spot** (buka, restaurant, cafeteria, etc.), 
   extract structured fields:

   - name (string)
   - address (string)
   - city (string)
   - category (string, e.g. "restaurant", "buka", "cafeteria")
   - cuisine (string, must include "Amala" or "Yoruba")
   - tags (array of short strings)
   - rating (0–5)
   - priceBand (string or null, e.g. "cheap", "moderate", "expensive")
   - description (string)
   - latitude (number, optional)
   - longitude (number, optional)

   If any REQUIRED fields (name, address, category) are missing or ambiguous,
   respond with needsClarification=true and provide a single clarifyingQuestion string. 
   Do NOT assume missing required fields.

2. If the user is describing a **non-Amala spot** (e.g. pizza, burger, shawarma),
   set needsClarification=true and clarifyingQuestion="Amala Atlas is only for Amala spots. 
   This entry doesn’t seem related to Amala." Do NOT try to parse details for non-Amala spots.

Return ONLY valid JSON (no markdown, no comments).`.trim();

    const fullPrompt = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(conversation)
        ? //eslint-disable-next-line
          conversation.map((m: any) => ({ role: m.role, content: m.text }))
        : []),
      { role: "user", content: text },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt.map((m) => m.content).join("\n"),
    });

    const rawText = response.text ?? "";
    const parsed: ParsedSpot = extractJSON(rawText);

    parsed.confidence = parsed.confidence ?? 0.7;
    parsed.needsClarification = !!parsed.needsClarification;

    const required: (keyof ParsedSpot)[] = ["name", "address", "category"];
    const missing = required.filter((f) => !parsed[f]);
    if (!parsed.needsClarification && missing.length > 0) {
      parsed.needsClarification = true;
      parsed.clarifyingQuestion =
        parsed.clarifyingQuestion ||
        `I need a bit more info: could you provide the ${missing.join(
          " and "
        )}?`;
    }

    const assistantMessage = parsed.needsClarification
      ? parsed.clarifyingQuestion ||
        "I need more information to complete the form."
      : "I parsed the Amala spot. Prefilling the form for you.";

    let suggestedCoordinates = null;
    if (parsed.address && parsed.address.trim().length > 0) {
      try {
        const query = `${parsed.address.trim()}, Nigeria`;
        const q = encodeURIComponent(query);

        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&limit=1`,
          { headers: { "User-Agent": NOMINATIM_USER_AGENT } }
        );

        if (nomRes.ok) {
          const nomJson = await nomRes.json();
          console.log("Nominatim raw response:", nomJson);
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

    const nudges: string[] = [];
    if ((!parsed.tags || parsed.tags.length === 0) && parsed.confidence < 0.8)
      nudges.push("Add tags to help others find this Amala spot.");
    if (!parsed.description)
      nudges.push("A short description (1–2 lines) helps users decide.");

    const finalResponse: AgentResponse = {
      parsed,
      suggestedCoordinates,
      duplicates: [],
      nudges,
      message: assistantMessage,
      needsClarification: parsed.needsClarification,
    };

    return NextResponse.json(finalResponse);
    //eslint-disable-next-line
  } catch (err: any) {
    console.error("Agent parse error:", err);
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
