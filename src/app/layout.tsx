import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

/** GA4 measurement ID for thecoralroom. */
const GA_MEASUREMENT_ID = 'G-KPX4KXFG9B';

/** Google Tag Manager ID. */
const GTM_ID = 'GTM-NW44F65C';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Coral Room — Digital experiences built to be seen, trusted, and chosen',
  description: 'We help ambitious brands turn scattered clicks into customers through sharper identity, smarter websites, and performance-led marketing.',
  verification: {
    google: 'HWl6_Pb6rKSfez6wnTKD3dWJ_DVYlnNBDZRbn-6socg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body className="antialiased selection:bg-[#9FE66F] selection:text-black">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}

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

        {/*
          Google Analytics (gtag.js). next/script with afterInteractive is the
          App Router equivalent of dropping the snippet in <head>: Next hoists
          it and loads it once hydration is done, so it does not block first
          paint. It still runs on every route because the root layout wraps
          them all.
        */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
