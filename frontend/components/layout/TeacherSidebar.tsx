
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
        label: "Performance",
        href: "/teacher/performance",
        icon: "lucide:bar-chart-3"
    },
    {
        label: "Behavior",
        href: "/teacher/behavior",
        icon: "lucide:shield-alert"
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
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-[270px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none font-sans",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            className
        )}>
            {/* Logo */}
            <div className="h-[70px] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 bg-white dark:bg-slate-800">
                <Link href="/teacher/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-success to-success-600 rounded-xl flex items-center justify-center shadow-lg shadow-success/30">
                        <Icon name="lucide:graduation-cap" className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Progress <span className="text-success">Pro</span></span>
                </Link>
                {setSidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen?.(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
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
                                    ? "bg-success text-white shadow-md shadow-success/30"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-success"
                            )}
                        >
                            <Icon
                                name={item.icon}
                                className={cn(
                                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                                    active ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-success"
                                )}
                            />
                            <span className="text-sm font-semibold truncate relative z-10">{item.label}</span>

                            {active && (
                                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3 mb-4 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-success to-success-600 rounded-lg flex items-center justify-center text-white font-black shadow-sm">
                        {user?.name?.charAt(0) || "T"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || "Teacher"}</p>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest leading-none">Educator Elite</p>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-center text-slate-500 dark:text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all font-bold h-10"
                >
                    <Icon name="lucide:log-out" className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </aside>
    )
}
