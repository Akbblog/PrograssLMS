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
    Building2,
    Users,
    BarChart3,
    Settings,
    GraduationCap,
    LayoutDashboard,
    ChevronDown,
    Menu,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/superadmin/dashboard" },
    { label: "Schools", icon: Building2, href: "/superadmin/schools" },
    { label: "Users", icon: Users, href: "/superadmin/users" },
    { label: "Analytics", icon: BarChart3, href: "/superadmin/analytics" },
    { label: "Settings", icon: Settings, href: "/superadmin/settings" },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
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

    const isActive = (href: string) => {
        if (href === "/superadmin/dashboard") {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    return (
        <ProtectedRoute requiredRoles={['super_admin']}>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Logo */}
                    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
                        <Link href="/superadmin/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-lg text-slate-900">Progress LMS</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                    isActive(item.href)
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive(item.href) ? "text-indigo-600" : "")} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User & Logout */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || "S"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name || "Super Admin"}</p>
                                <p className="text-xs text-slate-500">Super Admin</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>

                    {/* Admin Info */}
                    <div className="p-4 pt-0">
                        <div className="rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border border-purple-100">
                            <h4 className="text-sm font-semibold text-purple-900 mb-1">Super Admin</h4>
                            <p className="text-xs text-purple-700">
                                Full system access enabled
                            </p>
                        </div>
                    </div>
                </div>

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

                        {/* Search - Hidden on small mobile, visible on larger screens */}
                        <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
                            <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search schools, users..."
                                    className="bg-transparent text-sm outline-none w-full text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Mobile Logo - Only visible on mobile when sidebar is closed */}
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
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.name?.charAt(0) || "S"}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900 hidden md:block">{user?.name?.split(" ")[0] || "Admin"}</span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => router.push("/superadmin/settings")}>
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
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
