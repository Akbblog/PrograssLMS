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
            <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <TeacherSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto bg-slate-50 dark:bg-slate-900">
                    {/* Header */}
                    <header className="h-[70px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-4 lg:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30 transition-all duration-200">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
                                <div className="group flex items-center gap-3 flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent focus-within:border-success/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-sm focus-within:ring-4 focus-within:ring-success/10 transition-all duration-300">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-success transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Command search (⌘K)"
                                        className="bg-transparent text-sm outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center justify-center gap-2 flex-1 sm:hidden">
                            <GraduationCap className="h-6 w-6 text-success" />
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Progress</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 justify-end flex-1 sm:flex-initial">
                            <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-success transition-all">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>

                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-1 pr-2 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group">
                                        <div className="w-9 h-9 bg-gradient-to-br from-success to-success-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                                            {user?.name?.charAt(0) || "T"}
                                        </div>
                                        <div className="text-left hidden md:block">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{user?.name?.split(" ")[0] || "Teacher"}</p>
                                            <p className="text-[10px] font-bold text-success uppercase tracking-widest leading-none">Elite Educator</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                                    <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-700/50 focus:text-slate-900 dark:focus:text-white">
                                        <Settings className="w-4 h-4 mr-2 text-slate-400" />
                                        <span className="font-medium text-sm">Account Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700 my-1" />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span className="font-medium text-sm">Sign Out System</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
                        <div className="mx-auto max-w-7xl animate-fadeInUp">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
