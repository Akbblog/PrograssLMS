"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { LogOut, GraduationCap, Sparkles } from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/superadmin/dashboard",
        icon: "lucide:layout-dashboard",
    },
    {
        title: "Schools",
        href: "/superadmin/schools",
        icon: "lucide:building-2",
    },
    {
        title: "Users",
        href: "/superadmin/users",
        icon: "lucide:users",
    },
    {
        title: "Subscriptions",
        href: "/superadmin/subscriptions",
        icon: "lucide:credit-card",
    },
    {
        title: "Analytics",
        href: "/superadmin/analytics",
        icon: "lucide:bar-chart-3",
    },
    {
        title: "System Health",
        href: "/superadmin/system-health",
        icon: "lucide:activity",
    },
    {
        title: "Settings",
        href: "/superadmin/settings",
        icon: "lucide:settings",
    },
]

export default function SuperAdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const isActive = (href: string) => pathname === href || (href !== "/superadmin/dashboard" && pathname.startsWith(href))

    return (
        <div className={cn("flex h-full flex-col bg-white border-r border-slate-100 shadow-xl lg:shadow-none relative z-50 transition-all duration-300", className)}>
            {/* Logo */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 bg-white">
                <Link href="/superadmin/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform group-hover:scale-105">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-black text-lg text-slate-900 tracking-tight">Progress <span className="text-indigo-600">Pro</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-6">
                <nav className="px-4 space-y-1.5">
                    {sidebarItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                    active
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                )}
                            >
                                {active && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse pointer-events-none"></div>
                                )}

                                <Icon
                                    name={item.icon}
                                    className={cn(
                                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110 relative z-10",
                                        active ? "text-white" : "group-hover:text-indigo-600"
                                    )}
                                />
                                <span className="text-sm font-bold relative z-10">{item.title}</span>

                                {active && (
                                    <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-3 mb-4 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm">
                        {user?.name?.charAt(0) || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user?.name || "Super Admin"}</p>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">System Architect</p>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold mb-3 h-11"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit Control
                </Button>

                {/* System Directive */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-lg shadow-indigo-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-12 h-12" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10 text-indigo-100">System Status</h4>
                    <p className="text-[10px] font-bold leading-tight relative z-10 text-white/90">
                        All nodes operational. 4 new school requests pending.
                    </p>
                </div>
            </div>
        </div>
    )
}
