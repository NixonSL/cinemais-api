#!/bin/sh
set -e

echo "Running database migrations..."
until npx prisma migrate deploy; do
  echo "Waiting for database..."
  sleep 2
done

echo "Starting application..."
exec node dist/server.js
