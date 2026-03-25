import { NextResponse } from "next/server";

import {
  upsertStoredSubscription,
  validatePushSubscription,
} from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { subscription?: unknown };
  const subscription = validatePushSubscription(body.subscription);

  if (!subscription) {
    return NextResponse.json(
      { error: "Invalid push subscription." },
      { status: 400 },
    );
  }

  await upsertStoredSubscription(subscription);

  return NextResponse.json({ ok: true });
}
