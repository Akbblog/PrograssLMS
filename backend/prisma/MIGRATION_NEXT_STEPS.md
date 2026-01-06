Migration next steps — transform & seed

1) Export a Mongo collection (example: students) to JSON from your Mongo Atlas or local Mongo:

```bash
mongoexport --uri="<MONGO_URI>" --collection=students --out=students.json
```

2) Transform the export into Prisma-friendly JSON (on your dev machine):

```bash
# from repo root
node backend/scripts/transform_mongo_to_prisma.js students students.json backend/prisma/seed-data/students_prisma.json
```

Or batch-transform a folder of exports:

```bash
node backend/scripts/transform_all_exports.js ./exports ./backend/prisma/seed-data
```

3) Upload or copy the transformed JSON files to the server or run the seeder locally (must have `DATABASE_URL` pointing to target DB in `backend/.env`):

```bash
# from backend/
node prisma/seed_from_json.js prisma/seed-data/students_prisma.json prisma/seed-data/teachers_prisma.json prisma/seed-data/classes_prisma.json prisma/seed-data/subjects_prisma.json
```

4) Toggle application to use Prisma for students services:

Set environment variable `USE_PRISMA=1` (example in `backend/.env`):

```
USE_PRISMA=1
```

Restart the backend server. The `students` service will now use the Prisma implementation. Continue replacing other services similarly.
