/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'admin', 'dist');
const targetDir = path.join(rootDir, 'build', 'admin');

if (!fs.existsSync(sourceDir)) {
  console.error(`[admin-build] missing source directory: ${sourceDir}`);
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`[admin-build] copied ${sourceDir} to ${targetDir}`);
