function readEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://forgeko.com";
}

export function getServerEnv() {
  return {
    siteUrl: getSiteUrl(),
    supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
    resendApiKey: readEnv("RESEND_API_KEY"),
    resendFromEmail: readEnv("RESEND_FROM_EMAIL", "hello@forgeko.com"),
    resendReplyToEmail: process.env.RESEND_REPLY_TO_EMAIL
  };
}
