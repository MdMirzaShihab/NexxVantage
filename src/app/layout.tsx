import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexxVantage — We Build Software That Scales",
    template: "%s | NexxVantage",
  },
  description:
    "Custom software & AI solutions engineered for performance, built for the future.",
  metadataBase: new URL("https://nexxvantage.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NexxVantage",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-brand-secondary text-white`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
