export const metadata = {
  title: 'Register as Shopkeeper | e-LocalKart Merchant',
  description: 'Join e-LocalKart Merchant (e-LocalKart for Merchants / elocalkart merchant partner). Register your local Kirana store and sell online with same-hour doorstep delivery.',
  alternates: {
    canonical: '/register-shopkeeper',
  },
  openGraph: {
    title: 'e-LocalKart Merchant - Register as Shopkeeper Partner',
    description: 'Join e-LocalKart Merchant (LocalKart / elocalkart merchant partner) to digitize your neighborhood store and expand customer reach.',
    url: 'https://merchant.e-localkart.in/register-shopkeeper',
    siteName: 'e-LocalKart Merchant',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-LocalKart Merchant - Register as Shopkeeper Partner',
    description: 'Empowering local Kirana merchants with same-hour doorstep delivery. Register your shop on e-LocalKart today.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const merchantShopkeeperSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://merchant.e-localkart.in/register-shopkeeper/#webpage",
      "url": "https://merchant.e-localkart.in/register-shopkeeper",
      "name": "e-LocalKart Merchant - Register as Shopkeeper",
      "description": "Onboarding and registration page for shopkeepers on e-LocalKart Merchant (e-LocalKart for Merchants / elocalkart merchant).",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://merchant.e-localkart.in/#website",
        "url": "https://merchant.e-localkart.in",
        "name": "e-LocalKart Merchant",
        "alternateName": [
          "e-LocalKart for Merchants",
          "elocalkart merchant",
          "e local kart merchant",
          "LocalKart merchant"
        ]
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.e-localkart.in/#organization",
      "name": "e-LocalKart",
      "alternateName": [
        "elocalkart",
        "LocalKart",
        "e local kart",
        "e-local kart"
      ],
      "url": "https://www.e-localkart.in",
      "logo": "https://www.e-localkart.in/assets/Logo.png"
    }
  ]
};

export default function RegisterShopkeeperLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(merchantShopkeeperSchema) }}
      />
      {children}
    </>
  );
}
