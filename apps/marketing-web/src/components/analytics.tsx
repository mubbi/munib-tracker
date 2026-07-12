import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsPageViews } from "@/components/google-analytics-page-views";
import { getGaMeasurementId } from "@/lib/gtag";

/**
 * Consent Mode defaults must run before any Google tag commands.
 * Google’s Privacy & Messaging cookie consent popup (when enabled for the
 * tag in Google Ads / Tag Manager) updates these via gtag('consent','update').
 */
const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;

export function Analytics() {
  const measurementId = getGaMeasurementId();
  if (!measurementId) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {CONSENT_DEFAULT_SCRIPT}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageViews />
      </Suspense>
    </>
  );
}
