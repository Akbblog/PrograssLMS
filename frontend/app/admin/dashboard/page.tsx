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
import GraduationCap from "@/components/icons/GraduationCap"
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
        { title: "Add Student", icon: UserPlus, href: "/admin/students", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20", feature: "canManageStudents" },
        { title: "Add Teacher", icon: Users, href: "/admin/teachers", color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20", feature: "canManageTeachers" },
        { title: "Create Class", icon: BookOpen, href: "/admin/academic", color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20", feature: "canManageAcademics" },
        { title: "Record Attendance", icon: Calendar, href: "/admin/attendance", color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20", feature: "canManageAttendance" },
        { title: "View Reports", icon: BarChart3, href: "/admin/reports", color: "text-destructive bg-destructive/10", feature: "canViewReports" },
        { title: "Messages", icon: MessageSquare, href: "/admin/communication", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20", feature: "canManageCommunication" },
    ].filter(action => !action.feature || (user?.features as any)?.[action.feature] !== false);

    const upcomingEvents = [
        { title: "Staff Meeting", date: "Today, 10:00 AM", type: "meeting" },
        { title: "Parent-Teacher Conference", date: "Tomorrow, 2:00 PM", type: "event" },
        { title: "End of Term Exams", date: "Dec 15-20", type: "exam" },
        { title: "Winter Break", date: "Dec 21 - Jan 5", type: "holiday" },
    ];

    const getStatColor = (index: number) => {
        // Reference order: blue (Students), purple (Teachers), green (Classes), orange (Attendance)
        const colors = ['blue', 'purple', 'emerald', 'orange'];
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="heading-responsive font-bold text-foreground">
                            Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {" • "}Here's what's happening today
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="hidden sm:inline-flex rounded-lg border-border px-4 py-2"
                            onClick={() => router.push('/admin/reports')}
                        >
                            <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                            View Reports
                        </Button>
                        <Button
                            onClick={() => router.push('/admin/students')}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-lg px-4 py-2"
                        >
                            <Plus className="w-4 h-4" />
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
                <LuminaCard variant="default" className="border-none shadow-card bg-card">
                    <LuminaCardHeader className="pb-2">
                        <LuminaCardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
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
                                    className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${action.color}`}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-xs text-foreground text-center">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>

                {/* Recent Students */}
                <LuminaCard variant="default" className="border-none shadow-card bg-card">
                    <LuminaCardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <LuminaCardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-secondary" />
                                Recent Students
                            </LuminaCardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/10 font-medium text-sm">
                                <Link href="/admin/students">View All</Link>
                            </Button>
                        </div>
                    </LuminaCardHeader>
                    <LuminaCardContent className="pt-2">
                        {recentStudents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap className="h-7 w-7 text-muted-foreground/50" />
                                </div>
                                <p className="font-semibold text-sm text-muted-foreground">No students yet</p>
                                <p className="text-xs text-muted-foreground/80 mt-1">Add students to see them here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentStudents.map((student, index) => (
                                    <div
                                        key={student._id || index}
                                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
                                        onClick={() => router.push(`/admin/students/${student._id}`)}
                                    >
                                        <div className="relative">
                                            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm transition-transform group-hover:rotate-6">
                                                {student.name?.charAt(0) || "S"}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-background rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{student.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider">{student.email?.split('@')[0]}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </LuminaCardContent>
                </LuminaCard>

                {/* Upcoming Events */}
                <LuminaCard variant="default" className="border-none shadow-card bg-card">
                    <LuminaCardHeader className="pb-2">
                        <LuminaCardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Upcoming Events
                        </LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent className="pt-2">
                        <div className="space-y-3">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all duration-200"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${event.type === 'meeting' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                        event.type === 'event' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                            event.type === 'exam' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-foreground leading-tight">{event.title}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {event.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>
            </div>

            {/* Recent Activity */}
            <LuminaCard variant="default" className="border-none shadow-card animate-fadeInUp bg-card" style={{ animationDelay: '300ms' }}>
                <LuminaCardHeader className="pb-4">
                    <LuminaCardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Activity
                    </LuminaCardTitle>
                </LuminaCardHeader>
                <LuminaCardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {user?.features?.canManageStudents !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <UserPlus className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.newEnrollments || 8}</p>
                                    <p className="text-sm text-white/80">New Enrollments</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageAttendance !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.attendanceRate || 94.5}%</p>
                                    <p className="text-sm text-white/80">Today's Attendance</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageAcademics !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalClasses}</p>
                                    <p className="text-sm text-white/80">Active Classes</p>
                                </div>
                            </div>
                        )}
                        {user?.features?.canManageFinance !== false && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">${stats.pendingFees?.toLocaleString() || '0'}</p>
                                    <p className="text-sm text-white/80">Pending Fees</p>
                                </div>
                            </div>
                        )}
                    </div>
                </LuminaCardContent>
            </LuminaCard>
        </div>
    );
}
