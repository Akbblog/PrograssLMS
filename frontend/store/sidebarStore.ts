import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SidebarState {
    isCollapsed: boolean
    isMobileOpen: boolean
    toggleCollapse: () => void
    setCollapsed: (value: boolean) => void
    toggleMobile: () => void
    closeMobile: () => void
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set, get) => ({
            isCollapsed: false,
            isMobileOpen: false,

            toggleCollapse: () => {
                set((state) => ({ isCollapsed: !state.isCollapsed }))
            },

            setCollapsed: (value: boolean) => {
                set({ isCollapsed: value })
            },

            toggleMobile: () => {
                set((state) => ({ isMobileOpen: !state.isMobileOpen }))
            },

            closeMobile: () => {
                set({ isMobileOpen: false })
            },
        }),
        {
            name: 'sidebar-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ isCollapsed: state.isCollapsed }),
        }
    )
)