{
  "openFilesOnStartup.files": [
    "${workspaceFolder}/dev/agent/persona.md"
  ]
}



# School Management System (SaaS) - LMS

A production-ready, multi-tenant School Management System built with Node.js/Express (backend) and Next.js (frontend).

## 📁 Project Structure

```
LMS/
├── backend/          # Express.js REST API server
│   ├── app/
│   ├── config/       # Database configuration
│   ├── controllers/  # Request handlers
│   ├── models/       # MongoDB schemas (with multi-tenancy support)
│   ├── services/     # Business logic
│   ├── routes/       # API endpoints
│   ├── middlewares/  # Auth, tenant isolation, etc.
│   ├── package.json
│   └── server.js     # Entry point
│
└── frontend/         # Next.js 16 frontend application
    ├── app/          # App router (Next.js 13+)
    ├── components/   # React components
    ├── lib/          # Utilities, API client
    ├── store/        # Zustand state management
    ├── package.json
    └── next.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ 
- npm v10+
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
# Create .env file with:
# PORT=5130
# DB=mongodb://localhost:27017/school-management
# JWT_SECRET_KEY=your-secret-key

npm run dev    # Start with nodemon (development)
npm start      # Start production server
```

**Backend runs on:** `http://localhost:5130`

### Frontend Setup

```bash
cd frontend
npm install

# Use --prefix to run from the LMS root:
npm --prefix frontend run dev
```

**Frontend runs on:** `http://localhost:3000`

## 🏗️ Multi-Tenancy Architecture

This is a **single database, multiple tenants** SaaS system:

- **School Model:** Represents each tenant with subscription, limits, and branding
- **Tenant Isolation Middleware:** Automatically filters queries by `schoolId`
- **JWT Tokens:** Include `schoolId` and `role` for authorization
- **All Models:** Include `schoolId` field for data isolation

### Subscription Plans
- **Trial:** 14 days, 100 students, core features
- **Basic:** $29/mo, 100 students, online exams
- **Standard:** $79/mo, 500 students, analytics, parent portal
- **Premium:** $149/mo, unlimited students, white-label, SMS

## 📋 Implemented Features

### Backend ✅
- [x] School/Tenant model with subscription management
- [x] Multi-tenancy with `schoolId` isolation
- [x] Tenant isolation middleware
- [x] Role-based auth (super_admin, admin, teacher, student)
- [x] JWT token generation with schoolId & role
- [x] All models updated with `schoolId` field
- [x] Super admin endpoints for school management
- [x] Admin, Teacher, Student authentication

### Frontend 🔄
- [ ] Login page with role selection
- [ ] Super Admin portal (manage schools, subscriptions, analytics)
- [ ] School Admin dashboard (teachers, students, academic setup)
- [ ] Teacher portal (grades, attendance, exams)
- [ ] Student portal (take exams, view results)

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/teachers/login` - Teacher login
- `POST /api/v1/students/login` - Student login
- `POST /api/v1/superadmin/schools` - Create new school (Super Admin)

### Super Admin (Multi-tenant Management)
- `GET /api/v1/superadmin/schools` - List all schools
- `POST /api/v1/superadmin/schools` - Create school
- `GET /api/v1/superadmin/schools/:id` - Get school details
- `PUT /api/v1/superadmin/schools/:id` - Update school
- `PUT /api/v1/superadmin/schools/:id/subscription` - Update subscription
- `GET /api/v1/superadmin/analytics` - Global analytics

### School Admin
- `GET /api/v1/admin/students` - List students (school-specific)
- `GET /api/v1/admin/teachers` - List teachers (school-specific)
- `GET /api/v1/admin/academic-years` - Academic management

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend validates credentials and generates JWT with `schoolId` and `role`
3. Frontend stores token in localStorage and auth store
4. Requests include token in `Authorization: Bearer <token>` header
5. Tenant isolation middleware extracts `schoolId` from token
6. All queries automatically filtered by `schoolId`

## 📊 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, React 19, Tailwind CSS, Zustand |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT (JsonWebToken), bcryptjs |
| State | Zustand (frontend), MongoDB (backend) |
| API | RESTful, Axios |
| Styling | Tailwind CSS, shadcn/ui |

## 🛠️ Development

### Start both services

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm --prefix frontend run dev
```

Both services will run simultaneously on their respective ports.

## 📝 Environment Variables

### Backend (.env)
```
PORT=5130
DB=mongodb://localhost:27017/school-management
JWT_SECRET_KEY=your-secret-key-here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5130/api/v1
```

## 🗂️ Models with Multi-Tenancy

All models include `schoolId` for tenant isolation:
- ✅ School
- ✅ Admin (with role support)
- ✅ Teacher (with schoolId)
- ✅ Student (with schoolId)
- ✅ AcademicYear (with schoolId)
- ✅ AcademicTerm (with schoolId)
- ✅ Class (with schoolId)
- ✅ Subject (with schoolId)
- ✅ Program (with schoolId)
- ✅ Exam (with schoolId)
- ✅ Question (with schoolId)
- ✅ ExamResult (with schoolId)
- ✅ YearGroup (with schoolId)

## 🚢 Deployment

### Backend: Railway, Heroku, or DigitalOcean
- Deploy to your hosting platform
- Set environment variables
- Use MongoDB Atlas for database

### Frontend: Vercel (recommended for Next.js)
- Connect GitHub repo to Vercel
- Set API URL environment variable
- Auto-deploys on push

## 📖 Next Steps

1. ✅ Complete frontend Phase 1: Login page with role selection
2. ✅ Build Super Admin portal for school management
3. ✅ Implement School Admin features (teachers, students, academics)
4. ✅ Build Teacher and Student portals
5. ✅ Add advanced features (reports, analytics, notifications)

## 📞 Support

For issues or questions, refer to the README files in `/backend` and `/frontend` directories.

---

**Status:** In Active Development  
**Last Updated:** December 4, 2025
