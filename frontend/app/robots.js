export default function robots() {
  const baseUrl = 'https://merchant.e-localkart.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/register-shopkeeper',
          '/register-delivery',
        ],
        disallow: [
          '/shopkeeper/',
          '/delivery/',
          '/add-product',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
