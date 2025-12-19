import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5130/api/v1";

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        // Return the response data directly for convenience
        return response.data;
    },
    (error) => {
        // Handle 401 Unauthorized - but don't auto-logout on every 401
        // Only logout if there's an explicit "token expired" or "invalid token" message
        if (error.response?.status === 401) {
            const message = error.response?.data?.message?.toLowerCase() || '';

            // Only clear auth if token is actually invalid/expired
            if (message.includes('expired') ||
                message.includes('invalid token') ||
                message.includes('jwt') ||
                message.includes('unauthorized') ||
                message.includes('not logged in')) {

                console.warn('🔒 Session expired or invalid token, redirecting to login');

                if (typeof window !== 'undefined') {
                    // Clear auth data
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('auth-storage');

                    // Redirect to login if not already there
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
            }
        }

        // Handle network errors
        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout');
        }

        if (!error.response) {
            console.error('🌐 Network error - no response received');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
