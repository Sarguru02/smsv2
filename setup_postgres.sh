#!/usr/bin/env bash
set -e

DATA_DIR="./data"
PORT=5432
DB_NAME="sms"
ADMIN_USER="admin"
ADMIN_PASSWORD="docker"

# Initialize DB (only if not already initialized)
if [ ! -d "$DATA_DIR" ]; then
  echo "Initializing database..."
  initdb -D "$DATA_DIR"
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
pg_ctl -D "$DATA_DIR" -o "-p $PORT -c listen_addresses=127.0.0.1" -l logfile start

# Wait until ready
echo "Waiting for PostgreSQL..."
until pg_isready -p $PORT; do
  sleep 1
done

# Run setup SQL
echo "Configuring database..."

psql -p $PORT <<EOF
-- Create admin role
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$ADMIN_USER') THEN
      CREATE ROLE $ADMIN_USER WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD '$ADMIN_PASSWORD';
   END IF;
END
\$\$;

-- Create database
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $ADMIN_USER;
EOF

echo "Setup complete."
