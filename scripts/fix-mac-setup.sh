#!/usr/bin/env bash
# Recover Mac local dev when lib/password.ts still imports bcryptjs.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Peboli Mac setup fix"
echo "    pwd: $(pwd)"

if [[ ! -f package.json ]]; then
  echo "ERROR: Run this from the Peboli repo root (~/Documents/Peboli)"
  exit 1
fi

echo "==> Fetching latest..."
git fetch origin

BRANCH="cursor/local-shelf-p0-upgrade-2fa8"
if git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}"; then
  git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH" "origin/${BRANCH}"
  git reset --hard "origin/${BRANCH}"
else
  echo "==> Feature branch missing; using main"
  git checkout main
  git reset --hard origin/main
fi

echo "==> lib/password.ts (first line must be: import crypto from 'crypto';)"
head -3 lib/password.ts

if head -1 lib/password.ts | grep -q bcryptjs; then
  echo "ERROR: password.ts still imports bcryptjs. Contact support or run:"
  echo "  git fetch origin && git reset --hard origin/main"
  exit 1
fi

echo "==> Installing dependencies..."
npm install

if [[ ! -f .env ]] && [[ -f .env.local ]]; then
  cp .env.local .env
  echo "==> Copied .env.local -> .env"
fi

echo "==> Done. Next:"
echo "  npm run db:setup"
echo "  npm run create-admin -- admin@peboli.store 'YourSecurePassword8+'"
echo "  rm -rf .next && npm run dev"
