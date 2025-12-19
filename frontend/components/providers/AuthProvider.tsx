"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        // Rehydrate auth state from localStorage on mount if Zustand persist fails or for redundancy
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    // Only re-login if not already authenticated in store to avoid loops
                    if (!useAuthStore.getState().isAuthenticated) {
                        login(user, token);
                    }
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }
        }
    }, [login]);

    return <>{children}</>;
}
