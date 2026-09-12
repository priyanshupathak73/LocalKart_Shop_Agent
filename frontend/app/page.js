import HomeClient from './HomeClient';

export const metadata = {
  title: 'Merchant & Partner Portal Login | e-LocalKart',
  description: 'Sign in to access your e-LocalKart Shopkeeper or Delivery Partner portal.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <HomeClient />;
}
