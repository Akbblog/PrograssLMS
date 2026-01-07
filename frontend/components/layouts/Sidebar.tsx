"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useQueryClient } from '@tanstack/react-query'
import { adminAPI, academicAPI, superAdminAPI } from '@/lib/api/endpoints'
import { useAuthStore } from "@/store/authStore"
import { useSidebarStore } from "@/store/sidebarStore"
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
    ChevronLeft,
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

interface SidebarProps {
    className?: string
}

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebarStore()

    const [expandedItems, setExpandedItems] = useState<string[]>(["Academic"])
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    // Close mobile sidebar on route change
    useEffect(() => {
        closeMobile()
    }, [pathname, closeMobile])

    // Keyboard shortcut for collapse toggle
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault()
                toggleCollapse()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleCollapse])

    const qc = useQueryClient();

    const isActive = (href: string) => {
        if (href === "/admin/dashboard") return pathname === href
        return pathname.startsWith(href.split("?")[0])
    }

    const handleMouseEnter = (href: string) => {
        // Prefetch the most likely queries for each admin route
        if (href === '/admin/students') {
            qc.prefetchQuery({ queryKey: ['students', { page: 1, search: '', classId: '' }], queryFn: () => adminAPI.getStudents({ page: 1 }) });
        } else if (href === '/admin/teachers') {
            qc.prefetchQuery({ queryKey: ['teachers', { page: 1, search: '' }], queryFn: () => adminAPI.getTeachers({ page: 1 }) });
        } else if (href === '/admin/academic/classes' || href.startsWith('/admin/academic')) {
            qc.prefetchQuery({ queryKey: ['classes'], queryFn: () => academicAPI.getClasses() });
            qc.prefetchQuery({ queryKey: ['subjects'], queryFn: () => academicAPI.getSubjects() });
            qc.prefetchQuery({ queryKey: ['academicYears'], queryFn: () => adminAPI.getAcademicYears() });
            qc.prefetchQuery({ queryKey: ['academicTerms'], queryFn: () => adminAPI.getAcademicTerms() });
        } else if (href.startsWith('/admin/attendance')) {
            qc.prefetchQuery({ queryKey: ['attendance', { classLevel: '', date: '' }], queryFn: () => Promise.resolve([]) });
        } else if (href === '/admin/dashboard') {
            qc.prefetchQuery({ queryKey: ['dashboardStats'], queryFn: () => adminAPI.getDashboardStats() });
        } else if (href.startsWith('/admin/exams')) {
            qc.prefetchQuery({ queryKey: ['exams', { page: 1 }], queryFn: () => adminAPI.get('/exams', { params: { page: 1 } }).then(r => r.data) });
        } else if (href.startsWith('/admin/hr')) {
            qc.prefetchQuery({ queryKey: ['staff', { page: 1 }], queryFn: () => adminAPI.get('/hr/staff', { params: { page: 1 } }).then(r => r.data) });
            qc.prefetchQuery({ queryKey: ['payroll'], queryFn: () => adminAPI.get('/hr/payroll').then(r => r.data) });
            qc.prefetchQuery({ queryKey: ['appraisals', { page: 1 }], queryFn: () => adminAPI.get('/hr/appraisals', { params: { page: 1 } }).then(r => r.data) });
        } else if (href.startsWith('/admin/library')) {
            qc.prefetchQuery({ queryKey: ['books', { page: 1 }], queryFn: () => adminAPI.get('/library/books', { params: { page: 1 } }).then(r => r.data) });
        } else if (href.startsWith('/admin/documents')) {
            // Prefetch templates for Documents pages
            qc.prefetchQuery({ queryKey: ['documents','templates'], queryFn: () => adminAPI.getDocumentTemplates() });
        } else if (href === '/admin/settings') {
            // Prefetch school settings for settings page (if user has a schoolId)
            const user = useAuthStore.getState().user
            if (user?.schoolId) {
                qc.prefetchQuery({ queryKey: ['school', user.schoolId], queryFn: () => superAdminAPI.getSchool(user.schoolId) })
            }
        } else if (href.startsWith('/admin/transport')) {
            qc.prefetchQuery({ queryKey: ['routes', { page: 1 }], queryFn: () => adminAPI.get('/transport/routes', { params: { page: 1 } }).then(r => r.data) });
            qc.prefetchQuery({ queryKey: ['vehicles'], queryFn: () => adminAPI.get('/transport/vehicles').then(r => r.data) });
        }
    }

    const toggleExpanded = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(i => i !== title)
                : [...prev, title]
        )
    }

    const handleLogout = () => {
        logout()
        // Router push will be handled by parent component
    }

    return (
        <TooltipProvider>
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 bg-white text-slate-700 border-r border-slate-100 flex flex-col transform transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[72px]" : "w-[280px]",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                className
            )}>
                {/* Header Section */}
                <div className="h-20 flex items-center relative px-4">
                    <div className={cn(
                        "flex items-center transition-all duration-300 w-full",
                        isCollapsed ? "justify-center" : "justify-start px-2"
                    )}>
                        <Link href="/admin/dashboard" className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-xl text-slate-900 tracking-tight truncate">
                                    Progress <span className="text-violet-500">LMS</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className={cn(
                            "hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200",
                            isCollapsed ? "absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm z-50" : ""
                        )}
                        title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={closeMobile}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 flex-shrink-0 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Navigation */}
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

                        if (isCollapsed) {
                            return (
                                <div key={item.href} className="relative">
                                    {item.subItems ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    className={cn(
                                                        "w-full group flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-200",
                                                        active
                                                            ? "bg-violet-50 text-violet-600"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                    )}
                                                    onMouseEnter={() => { setHoveredItem(item.title); handleMouseEnter(item.href); }}
                                                    onMouseLeave={() => setHoveredItem(null)}
                                                >
                                                    <item.icon className={cn(
                                                        "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                                                        active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                                                    )} />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent side="right" align="start" className="w-56 p-2 ml-2">
                                                <div className="space-y-1">
                                                    <div className="px-3 py-2 text-sm font-medium text-slate-900 border-b border-slate-100">
                                                        {item.title}
                                                    </div>
                                                    {item.subItems.map((subItem) => (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            onMouseEnter={() => handleMouseEnter(subItem.href)}
                                                            className={cn(
                                                                "block px-3 py-2 text-sm rounded-md transition-all",
                                                                pathname === subItem.href.split("?")[0]
                                                                    ? "text-blue-600 font-medium bg-slate-100"
                                                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-200",
                                                        active
                                                            ? "bg-violet-50 text-violet-600"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                    )}
                                                >
                                                    <item.icon className={cn(
                                                        "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                                                        active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                                                    )} />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="ml-2">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            )
                        }

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
                                                <item.icon className={cn(
                                                    "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                                                    active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                                                )} />
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
                                                        onMouseEnter={() => handleMouseEnter(subItem.href)}
                                                        className={cn(
                                                            "block py-2 px-3 text-sm rounded-md transition-all",
                                                            pathname === subItem.href.split("?")[0]
                                                                ? "text-blue-600 font-medium bg-slate-100"
                                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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
                                        onMouseEnter={() => handleMouseEnter(item.href)}
                                        className={cn(
                                            "group flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-200",
                                            active
                                                ? "bg-violet-50 text-violet-600 font-semibold"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                                            active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                                        )} />
                                        <span className="text-sm font-medium truncate">{item.title}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className={cn(
                    "p-4 m-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-300",
                    isCollapsed ? "mx-2" : "mx-4"
                )}>
                    <div className={cn(
                        "flex items-center gap-3 mb-3",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {user?.name?.charAt(0) || "A"}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Admin"}</p>
                                <p className="text-xs font-medium text-slate-500">School Admin</p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg h-9 text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    )}
                    {isCollapsed && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-2">
                                Logout
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}
