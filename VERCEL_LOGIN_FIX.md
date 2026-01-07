# Vercel Login 401 Error - FIXED ✅

## Problem
All login endpoints were returning **401 Unauthorized** errors:
- POST /api/v1/superadmin/login - 401
- POST /api/v1/admin/login - 401  
- POST /api/v1/teachers/login - 401
- POST /api/v1/students/login - 401

## Root Cause
Two issues were identified and fixed:

1. **Vercel database has not been seeded** - The login services work correctly, but they can't find any users in the database to authenticate against.

2. **Password mismatch in seed scripts** - All seed scripts were using `password123` for teachers and students, but the documentation specified `teacher123` and `student123`. **This has been FIXED** in all seed scripts:
   - `backend/routes/v1/seed.router.js` (Vercel endpoint)
   - `backend/seed-islamic-school.js` (Local seeding)
   - `backend/seed-demo-logins.js` (Demo logins)
   - `backend/seed-demo.js` (Full demo)

## Solution

### Step 1: Verify Database Connection
Check that your Vercel environment variables are set correctly:
- `DB` or `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - For token generation
- `SEED_SECRET` - For authorizing the seed endpoint

### Step 2: Seed the Database
You need to populate the database with initial user data. 

**Option A: Use the PowerShell script (Easiest)**
```powershell
.\seed-vercel.ps1 -SeedSecret "YOUR_SEED_SECRET"
```

**Option B: Use curl**
```bash
curl -X POST https://progresslms-backend.vercel.app/api/v1/seed \
  -H "Authorization: Bearer YOUR_SEED_SECRET" \
  -H "Content-Type: application/json"
```

Replace `YOUR_SEED_SECRET` with the value you set in Vercel environment variables.

### Step 3: Verify Superadmin Credentials
The superadmin credentials are hardcoded and should work once the basic setup is complete:
- Email: `SA@progresslms.com`
- Password: `Superpass`

For other users (admin, teachers, students), they need to be in the database after seeding.

### Step 4: Test the Login
After seeding, test with the demo credentials from `DEMO_CREDENTIALS.md`:

**Superadmin:**
- Email: SA@progresslms.com
- Password: Superpass

**School Admin:**
- Email: admin@alnoor-academy.edu
- Password: admin123

**Teachers** (see DEMO_CREDENTIALS.md for full list):
- Email: teacher1@alnoor-academy.edu
- Password: teacher123

**Students** (see DEMO_CREDENTIALS.md for full list):
- Email: student1@alnoor-academy.edu
- Password: student123

## Alternative: Update Frontend to Use Local Backend

If you want to develop locally without seeding Vercel, update your frontend environment:

1. Create/edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5130/api/v1
```

2. Make sure your local backend is running:
```bash
cd backend
npm install
node seed-islamic-school.js  # Seed local database
node server.js               # Start server on port 5130
```

3. Restart your Next.js frontend:
```bash
cd frontend
npm run dev
```

## Debugging

To debug the Vercel deployment:

1. Check Vercel logs for any database connection errors
2. Verify environment variables are set correctly
3. Test the health endpoint: `https://progresslms-backend.vercel.app/api/v1/health`
4. Check debug errors: `https://progresslms-backend.vercel.app/api/v1/debug/errors`

## Expected Response Format

A successful login should return:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "role": "...",
      "schoolId": "...",
      "features": {}
    },
    "token": "eyJ..."
  },
  "message": "Login successful"
}
```

## Common Issues

1. **Database not seeded** - Run the seed endpoint
2. **Wrong credentials** - Check DEMO_CREDENTIALS.md for correct passwords
3. **Database connection failed** - Verify DB environment variable
4. **CORS errors** - Should be handled, but check browser console for details
