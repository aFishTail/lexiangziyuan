import type { Metadata } from "next";
import { RootProvider } from "@/components/providers/root-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lenjoy 资源分享站",
    template: "%s | Lenjoy 资源分享站",
  },
  description:
    "精选网络资源与优质网站资源导航，为创作者与效率工作者提供灵感与工具。",
  metadataBase: new URL("https://lenjoy.example.com"),
  generator: "Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
