# Multi-Role Login System - Troubleshooting Guide

## 🔍 Common Issues & Solutions

### Login Page Issues

#### ❌ Login Page Shows 404
**Symptoms:** Cannot access `/login` page

**Solutions:**
1. Check Next.js dev server is running
   ```powershell
   npm run dev
   # or
   yarn dev
   ```
2. Navigate to `http://localhost:3000/login`
3. Check file exists at `frontend/app/(auth)/login/page.tsx`
4. Clear Next.js cache:
   ```powershell
   rm -r .next
   npm run dev
   ```

---

#### ❌ Login Button Does Nothing
**Symptoms:** Clicking sign in has no effect, no error message

**Solutions:**
1. Check browser console for errors (F12)
2. Verify form validation:
   - Email must be valid format
   - Password must be 6+ characters
   - Role must be selected
3. Check API endpoint is reachable:
   ```powershell
   # Test backend connectivity
   curl http://localhost:5130/api/v1/staff/admin/login
   ```

---

#### ❌ "Login failed. Please try again." Error
**Symptoms:** Generic error message after login attempt

**Solutions:**
1. **Check API URL:**
   ```typescript
   // frontend/lib/api/client.ts
   const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5130/api/v1"
   ```
   - Is `NEXT_PUBLIC_API_URL` correct?
   - Backend running on right port?

2. **Check backend is running:**
   ```powershell
   # In backend folder
   npm start
   # or
   node server.js
   ```

3. **Verify credentials are correct:**
   - User exists in database
   - Password is correct
   - Account is not locked/disabled

4. **Check backend logs:**
   - Backend should show request received
   - Look for validation errors
   - Check database connection

---

#### ❌ CORS Error in Browser Console
**Symptoms:** 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. **Backend CORS configuration:**
   ```javascript
   // backend/app/app.js
   const cors = require('cors')
   app.use(cors())
   
   // Or more specific:
   app.use(cors({
       origin: 'http://localhost:3000',
       credentials: true
   }))
   ```

2. **Verify backend has CORS enabled:**
   - Check `app.js` imports cors
   - Check `app.use(cors())` is called
   - Restart backend after changes

---

### Authentication Issues

#### ❌ Token Not Persisting After Refresh
**Symptoms:** 
- User stays logged in while on page
- After refresh, logged out again
- Dashboard shows login page

**Solutions:**
1. **Check localStorage is enabled:**
   - Open DevTools → Application → Cookies
   - Verify localhost has permissions

2. **Verify Zustand persistence:**
   ```typescript
   // This should exist in authStore.ts
   persist(
       (set) => ({ ... }),
       { name: 'auth-storage' }
   )
   ```

3. **Clear browser storage:**
   ```javascript
   // In browser console
   localStorage.clear()
   sessionStorage.clear()
   ```
   Then login again

4. **Check browser console for errors:**
   - Look for persistence errors
   - Check for storage quota exceeded

---

#### ❌ Token Not Added to API Requests
**Symptoms:**
- Backend returns 401 Unauthorized
- API calls fail with auth error
- Token visible in store but not used

**Solutions:**
1. **Verify interceptor in client:**
   ```typescript
   // frontend/lib/api/client.ts
   apiClient.interceptors.request.use(async (config) => {
       const { useAuthStore } = await import("@/store/authStore")
       const token = useAuthStore.getState().token
       if (token) {
           config.headers.Authorization = `Bearer ${token}`
       }
       return config
   })
   ```

2. **Test token manually:**
   ```javascript
   // In browser console
   import { useAuthStore } from '@/store/authStore'
   useAuthStore.getState().token
   // Should show JWT string
   ```

3. **Check API client is being used:**
   - Verify components use `apiClient` from `@/lib/api/client`
   - Not using different axios instance

---

#### ❌ 401 Unauthorized on Protected Routes
**Symptoms:**
- Can login but get 401 on dashboard
- Token exists in store
- API calls failing

**Solutions:**
1. **Verify token is valid:**
   - Log token value in console
   - Check token hasn't expired
   - Verify token format (starts with `eyJ`)

2. **Check backend validates token correctly:**
   - Backend JWT secret matches frontend
   - Token expiration set correctly
   - Verify middleware on protected routes

3. **Test with curl:**
   ```powershell
   $token = "your_token_here"
   curl -H "Authorization: Bearer $token" http://localhost:5130/api/v1/admin/dashboard
   ```

---

### Protected Routes Issues

#### ❌ Protected Route Shows Login Page
**Symptoms:**
- Navigate to `/admin/dashboard`
- Redirects to `/login`
- Even when logged in as admin

**Solutions:**
1. **Verify user is logged in:**
   ```typescript
   // In component
   import { useAuthStore } from '@/store/authStore'
   
   const { user, isAuthenticated } = useAuthStore()
   console.log('Auth:', { user, isAuthenticated })
   ```

2. **Check ProtectedRoute wrapper:**
   ```typescript
   // Should wrap component like this:
   <ProtectedRoute requiredRoles={['admin']}>
       <AdminContent />
   </ProtectedRoute>
   ```

3. **Verify role matches exactly (case-sensitive):**
   ```typescript
   // User role: "admin"
   // Required: "admin" ✅
   // Required: "Admin" ❌ (won't work)
   ```

4. **Check redirect paths:**
   - Verify `/admin/dashboard` page exists
   - Check file structure in `app/admin/dashboard/page.tsx`

---

#### ❌ Redirects to Unauthorized Page
**Symptoms:**
- Can login as Admin
- Dashboard shows "Access Denied"
- Cannot access `/admin/dashboard`

**Solutions:**
1. **Verify role after login:**
   ```javascript
   // In browser console after login
   import { useAuthStore } from '@/store/authStore'
   useAuthStore.getState().user
   // Check role value is exactly "admin"
   ```

2. **Check ProtectedRoute required roles:**
   ```typescript
   // frontend/app/admin/dashboard/page.tsx
   <ProtectedRoute requiredRoles={['admin']}>
   
   // Verify 'admin' exactly matches user.role
   ```

3. **Verify user data from backend:**
   - Backend should return `role: "admin"`
   - Not `role: "Admin"` or `role: "ADMIN"`

---

### Form & Validation Issues

#### ❌ Form Shows Red Error Messages
**Symptoms:**
- Email/password marked invalid
- Cannot submit form
- Red error text under fields

**Solutions:**
1. **Email validation:**
   - Must be valid email format
   - ✅ user@school.com
   - ❌ userATschoolDOTcom
   - ❌ user@school

2. **Password validation:**
   - Must be 6+ characters
   - ✅ password123
   - ❌ pass (too short)

3. **Role validation:**
   - Must select a role
   - Cannot leave blank
   - Must be exact: admin/teacher/student/super_admin

---

#### ❌ Form Doesn't Submit
**Symptoms:**
- Click "Sign In" button
- Nothing happens
- No error message

**Solutions:**
1. **Check form validation:**
   - Fill all fields correctly
   - Verify email format
   - Verify password length

2. **Check browser console:**
   - Look for JavaScript errors
   - Look for validation errors

3. **Try demo credentials:**
   ```
   Email: admin@school.com
   Password: pass123
   Role: admin
   ```

---

### API & Backend Issues

#### ❌ Backend Not Responding
**Symptoms:**
- "Cannot reach server" in browser
- Network tab shows failed requests
- Connection refused

**Solutions:**
1. **Verify backend is running:**
   ```powershell
   # Check if process is running
   Get-Process | Where-Object {$_.ProcessName -like "*node*"}
   
   # Or test port
   Test-NetConnection localhost -Port 5130
   ```

2. **Start backend:**
   ```powershell
   cd backend
   npm install
   npm start
   ```

3. **Check backend port:**
   - Default: `5130`
   - Verify in `backend/server.js` or `.env`
   - Update `NEXT_PUBLIC_API_URL` if different

4. **Check firewall:**
   - Port 5130 might be blocked
   - Allow in Windows Firewall
   - Check antivirus isn't blocking

---

#### ❌ Backend Returns Wrong Format
**Symptoms:**
- Login fails with error
- Response doesn't include token
- User data missing

**Solutions:**
1. **Verify response format:**
   Backend should return:
   ```json
   {
       "status": "success",
       "data": {
           "_id": "...",
           "name": "...",
           "email": "...",
           "schoolId": "..."
       },
       "token": "..."
   }
   ```

2. **Check response in network tab:**
   - Open DevTools → Network
   - Look for login request
   - Check Response tab for data

3. **Add logging to backend:**
   ```javascript
   console.log('Login response:', response)
   ```

---

#### ❌ Database Connection Failed
**Symptoms:**
- Backend error mentions database
- Cannot find user in database
- Login always fails

**Solutions:**
1. **Check database is running:**
   - MongoDB running?
   - Check connection string
   - Verify credentials

2. **Check database seed data:**
   ```javascript
   // Backend should have test users
   // admin@school.com
   // teacher@school.com
   // student@school.com
   ```

3. **Test database connection:**
   ```javascript
   // In backend
   console.log('DB Connected:', mongoose.connection.readyState)
   // 1 = connected, 0 = disconnected
   ```

---

### UI/UX Issues

#### ❌ Styling Looks Wrong
**Symptoms:**
- Login page missing styles
- Colors incorrect
- Layout broken

**Solutions:**
1. **Check Tailwind CSS:**
   ```bash
   # Rebuild Tailwind
   npm run build
   ```

2. **Clear cache:**
   ```powershell
   rm -r .next
   npm run dev
   ```

3. **Verify component imports:**
   - All UI components should import from `@/components/ui`
   - Check components exist

---

#### ❌ Icons Not Showing
**Symptoms:**
- Empty boxes where icons should be
- Missing building icon on header
- Role icons not visible

**Solutions:**
1. **Verify lucide-react import:**
   ```typescript
   import { Building2, Loader2, Eye, EyeOff, Crown, Briefcase, BookOpen, User } from "lucide-react"
   ```

2. **Install lucide-react if missing:**
   ```bash
   npm install lucide-react
   ```

3. **Check icon names:**
   - Visit https://lucide.dev for all available icons
   - Icon names are case-sensitive

---

#### ❌ Dark Theme Not Applied
**Symptoms:**
- Login page shows light theme
- Colors appear wrong
- Not matching screenshot

**Solutions:**
1. **Check Tailwind classes:**
   - Should include `bg-slate-900`, `text-slate-100`
   - Verify gradient classes applied

2. **Clear cache and rebuild:**
   ```bash
   rm -r .next
   npm run dev
   ```

3. **Check theme provider:**
   - Verify theme context setup in layout
   - Check next-themes is installed

---

## 🔧 Debugging Techniques

### Enable Verbose Logging

Add to login page:
```typescript
async function onSubmit(values: FormValues) {
    console.log('📝 Form submitted:', values)
    setIsLoading(true)
    try {
        const response = await apiClient.post(endpoint, {...})
        console.log('✅ Login successful:', response.data)
        // ...
    } catch (error) {
        console.error('❌ Login error:', error)
        // ...
    }
}
```

### Use Browser DevTools

1. **Open DevTools:** F12 or Right-click → Inspect
2. **Console Tab:** View errors and logs
3. **Network Tab:** See API requests/responses
4. **Application Tab:** Check localStorage/cookies
5. **Debugger:** Set breakpoints in code

### Test API Manually

```powershell
# Test login endpoint
$body = @{
    email = "admin@school.com"
    password = "pass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5130/api/v1/staff/admin/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Check Environment Variables

```powershell
# Verify API URL is set
Write-Host $env:NEXT_PUBLIC_API_URL

# Or check in app:
# http://localhost:3000
# (Right-click → View Page Source)
# Look for __NEXT_DATA__
```

---

## 📋 Diagnostic Checklist

Before reporting issues, verify:

- [ ] Backend is running (`npm start` in backend folder)
- [ ] Frontend is running (`npm run dev` in frontend folder)
- [ ] API URL is correct in `.env.local`
- [ ] `NEXT_PUBLIC_API_URL` environment variable set
- [ ] Demo user exists in database
- [ ] Browser console has no errors
- [ ] Network tab shows API request
- [ ] Response includes token
- [ ] LocalStorage has auth data
- [ ] Role matches exactly (case-sensitive)

---

## 🆘 Getting Help

1. **Check these docs first:**
   - `LOGIN_SYSTEM.md` - Full reference
   - `QUICKSTART.md` - Quick start
   - `BUILD_SUMMARY.md` - Feature overview

2. **Common patterns:**
   - Most issues are environment/configuration
   - Check backend is running first
   - Verify API URL is correct
   - Check database is seeded with test data

3. **Enable debugging:**
   - Add `console.log()` statements
   - Check browser console errors
   - Check network tab
   - Check backend logs

4. **Search in documentation:**
   - "Cannot login" → Check API URL
   - "Token not persisting" → Check localStorage
   - "Protected route not working" → Check role name
   - "401 error" → Check token is being sent

---

## 📞 Support

If issues persist:

1. Check all environment variables are set correctly
2. Verify backend database has test data
3. Review error message carefully
4. Check browser console for detailed error
5. Review network tab response
6. Add logging to narrow down issue
7. Review relevant section above

---

**Last Updated:** December 4, 2025
**Version:** 1.0
