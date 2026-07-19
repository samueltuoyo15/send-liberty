const config = {
  siteUrl: 'https://sendlib.samueltuoyo.com', 
  generateRobotsTxt: true, 
  exclude: ['/api/*', '/login'], 
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