import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery Platform",
  description: "Minimal, functional MVP for AI model discovery, filtering, and side-by-side comparison.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
