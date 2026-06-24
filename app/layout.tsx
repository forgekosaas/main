import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forgeko.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Forgeko — The Operating System for Your SaaS",
  description:
    "From idea validation to first revenue. Forgeko guides solo builders through validation, landing, payments, and growth — in one environment that never forgets where you left off.",
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Forgeko — Stop Building. Start Launching.",
    description:
      "The AI-guided environment for solo SaaS builders. Validation, landing, payments, growth — one system, full context.",
    url: siteUrl,
    siteName: "Forgeko",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Forgeko waitlist" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgeko — Stop Building. Start Launching.",
    description: "The AI-guided environment for solo SaaS builders.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A"
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Forgeko",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-guided operating system for solo SaaS builders. Validation, landing page, payments, growth analytics in one environment.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  url: siteUrl
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Forgeko",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: []
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <AnalyticsConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
