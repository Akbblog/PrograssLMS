const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

async function main() {
  const sqlFile = path.resolve(__dirname, 'migration_sql.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('SQL file not found:', sqlFile);
    process.exit(2);
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set in .env');
    process.exit(3);
  }

  // Parse DATABASE_URL (mysql://user:pass@host:port/db)
  const dbUrl = process.env.DATABASE_URL;
  const url = new URL(dbUrl);
  const user = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  const host = url.hostname;
  const port = url.port ? parseInt(url.port, 10) : 3306;
  const database = url.pathname.replace(/^\//, '');

  console.log('Connecting to', host + ':' + port, 'database', database);

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });

  try {
    console.log('Importing SQL from', sqlFile);
    await conn.query(sql);
    console.log('SQL import completed.');
  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
