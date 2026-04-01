#!/bin/sh
set -e

echo "Running Payload migrations..."
npx payload migrate --force-accept-warning

echo "Running Drizzle migrations..."
node scripts/migrate.mjs

echo "Migrations complete. Starting server..."
exec "$@"
