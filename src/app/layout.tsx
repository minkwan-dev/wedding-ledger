import type { Metadata, Viewport } from "next";
import { Great_Vibes } from "next/font/google";

import { Toaster } from "@/shared/components/Toaster";
import { THEME_STORAGE_KEY } from "@/shared/lib/constants";

import "./globals.css";

// 로고 전용 스크립트 폰트
const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedding Ledger",
  description: "결혼식 축의금 관리 서비스",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16171a" },
  ],
};

const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`h-full antialiased ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
