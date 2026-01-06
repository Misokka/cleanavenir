/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://cleanavenir.com',
  generateRobotsTxt: false, // On utilise notre propre robots.txt
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/dashboard/*',
    '/*/dashboard/*',
    '/server-sitemap.xml',
  ],
  alternateRefs: [
    {
      href: 'https://cleanavenir.com/fr',
      hreflang: 'fr',
    },
    {
      href: 'https://cleanavenir.com/en',
      hreflang: 'en',
    },
  ],
  transform: async (config, path) => {
    // Définir les priorités par page
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/' || path === '/fr' || path === '/en') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/learn-more')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.includes('/login') || path.includes('/register')) {
      priority = 0.8;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
