export const metadata = {
  title: 'Register as Delivery Partner | e-LocalKart Fleet',
  description: 'Join the e-LocalKart delivery partner fleet (elocalkart / LocalKart delivery fleet). Deliver local orders with flexible hours, competitive payouts, and weekly incentives.',
  alternates: {
    canonical: '/register-delivery',
  },
  openGraph: {
    title: 'e-LocalKart Delivery Partner - Join the Fleet',
    description: 'Join the e-LocalKart express delivery fleet (elocalkart delivery partner) and start earning on neighborhood orders today.',
    url: 'https://merchant.e-localkart.in/register-delivery',
    siteName: 'e-LocalKart Delivery Fleet',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-LocalKart Delivery Partner - Join the Fleet',
    description: 'Earn with flexible delivery shifts in your neighborhood. Register as an e-LocalKart rider today.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const deliveryPartnerSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://merchant.e-localkart.in/register-delivery/#webpage",
      "url": "https://merchant.e-localkart.in/register-delivery",
      "name": "e-LocalKart Delivery Partner Registration",
      "description": "Onboarding and registration page for delivery partners on e-LocalKart (elocalkart / LocalKart delivery fleet).",
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

export default function RegisterDeliveryLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deliveryPartnerSchema) }}
      />
      {children}
    </>
  );
}
