import { NextResponse } from "next/server";
import webpush from "web-push";

import {
  getPushAdminSecret,
  getStoredSubscriptions,
  getWebPushConfig,
  removeStoredSubscription,
} from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = getWebPushConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Push env vars are not configured." },
      { status: 500 },
    );
  }

  const secret = getPushAdminSecret();
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { title?: unknown; url?: unknown };
  const title =
    typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim()
      : null;
  const url =
    typeof body.url === "string" && body.url.trim().length > 0
      ? body.url.trim()
      : "/";

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  webpush.setVapidDetails(
    config.subject,
    config.publicKey,
    config.privateKey,
  );

  const subscriptions = await getStoredSubscriptions();
  let sent = 0;

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title,
          url,
        }),
      );
      sent += 1;
    } catch (error) {
      const statusCode =
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        typeof error.statusCode === "number"
          ? error.statusCode
          : 0;

      if (statusCode === 404 || statusCode === 410) {
        await removeStoredSubscription(subscription.endpoint);
      }
    }
  }

  return NextResponse.json({ ok: true, sent, total: subscriptions.length });
}
