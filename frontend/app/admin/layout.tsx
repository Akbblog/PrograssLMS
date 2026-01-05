"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { ProtectedRoute } from "@/lib/auth/protectedRoute"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    LogOut,
    Search,
    Bell,
    Users,
    BookOpen,
    Calendar,
    FileText,
    CreditCard,
    Settings,
    LayoutDashboard,
    ChevronDown,
    ChevronRight,
    MessageSquare,
    UserCog,
    Menu,
    X,
    Bus
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"

const sidebarItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
        title: "Academic",
        href: "/admin/academic",
        icon: BookOpen,
        subItems: [
            { title: "Classes", href: "/admin/academic/classes" },
            { title: "Subjects", href: "/admin/academic/subjects" },
            { title: "Academic Years", href: "/admin/academic/years" },
            { title: "Academic Terms", href: "/admin/academic/terms" },
            { title: "Grading Policy", href: "/admin/academic/grading-policy" },
            { title: "Question Bank", href: "/admin/academic/questions" },
            { title: "Assessment Types", href: "/admin/academic/assessments" },
            { title: "Learning Courses", href: "/admin/academic/learning-courses" },
            { title: "Behavior Tracking", href: "/admin/academic/behavior" },
        ]
    },
    { title: "Teachers", href: "/admin/teachers", icon: Users },
    { title: "Students", href: "/admin/students", icon: GraduationCap },
    {
        title: "Attendance",
        href: "/admin/attendance",
        icon: Calendar,
        subItems: [
            { title: "Overview", href: "/admin/attendance" },
            { title: "QR Scanner", href: "/admin/attendance/qr-scanner" },
            { title: "Live Attendance", href: "/admin/attendance/live" },
            { title: "Attendance Reports", href: "/admin/attendance/reports" },
        ],
    },
    {
        title: "HR",
        href: "/admin/hr",
        icon: Users,
        subItems: [
            { title: "Staff Directory", href: "/admin/hr/staff-directory" },
            { title: "Payroll", href: "/admin/hr/payroll" },
            { title: "Performance Reviews", href: "/admin/hr/performance" },
            { title: "Leave Management", href: "/admin/hr/leave" },
        ],
    },
    {
        title: "Library",
        href: "/admin/library",
        icon: BookOpen,
        subItems: [
            { title: "Books Catalog", href: "/admin/library/books" },
            { title: "Issue / Return", href: "/admin/library/transactions" },
            { title: "Reports", href: "/admin/library/reports" },
        ],
    },
    {
        title: "Transport",
        href: "/admin/transport",
        icon: Bus,
        subItems: [
            { title: "Routes", href: "/admin/transport/routes" },
            { title: "Vehicles", href: "/admin/transport/vehicles" },
            { title: "Allocations", href: "/admin/transport/allocations" },
            { title: "Reports", href: "/admin/transport/reports" },
        ],
    },
    { title: "Communication", href: "/admin/communication", icon: MessageSquare },
    { title: "Exams", href: "/admin/exams", icon: FileText },
    { title: "Finance", href: "/admin/finance", icon: CreditCard },
    { title: "Reports", href: "/admin/reports", icon: FileText },
    { title: "Roles & Permissions", href: "/admin/roles", icon: UserCog },
    { title: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const [expandedItems, setExpandedItems] = useState<string[]>(["Academic"])
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
        if (href === "/admin/dashboard") return pathname === href
        return pathname.startsWith(href.split("?")[0])
    }

    const toggleExpanded = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(i => i !== title)
                : [...prev, title]
        )
    }

    return (
        <ProtectedRoute requiredRoles={['admin']}>
            <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar - Light theme (matches reference) */}
                <div className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[270px] max-w-[90vw] bg-white text-slate-700 border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-between px-6">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight truncate">Progress <span className="text-violet-500">LMS</span></span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/10 flex-shrink-0"
                        >
                            <X className="w-5 h-5 text-white/70" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            // Feature Toggle Logic
                            if (item.title === "Teachers" && user?.features?.canManageTeachers === false) return null;
                            if (item.title === "Students" && user?.features?.canManageStudents === false) return null;
                            if (item.title === "Academic" && user?.features?.canManageAcademics === false) return null;
                            if (item.title === "Attendance" && user?.features?.canManageAttendance === false) return null;
                            if (item.title === "Exams" && user?.features?.canManageExams === false) return null;
                            if (item.title === "Finance" && user?.features?.canManageFinance === false) return null;
                            if (item.title === "Communication" && user?.features?.canManageCommunication === false) return null;
                            if (item.title === "Reports" && user?.features?.canViewReports === false) return null;
                            if (item.title === "Roles & Permissions" && user?.features?.canManageRoles === false) return null;

                            const active = isActive(item.href);

                            return (
                                <div key={item.href}>
                                    {item.subItems ? (
                                        <>
                                            <button
                                                onClick={() => toggleExpanded(item.title)}
                                                className={cn(
                                                    "w-full group flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg transition-all duration-200",
                                                    active
                                                        ? "bg-violet-50 text-violet-600 font-semibold"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <item.icon className={cn("h-[22px] w-[22px] flex-shrink-0 transition-transform", active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700")} />
                                                    <span className="text-sm font-medium truncate">{item.title}</span>
                                                </div>
                                                <ChevronRight className={cn(
                                                    "h-4 w-4 transition-transform flex-shrink-0 opacity-70",
                                                    expandedItems.includes(item.title) && "rotate-90"
                                                )} />
                                            </button>
                                            {expandedItems.includes(item.title) && (
                                                <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-slate-100">
                                                    {item.subItems.map((subItem) => (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={cn(
                                                                "block py-2 px-3 text-sm rounded-md transition-all",
                                                                pathname === subItem.href.split("?")[0]
                                                                    ? "text-blue-600 font-medium bg-slate-100 dark:text-blue-400 dark:bg-white/5"
                                                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                                                            )}
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-200",
                                                active
                                                    ? "bg-violet-50 text-violet-600 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                        >
                                            <item.icon className={cn("h-[22px] w-[22px] flex-shrink-0 transition-transform", active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700")} />
                                            <span className="text-sm font-medium truncate">{item.title}</span>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 m-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || "Admin"}</p>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">School Admin</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-center text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg h-9 text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
                    {/* Header */}
                    <header className="h-[70px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-4 lg:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
                                <div className="group flex items-center gap-3 flex-1 px-4 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-full border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="bg-transparent text-sm outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 justify-end flex-1 sm:flex-initial">
                            <button className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-primary transition-all relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white dark:border-slate-800"></span>
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all group">
                                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                            {user?.name?.charAt(0) || "A"}
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-100 dark:border-slate-700 shadow-xl dark:bg-slate-800">
                                    <DropdownMenuItem onClick={() => router.push("/admin/settings")} className="rounded-lg py-2.5 cursor-pointer">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700 my-1" />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2.5 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
                        <div className="w-full animate-fadeInUp">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
