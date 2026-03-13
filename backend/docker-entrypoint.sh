#!/bin/sh
set -e

echo "▶ Running database migrations..."
pnpm exec prisma migrate deploy

echo "▶ Running database seed..."
pnpm exec prisma db seed

echo "▶ Starting server..."
exec node dist/src/main.js
