const defaultClarityProjectId = "x98rtg96a8";
const defaultPlausibleDomain = "forgeko.com";
const defaultPlausibleScriptPath = "/p/js/script";
const defaultPlausibleEndpointPath = "/p/event";
const legacyPlausibleScriptPath = "/p/js/script.js";

export interface AnalyticsEnv {
  NEXT_PUBLIC_CLARITY_PROJECT_ID?: string;
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;
  NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL?: string;
  NEXT_PUBLIC_PLAUSIBLE_ENDPOINT?: string;
}

export function getAnalyticsConfig(env: AnalyticsEnv) {
  const configuredScriptUrl = env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || defaultPlausibleScriptPath;

  return {
    clarityProjectId: env.NEXT_PUBLIC_CLARITY_PROJECT_ID || defaultClarityProjectId,
    plausible: {
      domain: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || defaultPlausibleDomain,
      scriptUrl:
        configuredScriptUrl === legacyPlausibleScriptPath
          ? defaultPlausibleScriptPath
          : configuredScriptUrl,
      endpoint: env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT || defaultPlausibleEndpointPath
    }
  };
}
