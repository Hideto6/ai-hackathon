export interface StoredPushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
}

const PUSH_SUBSCRIPTIONS_KEY = "push:subscriptions";
const inMemorySubscriptions = new Map<string, StoredPushSubscription>();

function getKvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

async function runKvCommand(command: string[]) {
  const kv = getKvConfig();

  if (!kv) {
    return null;
  }

  const response = await fetch(kv.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kv.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`);
  }

  const data = (await response.json()) as { result?: unknown };
  return data.result ?? null;
}

export function validatePushSubscription(
  value: unknown,
): StoredPushSubscription | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const subscription = value as Record<string, unknown>;
  const keys =
    subscription.keys && typeof subscription.keys === "object"
      ? (subscription.keys as Record<string, unknown>)
      : null;

  if (
    typeof subscription.endpoint !== "string" ||
    typeof keys?.auth !== "string" ||
    typeof keys?.p256dh !== "string"
  ) {
    return null;
  }

  return {
    endpoint: subscription.endpoint,
    expirationTime:
      typeof subscription.expirationTime === "number"
        ? subscription.expirationTime
        : null,
    keys: {
      auth: keys.auth,
      p256dh: keys.p256dh,
    },
  };
}

export async function getStoredSubscriptions() {
  const fromKv = await runKvCommand(["GET", PUSH_SUBSCRIPTIONS_KEY]);
  if (typeof fromKv === "string") {
    try {
      const parsed = JSON.parse(fromKv) as unknown[];
      return parsed
        .map((item) => validatePushSubscription(item))
        .filter((item): item is StoredPushSubscription => item !== null);
    } catch {
      return [];
    }
  }

  return Array.from(inMemorySubscriptions.values());
}

async function saveStoredSubscriptions(subscriptions: StoredPushSubscription[]) {
  const serialized = JSON.stringify(subscriptions);
  const kv = getKvConfig();

  if (!kv) {
    inMemorySubscriptions.clear();
    subscriptions.forEach((subscription) => {
      inMemorySubscriptions.set(subscription.endpoint, subscription);
    });
    return;
  }

  await runKvCommand(["SET", PUSH_SUBSCRIPTIONS_KEY, serialized]);
}

export async function upsertStoredSubscription(
  subscription: StoredPushSubscription,
) {
  const subscriptions = await getStoredSubscriptions();
  const next = subscriptions.filter(
    (item) => item.endpoint !== subscription.endpoint,
  );
  next.push(subscription);
  await saveStoredSubscriptions(next);
}

export async function removeStoredSubscription(endpoint: string) {
  const subscriptions = await getStoredSubscriptions();
  const next = subscriptions.filter((item) => item.endpoint !== endpoint);
  await saveStoredSubscriptions(next);
}

export function getPublicVapidKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}

export function getWebPushConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

export function getPushAdminSecret() {
  return process.env.PUSH_ADMIN_SECRET ?? "";
}
