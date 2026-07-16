import type { Metadata } from "next";
import { spaceGrotesk, inter, jetbrainsMono } from "@/lib/fonts";
import { SITE_CONFIG } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";
import "@/styles/nv-theme.css";

export const metadata: Metadata = {
  title: {
    default: "NexxVantage — Premium Software Design Studio & Engineering House",
    template: "%s",
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nv-theme');
                  if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a href="#main" className="nv-skip-link">Skip to content</a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
            email: SITE_CONFIG.email,
            slogan: SITE_CONFIG.tagline,
            address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
            sameAs: Object.values(SITE_CONFIG.social),
          }}
        />
        <Navbar />
        <main id="main" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
