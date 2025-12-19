# Multi-Role Login System - Quick Start Guide

## 🎯 What's Been Built

A complete multi-role authentication system with 4 user roles:
- **Super Admin** - Manage all schools
- **Admin** - Manage individual schools  
- **Teacher** - Manage classes and grades
- **Student** - View courses and grades

## 📁 Files Created/Modified

### Core Authentication
- ✅ `app/(auth)/login/page.tsx` - Enhanced multi-role login page
- ✅ `app/(auth)/forgot-password/page.tsx` - Password recovery page
- ✅ `store/authStore.ts` - Enhanced Zustand auth store
- ✅ `lib/api/authService.ts` - Authentication service layer

### Route Protection & Utilities
- ✅ `lib/auth/useAuth.ts` - Custom authentication hook
- ✅ `lib/auth/protectedRoute.tsx` - Protected route wrapper component
- ✅ `lib/auth/authInterceptor.ts` - Auth state management utilities

### Error Pages
- ✅ `app/unauthorized/page.tsx` - Unauthorized access page

### Example Dashboards
- ✅ `app/superadmin/dashboard/page.tsx` - Super Admin dashboard template
- ✅ `app/admin/dashboard/page.tsx` - Admin dashboard template
- ✅ `app/teacher/dashboard/page.tsx` - Teacher dashboard template
- ✅ `app/student/dashboard/page.tsx` - Student dashboard template

### Documentation
- ✅ `LOGIN_SYSTEM.md` - Comprehensive documentation
- ✅ `QUICKSTART.md` - This file

## 🚀 Getting Started

### 1. Test the Login Page

Navigate to `http://localhost:3000/login`

**Demo Credentials:**
```
Admin:    admin@school.com / pass123
Teacher:  teacher@school.com / pass123
Student:  student@school.com / pass123
Super Admin: Will need backend endpoint
```

### 2. Using in Your Components

#### Simple Authentication Check
```typescript
import { useAuth } from '@/lib/auth/useAuth'

export function MyComponent() {
    const { user, isAuthenticated, logout } = useAuth()
    
    if (!isAuthenticated) return <div>Please login</div>
    return <div>Welcome {user?.name}</div>
}
```

#### Protected Routes
```typescript
import { ProtectedRoute } from '@/lib/auth/protectedRoute'

export default function AdminPage() {
    return (
        <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
            <AdminContent />
        </ProtectedRoute>
    )
}
```

#### Role Checking
```typescript
const { hasRole, hasPermission } = useAuth()

if (hasRole('admin')) {
    // Show admin features
}

if (hasPermission(['admin', 'super_admin'])) {
    // Show admin/superadmin features
}
```

## 🔑 Key Features

### Login Page
- ✅ Role selection dropdown with descriptions
- ✅ Email/password validation
- ✅ Show/hide password toggle
- ✅ Loading states
- ✅ Error notifications via toast
- ✅ Demo credentials display
- ✅ Forgot password link
- ✅ Modern dark theme UI

### Authentication System
- ✅ JWT token management
- ✅ Persistent auth state (survives page refresh)
- ✅ Automatic token injection in API requests
- ✅ Role-based redirection after login
- ✅ Protected routes that redirect to login if not authenticated
- ✅ Role-specific access control

### Security
- ✅ Email validation (Zod schema)
- ✅ Password minimum length (6 chars)
- ✅ Protected routes with role verification
- ✅ Token auto-injection via axios interceptor
- ✅ 401/403 handling (needs backend setup)

## 🔄 Authentication Flow

```
1. User visits /login
   ↓
2. Selects role (Admin, Teacher, Student, Super Admin)
   ↓
3. Enters email and password
   ↓
4. Submits form → API request to role-specific endpoint
   ↓
5. Backend validates credentials
   ↓
6. Returns JWT token + user data
   ↓
7. Frontend stores in Zustand store
   ↓
8. Redirects to role-specific dashboard
   ↓
9. All future requests automatically include token
```

## 🎨 Customization

### Add a New Role

1. **Login Page** - Update role enum in `formSchema`:
```typescript
const formSchema = z.object({
    role: z.enum(["admin", "teacher", "student", "super_admin", "new_role"])
})
```

2. **Role Config** - Add to `ROLE_CONFIG`:
```typescript
const ROLE_CONFIG = {
    new_role: {
        label: "New Role",
        icon: IconName,
        description: "Description",
        color: "bg-color-500/10 text-color-600 border-color-200",
    }
}
```

3. **API Service** - Add login method:
```typescript
export const authService = {
    loginNewRole: async (credentials) => {
        const response = await apiClient.post('/path/to/login', credentials)
        return response.data
    }
}
```

4. **Endpoint Map** - Update in onSubmit:
```typescript
const endpointMap: Record<UserRole, string> = {
    // ... existing
    new_role: "/api/new-role/login"
}
```

5. **Redirect** - Add to redirectMap:
```typescript
const redirectMap: Record<UserRole, string> = {
    // ... existing
    new_role: "/new-role/dashboard"
}
```

### Change Styling

All styling uses Tailwind CSS. Key theme colors:
- **Primary**: `from-blue-600 to-purple-600`
- **Background**: `from-slate-900 to-slate-800`
- **Card**: `bg-slate-800 border-slate-700`
- **Text**: `text-slate-100` (light text)

Edit the component classes to customize.

## 🐛 Troubleshooting

### Login fails with 404
- Check API URL in `lib/api/client.ts`
- Verify backend is running
- Check endpoint paths match backend routes

### Token not persisting
- Clear browser storage: `localStorage.clear()`
- Check Zustand persistence is enabled
- Verify browser allows localStorage

### Routes not protected
- Ensure `ProtectedRoute` wraps your component
- Check `requiredRoles` matches user role
- Verify user is logged in: `useAuthStore` should show `isAuthenticated: true`

### Cannot access dashboard after login
- Verify redirect path matches created pages
- Check role name matches exactly (case-sensitive)
- Verify `ProtectedRoute` wrapper is present on dashboard

## 📝 Next Steps

1. **Connect Backend**
   - Ensure backend endpoints return correct format
   - Set up password reset endpoint
   - Implement 401/403 response handling

2. **Implement Features**
   - Email verification
   - Two-factor authentication
   - Refresh token mechanism
   - Session timeout/auto-logout

3. **Create Role-Specific Features**
   - Complete dashboard pages
   - Role-specific navigation
   - Permission-based feature toggling

4. **Testing**
   - Test all role login flows
   - Test protected routes
   - Test logout functionality
   - Test token expiration

## 📞 API Endpoints Needed

```
POST /staff/admin/login              - Admin login
POST /staff/teacher/login            - Teacher login
POST /students/login                 - Student login
POST /superadmin/login               - Super admin login
POST /auth/forgot-password           - Password reset request
```

Each endpoint should return:
```json
{
    "status": "success",
    "data": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "schoolId": "school_id (optional)"
    },
    "token": "jwt_token_here"
}
```

## 🎓 Architecture Overview

```
Frontend Auth System
├── Login Page
│   ├── Role Selection
│   ├── Form Validation (Zod)
│   └── API Request
│
├── Auth Service (authService.ts)
│   ├── Universal login function
│   ├── Role-specific login functions
│   └── Logout function
│
├── Auth Store (Zustand)
│   ├── User state
│   ├── Token management
│   └── Login/Logout actions
│
├── API Client (Axios)
│   ├── Base URL configuration
│   ├── Request interceptor (adds token)
│   └── Response interceptor (handles errors)
│
├── Custom Hooks
│   ├── useAuth() - Main authentication hook
│   └── useAuthInterceptor() - Auth event handling
│
└── Route Protection
    ├── ProtectedRoute component
    ├── Role verification
    └── Redirect logic
```

## 💡 Tips & Best Practices

1. **Always use `useAuth()`** for authentication operations in components
2. **Wrap dashboards** with `ProtectedRoute` to prevent unauthorized access
3. **Check roles** before rendering sensitive features
4. **Handle errors gracefully** with try-catch and toast notifications
5. **Test on all roles** before deploying
6. **Use the `hasRole()` function** for conditional rendering
7. **Keep tokens secure** - never expose in frontend code
8. **Implement logout** on 401 responses (backend-side)

---

**Happy coding! 🚀**
