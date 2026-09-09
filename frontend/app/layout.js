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
  title: 'LocalKart - Merchant & Shopkeeper Portal',
  description: 'Empowering local commerce by connecting offline store owners with logistics partners.',
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
