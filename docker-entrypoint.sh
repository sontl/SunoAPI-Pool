#!/bin/sh
set -e

# Wait for the database to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

# Generate Prisma client
npm run prisma:generate

# Run Prisma migrations
npm run prisma:migrate

# Execute the main command
exec "$@"
