const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');
const adminDir = path.join(buildDir, 'admin');
const adminIndexPath = path.join(adminDir, 'index.html');
const defaultDocumentPath = path.join(buildDir, 'default.htm');
const adminDefaultDocumentPath = path.join(adminDir, 'default.htm');

if (!fs.existsSync(indexHtmlPath)) {
  throw new Error(`Build output not found at ${indexHtmlPath}`);
}

fs.mkdirSync(adminDir, { recursive: true });
fs.copyFileSync(indexHtmlPath, adminIndexPath);
fs.copyFileSync(indexHtmlPath, defaultDocumentPath);
fs.copyFileSync(adminIndexPath, adminDefaultDocumentPath);

console.log('Created static route files at build/index.html, build/default.htm, build/admin/index.html, and build/admin/default.htm');
