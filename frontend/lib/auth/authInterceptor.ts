import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

/**
 * Hook for handling 401/403 responses and redirecting to login
 * This should be called in the root layout or a top-level component
 */
export function useAuthInterceptor() {
    const router = useRouter()
    const { logout } = useAuthStore()

    // This would typically be set up in an axios response interceptor
    // For now, it's a utility for manual handling
    const handleUnauthorized = () => {
        logout()
        router.push('/login')
    }

    const handleForbidden = () => {
        router.push('/unauthorized')
    }

    return {
        handleUnauthorized,
        handleForbidden,
    }
}

/**
 * Get current auth state without subscription (snapshot)
 */
export function getAuthSnapshot() {
    return useAuthStore.getState()
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(callback: (state: any) => void) {
    return useAuthStore.subscribe(
        (state) => state,
        callback
    )
}

export default useAuthInterceptor
