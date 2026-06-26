import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { PageAmbientField } from "@/components/PageAmbientField";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forgeko.com";
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "x98rtg96a8";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Forgeko — SaaS Operating System for Solo Builders",
  description:
    "Forgeko is a SaaS operating system for solo builders, guiding idea validation, landing pages, payments, launch workflows, and growth analytics in one environment.",
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Forgeko — SaaS Operating System for Solo Builders",
    description:
      "The AI-guided SaaS environment for solo builders. Validation, landing, payments, growth analytics — one system, full context.",
    url: siteUrl,
    siteName: "Forgeko",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Forgeko waitlist" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgeko — SaaS Operating System for Solo Builders",
    description: "The AI-guided SaaS environment for solo builders.",
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
  logo: `${siteUrl}/logo-on-light.png`,
  sameAs: []
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {clarityProjectId ? (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityProjectId}");
`
            }}
          />
        ) : null}
      </head>
      <body>
        <PageAmbientField />
        {children}
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
