"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const consentKey = "forgeko_analytics_consent";

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<"unknown" | "accepted" | "declined">("unknown");

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = window.localStorage.getItem(consentKey);
      if (stored === "accepted" || stored === "declined") {
        setConsent(stored);
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  function updateConsent(value: "accepted" | "declined") {
    window.localStorage.setItem(consentKey, value);
    setConsent(value);
  }

  const plausibleScriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL;
  const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const plausibleSource =
    plausibleScriptUrl ?? (plausibleHost ? `${plausibleHost.replace(/\/$/, "")}/js/script.js` : undefined);
  const plausibleScriptProps = plausibleDomain && !plausibleScriptUrl ? { "data-domain": plausibleDomain } : {};

  return (
    <>
      {consent === "accepted" && plausibleSource ? (
        <>
          <Script id="plausible-init" strategy="afterInteractive">
            {`
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init()
            `}
          </Script>
          <Script async src={plausibleSource} strategy="afterInteractive" {...plausibleScriptProps} />
        </>
      ) : null}
      {consent === "accepted" && clarityProjectId ? (
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      ) : null}
      {consent === "unknown" ? (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl border border-forgeko-border bg-forgeko-section p-4 shadow-2xl sm:left-auto sm:w-[32rem]">
          <p className="text-sm leading-6 text-neutral-300">
            Forgeko uses privacy-conscious analytics to understand waitlist conversion. No advertising cookies are loaded unless you accept.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="focus-ring bg-forgeko-accent px-4 py-2 text-sm font-semibold text-white"
              onClick={() => updateConsent("accepted")}
            >
              Accept analytics
            </button>
            <button
              type="button"
              className="focus-ring border border-forgeko-border px-4 py-2 text-sm text-forgeko-text"
              onClick={() => updateConsent("declined")}
            >
              Decline
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
