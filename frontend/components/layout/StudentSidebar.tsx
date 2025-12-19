"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon"
import { cn } from "@/lib/utils";

export default function StudentSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const menuItems = [
        { icon: "lucide:layout-dashboard", label: "Dashboard", href: "/student/dashboard" },
        { icon: "lucide:book-open", label: "My Courses", href: "/student/courses" },
        { icon: "lucide:bar-chart-3", label: "My Grades", href: "/student/grades" },
        { icon: "lucide:file-text", label: "Assignments", href: "/student/assignments" },
        { icon: "lucide:clipboard-list", label: "Attendance", href: "/student/attendance" },
        { icon: "lucide:message-square", label: "Communication", href: "/student/communication" },
        { icon: "lucide:dollar-sign", label: "Fees", href: "/student/fees" },
        { icon: "lucide:calendar", label: "Calendar", href: "/student/calendar" },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="h-16 border-b border-slate-200 flex items-center px-6">
                <Link href="/student/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Icon name="lucide:graduation-cap" className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">Progress LMS</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0) || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name || "Student"}</p>
                        <p className="text-xs text-slate-500">Student</p>
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
    );
}

