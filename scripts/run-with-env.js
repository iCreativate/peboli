#!/usr/bin/env node
/** Load .env / .env.local then run a ts-node script (CommonJS). */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(path.join(process.cwd(), '.env'));
loadEnvFile(path.join(process.cwd(), '.env.local'));

const script = process.argv[2];
const args = process.argv.slice(3);
if (!script) {
  console.error('Usage: node scripts/run-with-env.js <script.ts> [args...]');
  process.exit(1);
}

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS' });
const cmd = `npx ts-node "${script}" ${args.map((a) => JSON.stringify(a)).join(' ')}`.trim();
execSync(cmd, { stdio: 'inherit', env: process.env });
