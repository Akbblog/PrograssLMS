"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn, unwrapArray } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { ChevronDown, LogOut, Sparkles } from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"
import { useClasses } from "@/hooks/useClasses"

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
        icon: "lucide:palette",
    },
]

export default function SchoolAdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const { data: classesData } = useClasses()
    const classes = useMemo(() => unwrapArray<any>(classesData, "classes"), [classesData])
    const [studentsOpen, setStudentsOpen] = useState(false)

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const isActive = (href: string) => pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href))
    const isStudentsActive = pathname === "/admin/students" || pathname.startsWith("/admin/students")
    const activeClassId = searchParams.get("classId") || ""

    useEffect(() => {
        if (isStudentsActive) setStudentsOpen(true)
    }, [isStudentsActive])

    return (
        <div className={cn("flex h-full flex-col bg-white border-r border-slate-100 shadow-xl lg:shadow-none relative z-50 transition-all duration-300", className)}>
            {/* Logo */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 bg-white">
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform group-hover:scale-105">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-black text-lg text-slate-900 tracking-tight">Progress <span className="text-indigo-600">Pro</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-6">
                <nav className="px-4 space-y-1.5">
                    {sidebarItems.map((item) => {
                        // Feature Toggle Logic
                        if (item.featureKey && user?.features && (user.features as any)[item.featureKey] === false) {
                            return null;
                        }

                        const active = isActive(item.href)
                        if (item.title === "Students") {
                            return (
                                <div key={item.href} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 relative overflow-hidden flex-1",
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
                                            <span className="text-xs font-bold relative z-10">{item.title}</span>
                                        </Link>
                                        <button
                                            type="button"
                                            aria-label="Toggle student classes"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setStudentsOpen((prev) => !prev)
                                            }}
                                            className={cn(
                                                "h-9 w-9 rounded-2xl flex items-center justify-center transition-all",
                                                studentsOpen ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-500 hover:text-indigo-600"
                                            )}
                                        >
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", studentsOpen && "rotate-180")} />
                                        </button>
                                    </div>

                                    {studentsOpen && (
                                        <div className="ml-2 pl-3 border-l border-slate-100 space-y-1">
                                            <Link
                                                href="/admin/students"
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors",
                                                    pathname === "/admin/students"
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                                                )}
                                            >
                                                All Students
                                            </Link>
                                            <Link
                                                href="/admin/students/create"
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Register Student
                                            </Link>
                                            <div className="pt-2">
                                                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">By Class</p>
                                                <div className="mt-2 space-y-1 max-h-52 overflow-auto pr-1">
                                                    {classes.length === 0 ? (
                                                        <div className="px-3 py-2 text-[11px] text-slate-400">No classes yet</div>
                                                    ) : (
                                                        classes.map((c: any) => (
                                                            <Link
                                                                key={c._id}
                                                                href={`/admin/students?classId=${c._id}`}
                                                                className={cn(
                                                                    "flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors",
                                                                    activeClassId === c._id
                                                                        ? "bg-indigo-50 text-indigo-700"
                                                                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                                                                )}
                                                            >
                                                                <span className="truncate">{c.name}</span>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
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
                                <span className="text-xs font-bold relative z-10">{item.title}</span>

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
                    <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user?.name || "Admin"}</p>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">School Admin</p>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold mb-3 h-11"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>

                {/* Plan Info */}
                <div className="rounded-2xl bg-indigo-600 p-4 text-white shadow-lg shadow-indigo-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-12 h-12" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10 text-indigo-100">Capacity</h4>
                    <p className="text-[10px] font-bold leading-tight relative z-10 text-white/90 mb-2">
                        245 / 500 Students
                    </p>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden relative z-10">
                        <div className="h-full bg-white w-[49%] shadow-[0_0_8px_white]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
