/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const reactSnap = require('react-snap');

const includePath = path.resolve(__dirname, 'react-snap-include.json');

let include = ['/'];
if (fs.existsSync(includePath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(includePath, 'utf8'));
    if (Array.isArray(parsed) && parsed.length > 0) {
      include = parsed;
    }
  } catch (err) {
    console.warn(`[react-snap] could not parse ${includePath}: ${err.message}`);
  }
}

console.log(`[react-snap] prerendering ${include.length} routes`);

const localChromePaths = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const fsLocal = require('fs');
const executablePath = localChromePaths.find((p) => fsLocal.existsSync(p));
if (executablePath) {
  console.log(`[react-snap] using Chrome at ${executablePath}`);
}

reactSnap
  .run({
    source: 'build',
    minifyHtml: { collapseWhitespace: true, removeComments: true },
    inlineCss: false,
    puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    puppeteerExecutablePath: executablePath,
    skipThirdPartyRequests: true,
    waitFor: 1500,
    include,
  })
  .catch((err) => {
    console.error('[react-snap] failed:', err);
    process.exit(1);
  });
