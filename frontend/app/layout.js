import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import NavigationProgressBar from '../components/NavigationProgressBar';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://merchant.e-localkart.in'),
  title: 'e-LocalKart - Merchant & Shopkeeper Portal',
  description: 'Empowering local commerce by connecting offline store owners with logistics partners on e-LocalKart.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/assets/Logo.png',
    shortcut: '/assets/Logo.png',
    apple: '/assets/Logo.png',
  },
  openGraph: {
    title: 'e-LocalKart - Merchant & Shopkeeper Portal',
    description: 'Empowering local commerce by connecting offline store owners with logistics partners on e-LocalKart.',
    url: 'https://merchant.e-localkart.in/',
    siteName: 'e-LocalKart Merchant Hub',
    images: [
      {
        url: '/assets/Logo.png',
        width: 1456,
        height: 1080,
        alt: 'e-LocalKart Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-LocalKart - Merchant & Shopkeeper Portal',
    description: 'Empowering local commerce by connecting offline store owners with logistics partners on e-LocalKart.',
    images: ['/assets/Logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#f9fafb] text-[#111827]">
        <NavigationProgressBar />
        {children}
      </body>
    </html>
  );
}
