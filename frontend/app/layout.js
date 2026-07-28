import './globals.css';
import NavigationProgressBar from '../components/NavigationProgressBar';

export const metadata = {
  title: 'LocalKart - Shopkeeper & Delivery Partner Portal',
  description: 'Empowering local commerce by connecting offline store owners with logistics partners.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NavigationProgressBar />
        {children}
      </body>
    </html>
  );
}
