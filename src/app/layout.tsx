import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Coral Room — Digital experiences built to be seen, trusted, and chosen',
  description: 'We help ambitious brands turn scattered clicks into customers through sharper identity, smarter websites, and performance-led marketing.',
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
        {children}
      </body>
    </html>
  );
}
