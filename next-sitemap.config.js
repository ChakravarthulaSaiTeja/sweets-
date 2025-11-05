/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://kotaiahfoods.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  additionalPaths: async (config) => {
    const result = [];
    
    try {
      // Try to fetch from database using dynamic import
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const products = await prisma.product.findMany({
        where: {
          isVisible: true,
          isActive: true,
        },
        select: {
          slug: true,
        },
      });

      // Add product pages to sitemap
      products.forEach((product) => {
        result.push({
          loc: `/products/${product.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString(),
        });
      });

      // Add category pages
      const categories = await prisma.category.findMany({
        where: {
          isActive: true,
        },
        select: {
          slug: true,
        },
      });

      categories.forEach((category) => {
        result.push({
          loc: `/products/${category.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: new Date().toISOString(),
        });
      });

      await prisma.$disconnect();
    } catch (error) {
      console.error('Error generating sitemap paths:', error);
      // Fallback to static paths if database is not available
      result.push(
        { loc: '/products/gulab-jamun', changefreq: 'weekly', priority: 0.8 },
        { loc: '/products/kaju-katli', changefreq: 'weekly', priority: 0.8 },
        { loc: '/products/kakinada-kaja', changefreq: 'weekly', priority: 0.8 },
        { loc: '/products/rasagulla', changefreq: 'weekly', priority: 0.8 },
        { loc: '/products/sweets', changefreq: 'weekly', priority: 0.7 },
        { loc: '/products/hot-snacks', changefreq: 'weekly', priority: 0.7 },
        { loc: '/products/pickles', changefreq: 'weekly', priority: 0.7 },
        { loc: '/products/powders', changefreq: 'weekly', priority: 0.7 },
        { loc: '/products/gift-boxes', changefreq: 'weekly', priority: 0.7 }
      );
    }

    return result;
  },
};

