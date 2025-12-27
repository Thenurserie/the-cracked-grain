import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CookieConsent } from '@/components/CookieConsent';
import { OrganizationSchema, WebsiteSchema } from '@/components/StructuredData';
import { AuthProvider } from '@/contexts/AuthContext';
import NetworkStatus from '@/components/NetworkStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://thecrackedgrain.com'),
  title: 'The Cracked Grain | Premium Homebrew Supplies in Bryant, Arkansas',
  description: 'Shop quality brewing ingredients, equipment, and supplies. Grains, hops, yeast, and everything you need to brew better beer. Free shipping over $75.',
  keywords: 'homebrew supplies, brewing ingredients, craft beer, hops, grains, yeast, brewing equipment, Bryant Arkansas',
  icons: {
    icon: 'https://admin.thecrackedgrain.com/assets/5a80e87b-402a-4d9b-b8f2-c1622865aa46',
    shortcut: 'https://admin.thecrackedgrain.com/assets/5a80e87b-402a-4d9b-b8f2-c1622865aa46',
    apple: 'https://admin.thecrackedgrain.com/assets/5a80e87b-402a-4d9b-b8f2-c1622865aa46',
  },
  openGraph: {
    title: 'The Cracked Grain | Premium Homebrew Supplies',
    description: 'Shop quality brewing ingredients, equipment, and supplies. Free shipping over $75.',
    url: 'https://thecrackedgrain.com',
    siteName: 'The Cracked Grain',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Cracked Grain | Premium Homebrew Supplies',
    description: 'Shop quality brewing ingredients, equipment, and supplies. Free shipping over $75.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cracked Grain',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <NetworkStatus />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieConsent />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
