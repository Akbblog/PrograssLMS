import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService, LoginCredentials, UserRole } from '@/lib/api/authService'
import { toast } from 'sonner'

/**
 * Custom hook for authentication operations
 */
export function useAuth() {
    const router = useRouter()
    const { user, isAuthenticated, login, logout } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Handle user login
     */
    const handleLogin = useCallback(
        async (email: string, password: string, role: UserRole) => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await authService.login({ email, password }, role)

                if (response.status === 'success') {
                    // Handle inconsistent backend response structures
                    // Superadmin: { data: user, token: "..." }
                    // Admin: { data: { user: user, token: "..." } }
                    // Student: { data: { student: user, token: "..." } }
                    // Teacher: { data: { teacher: user, token: "..." } }

                    console.log("🔍 Login Response Data:", JSON.stringify(response, null, 2));

                    const token = response.token || response.data?.token

                    let userData = response.data?.user || response.data?.student || response.data?.teacher
                    // Fallback for Superadmin where data IS the user object
                    if (!userData && response.data?._id) {
                        userData = response.data
                    }

                    if (!token || typeof token !== 'string') {
                        console.error("❌ Invalid token received:", token);
                        throw new Error('Invalid token format from server')
                    }

                    if (!userData) {
                        console.error("❌ No user data found in response");
                        throw new Error('Invalid user data from server')
                    }

                    console.log("✅ Token extracted successfully:", token.substring(0, 10) + "...");

                    login(
                        {
                            _id: userData._id,
                            id: userData._id,
                            name: userData.name,
                            email: userData.email,
                            role,
                            schoolId: userData.schoolId,
                        },
                        token
                    )

                    toast.success(`Welcome back, ${response.data.name}!`)

                    // Redirect based on role
                    const redirectMap: Record<UserRole, string> = {
                        super_admin: '/superadmin/dashboard',
                        admin: '/admin/dashboard',
                        teacher: '/teacher/dashboard',
                        student: '/student/dashboard',
                    }

                    const redirectUrl = redirectMap[role] || '/dashboard'
                    router.push(redirectUrl)

                    return true
                } else {
                    throw new Error('Login failed')
                }
            } catch (err: any) {
                const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.'
                setError(errorMsg)
                toast.error(errorMsg)
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [login, router]
    )

    /**
     * Handle user logout
     */
    const handleLogout = useCallback(() => {
        logout()
        authService.logout()
        toast.success('Logged out successfully')
        router.push('/login')
    }, [logout, router])

    /**
     * Check if user has specific role
     */
    const hasRole = useCallback(
        (role: UserRole | UserRole[]) => {
            if (!user) return false
            const roles = Array.isArray(role) ? role : [role]
            return roles.includes(user.role as UserRole)
        },
        [user]
    )

    /**
     * Check if user has any of the specified permissions
     */
    const hasPermission = useCallback(
        (requiredRoles: UserRole[]) => {
            if (!isAuthenticated) return false
            return hasRole(requiredRoles)
        },
        [isAuthenticated, hasRole]
    )

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        logout: handleLogout,
        hasRole,
        hasPermission,
    }
}

export default useAuth
