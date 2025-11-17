import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import ClientBodyFix from '@/components/ClientBodyFix';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'highphaus - Community ETH Faucet',
  description:
    'Get $0.10 worth of ETH instantly. Contribute to highphaus and claim up to $1. OG NFT for first 1000 contributors.',
  keywords: ['highphaus', 'ETH', 'Faucet', 'Base', 'NFT', 'Community'],
  authors: [{ name: 'highphaus' }],
  openGraph: {
    title: 'highphaus - Community ETH Faucet',
    description: 'Get $0.10 worth of ETH instantly. Contribute and earn OG NFT.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'highphaus',
    description: 'Get $0.10 worth of ETH instantly. Contribute and earn OG NFT.',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://highp-haus.vercel.app' 
      : 'http://localhost:3000')
  ),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              margin: 0;
              padding: 0;
              background: #FFFFFF !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              -webkit-font-smoothing: antialiased;
            }
            #__next {
              min-height: 100vh;
              background: #FFFFFF;
            }
          `
        }} />
      </head>
      <body className={inter.className} style={{ background: '#FFFFFF', color: '#000000', margin: 0, padding: 0 }}>
        <ClientBodyFix />
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', background: '#FFFFFF', color: '#000000' }}>
            <h1>JavaScript Required</h1>
            <p>Please enable JavaScript to use this application.</p>
          </div>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
