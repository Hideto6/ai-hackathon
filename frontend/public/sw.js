self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title =
    typeof payload.title === "string" && payload.title.trim().length > 0
      ? payload.title.trim()
      : "じじいにゅーす";
  const url = typeof payload.url === "string" ? payload.url : "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: "",
      icon: "/image/icon.png",
      badge: "/image/icon.png",
      data: { url },
      tag: "jijii-news-push",
      renotify: true,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(
      (clientList) => {
        const targetUrl =
          event.notification?.data?.url && typeof event.notification.data.url === "string"
            ? event.notification.data.url
            : "/";

        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return undefined;
      },
    ),
  );
});
