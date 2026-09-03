import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const HOTELBEDS_ACTIVITIES_URL = "https://api.test.hotelbeds.com/activity-api/3.0/activities";

export async function POST(request: Request) {
  const apiKey = process.env.HOTELBEDS_API_KEY;
  const secret = process.env.HOTELBEDS_SECRET;
  if (!apiKey || !secret) {
    return NextResponse.json({ error: "Hotelbeds activities is not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("destination" in body) || typeof body.destination !== "string" || !body.destination.trim()) {
    return NextResponse.json({ error: "destination is required" }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha256").update(apiKey + secret + timestamp).digest("hex");

  try {
    const response = await fetch(HOTELBEDS_ACTIVITIES_URL, {
      method: "POST",
      headers: {
        "Api-key": apiKey,
        "X-Signature": signature,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        language: "ENG",
        from: "2026-09-03",
        to: "2026-12-31",
        destination: { code: body.destination.trim() },
        pagination: { itemsPerPage: 20, page: 1 },
      }),
    });
    const data: unknown = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Hotelbeds activities request failed" }, { status: 502 });
  }
}