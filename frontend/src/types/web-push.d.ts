declare module "web-push" {
  interface PushSubscriptionLike {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
      auth: string;
      p256dh: string;
    };
  }

  interface WebPushError extends Error {
    statusCode?: number;
  }

  interface WebPushModule {
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    sendNotification(
      subscription: PushSubscriptionLike,
      payload?: string,
    ): Promise<unknown>;
  }

  const webpush: WebPushModule;

  export default webpush;
  export type { PushSubscriptionLike, WebPushError };
}
