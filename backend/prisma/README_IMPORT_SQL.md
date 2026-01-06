# How to import the generated SQL migration

The file `prisma/migration_sql.sql` contains CREATE TABLE statements for the initial schema (Student, Teacher, ClassLevel, Subject).

Options to import:

1) phpMyAdmin
 - Log in to phpMyAdmin for the `u966438854_LMS` database.
 - Select the database, go to the `Import` tab, choose `migration_sql.sql`, and click `Go`.

2) mysql CLI (from your machine or the server)
```bash
# replace user/host as needed
mysql -u u966438854_jk -p -h 127.0.0.1 -P 3306 u966438854_LMS < prisma/migration_sql.sql
```

3) Use the Hostinger MySQL UI (Databases -> Import SQL) — upload `migration_sql.sql`.

After import
 - Verify tables exist: `SHOW TABLES;` and `DESCRIBE Student;`
 - If you want me to run the `prisma/seed.js` script, provide remote access or run the seed on the host where MySQL is reachable.

Notes
 - Passwords in `backend/.env` must be URL-encoded for `DATABASE_URL` when using Prisma.
 - I couldn't connect to `127.0.0.1:3306` from this environment; importing via phpMyAdmin or running the SQL on the server is the recommended path if remote access is not enabled.
