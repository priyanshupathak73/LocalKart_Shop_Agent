export default function sitemap() {
  const baseUrl = 'https://merchant.e-localkart.in';
  const currentDate = new Date();

  return [
    {
      url: `${baseUrl}/register-shopkeeper`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register-delivery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
