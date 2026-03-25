import { NextResponse } from "next/server";

import { getPublicVapidKey } from "@/lib/push";

export const runtime = "nodejs";

export async function GET() {
  const publicKey = getPublicVapidKey();

  if (!publicKey) {
    return NextResponse.json(
      { error: "VAPID public key is not configured." },
      { status: 500 },
    );
  }

  return NextResponse.json({ publicKey });
}
