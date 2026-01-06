#!/usr/bin/env bash
set -euo pipefail

# Usage: backend/scripts/import_and_seed.sh [host] [port] [user] [db] [sql_file]
# Example: backend/scripts/import_and_seed.sh srv2027.hstgr.io 3306 u966438854_jk u966438854_LMS prisma/migration_sql.sql

HOST=${1:-srv2027.hstgr.io}
PORT=${2:-3306}
USER=${3:-u966438854_jk}
DB=${4:-u966438854_LMS}
SQL_FILE=${5:-prisma/migration_sql.sql}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/.."

echo "Switching to backend directory: ${BACKEND_DIR}"
cd "${BACKEND_DIR}"

if [ ! -f "${SQL_FILE}" ]; then
  echo "SQL file not found: ${SQL_FILE}" >&2
  exit 2
fi

echo "Importing ${SQL_FILE} into ${USER}@${HOST}:${DB}..."
mysql -u"${USER}" -p -h "${HOST}" -P "${PORT}" "${DB}" < "${SQL_FILE}"

echo "Installing backend dependencies (if missing) and generating Prisma client..."
npm install --no-audit --no-fund
npx prisma generate

echo "Running Prisma seed..."
node prisma/seed.js

echo "Done."
