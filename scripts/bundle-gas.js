// Script to bundle Vite output into a single self-contained Index.html for Google Apps Script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const distAssetsDir = path.join(distDir, 'assets');
const gasDir = path.join(rootDir, 'google-apps-script');

if (!fs.existsSync(gasDir)) {
  fs.mkdirSync(gasDir, { recursive: true });
}

const htmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error('Error: dist/index.html not found. Please run vite build first.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Find CSS files in dist/assets
const assetFiles = fs.readdirSync(distAssetsDir);
const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
const jsFiles = assetFiles.filter(f => f.endsWith('.js'));

// Inline CSS
let allCss = '';
for (const cssFile of cssFiles) {
  const cssContent = fs.readFileSync(path.join(distAssetsDir, cssFile), 'utf8');
  allCss += `\n/* Inline: ${cssFile} */\n` + cssContent;
}

// Remove <link rel="stylesheet" crossorigin href="/assets/...">
html = html.replace(/<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/[^"]+\.css">/g, '');
html = html.replace(/<link\s+rel="stylesheet"\s+href="\/assets\/[^"]+\.css">/g, '');

// Inject style tag before </head>
html = html.replace('</head>', `<style>\n${allCss}\n</style>\n</head>`);

// Inline JS
let allJs = '';
for (const jsFile of jsFiles) {
  const jsContent = fs.readFileSync(path.join(distAssetsDir, jsFile), 'utf8');
  allJs += `\n// Inline: ${jsFile}\n` + jsContent;
}

// Remove <script type="module" crossorigin src="/assets/...">
html = html.replace(/<script\s+type="module"\s+crossorigin\s+src="\/assets\/[^"]+\.js"><\/script>/g, '');
html = html.replace(/<script\s+type="module"\s+src="\/assets\/[^"]+\.js"><\/script>/g, '');

// In Google Apps Script, we can also inject Google Script Run helper
const gasHelperScript = `
<script>
  // Google Apps Script environment detection & bridge
  window.IS_GOOGLE_APPS_SCRIPT = typeof google !== 'undefined' && typeof google.script !== 'undefined';
  console.log('App running in Google Apps Script mode:', window.IS_GOOGLE_APPS_SCRIPT);
</script>
`;

// Inject bundle script before </body>
html = html.replace('</body>', `${gasHelperScript}\n<script type="module">\n${allJs}\n</script>\n</body>`);

// Output to google-apps-script/Index.html
const outputPath = path.join(gasDir, 'Index.html');
fs.writeFileSync(outputPath, html, 'utf8');

const stats = fs.statSync(outputPath);
console.log(`Successfully generated Google Apps Script bundle: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
