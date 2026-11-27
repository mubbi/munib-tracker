import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsPageViews } from "@/components/google-analytics-page-views";
import { CONSENT_STORAGE_KEY } from "@/lib/consent-storage";
import { getGaMeasurementId } from "@/lib/gtag";

/**
 * Consent Mode defaults must run before any Google tag commands.
 * Stored preferences (if any) are restored immediately after so returning
 * visitors keep their choice within `wait_for_update`.
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
try {
  var raw = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  if (raw) {
    var parsed = JSON.parse(raw);
    if (parsed && parsed.preferences && parsed.preferences.analytics) {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }
} catch (e) {}
`;

export function Analytics() {
  const measurementId = getGaMeasurementId();
  if (!measurementId) return null;

  // Consent defaults, the restored choice and the GA config are queued first
  // (tiny inline script), so every later page_view / event has its
  // destination. The ~180 KB gtag.js library itself loads after the page has
  // finished loading (`lazyOnload`) and then processes the queue — it never
  // competes with the page's own rendering and hydration.
  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`${CONSENT_DEFAULT_SCRIPT}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true, send_page_view: false });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsPageViews />
      </Suspense>
    </>
  );
}
