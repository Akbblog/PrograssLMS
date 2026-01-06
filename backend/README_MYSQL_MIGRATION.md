# MySQL Migration Guide (Hostinger) — Quick Start

This document outlines steps to migrate selected MongoDB collections to MySQL using Prisma. It's intended as a testing migration on your Hostinger account.

1) Create DB & User on Hostinger (cPanel)
 - Login to Hostinger/cPanel -> MySQL Databases
 - Create database `u966438854_LMS` and user `u966438854_jk`, set a strong password.
 - Assign the user to the database with ALL PRIVILEGES.
 - Note the DB host (usually `localhost` for cPanel), username, password and port (3306).

2) Configure backend env
 - In `backend/.env` set:
 ```
 DATABASE_URL="mysql://u966438854_jk:j2YZ49&)JtWiM2(@<HOST>:3306/u966438854_LMS"
 ```

3) Install Prisma and generate client
 ```bash
 cd backend
 npm install prisma @prisma/client
 npx prisma generate
 ```

4) Create DB schema and run migration
 ```bash
 npx prisma migrate dev --name init
 ```

5) Export Mongo data, transform, and seed
 - Export students collection (example):
 ```bash
 mongoexport --uri="<MONGO_URI>" --collection=students --out=students.json
 node scripts/transform_mongo_to_prisma.js students.json students_prisma.json
 ```
 - Create a small script that reads `students_prisma.json` and upserts into MySQL using Prisma (or adapt `prisma/seed.js`).

6) Update app code
 - Replace Mongoose model usage incrementally with Prisma client calls (start with read-only endpoints to validate).

7) Test and cutover
 - Test the migrated data on your dev/staging environment.
 - Once ready, update production env variables and deploy.

Notes/Warnings
 - This is a manual migration; object references must be reconciled to foreign keys.
 - Large datasets require batching and careful FK handling.
