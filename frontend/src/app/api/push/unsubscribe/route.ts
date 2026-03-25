import { NextResponse } from "next/server";

import { removeStoredSubscription } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { endpoint?: unknown };

  if (typeof body.endpoint !== "string" || body.endpoint.length === 0) {
    return NextResponse.json({ error: "Invalid endpoint." }, { status: 400 });
  }

  await removeStoredSubscription(body.endpoint);

  return NextResponse.json({ ok: true });
}
