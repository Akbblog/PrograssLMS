"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useSidebarStore } from "@/store/sidebarStore"
import { useSearchStore } from "@/store/searchStore"
import { ProtectedRoute } from "@/lib/auth/protectedRoute"
import Sidebar from "@/components/layouts/Sidebar"
import SearchDropdown from "@/components/search/SearchDropdown"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    LogOut,
    Search,
    Bell,
    Menu,
    Settings,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const { isCollapsed, isMobileOpen, toggleMobile, closeMobile } = useSidebarStore()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        closeMobile()
    }, [pathname, closeMobile])

    // Close sidebar on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                closeMobile()
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [closeMobile])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    return (
        <ProtectedRoute requiredRoles={['admin']}>
            <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
                {/* Mobile Overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={closeMobile}
                    />
                )}

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className={cn(
                    "flex-1 flex flex-col overflow-hidden w-full lg:w-auto transition-all duration-300",
                    isCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"
                )}>
                    {/* Header */}
                    <header className="h-[70px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-4 lg:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMobile}
                                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
                                <SearchDropdown />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 justify-end flex-1 sm:flex-initial">
                            <button className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-primary transition-all relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white dark:border-slate-800"></span>
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all group">
                                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                            {user?.name?.charAt(0) || "A"}
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-100 dark:border-slate-700 shadow-xl dark:bg-slate-800">
                                    <DropdownMenuItem onClick={() => router.push("/admin/settings")} className="rounded-lg py-2.5 cursor-pointer">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700 my-1" />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2.5 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
                        <div className="w-full animate-fadeInUp">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
            {/* SearchDropdown is rendered inline in the header; keep activator removed */}
        </ProtectedRoute>
    )
}
