
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { X } from "lucide-react"

const sidebarItems = [
    {
        label: "Dashboard",
        href: "/teacher/dashboard",
        icon: "lucide:layout-dashboard"
    },
    {
        label: "My Students",
        href: "/teacher/students",
        icon: "lucide:users"
    },
    {
        label: "Attendance",
        href: "/teacher/attendance",
        icon: "lucide:clipboard-list"
    },
    {
        label: "Assignments",
        href: "/teacher/assignments",
        icon: "lucide:file-text"
    },
    {
        label: "Grades",
        href: "/teacher/grades",
        icon: "lucide:graduation-cap"
    },
    {
        label: "Communication",
        href: "/teacher/communication",
        icon: "lucide:message-square"
    },
    {
        label: "Materials",
        href: "/teacher/materials",
        icon: "lucide:book-open"
    },
]

interface TeacherSidebarProps {
    className?: string
    sidebarOpen?: boolean
    setSidebarOpen?: (open: boolean) => void
}

export default function TeacherSidebar({ className, sidebarOpen, setSidebarOpen }: TeacherSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            className
        )}>
            {/* Logo */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
                <Link href="/teacher/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Icon name="lucide:graduation-cap" className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">Progress LMS</span>
                </Link>
                {setSidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                )}
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
                        <Icon name={item.icon} className={cn("h-5 w-5", isActive(item.href) ? "text-indigo-600" : "")} />
                        <span className="text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0) || "T"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name || "Teacher"}</p>
                        <p className="text-xs text-slate-500">Teacher</p>
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
        </div>
    )
}
