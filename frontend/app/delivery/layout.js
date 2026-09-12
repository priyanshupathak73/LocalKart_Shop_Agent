import DeliveryClientLayout from './DeliveryClientLayout';

export const metadata = {
  title: 'Delivery Partner Portal | e-LocalKart',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DeliveryLayout({ children }) {
  return <DeliveryClientLayout>{children}</DeliveryClientLayout>;
}
