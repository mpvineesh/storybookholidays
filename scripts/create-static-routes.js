const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');
const defaultDocumentPath = path.join(buildDir, 'default.htm');

const staticRoutes = [
  'admin',
  'home',
  'about',
  'destinations',
  'packages',
  'package',
  'contact',
  'mission',
  'vision',
  'our-story',
  'backwaters',
  'theyyam',
  'ayurveda',
  'kerala',
  'arts',
];

if (!fs.existsSync(indexHtmlPath)) {
  throw new Error(`Build output not found at ${indexHtmlPath}`);
}

fs.copyFileSync(indexHtmlPath, defaultDocumentPath);

staticRoutes.forEach((route) => {
  const routeDir = path.join(buildDir, route);
  const routeIndexPath = path.join(routeDir, 'index.html');
  const routeDefaultDocumentPath = path.join(routeDir, 'default.htm');

  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexHtmlPath, routeIndexPath);
  fs.copyFileSync(indexHtmlPath, routeDefaultDocumentPath);
});

console.log(`Created static route files for ${staticRoutes.length} routes plus the root default document.`);
