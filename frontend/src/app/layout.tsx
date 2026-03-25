import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/shared/ui/shadcn/ui/sonner";

export const metadata: Metadata = {
  title: "じじいにゅーす",
  applicationName: "じじいにゅーす",
  icons: {
    icon: [
      { url: "/image/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/image/icon.png", type: "image/png" },
    ],
    shortcut: [
      { url: "/image/icon.png", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "じじいにゅーす",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("h-full antialiased", "font-sans")}>
      <body className={cn("flex min-h-full flex-col")}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
