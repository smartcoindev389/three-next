export default async function sitemap() {
  // Base URL for your site
  const baseUrl = 'https://platformz.us';

  // Static routes (add all the necessary static pages)
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: '2024-12-01', // Replace with the appropriate last modified date
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/3d-virtualization`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/build-your-platform`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/casestudy`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/e-commerce`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/ourprocess`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/referral-policy`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/referral-program`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/refund-privacy`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/request`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/services`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: '2024-12-01',
    },
    {
      url: `${baseUrl}/venture-program`,
      lastModified: '2024-12-01',
    },
    // Add more static pages if necessary
  ];

  // Fetch dynamic routes from Strapi
  const res = await fetch(process.env.NEXT_PUBLIC_STRAPI_URL + 'api/header?pLevel', { cache: 'no-cache' });
  const data = await res.json();

  const services = data.data.navigation.navigation_link[0].sub_menu.map((service) => ({
    slug: service.path,
    updatedAt: service.updatedAt,
  }));

  // Dynamic routes from Strapi posts
  const dynamicRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
  }));

  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes];
}
