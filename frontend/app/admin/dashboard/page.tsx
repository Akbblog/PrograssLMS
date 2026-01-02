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
    Bell,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from "@/components/ui/lumina-card";

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
            color: "from-primary to-primary-600",
            change: "+12%",
            href: "/admin/students",
            feature: "canManageStudents"
        },
        {
            title: "Total Teachers",
            value: stats.totalTeachers,
            icon: Users,
            color: "from-secondary to-secondary-600",
            change: "+5%",
            href: "/admin/teachers",
            feature: "canManageTeachers"
        },
        {
            title: "Active Classes",
            value: stats.totalClasses,
            icon: BookOpen,
            color: "from-success to-success-600",
            change: "+3%",
            href: "/admin/academic",
            feature: "canManageAcademics"
        },
        {
            title: "Attendance Rate",
            value: `${stats.attendanceRate || 94.5}%`,
            icon: CheckCircle2,
            color: "from-warning to-warning-600",
            change: "+2.1%",
            href: "/admin/attendance",
            feature: "canManageAttendance"
        },
    ].filter(card => !card.feature || (user?.features as any)?.[card.feature] !== false);

    const quickActions = [
        { title: "Add Student", icon: UserPlus, href: "/admin/students", color: "text-primary bg-primary/10", feature: "canManageStudents" },
        { title: "Add Teacher", icon: Users, href: "/admin/teachers", color: "text-secondary bg-secondary/10", feature: "canManageTeachers" },
        { title: "Create Class", icon: BookOpen, href: "/admin/academic", color: "text-success bg-success/10", feature: "canManageAcademics" },
        { title: "Record Attendance", icon: Calendar, href: "/admin/attendance", color: "text-warning bg-warning/10", feature: "canManageAttendance" },
        { title: "View Reports", icon: BarChart3, href: "/admin/reports", color: "text-destructive bg-destructive/10", feature: "canViewReports" },
        { title: "Messages", icon: MessageSquare, href: "/admin/communication", color: "text-info-600 bg-info-100", feature: "canManageCommunication" },
    ].filter(action => !action.feature || (user?.features as any)?.[action.feature] !== false);

    const upcomingEvents = [
        { title: "Staff Meeting", date: "Today, 10:00 AM", type: "meeting" },
        { title: "Parent-Teacher Conference", date: "Tomorrow, 2:00 PM", type: "event" },
        { title: "End of Term Exams", date: "Dec 15-20", type: "exam" },
        { title: "Winter Break", date: "Dec 21 - Jan 5", type: "holiday" },
    ];

    const getStatColor = (index: number) => {
        const colors = ['indigo', 'teal', 'emerald', 'amber']; // Maps to LuminaCard variants
        return colors[index % colors.length] as any;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mobile-padding mobile-padding-y space-y-4 sm:space-y-6 md:space-y-8">
            {/* Welcome Section - Mobile optimized */}
            <div>
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                        <h1 className="heading-responsive font-bold text-slate-900 dark:text-white">
                            Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {" • "}Here's what's happening today
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto rounded-lg border-slate-200"
                            onClick={() => router.push('/admin/reports')}
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Reports
                        </Button>
                        <Button
                            onClick={() => router.push('/admin/students')}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Student
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Mobile optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                {statCards.map((stat, index) => (
                    <LuminaCard
                        key={index}
                        variant="gradient"
                        gradientColor={getStatColor(index)}
                        className="cursor-pointer border-none shadow-card hover:shadow-card-hover"
                        glow
                        onClick={() => router.push(stat.href)}
                    >
                        <LuminaCardContent className="p-4 sm:p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                                    <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">{stat.value}</h3>
                                    <div className="flex items-center gap-1 mt-2 text-white/90">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-[10px] sm:text-xs font-bold">{stat.change}</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                        </LuminaCardContent>
                    </LuminaCard>
                ))}
            </div>

            {/* Main Grid - Mobile optimized to single column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                {/* Quick Actions */}
                <LuminaCard variant="default" className="border-none shadow-card">
                    <LuminaCardHeader className="pb-2">
                        <LuminaCardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Quick Actions
                        </LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent className="pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.push(action.href)}
                                    className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${action.color}`}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 text-center">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>

                {/* Recent Students */}
                <LuminaCard variant="default" className="border-none shadow-card">
                    <LuminaCardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <LuminaCardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-secondary" />
                                Recent Students
                            </LuminaCardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/10 font-bold px-3">
                                <Link href="/admin/students">All</Link>
                            </Button>
                        </div>
                    </LuminaCardHeader>
                    <LuminaCardContent className="pt-2">
                        {recentStudents.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                    <GraduationCap className="h-8 w-8 opacity-20" />
                                </div>
                                <p className="font-bold text-sm">No new students</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentStudents.map((student, index) => (
                                    <div
                                        key={student._id || index}
                                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                        onClick={() => router.push(`/admin/students/${student._id}`)}
                                    >
                                        <div className="relative">
                                            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm transition-transform group-hover:rotate-6">
                                                {student.name?.charAt(0) || "S"}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-white dark:border-slate-900 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{student.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider">{student.email?.split('@')[0]}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </LuminaCardContent>
                </LuminaCard>

                {/* Upcoming Events */}
                <LuminaCard variant="default" className="border-none shadow-card">
                    <LuminaCardHeader className="pb-2">
                        <LuminaCardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-success" />
                            Events Calendar
                        </LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent className="pt-2">
                        <div className="space-y-3">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${event.type === 'meeting' ? 'bg-primary/10 text-primary' :
                                        event.type === 'event' ? 'bg-secondary/10 text-secondary' :
                                            event.type === 'exam' ? 'bg-destructive/10 text-destructive' :
                                                'bg-success/10 text-success'
                                        }`}>
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{event.title}</p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {event.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>
            </div>

            {/* Activity Feed */}
            <LuminaCard variant="default" className="border-none shadow-card animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <LuminaCardHeader className="pb-4">
                    <LuminaCardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Institutional Performance
                    </LuminaCardTitle>
                </LuminaCardHeader>
                <LuminaCardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {user?.features?.canManageStudents !== false && (
                            <div className="group flex flex-col gap-4 p-6 bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-slate-800 rounded-2xl border border-primary/10 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:rotate-6 transition-transform">
                                    <UserPlus className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.newEnrollments || 8}</p>
                                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest mt-1">New Enrollments</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageAttendance !== false && (
                            <div className="group flex flex-col gap-4 p-6 bg-gradient-to-br from-success/5 to-white dark:from-success/10 dark:to-slate-800 rounded-2xl border border-success/10 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center shadow-lg shadow-success/25 group-hover:rotate-6 transition-transform">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.attendanceRate || 94.5}%</p>
                                    <p className="text-[11px] font-bold text-success uppercase tracking-widest mt-1">Daily Attendance</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageAcademics !== false && (
                            <div className="group flex flex-col gap-4 p-6 bg-gradient-to-br from-secondary/5 to-white dark:from-secondary/10 dark:to-slate-800 rounded-2xl border border-secondary/10 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/25 group-hover:rotate-6 transition-transform">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stats.totalClasses}</p>
                                    <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-1">Active Courses</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageFinance !== false && (
                            <div className="group flex flex-col gap-4 p-6 bg-gradient-to-br from-warning/5 to-white dark:from-warning/10 dark:to-slate-800 rounded-2xl border border-warning/10 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center shadow-lg shadow-warning/25 group-hover:rotate-6 transition-transform">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">${stats.pendingFees?.toLocaleString() || '12.5k'}</p>
                                    <p className="text-[11px] font-bold text-warning uppercase tracking-widest mt-1">Pending Dues</p>
                                </div>
                            </div>
                        )}
                    </div>
                </LuminaCardContent>
            </LuminaCard>
        </div>
    );
}
