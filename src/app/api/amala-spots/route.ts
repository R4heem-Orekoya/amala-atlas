import { NextResponse } from "next/server";

export async function GET(req: Request) {
   const { searchParams } = new URL(req.url);
   const lat = searchParams.get("lat");
   const lng = searchParams.get("lng");

   const url = `https://places-api.foursquare.com/places/search?query=Amala&ll=${lat},${lng}&radius=100000&limit=50`;

   const res = await fetch(url, {
      headers: {
         Accept: "application/json",
         "X-Places-Api-Version": "2025-06-17",
         Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY as string}`,
      },
   });

   const data = await res.json();
   console.log(data);

   return NextResponse.json(data);
}
