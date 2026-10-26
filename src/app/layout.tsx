import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { SocialLinksProvider } from '@/components/FooterSocialLinks';
import { getSocialLinks } from '@/lib/publicData';
import { GTM_ID, META_PIXEL_ID } from '@/lib/tracking';
import TrackingTags from '@/components/TrackingTags';
import './globals.css';

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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = await getSocialLinks();

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

        {/*
          Meta Pixel (noscript). Written as raw HTML on purpose: as a JSX <img>, React turns
          it into <link rel="preload" as="image"> in the head, so every visitor with JavaScript
          still fired this tracking request (PageSpeed: "cache lifetimes", third-party).
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" alt="" />`,
          }}
        />

        <SocialLinksProvider links={socialLinks}>{children}</SocialLinksProvider>

        {/* GTM, GA4 and the Meta Pixel — started on first interaction (or a few seconds after load), see TrackingTags */}
        <TrackingTags />
      </body>
    </html>
  );
}
