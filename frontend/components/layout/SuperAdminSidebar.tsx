"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

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
        href: "/superadmin/shield-alert", // Fixed name if intended as health
        icon: "lucide:shield-alert",
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

    return (
        <div className={cn("flex h-full flex-col bg-white border-r border-slate-200", className)}>
            {/* Logo */}
            <div className="h-16 border-b border-slate-200 flex items-center px-6">
                <Link href="/superadmin/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Icon name="lucide:graduation-cap" className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">Progress LMS</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4">
                <nav className="px-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/superadmin/dashboard" && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon name={item.icon} className={cn("h-5 w-5", isActive ? "text-indigo-600" : "")} />
                                <span className="text-sm">{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

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
                    <Icon name="lucide:log-out" className="w-4 h-4 mr-2" />
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
    )
}

