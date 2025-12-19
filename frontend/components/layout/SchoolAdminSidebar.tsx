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
        href: "/admin/dashboard",
        icon: "lucide:layout-dashboard",
    },
    {
        title: "Teachers",
        href: "/admin/teachers",
        icon: "lucide:users",
        featureKey: "canManageTeachers",
    },
    {
        title: "Students",
        href: "/admin/students",
        icon: "lucide:graduation-cap",
        featureKey: "canManageStudents",
    },
    {
        title: "Academic",
        href: "/admin/academic",
        icon: "lucide:book-open",
        featureKey: "canManageAcademics",
    },
    {
        title: "Attendance",
        href: "/admin/attendance",
        icon: "lucide:check-circle-2",
        featureKey: "canManageAttendance",
    },
    {
        title: "Exams",
        href: "/admin/exams",
        icon: "lucide:file-text",
        featureKey: "canManageExams",
    },
    {
        title: "Finance",
        href: "/admin/finance",
        icon: "lucide:dollar-sign",
        featureKey: "canManageFinance",
    },
    {
        title: "Communication",
        href: "/admin/communication",
        icon: "lucide:message-square",
        featureKey: "canManageCommunication",
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: "lucide:bar-chart-3",
        featureKey: "canViewReports",
    },
    {
        title: "Roles & Permissions",
        href: "/admin/roles",
        icon: "lucide:shield-check",
        featureKey: "canManageRoles",
    },
    {
        title: "School Settings",
        href: "/admin/settings",
        icon: "lucide:settings",
    },
    {
        title: "Branding",
        href: "/admin/branding",
        icon: "lucide:palette", // Good for branding/visuals
    },
]

export default function SchoolAdminSidebar({ className }: { className?: string }) {
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
                <Link href="/admin/dashboard" className="flex items-center gap-3">
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
                        // Feature Toggle Logic
                        if (item.featureKey && user?.features && (user.features as any)[item.featureKey] === false) {
                            return null;
                        }

                        const isActive = pathname === item.href ||
                            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
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
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name || "Admin"}</p>
                        <p className="text-xs text-slate-500">School Admin</p>
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

            {/* Plan Info */}
            <div className="p-4 pt-0">
                <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-900 mb-2">Standard Plan</h4>
                    <p className="text-xs text-indigo-700 mb-2">
                        245/500 Students
                    </p>
                    <div className="h-1.5 w-full bg-indigo-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-[49%]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

