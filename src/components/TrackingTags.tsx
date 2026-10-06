'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, GTM_ID, META_PIXEL_ID } from '@/lib/tracking';

/** If the visitor does nothing, the tags still start this long after the page has loaded. */
const FALLBACK_MS = 5000;

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * Google Tag Manager, GA4 and the Meta Pixel (~500 KB of third-party JavaScript, the single
 * biggest cost on every page in PageSpeed: unused JS, main-thread blocking, LCP).
 *
 * They no longer start while the page is still loading and hydrating. They start on the
 * visitor's first interaction (tap, click, key press or scroll) or, if they just sit
 * there, FALLBACK_MS after the page has loaded — whichever comes first. Everyone who
 * reads or uses the page is counted exactly as before; the only visits not counted
 * are ones that leave inside those first seconds without touching the page.
 */
export default function TrackingTags() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    const start = () => {
      cleanup();
      setEnabled(true);
    };
    const arm = () => {
      timer = window.setTimeout(start, FALLBACK_MS);
    };
    const cleanup = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener('load', arm);
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, start));
    };

    INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });

    return cleanup;
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>

      {/* Google Analytics (gtag.js) */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}
