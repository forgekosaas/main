import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const devScriptPolicy = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot
  },
  async headers() {
    return [
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
              `default-src 'self'; script-src 'self' 'unsafe-inline'${devScriptPolicy} https://*.forgeko.com https://www.clarity.ms https://scripts.clarity.ms https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.forgeko.com https://www.clarity.ms; connect-src 'self' https://*.forgeko.com https://*.supabase.co https://api.resend.com https://www.clarity.ms https://*.clarity.ms https://plausible.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
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
