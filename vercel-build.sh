#!/bin/bash
echo "VERCEL_BUILD_SCRIPT_START"
echo "Running Prisma DB Push with --accept-data-loss..."
npx prisma db push --skip-generate --accept-data-loss
echo "Prisma DB Push Complete"
echo "Running Next.js Build..."
next build
