# DEMO LOGIN

This file contains demo credentials for quick local testing of the LMS.

## Super Admin
- Email: SA@progresslms.com
- Password: Superpass
- Role: super_admin
- Login URL: http://localhost:3000/login

## Admin (School Admin)
- Email: admin@majschool.com
- Password: maj1234
- Role: admin
- Permissions: `manageUsers`, `manageTeachers`, `manageStudents`, `manageFees`, `viewReports`
- Login URL: http://localhost:3000/login

## Teacher
- Email: ahsan.raza@majschool.com
- Password: teacher123
- Role: teacher
- Login URL: http://localhost:3000/login

## Student
- Email: test.student@majschool.com
- Password: test.student
- Login URL: http://localhost:3000/login

---


1. Start Backend: `cd backend && npm run dev`
2. Start Frontend: `cd frontend && npm run dev`
3. Open: http://localhost:3000/login
4. Login with credentials above
