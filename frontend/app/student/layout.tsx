"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { ProtectedRoute } from "@/lib/auth/protectedRoute"
import { Button } from "@/components/ui/button"
import {
    LogOut,
    Search,
    Bell,
    BookOpen,
    BarChart3,
    Calendar,
    FileText,
    DollarSign,
    LayoutDashboard,
    Menu,
    X
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
    { icon: BookOpen, label: "My Courses", href: "/student/courses" },
    { icon: BarChart3, label: "My Grades", href: "/student/grades" },
    { icon: Calendar, label: "Calendar", href: "/student/calendar" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: DollarSign, label: "Fees", href: "/student/fees" },
    { icon: GraduationCap, label: "Conduct", href: "/student/behavior" },
]

export default function StudentLayout({
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

    const isActive = (href: string) => pathname === href

    return (
        <ProtectedRoute requiredRoles={['student']}>
            <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[270px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Logo */}
                    <div className="h-[70px] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
                        <Link href="/student/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-warning to-warning-600 rounded-xl flex items-center justify-center shadow-lg shadow-warning/30">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Progress <span className="text-warning">Sync</span></span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {sidebarItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                                        active
                                            ? "bg-warning text-white shadow-md shadow-warning/30"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-warning"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", active ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-warning")} />
                                    <span className="text-sm font-semibold truncate relative z-10">{item.label}</span>
                                    {active && (
                                        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3 mb-4 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-warning to-warning-600 rounded-lg flex items-center justify-center text-white font-black shadow-sm">
                                {user?.name?.charAt(0) || "S"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || "Student"}</p>
                                <p className="text-[10px] font-bold text-warning uppercase tracking-widest leading-none">Learning Path</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-center text-slate-500 dark:text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all font-bold h-10"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </aside>

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
                                <div className="group flex items-center gap-3 flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent focus-within:border-warning/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-sm focus-within:ring-4 focus-within:ring-warning/10 transition-all duration-300">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-warning transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Find lessons, assignments..."
                                        className="bg-transparent text-sm outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                                    />
                                    <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400 shadow-sm">
                                        <span className="text-[8px]">⌘</span>K
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center justify-center gap-2 flex-1 sm:hidden">
                            <GraduationCap className="h-6 w-6 text-warning" />
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Progress</span>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 justify-end flex-1 sm:flex-initial">
                            <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-warning transition-all">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>

                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                            <div className="flex items-center gap-3 pl-1">
                                <div className="w-9 h-9 bg-gradient-to-br from-warning to-warning-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                    {user?.name?.charAt(0) || "S"}
                                </div>
                            </div>
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
