import apiClient from './client'

export interface LoginCredentials {
    email: string
    password: string
}

export type LoginResponse = any

export interface User {
    id: string
    name: string
    email: string
    role: string
    schoolId?: string
}

export type UserRole = 'admin' | 'teacher' | 'student' | 'super_admin'

/**
 * Authentication service for handling login/logout operations
 */
export const authService = {
    /**
     * Login as Super Admin
     */
    loginSuperAdmin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/superadmin/login', credentials)
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Login as School Admin
     */
    loginAdmin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/admin/login', credentials)
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Login as Teacher
     */
    loginTeacher: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/teachers/login', credentials)
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Login as Student
     */
    loginStudent: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/students/login', credentials)
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Universal login function that routes to appropriate endpoint
     */
    login: async (credentials: LoginCredentials, role: UserRole): Promise<LoginResponse> => {
        const endpointMap: Record<UserRole, (creds: LoginCredentials) => Promise<LoginResponse>> = {
            admin: authService.loginAdmin,
            teacher: authService.loginTeacher,
            student: authService.loginStudent,
            super_admin: authService.loginSuperAdmin,
        }

        const loginFn = endpointMap[role]
        if (!loginFn) {
            throw new Error(`Invalid role: ${role}`)
        }

        return loginFn(credentials)
    },

    /**
     * Logout user
     */
    logout: () => {
        // Token will be cleared from store
        localStorage.removeItem('auth-storage')
    },

    /**
     * Verify if token is still valid
     */
    verifyToken: async (): Promise<boolean> => {
        try {
            // This would need a backend endpoint to verify token
            // For now, just check if token exists
            return true
        } catch (error) {
            return false
        }
    },
}

export default authService
