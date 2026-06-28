import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const devScriptPolicy = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";
const discoveryLinkHeader = [
  "</.well-known/api-catalog>; rel=\"api-catalog\"",
  "</openapi.json>; rel=\"service-desc\"; type=\"application/openapi+json\"",
  "</docs/api>; rel=\"service-doc\"; type=\"text/html\"",
  "</llms.txt>; rel=\"describedby\"; type=\"text/markdown\"",
  "</.well-known/agent-skills/index.json>; rel=\"describedby\"; type=\"application/json\""
].join(", ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Link", value: discoveryLinkHeader },
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=3600" }
        ]
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src 'self' 'unsafe-inline'${devScriptPolicy} https://*.forgeko.com https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.forgeko.com; connect-src 'self' https://*.forgeko.com https://*.supabase.co https://api.resend.com https://cloudflareinsights.com https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/www",
        destination: "https://forgeko.com",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
