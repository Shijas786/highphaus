import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
