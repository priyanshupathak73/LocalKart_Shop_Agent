import ShopkeeperClientLayout from './ShopkeeperClientLayout';

export const metadata = {
  title: 'Shopkeeper Portal | e-LocalKart',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ShopkeeperLayout({ children }) {
  return <ShopkeeperClientLayout>{children}</ShopkeeperClientLayout>;
}
