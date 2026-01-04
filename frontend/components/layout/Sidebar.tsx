"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    Settings,
    FileText,
    Building2
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Teachers",
        href: "/admin/teachers",
        icon: Users,
    },
    {
        title: "Students",
        href: "/admin/students",
        icon: GraduationCap,
    },
    {
        title: "Academic",
        href: "/admin/academic",
        icon: BookOpen,
    },
    {
        title: "Exams",
        href: "/admin/exams",
        icon: FileText,
    },
    {
        title: "Timetable",
        href: "/admin/timetable",
        icon: Calendar,
    },
    {
        title: "Attendance",
        href: "/admin/academic/attendance",
        icon: Calendar,
    },
    {
        title: "Finance",
        href: "/admin/finance/fees",
        icon: Building2, // Using Building2 as placeholder or import DollarSign
    },
    {
        title: "School Profile",
        href: "/admin/settings",
        icon: Building2,
    },
]

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={cn("flex h-full flex-col border-r bg-muted/40", className)}>
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span>Progress LMS</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <h4 className="mb-2 text-sm font-semibold">Pro Plan</h4>
                    <p className="mb-3 text-xs text-muted-foreground">
                        You are on the Pro plan. 85/100 students used.
                    </p>
                    <Link
                        href="/billing"
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        Upgrade Plan
                    </Link>
                </div>
            </div>
        </div>
    )
}
