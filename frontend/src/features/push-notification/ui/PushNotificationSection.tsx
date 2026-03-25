"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/ui/card";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("このブラウザは Service Worker に対応していません。");
  }

  return navigator.serviceWorker.register("/sw.js");
}

interface PushNotificationSectionProps {
  sampleTitle: string;
}

export function PushNotificationSection({
  sampleTitle,
}: PushNotificationSectionProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    setIsSupported(supported);

    if (!supported) {
      return;
    }

    setPermission(Notification.permission);

    void getServiceWorkerRegistration().then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(Boolean(subscription));
    });
  }, []);

  const handleEnable = async () => {
    try {
      setIsBusy(true);

      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        toast.error("通知が許可されていません");
        return;
      }

      const registration = await getServiceWorkerRegistration();
      const keyResponse = await fetch("/api/push/public-key");
      if (!keyResponse.ok) {
        throw new Error("公開鍵の取得に失敗しました。");
      }

      const { publicKey } = (await keyResponse.json()) as { publicKey: string };
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      if (!response.ok) {
        throw new Error("購読の保存に失敗しました。");
      }

      setIsSubscribed(true);
      toast.success("このスマホで通知を受け取れるようにしました");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "通知の有効化に失敗しました。",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleDisable = async () => {
    try {
      setIsBusy(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        return;
      }

      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });

      await subscription.unsubscribe();
      setIsSubscribed(false);
      toast.info("このスマホの通知を解除しました");
    } catch {
      toast.error("通知の解除に失敗しました。");
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendTest = async () => {
    try {
      setIsBusy(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        throw new Error("先に通知を有効化してください。");
      }

      toast.success("30秒後にテスト通知を送信します");

      await new Promise((resolve) => {
        window.setTimeout(resolve, 30_000);
      });

      const response = await fetch("/api/push/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          title: sampleTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("テスト通知の送信に失敗しました。");
      }

      toast.success("テスト通知を送信しました");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "テスト通知の送信に失敗しました。",
      );
    } finally {
      setIsBusy(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">スマホ通知</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          このブラウザでは Push 通知を使えません。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">スマホ通知</CardTitle>
        <p className="text-sm text-muted-foreground">
          ニュースのタイトルだけをスマホへ通知します。
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          権限: {permission === "granted" ? "許可済み" : permission === "denied" ? "拒否" : "未選択"}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={isSubscribed ? handleDisable : handleEnable}
            disabled={isBusy}
            className="flex-1"
          >
            {isSubscribed ? <BellOff className="size-4" /> : <Bell className="size-4" />}
            {isSubscribed ? "通知を解除" : "このスマホで通知を受け取る"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSendTest}
            disabled={isBusy || !isSubscribed}
            className="flex-1"
          >
            <Send className="size-4" />
            テスト通知
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
