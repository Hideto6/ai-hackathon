import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "じじいにゅーす",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={cn("h-full antialiased", "font-sans", notoSansJp.variable)}
    >
      <body className={cn("flex min-h-full flex-col", notoSansJp.className)}>
        {children}
      </body>
    </html>
  );
}
