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
    LayoutDashboard,
    ChevronDown,
    Menu,
    X
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"
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
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Logo */}
                    <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 lg:px-6">
                        <Link href="/superadmin/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-lg text-slate-900 tracking-tight">Progress <span className="text-indigo-600">LMS</span></span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                                        active
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                    )}
                                >
                                    {active && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent animate-pulse pointer-events-none"></div>
                                    )}
                                    <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", active ? "text-white" : "group-hover:text-indigo-600")} />
                                    <span className="text-sm font-bold truncate relative z-10">{item.label}</span>
                                    {active && (
                                        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                        <div className="flex items-center gap-3 mb-4 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {user?.name?.charAt(0) || "S"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{user?.name || "Super Admin"}</p>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Global Root</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold mb-2"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>

                        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="w-12 h-12" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-1 relative z-10 text-white/90">Authority</h4>
                            <p className="text-[10px] font-bold leading-tight relative z-10 text-white/80">
                                System-wide root access protocol active.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
                    {/* Header */}
                    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all border border-slate-100 hover:border-indigo-100"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
                                <div className="group flex items-center gap-3 flex-1 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="System-wide search..."
                                        className="bg-transparent text-sm outline-none w-full text-slate-900 placeholder:text-slate-400 font-medium"
                                    />
                                    <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-400 shadow-sm">
                                        <span className="text-[8px]">⌘</span>K
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center justify-center gap-2 flex-1 sm:hidden">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-slate-900 tracking-tight">Progress <span className="text-indigo-600">LMS</span></span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 justify-end flex-1 sm:flex-initial">
                            <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-all border border-slate-100 hover:border-indigo-100 relative group">
                                <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span>
                            </button>

                            <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2.5 hover:bg-slate-50 rounded-2xl p-1 pr-2 transition-all border border-transparent hover:border-slate-100 group">
                                        <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                                            {user?.name?.charAt(0) || "S"}
                                        </div>
                                        <div className="text-left hidden md:block">
                                            <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">{user?.name?.split(" ")[0] || "Admin"}</p>
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Global Root</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                    <DropdownMenuItem onClick={() => router.push("/superadmin/settings")} className="rounded-xl py-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span className="font-semibold text-sm">System Control</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span className="font-semibold text-sm">Sign Out</span>
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
