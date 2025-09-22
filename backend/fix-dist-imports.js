#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && full.endsWith('.js')) processFile(full);
  }
}

function processFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  // Replace import/export from './module' -> './module.js' when the specifier is relative and has no extension
  s = s.replace(/(from\s+['"])(\.\.\/|\.\/)([^'".][^'"']*?)(['"])/g, (m, p1, rel, rest, p4) => {
    // don't add .js if it already has an extension or is a bare import
    if (rest.match(/\.(js|json|css|mjs|cjs)$/)) return m;
    return p1 + rel + rest + '.js' + p4;
  });
  // handle export ... from '...'
  s = s.replace(/(export\s+\*\s+from\s+['"])(\.\.\/|\.\/)([^'".][^'"']*?)(['"])/g, (m, p1, rel, rest, p4) => {
    if (rest.match(/\.(js|json|css|mjs|cjs)$/)) return m;
    return p1 + rel + rest + '.js' + p4;
  });
  fs.writeFileSync(file, s, 'utf8');
}

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) {
  console.error('dist directory not found:', dist);
  process.exit(1);
}
walk(dist);
console.log('Patched imports in', dist);
