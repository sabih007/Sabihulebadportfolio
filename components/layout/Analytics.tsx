import Script from "next/script";

/**
 * Optional, env-gated analytics. Nothing loads unless a variable is set, so the
 * default build ships no third-party script at all.
 *
 * Two mutually compatible options:
 *   NEXT_PUBLIC_GA_ID        — GA4, e.g. "G-XXXXXXXXXX"
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN — Plausible, e.g. "sabihulebad.com"
 *
 * `afterInteractive` rather than `beforeInteractive`: analytics must never sit
 * on the critical path of a page whose Core Web Vitals are a ranking input.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!ga && !plausible) return null;

  return (
    <>
      {plausible ? (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}

      {ga ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}
    </>
  );
}
