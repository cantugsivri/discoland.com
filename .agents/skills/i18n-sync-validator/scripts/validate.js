/**
 * DISCOLAND — i18n Translation Sync Validator
 * Recursively checks keys between TR and EN, and validates HTML usage.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../../');
const transPath = path.join(rootDir, 'js', 'translations.js');
const htmlPath = path.join(rootDir, 'index.html');

if (!fs.existsSync(transPath)) {
  console.error('[ERROR] translations.js not found at:', transPath);
  process.exit(1);
}

const transContent = fs.readFileSync(transPath, 'utf8');

// Safely extract translations object
let translations;
try {
  const sandbox = {};
  const fn = new Function('sandbox', `${transContent}\nsandbox.translations = translations;`);
  fn(sandbox);
  translations = sandbox.translations;
} catch (err) {
  console.error('[ERROR] Failed to evaluate translations.js:', err);
  process.exit(1);
}

if (!translations.tr || !translations.en) {
  console.error('[ERROR] translations must contain both "tr" and "en" roots');
  process.exit(1);
}

function getLeafKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getLeafKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const trKeys = new Set(getLeafKeys(translations.tr));
const enKeys = new Set(getLeafKeys(translations.en));

console.log(`\n--- DISCOLAND i18n Validation Report ---`);
console.log(`Total TR translation keys: ${trKeys.size}`);
console.log(`Total EN translation keys: ${enKeys.size}`);

const missingInEn = [...trKeys].filter(k => !enKeys.has(k));
const missingInTr = [...enKeys].filter(k => !trKeys.has(k));

let hasErrors = false;

if (missingInEn.length > 0) {
  hasErrors = true;
  console.log(`\n[WARNING] Keys present in TR but missing in EN (${missingInEn.length}):`);
  missingInEn.forEach(k => console.log(`  - ${k}`));
} else {
  console.log(`\n[OK] All TR keys exist in EN dictionary.`);
}

if (missingInTr.length > 0) {
  hasErrors = true;
  console.log(`\n[WARNING] Keys present in EN but missing in TR (${missingInTr.length}):`);
  missingInTr.forEach(k => console.log(`  - ${k}`));
} else {
  console.log(`[OK] All EN keys exist in TR dictionary.`);
}

// Validate HTML keys
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const attrRegex = /data-i18n(?:-html)?=["']([^"']+)["']/g;
  let match;
  const htmlKeys = new Set();
  while ((match = attrRegex.exec(htmlContent)) !== null) {
    htmlKeys.add(match[1]);
  }

  console.log(`\nTotal keys referenced in index.html: ${htmlKeys.size}`);
  const missingInTranslations = [...htmlKeys].filter(k => !trKeys.has(k));

  if (missingInTranslations.length > 0) {
    hasErrors = true;
    console.log(`[ERROR] Keys in index.html not found in translations (${missingInTranslations.length}):`);
    missingInTranslations.forEach(k => console.log(`  - ${k}`));
  } else {
    console.log(`[OK] All HTML data-i18n attributes exist in translations.`);
  }
}

if (hasErrors) {
  console.log(`\nStatus: Issues found that require synchronization.\n`);
  process.exit(1);
} else {
  console.log(`\nStatus: 100% Synced & Healthy!\n`);
  process.exit(0);
}
