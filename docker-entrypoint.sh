#!/bin/sh
set -e

echo "Running Drizzle migrations..."
node scripts/migrate.mjs

echo "Migrations complete. Starting server..."
exec "$@"
