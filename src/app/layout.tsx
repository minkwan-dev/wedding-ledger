import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "축의금 관리",
  description: "결혼식 축의금 관리 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
