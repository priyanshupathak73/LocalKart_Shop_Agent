export const metadata = {
  title: 'Register as Delivery Partner | e-LocalKart Delivery Fleet',
  description: 'Become an e-LocalKart delivery partner. Deliver local orders with flexible hours, competitive payouts, and weekly incentives in your city.',
  alternates: {
    canonical: '/register-delivery',
  },
  openGraph: {
    title: 'Register as Delivery Partner - e-LocalKart',
    description: 'Join the e-LocalKart express delivery fleet and start earning today.',
    url: 'https://merchant.e-localkart.in/register-delivery',
    siteName: 'e-LocalKart Delivery Fleet',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Register as Delivery Partner - e-LocalKart',
    description: 'Earn with flexible delivery shifts in your neighborhood. Register as an e-LocalKart rider today.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterDeliveryLayout({ children }) {
  return children;
}
