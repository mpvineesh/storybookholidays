/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SITE_URL = process.env.SITE_URL || 'https://storybookholidays.com';
const API_BASE_URL = process.env.SEO_API_BASE_URL || 'https://api.storybookholidays.com';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/kerala', priority: 0.9, changefreq: 'weekly' },
  { path: '/india', priority: 0.9, changefreq: 'weekly' },
  { path: '/world', priority: 0.9, changefreq: 'weekly' },
  { path: '/destinations', priority: 0.8, changefreq: 'weekly' },
  { path: '/packages', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/mission', priority: 0.4, changefreq: 'yearly' },
  { path: '/vision', priority: 0.4, changefreq: 'yearly' },
  { path: '/our-story', priority: 0.5, changefreq: 'yearly' },
  { path: '/backwaters', priority: 0.7, changefreq: 'monthly' },
  { path: '/theyyam', priority: 0.7, changefreq: 'monthly' },
  { path: '/ayurveda', priority: 0.7, changefreq: 'monthly' },
  { path: '/arts', priority: 0.7, changefreq: 'monthly' },
];

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (ch) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[ch])
  );

const buildSitemap = (entries) => {
  const today = new Date().toISOString().slice(0, 10);
  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc>
    <lastmod>${entry.lastmod || today}</lastmod>
    <changefreq>${entry.changefreq || 'monthly'}</changefreq>
    <priority>${entry.priority != null ? entry.priority : 0.6}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>
`;
};

const main = async () => {
  let packageSlugs = [];
  try {
    const response = await fetchJson(`${API_BASE_URL}/api/packages`);
    packageSlugs = (response.data || [])
      .map((entry) => entry.slug)
      .filter(Boolean);
    console.log(`[seo] fetched ${packageSlugs.length} package slugs`);
  } catch (err) {
    console.warn(`[seo] could not fetch packages from ${API_BASE_URL}: ${err.message}`);
  }

  const entries = [
    ...STATIC_ROUTES,
    ...packageSlugs.map((slug) => ({
      path: `/package/${slug}`,
      priority: 0.8,
      changefreq: 'weekly',
    })),
  ];

  const sitemap = buildSitemap(entries);
  const sitemapPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`[seo] wrote sitemap with ${entries.length} URLs → ${sitemapPath}`);

  const includeRoutes = entries.map((entry) => entry.path);
  const includePath = path.resolve(__dirname, 'react-snap-include.json');
  fs.writeFileSync(includePath, JSON.stringify(includeRoutes, null, 2));
  console.log(`[seo] wrote react-snap include list with ${includeRoutes.length} routes`);
};

main().catch((err) => {
  console.error('[seo] generation failed:', err);
  process.exitCode = 1;
});
