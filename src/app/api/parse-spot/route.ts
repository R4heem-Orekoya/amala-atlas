// src/app/api/parse-spot/route.ts
import { NextResponse } from "next/server";

/**
 * Lightweight heuristic parser for prototyping.
 * Returns { parsed: {...}, summary: "..." }
 */
export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const lower = text.toLowerCase();
  //eslint-disable-next-line
  const parsed: any = {};

  const nameMatch = text.match(/^(.*?)\s*(?:at|,|located at|on)\s/);
  if (nameMatch) parsed.name = nameMatch[1].trim();

  if (!parsed.name) {
    const prefix = text.split(",")[0].trim();
    if (prefix.length > 2 && /\w+/.test(prefix)) parsed.name = prefix;
  }

  const addressMatch = text.match(
    /(?:at|located at|on)\s+([0-9A-Za-z\s\.,-]+)/
  );
  if (addressMatch) {
    parsed.address = addressMatch[1]
      .split(/,? lat|,? lng|,? tags|,? rating/i)[0]
      .trim();
  }

  const latMatch = text.match(/lat(?:itude)?:?\s*([+-]?\d+(\.\d+)?)/i);
  const lngMatch = text.match(/l(?:on|ng|ongitude)?:?\s*([+-]?\d+(\.\d+)?)/i);
  if (latMatch) parsed.latitude = parseFloat(latMatch[1]);
  if (lngMatch) parsed.longitude = parseFloat(lngMatch[1]);

  const categories = [
    "restaurant",
    "street-food",
    "cafe",
    "food-joint",
    "bukateria",
    "amala",
  ];
  for (const c of categories) {
    if (lower.includes(c)) {
      parsed.category = c === "amala" ? "restaurant" : c;
      if (!parsed.cuisine && c === "amala") parsed.cuisine = "amala";
      break;
    }
  }

  const ratingMatch = text.match(/rating[:\s]*([0-5](?:\.\d)?)/i);
  if (ratingMatch) parsed.rating = parseFloat(ratingMatch[1]);

  const tagsMatch = text.match(/tags?[:\s]*([a-z0-9,\s-]+)/i);
  if (tagsMatch) {
    parsed.tags = tagsMatch[1]
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  } else {
    const possibleTags = [
      "authentic",
      "affordable",
      "cheap",
      "expensive",
      "family-friendly",
      "late-night",
    ];
    parsed.tags = possibleTags.filter((t) => lower.includes(t));
  }

  const explicitCity = text.match(/city[:\s]*([A-Za-z\s]+)/i);
  if (explicitCity) parsed.city = explicitCity[1].trim();

  parsed.summary = {
    name: parsed.name ?? null,
    address: parsed.address ?? null,
    latitude: parsed.latitude ?? null,
    longitude: parsed.longitude ?? null,
    category: parsed.category ?? null,
    tags: parsed.tags ?? [],
    rating: parsed.rating ?? null,
  };

  return NextResponse.json({ parsed, summary: parsed.summary });
}
