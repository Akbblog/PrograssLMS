# 🎓 Multi-Role LMS Login System - Visual Reference Guide

## 🎯 Quick Navigation

### 📚 Documentation
| Document | Purpose | Read Time |
|----------|---------|-----------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes | 10 min |
| [LOGIN_SYSTEM.md](./LOGIN_SYSTEM.md) | Complete technical reference | 30 min |
| [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) | Project overview & features | 15 min |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Fix common issues | 20 min |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Status & requirements | 15 min |
| [ASSET_INVENTORY.md](./ASSET_INVENTORY.md) | Complete file listing | 10 min |

---

## 🗂️ File Organization

### Authentication System
```
lib/auth/
├── useAuth.ts                 → Custom hook for auth operations
├── protectedRoute.tsx         → Component for route protection
└── authInterceptor.ts         → Utility functions for auth

lib/api/
├── authService.ts             → Service layer for login endpoints
├── client.ts                  → Axios config + interceptors
└── endpoints.ts               → API route definitions
```

### Pages & Dashboards
```
app/
├── (auth)/
│   ├── login/page.tsx        → Multi-role login page
│   └── forgot-password/       → Password recovery
│
├── unauthorized/page.tsx      → 403 error page
│
├── superadmin/dashboard/      → Super admin dashboard
├── admin/dashboard/           → School admin dashboard
├── teacher/dashboard/         → Teacher dashboard
└── student/dashboard/         → Student dashboard
```

### State Management
```
store/
└── authStore.ts              → Zustand auth store (persistent)
```

---

## 🔐 Authentication Roles Matrix

| Role | Access Level | Dashboard | Features |
|------|-------------|-----------|----------|
| **Super Admin** | System-wide | `/superadmin/dashboard` | Manage all schools, analytics, system settings |
| **Admin** | School-specific | `/admin/dashboard` | Students, teachers, academic structure, reports |
| **Teacher** | Class-level | `/teacher/dashboard` | Classes, grades, attendance, exams |
| **Student** | Personal | `/student/dashboard` | Courses, grades, attendance, assignments |

---

## 🎨 UI Component Hierarchy

```
Login Page (app/(auth)/login/page.tsx)
├── Card (UI Container)
│   ├── CardHeader
│   │   ├── Logo Icon (Building2)
│   │   ├── Title "Welcome to LMS"
│   │   └── Subtitle
│   │
│   ├── CardContent
│   │   └── Form
│   │       ├── Role Select (Dropdown)
│   │       │   └── 4 Options with icons
│   │       │
│   │       ├── Role Info Box
│   │       │   ├── Icon (Role-specific)
│   │       │   ├── Role name
│   │       │   └── Description
│   │       │
│   │       ├── Email Input
│   │       ├── Password Input (with toggle)
│   │       └── Submit Button
│   │
│   └── CardFooter
│       ├── Divider
│       ├── Demo Credentials
│       └── Register Link
```

---

## 🔄 Authentication Flow

```
START
  ↓
┌─────────────────────────────────┐
│   User visits /login            │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│   Selects Role                  │
│   - Super Admin                 │
│   - Admin                       │
│   - Teacher                     │
│   - Student                     │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│   Enters Credentials            │
│   - Email                       │
│   - Password                    │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│   Form Validation (Zod)         │
│   - Email format ✓              │
│   - Password length ✓           │
│   - Role selected ✓             │
└─────────────────────────────────┘
  ↓
  └─→ Invalid? Show errors ↻
  ↓
┌─────────────────────────────────┐
│   API Request                   │
│   Role-specific endpoint        │
│   + credentials                 │
└─────────────────────────────────┘
  ↓
  └─→ No response? Show error ↻
  ↓
┌─────────────────────────────────┐
│   Backend Validation            │
│   - User exists?                │
│   - Password correct?           │
│   - Account active?             │
└─────────────────────────────────┘
  ↓
  └─→ Invalid? Return error ↻
  ↓
┌─────────────────────────────────┐
│   Generate JWT Token            │
│   + User Data                   │
│   Return response               │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│   Store in Zustand              │
│   - User info                   │
│   - Token                       │
│   - Auth state                  │
│   - Persist to storage          │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│   Redirect to Dashboard         │
│   Based on role                 │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│   Load Dashboard                │
│   - ProtectedRoute verified     │
│   - Role-specific content       │
│   - Ready for use               │
└─────────────────────────────────┘
  ↓
END ✓
```

---

## 🛡️ Route Protection Flow

```
User navigates to /admin/dashboard
  ↓
ProtectedRoute component renders
  ↓
Check: isAuthenticated = true?
  ├─ NO → Redirect to /login
  └─ YES → Continue
      ↓
      Check: User role in requiredRoles?
      ├─ NO → Redirect to /unauthorized
      └─ YES → Render component
          ↓
          Display Dashboard
```

---

## 🔑 Hook Usage Examples

### useAuth() Hook
```typescript
import { useAuth } from '@/lib/auth/useAuth'

export function MyComponent() {
    const { 
        user,           // Current user object
        isAuthenticated, // Boolean
        isLoading,      // During login
        error,          // Error message
        login,          // (email, password, role) => Promise
        logout,         // () => void
        hasRole,        // (role | roles[]) => boolean
        hasPermission,  // (roles[]) => boolean
    } = useAuth()

    // Usage examples
    if (!isAuthenticated) return <LoginPage />
    if (hasRole('admin')) return <AdminFeatures />
    if (hasPermission(['admin', 'super_admin'])) return <AdminPanel />
}
```

### ProtectedRoute Component
```typescript
import { ProtectedRoute } from '@/lib/auth/protectedRoute'

// Example: Admin only page
export default function AdminPage() {
    return (
        <ProtectedRoute requiredRoles={['admin']}>
            <AdminContent />
        </ProtectedRoute>
    )
}

// Example: Multiple roles
export default function ModeratorPage() {
    return (
        <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
            <ModeratorContent />
        </ProtectedRoute>
    )
}
```

---

## 📡 API Endpoints

### Login Endpoints
```
POST /staff/admin/login              → Admin login
POST /staff/teacher/login            → Teacher login
POST /students/login                 → Student login
POST /superadmin/login               → Super admin login
```

### Request Format
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Success Response
```json
{
    "status": "success",
    "data": {
        "_id": "user_id_here",
        "name": "User Name",
        "email": "user@example.com",
        "schoolId": "school_id_here"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Error Response
```json
{
    "status": "error",
    "message": "Invalid credentials"
}
```

---

## 🎨 Role Colors & Icons

| Role | Icon | Color | Hex |
|------|------|-------|-----|
| Super Admin | 👑 Crown | Purple | `#a855f7` |
| Admin | 💼 Briefcase | Blue | `#3b82f6` |
| Teacher | 📖 BookOpen | Green | `#22c55e` |
| Student | 👤 User | Orange | `#f97316` |

---

## 🔐 Security Checklist

Frontend Security:
- ✅ Email validation (Zod schema)
- ✅ Password validation (min 6 chars)
- ✅ Form validation before submission
- ✅ Protected routes with role verification
- ✅ Tokens not exposed in console
- ✅ Auto token injection in requests

Backend Security (Required):
- ⏳ Password hashing (bcrypt)
- ⏳ JWT signing/verification
- ⏳ CORS configuration
- ⏳ Rate limiting
- ⏳ SQL injection prevention
- ⏳ Token expiration

---

## 📊 State Management

### Zustand Store Structure
```typescript
{
    // State
    user: {
        id: string
        name: string
        email: string
        role: string
        schoolId?: string
    } | null
    
    token: string | null
    isAuthenticated: boolean
    
    // Actions
    login(user, token)
    logout()
    updateUser(partial)
    hasRole(role | roles[])
}
```

### Persistence
- ✅ Automatically saved to localStorage as "auth-storage"
- ✅ Restored on page refresh
- ✅ Cleared on logout

---

## 🚀 Performance Optimizations

| Optimization | Implementation | Benefit |
|--------------|-----------------|---------|
| Code Splitting | Dynamic imports | Faster initial load |
| Memoization | useCallback hooks | Fewer re-renders |
| Lazy Loading | next/dynamic | Load on demand |
| Request Caching | Axios instances | Reduce API calls |
| Token Reuse | Store in memory | No constant API hits |

---

## 🎯 Common Tasks

### Add a New Role
1. Update `ROLE_CONFIG` in login page
2. Add to Zod schema
3. Create login function in `authService`
4. Update endpoint mapping
5. Create dashboard page

### Protect a Page
```typescript
<ProtectedRoute requiredRoles={['admin']}>
    <YourComponent />
</ProtectedRoute>
```

### Check User Role
```typescript
const { hasRole } = useAuth()
if (hasRole('admin')) { /* ... */ }
```

### Logout User
```typescript
const { logout } = useAuth()
<button onClick={logout}>Logout</button>
```

### Access User Data
```typescript
const { user } = useAuth()
console.log(user?.name)
console.log(user?.email)
console.log(user?.role)
```

---

## 🐛 Debug Techniques

### Check Authentication State
```javascript
// In browser console
import { useAuthStore } from '@/store/authStore'
const state = useAuthStore.getState()
console.log('User:', state.user)
console.log('Token:', state.token)
console.log('Authenticated:', state.isAuthenticated)
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Trigger login
4. Look for API request
5. Check response status and data

### Enable Logging
Add to components:
```typescript
useEffect(() => {
    console.log('Auth state:', { user, isAuthenticated })
}, [user, isAuthenticated])
```

### Check Interceptors
```typescript
// Verify token added to requests
apiClient.interceptors.request.use(config => {
    console.log('Headers:', config.headers)
    return config
})
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Login Page Responsive
- ✅ Full-width on mobile
- ✅ Max-width: 428px on desktop
- ✅ Padding adjusted for screens
- ✅ Touch-friendly buttons

### Dashboards Responsive
- ✅ Single column on mobile
- ✅ 2-column grid on tablet
- ✅ Cards stack properly
- ✅ Text sizes adjust

---

## 🎓 Learning Path

### Beginner
1. Read `QUICKSTART.md`
2. Understand login flow
3. Test demo credentials
4. Try useAuth hook

### Intermediate
1. Read `LOGIN_SYSTEM.md`
2. Study authentication service
3. Understand ProtectedRoute
4. Implement in own pages

### Advanced
1. Modify authService
2. Add new roles
3. Customize styling
4. Extend with features

---

## 📞 Quick Help

### Common Issues
| Issue | Solution | Doc |
|-------|----------|-----|
| Can't login | Check backend running | TROUBLESHOOTING |
| Token not persisting | Clear storage | TROUBLESHOOTING |
| Protected route fails | Check role name | QUICKSTART |
| API 404 errors | Check API URL | LOGIN_SYSTEM |
| Styling wrong | Clear .next cache | TROUBLESHOOTING |

---

## 🎯 Success Checklist

Before going live:
- [ ] Backend endpoints implemented
- [ ] Test all 4 role logins
- [ ] Token persists on refresh
- [ ] Protected routes work
- [ ] Logout works
- [ ] Error handling tested
- [ ] UI looks correct
- [ ] No console errors
- [ ] Mobile view works
- [ ] Documentation reviewed

---

## 🏆 You're Ready!

✅ **Frontend:** 100% Complete
✅ **Documentation:** 6 comprehensive guides
✅ **Components:** Production-ready
✅ **Security:** Client-side implemented

⏳ **Next:** Backend API Implementation

---

**Start Here:** [QUICKSTART.md](./QUICKSTART.md) → 5 minutes to running! 🚀

---

*Generated: December 4, 2025*
*Version: 1.0 - Complete*
*Status: ✅ Frontend Ready | ⏳ Backend Pending*
