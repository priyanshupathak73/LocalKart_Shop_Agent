export const metadata = {
  title: 'Register as Shopkeeper Partner | e-LocalKart Merchant Portal',
  description: 'Join e-LocalKart as a verified local Kirana and retail store partner. Expand your customer reach, sell groceries and daily essentials, and get same-hour doorstep delivery.',
  alternates: {
    canonical: '/register-shopkeeper',
  },
  openGraph: {
    title: 'Register as Shopkeeper Partner - e-LocalKart',
    description: 'Grow your local Kirana store sales with e-LocalKart quick commerce platform.',
    url: 'https://merchant.e-localkart.in/register-shopkeeper',
    siteName: 'e-LocalKart Merchant Portal',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Register as Shopkeeper Partner - e-LocalKart',
    description: 'Empowering local Kiranas with same-hour doorstep delivery. Register your shop today.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterShopkeeperLayout({ children }) {
  return children;
}
