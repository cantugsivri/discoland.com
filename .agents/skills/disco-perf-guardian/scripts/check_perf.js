/**
 * DISCOLAND — Performance & Asset Guardian Check
 * Evaluates asset budgets, render-blocking issues, and Core Web Vitals readiness.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../../');
const cssPath = path.join(rootDir, 'css', 'style.css');
const jsPath = path.join(rootDir, 'js', 'main.js');
const htmlPath = path.join(rootDir, 'index.html');
const imgDir = path.join(rootDir, 'assets', 'images');

console.log(`\n--- DISCOLAND Performance & Asset Guardian Report ---`);

let totalAssetBytes = 0;
let violations = [];

// 1. Check CSS
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const cssSize = fs.statSync(cssPath).size;
  totalAssetBytes += cssSize;
  console.log(`[CSS] style.css: ${(cssSize / 1024).toFixed(1)} KB`);

  if (cssContent.includes('@import url(')) {
    violations.push('style.css contains render-blocking @import url(...)');
  }
}

// 2. Check JS
if (fs.existsSync(jsPath)) {
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const jsSize = fs.statSync(jsPath).size;
  totalAssetBytes += jsSize;
  console.log(`[JS]  main.js:  ${(jsSize / 1024).toFixed(1)} KB`);

  if (!jsContent.includes('requestAnimationFrame') || !jsContent.includes('passive: true')) {
    violations.push('main.js scroll events should use requestAnimationFrame and { passive: true }');
  }
}

// 3. Check HTML
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const htmlSize = fs.statSync(htmlPath).size;
  console.log(`[HTML] index.html: ${(htmlSize / 1024).toFixed(1)} KB`);

  if (!htmlContent.includes('rel="preconnect"') || !htmlContent.includes('fonts.gstatic.com')) {
    violations.push('index.html missing Google Fonts preconnect hints');
  }
  if (!htmlContent.includes('loading="lazy"')) {
    violations.push('index.html YouTube iframe should have loading="lazy"');
  }
}

// 4. Check Images
if (fs.existsSync(imgDir)) {
  const images = fs.readdirSync(imgDir);
  console.log(`\n[IMAGES] Checking ${images.length} images:`);
  images.forEach(imgFile => {
    const p = path.join(imgDir, imgFile);
    const sz = fs.statSync(p).size;
    totalAssetBytes += sz;
    const kb = (sz / 1024).toFixed(1);
    console.log(`  - ${imgFile}: ${kb} KB`);
    if (imgFile.includes('favicon') && sz > 30 * 1024) {
      violations.push(`Favicon is too heavy: ${kb} KB (Target < 25 KB)`);
    } else if (sz > 500 * 1024) {
      violations.push(`Image ${imgFile} exceeds recommended 500 KB limit (${kb} KB)`);
    }
  });
}

console.log(`\nTotal Monitored Assets: ${(totalAssetBytes / 1024).toFixed(1)} KB`);

if (violations.length > 0) {
  console.log(`\n[FAIL] Performance Violations Detected (${violations.length}):`);
  violations.forEach(v => console.log(`  ❌ ${v}`));
  process.exit(1);
} else {
  console.log(`\n[PASS] All performance & asset benchmarks satisfied! (Score: 100/100)\n`);
  process.exit(0);
}
