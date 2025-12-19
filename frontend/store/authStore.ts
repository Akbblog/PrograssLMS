import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
    _id: string
    id: string
    name: string
    email: string
    role: string
    schoolId?: string
    features?: {
        onlineExams?: boolean
        attendance?: boolean
        analytics?: boolean
        canManageTeachers?: boolean
        canManageStudents?: boolean
        canManageAcademics?: boolean
        canManageAttendance?: boolean
        canManageCommunication?: boolean
        canManageExams?: boolean
        canManageFinance?: boolean
        canViewReports?: boolean
        canManageRoles?: boolean
        [key: string]: any
    }
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    _hasHydrated: boolean
    login: (user: User, token: string) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
    hasRole: (role: string | string[]) => boolean
    setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,

            setHasHydrated: (state) => {
                set({ _hasHydrated: state })
            },

            login: (user, token) => {
                set({ user, token, isAuthenticated: true })
                // Also store in localStorage directly for the API client
                if (typeof window !== 'undefined' && window.localStorage) {
                    try {
                        localStorage.setItem('token', token || '')
                        localStorage.setItem('user', JSON.stringify(user || {}))
                    } catch (e) {
                        console.warn('Failed to persist auth to localStorage', e)
                    }
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false })
                if (typeof window !== 'undefined' && window.localStorage) {
                    try {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        localStorage.removeItem('auth-storage')
                    } catch (e) {
                        // ignore
                    }
                }
            },

            updateUser: (updates) => {
                const current = get().user
                if (current) {
                    const updated = { ...current, ...updates }
                    set({ user: updated })
                    // Update localStorage too
                    if (typeof window !== 'undefined' && window.localStorage) {
                        try {
                            localStorage.setItem('user', JSON.stringify(updated))
                        } catch (e) {
                            // ignore
                        }
                    }
                }
            },

            hasRole: (roles) => {
                const userRole = get().user?.role
                if (!userRole) return false

                if (typeof roles === 'string') {
                    return userRole === roles
                }

                return roles.includes(userRole)
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => {
                try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                        return localStorage;
                    }
                    return sessionStorage; // Fallback to session storage if available
                } catch (e) {
                    console.warn("AuthStore: LocalStorage access blocked, falling back to memory storage", e);
                    // Dummy storage implementation to prevent crashes
                    return {
                        getItem: () => null,
                        setItem: () => { },
                        removeItem: () => { },
                    };
                }
            }),
            onRehydrateStorage: () => (state) => {
                // Mark as hydrated once rehydration is complete
                state?.setHasHydrated(true)

                // Verify token from localStorage matches persisted state if possible
                try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                        const storedToken = localStorage.getItem('token')
                        if (state && storedToken && state.token !== storedToken) {
                            state.token = storedToken
                        }
                    }
                } catch (e) {
                    // Ignore storage errors during rehydration check
                }
            },
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

// Helper hook to check if store has hydrated
export const useAuthHydrated = () => useAuthStore((state) => state._hasHydrated)
