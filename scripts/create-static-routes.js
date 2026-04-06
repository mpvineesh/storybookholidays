const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');
const adminDir = path.join(buildDir, 'admin');
const adminIndexPath = path.join(adminDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  throw new Error(`Build output not found at ${indexHtmlPath}`);
}

fs.mkdirSync(adminDir, { recursive: true });
fs.copyFileSync(indexHtmlPath, adminIndexPath);

console.log('Created static admin route at build/admin/index.html');
