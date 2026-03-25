import { NextResponse } from "next/server";
import webpush from "web-push";

import { getWebPushConfig, validatePushSubscription } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = getWebPushConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Push env vars are not configured." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    subscription?: unknown;
    title?: unknown;
  };
  const subscription = validatePushSubscription(body.subscription);
  const title =
    typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim()
      : "テスト通知";

  if (!subscription) {
    return NextResponse.json(
      { error: "Invalid push subscription." },
      { status: 400 },
    );
  }

  webpush.setVapidDetails(
    config.subject,
    config.publicKey,
    config.privateKey,
  );

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title,
      url: "/",
    }),
  );

  return NextResponse.json({ ok: true });
}
