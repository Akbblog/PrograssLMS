"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { ProtectedRoute } from "@/lib/auth/protectedRoute"
import { Button } from "@/components/ui/button"
import {
    Search,
    Bell,
    GraduationCap,
    Menu,
    ChevronDown,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TeacherSidebar from "@/components/layout/TeacherSidebar"
import Icon from "@/components/ui/icon"

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    // Close sidebar on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    return (
        <ProtectedRoute requiredRoles={['teacher']}>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <TeacherSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
                    {/* Header */}
                    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between flex-shrink-0">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 mr-2"
                        >
                            <Menu className="w-6 h-6 text-slate-600" />
                        </button>

                        {/* Search - Hidden on small mobile */}
                        <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
                            <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search students, assignments..."
                                    className="bg-transparent text-sm outline-none w-full text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center gap-2 flex-1 sm:hidden">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-slate-900">Progress LMS</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Mobile Search Button */}
                            <button className="sm:hidden p-2 rounded-lg hover:bg-slate-100">
                                <Search className="w-5 h-5 text-slate-600" />
                            </button>

                            <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors relative">
                                <Bell className="w-5 h-5 text-slate-600" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.name?.charAt(0) || "T"}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900 hidden md:block">{user?.name?.split(" ")[0] || "Teacher"}</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
