"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/useAuth";
import { adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    GraduationCap,
    BookOpen,
    DollarSign,
    Calendar,
    ArrowRight,
    Loader2,
    Plus,
    Clock,
    CheckCircle2,
    Activity,
    UserPlus,
    ArrowUpRight,
    ChevronRight,
    BarChart3,
    MessageSquare,
    Bell
} from "lucide-react";

interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalRevenue: number;
    pendingFees?: number;
    attendanceRate?: number;
    newEnrollments?: number;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalRevenue: 0,
        pendingFees: 0,
        attendanceRate: 0,
        newEnrollments: 0
    });
    const [recentStudents, setRecentStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, studentsRes] = await Promise.all([
                    adminAPI.getDashboardStats(),
                    adminAPI.getStudents()
                ]);

                if ((statsRes as any).status === "success" && (statsRes as any).data) {
                    setStats({
                        ...(statsRes as any).data,
                        pendingFees: 12500,
                        attendanceRate: 94.5,
                        newEnrollments: 8
                    });
                }

                const studentsData = (studentsRes as any).data;
                const students = Array.isArray(studentsData) ? studentsData : (studentsData?.students || []);
                setRecentStudents(students.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: GraduationCap,
            color: "from-blue-500 to-blue-600",
            change: "+12%",
            href: "/admin/students",
            feature: "canManageStudents"
        },
        {
            title: "Total Teachers",
            value: stats.totalTeachers,
            icon: Users,
            color: "from-purple-500 to-purple-600",
            change: "+5%",
            href: "/admin/teachers",
            feature: "canManageTeachers"
        },
        {
            title: "Active Classes",
            value: stats.totalClasses,
            icon: BookOpen,
            color: "from-emerald-500 to-emerald-600",
            change: "+3%",
            href: "/admin/academic",
            feature: "canManageAcademics"
        },
        {
            title: "Attendance Rate",
            value: `${stats.attendanceRate || 94.5}%`,
            icon: CheckCircle2,
            color: "from-amber-500 to-amber-600",
            change: "+2.1%",
            href: "/admin/attendance",
            feature: "canManageAttendance"
        },
    ].filter(card => !card.feature || (user?.features as any)?.[card.feature] !== false);

    const quickActions = [
        { title: "Add Student", icon: UserPlus, href: "/admin/students", color: "text-blue-600 bg-blue-100", feature: "canManageStudents" },
        { title: "Add Teacher", icon: Users, href: "/admin/teachers", color: "text-purple-600 bg-purple-100", feature: "canManageTeachers" },
        { title: "Create Class", icon: BookOpen, href: "/admin/academic", color: "text-emerald-600 bg-emerald-100", feature: "canManageAcademics" },
        { title: "Record Attendance", icon: Calendar, href: "/admin/attendance", color: "text-amber-600 bg-amber-100", feature: "canManageAttendance" },
        { title: "View Reports", icon: BarChart3, href: "/admin/reports", color: "text-rose-600 bg-rose-100", feature: "canViewReports" },
        { title: "Messages", icon: MessageSquare, href: "/admin/communication", color: "text-indigo-600 bg-indigo-100", feature: "canManageCommunication" },
    ].filter(action => !action.feature || (user?.features as any)?.[action.feature] !== false);

    const upcomingEvents = [
        { title: "Staff Meeting", date: "Today, 10:00 AM", type: "meeting" },
        { title: "Parent-Teacher Conference", date: "Tomorrow, 2:00 PM", type: "event" },
        { title: "End of Term Exams", date: "Dec 15-20", type: "exam" },
        { title: "Winter Break", date: "Dec 21 - Jan 5", type: "holiday" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋
                        </h1>
                        <p className="text-slate-500">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {" • "}Here's what's happening at your school today
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/admin/reports')}
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Reports
                        </Button>
                        <Button
                            onClick={() => router.push('/admin/students')}
                            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Student
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <Card
                        key={index}
                        className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        onClick={() => router.push(stat.href)}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                                    <div className="flex items-center gap-1 mt-2">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span className="text-sm font-medium">{stat.change}</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900">
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-slate-50"
                                    onClick={() => router.push(action.href)}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-700">{action.title}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Students */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                                Recent Students
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-indigo-600">
                                <Link href="/admin/students">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        {recentStudents.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No students yet</p>
                                <p className="text-sm">Add students to see them here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentStudents.map((student, index) => (
                                    <div
                                        key={student._id || index}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/admin/students/${student._id}`)}
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {student.name?.charAt(0) || "S"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{student.name}</p>
                                            <p className="text-xs text-slate-500">{student.email}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-indigo-600" />
                            Upcoming Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-3">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                                        event.type === 'event' ? 'bg-purple-100 text-purple-600' :
                                            event.type === 'exam' ? 'bg-amber-100 text-amber-600' :
                                                'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{event.title}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {event.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card className="mt-6 shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-600" />
                            Recent Activity
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {user?.features?.canManageStudents !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <UserPlus className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-700">{stats.newEnrollments || 8}</p>
                                    <p className="text-sm text-blue-600">New Enrollments</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageAttendance !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-emerald-700">{stats.attendanceRate || 94.5}%</p>
                                    <p className="text-sm text-emerald-600">Today's Attendance</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageAcademics !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-purple-700">{stats.totalClasses}</p>
                                    <p className="text-sm text-purple-600">Active Classes</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageFinance !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-amber-700">${stats.pendingFees?.toLocaleString() || 0}</p>
                                    <p className="text-sm text-amber-600">Pending Fees</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
