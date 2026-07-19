const config = {
  siteUrl: 'https://sendlib.samueltuoyo.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/login', '/dashboard', '/dashboard/*'],
  changefreq: 'daily',
  priority: 0.8,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/*', '/dashboard/*', '/login'] }
    ]
  }
};

export default config;