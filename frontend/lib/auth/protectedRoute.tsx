'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/lib/api/authService'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRoles?: UserRole[]
}

/**
 * Higher-order component to protect routes based on authentication and role
 */
export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
    const router = useRouter()
    const { isAuthenticated, user, token } = useAuthStore()
    const [isHydrated, setIsHydrated] = useState(false)

    // Wait for zustand to hydrate from localStorage
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        // Don't check auth until hydration is complete
        if (!isHydrated) return

        // Check if user is authenticated
        if (!isAuthenticated || !token) {
            router.push('/login')
            return
        }

        // Check if user has required role
        if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role as UserRole)) {
            router.push('/unauthorized')
            return
        }
    }, [isHydrated, isAuthenticated, user, token, requiredRoles, router])

    // Show loading state while hydrating or checking authentication
    if (!isHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin">
                        <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-sm text-slate-500">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin">
                        <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-sm text-slate-500">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    // Check if user has required role
    if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role as UserRole)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export default ProtectedRoute
