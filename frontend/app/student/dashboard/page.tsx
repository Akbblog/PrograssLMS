'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { SkeletonCard, SkeletonTable, SkeletonDashboardStats } from "@/components/ui/skeleton"
import {
    CheckCircle2,
    BookOpen,
    Calendar,
    ClipboardList,
    Clock,
    ChevronRight,
    Download,
    Eye,
    Award,
    Bell,
    FileText,
    ArrowRight,
    GraduationCap,
    AlertCircle,
    BarChart3,
    Target,
    Timer,
    BookMarked,
    MessageSquare,
    CalendarDays,
    Zap,
    TrendingUp
} from "lucide-react"
import { adminAPI } from "@/lib/api/endpoints"
import { IDCard } from "@/components/ui/id-card"
import { CardPreviewModal } from "@/components/ui/card-preview-modal"

export default function StudentDashboard() {
    const user = useAuthStore((state) => state.user)
    const [isLoading, setIsLoading] = useState(true)
    const [currentDateTime, setCurrentDateTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    const [dashboard, setDashboard] = useState<any>(null)
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res: any = await adminAPI.getStudentDashboard();
                if (res && res.status === 'success') {
                    setDashboard(res.data);
                }
            } catch (err: any) {
                console.warn('Failed to fetch student dashboard:', err?.message || err)
            }
        }
        fetchDashboard()
    }, [])

    const handleDownloadStudentCard = async () => {
        try {
            const response = await adminAPI.downloadStudentCard(user?.id);
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `student-${user?.id}-card.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Student ID card downloaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to download student card");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="space-y-2">
                    <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <SkeletonDashboardStats />
                <SkeletonTable rows={5} />
            </div>
        )
    }

    const hour = currentDateTime.getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

    // Stats with practical metrics
    const stats = [
        { label: "Today's Classes", value: dashboard?.todaysClassesCount || 4, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Due This Week", value: dashboard?.dueThisWeek || 5, icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Attendance", value: `${dashboard?.attendancePercent || 95}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Unread Messages", value: dashboard?.unreadMessages || 3, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" }
    ]

    // Today's classes/schedule
    const todaysClasses = dashboard?.todaysClasses || [
        { id: 1, time: "9:00 AM", subject: "Mathematics", teacher: "Dr. Sarah Johnson", room: "Room 301", status: "completed" },
        { id: 2, time: "10:30 AM", subject: "Physics", teacher: "Prof. Michael Chen", room: "Lab 102", status: "in-progress" },
        { id: 3, time: "12:00 PM", subject: "English", teacher: "Ms. Emily Davis", room: "Room 205", status: "upcoming" },
        { id: 4, time: "2:30 PM", subject: "Chemistry", teacher: "Dr. James Wilson", room: "Lab 101", status: "upcoming" }
    ]

    // Immediate deadlines (next 48 hours)
    const upcomingDeadlines = dashboard?.upcomingDeadlines || [
        { id: 1, title: "Algebra Homework #5", course: "Mathematics", due: "Today, 11:59 PM", priority: "urgent", hoursLeft: 8 },
        { id: 2, title: "Lab Report: Forces", course: "Physics", due: "Tomorrow, 5:00 PM", priority: "high", hoursLeft: 26 },
        { id: 3, title: "Reading Response Ch. 4", course: "English", due: "Wed, 9:00 AM", priority: "medium", hoursLeft: 45 }
    ]

    // Upcoming exams countdown
    const upcomingExams = [
        { id: 1, subject: "Mathematics", title: "Mid-term Exam", date: "Feb 5, 2026", daysLeft: 9 },
        { id: 2, subject: "Physics", title: "Lab Practical", date: "Feb 10, 2026", daysLeft: 14 }
    ]

    // Today's homework/tasks
    const todaysHomework = [
        { id: 1, subject: "Mathematics", task: "Complete exercises 5.1-5.3", completed: true },
        { id: 2, subject: "Physics", task: "Review Newton's Laws notes", completed: true },
        { id: 3, subject: "English", task: "Read Chapter 5 of 'To Kill a Mockingbird'", completed: false },
        { id: 4, subject: "Chemistry", task: "Watch video on chemical bonds", completed: false }
    ]

    const completedHomework = todaysHomework.filter(h => h.completed).length
    const totalHomework = todaysHomework.length

    // Recent activity
    const recentActivity = [
        { id: 1, type: "grade", text: "New grade posted for Quiz: Chapter 4", time: "2 hours ago", icon: BarChart3 },
        { id: 2, type: "material", text: "New study material uploaded in Physics", time: "5 hours ago", icon: BookMarked },
        { id: 3, type: "announcement", text: "Class schedule change for tomorrow", time: "Yesterday", icon: Bell }
    ]

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 mb-1">
                        {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        {greeting}, <span className="text-blue-600">{user?.name?.split(" ")[0] || "Student"}</span>
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10" asChild>
                        <Link href="/student/calendar">
                            <Calendar className="w-4 h-4 mr-2" />
                            My Calendar
                        </Link>
                    </Button>
                    <Button className="h-10 bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href="/student/assignments">
                            <ClipboardList className="w-4 h-4 mr-2" />
                            View Assignments
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <ErrorBoundary
                title="Dashboard Stats Error"
                description="Unable to load your dashboard statistics"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                </div>
            </ErrorBoundary>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Schedule */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    Today's Classes
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                                    <Link href="/student/calendar">
                                        Full Schedule
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {todaysClasses.map((cls: any) => (
                                <div key={cls.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${cls.status === 'completed' ? 'bg-slate-50 border-slate-100' : cls.status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:border-blue-200'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls.status === 'completed' ? 'bg-slate-200' : cls.status === 'in-progress' ? 'bg-blue-600' : 'bg-slate-100'}`}>
                                        <BookOpen className={`w-5 h-5 ${cls.status === 'in-progress' ? 'text-white' : 'text-slate-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className={`font-semibold ${cls.status === 'completed' ? 'text-slate-500' : 'text-slate-800'}`}>{cls.subject}</h3>
                                            {cls.status === 'in-progress' && <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0">NOW</Badge>}
                                            {cls.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        </div>
                                        <p className="text-sm text-slate-500">{cls.teacher} • {cls.room}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${cls.status === 'in-progress' ? 'text-blue-600' : 'text-slate-700'}`}>{cls.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Today's Homework Progress */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-600" />
                                    Today's Tasks
                                </CardTitle>
                                <span className="text-sm text-slate-500">{completedHomework}/{totalHomework} completed</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Progress value={(completedHomework / totalHomework) * 100} className="h-2" />
                            <div className="space-y-2 mt-4">
                                {todaysHomework.map((hw) => (
                                    <div key={hw.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hw.completed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                            {hw.completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${hw.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{hw.task}</p>
                                            <p className="text-xs text-slate-400">{hw.subject}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <Link href="/student/assignments" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                            <ClipboardList className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Assignments</p>
                                    </div>
                                </Link>
                                <Link href="/student/grades" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                                            <BarChart3 className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">My Grades</p>
                                    </div>
                                </Link>
                                <Link href="/student/materials" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                            <BookMarked className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Materials</p>
                                    </div>
                                </Link>
                                <Link href="/student/attendance" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                                            <CalendarDays className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Attendance</p>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ID Card */}
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    My ID Card
                                </CardTitle>
                                <div className="flex gap-2">
                                    <CardPreviewModal
                                        trigger={<Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Preview</Button>}
                                        cardData={{ type: 'student', data: user, attendanceData: user?.attendanceData, academicData: user?.academicData }}
                                        onDownload={handleDownloadStudentCard}
                                    />
                                    <Button size="sm" onClick={handleDownloadStudentCard} className="bg-blue-600 hover:bg-blue-700">
                                        <Download className="w-4 h-4 mr-2" />Download
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center pb-6">
                            <div className="transform scale-75 origin-top -my-8">
                                <IDCard type="student" data={user ? {
                                    name: user.name,
                                    studentId: user.studentId || user._id || user.id
                                } : { name: 'Student', studentId: 'N/A' }} showQRCode={true} showSignature={true} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Urgent Deadlines */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Timer className="w-4 h-4 text-rose-500" />
                                Upcoming Deadlines
                                <Badge variant="secondary" className="ml-auto bg-rose-100 text-rose-700">{upcomingDeadlines.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingDeadlines.map((deadline: any) => (
                                <div key={deadline.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${deadline.priority === 'urgent' ? 'bg-rose-100' : deadline.priority === 'high' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                                            <FileText className={`w-4 h-4 ${deadline.priority === 'urgent' ? 'text-rose-600' : deadline.priority === 'high' ? 'text-amber-600' : 'text-slate-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 leading-tight">{deadline.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{deadline.course}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className={`text-xs font-medium ${deadline.hoursLeft < 12 ? 'text-rose-600' : deadline.hoursLeft < 24 ? 'text-amber-600' : 'text-slate-500'}`}>
                                                    {deadline.due}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50" size="sm" asChild>
                                <Link href="/student/assignments">View All<ArrowRight className="w-4 h-4 ml-2" /></Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Exam Countdown */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-purple-500" />
                                Upcoming Exams
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingExams.map((exam) => (
                                <div key={exam.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{exam.title}</p>
                                            <p className="text-xs text-slate-500">{exam.subject} • {exam.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-purple-600">{exam.daysLeft}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">days left</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <activity.icon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 leading-tight">{activity.text}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Academic Progress */}
                    <Card className="border-0 shadow-sm bg-blue-600 text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4" />
                                <h3 className="text-sm font-semibold">Academic Progress</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-100">Current GPA</span>
                                    <span className="font-bold">3.8 / 4.0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-100">Class Rank</span>
                                    <span className="font-bold">#5 of 120</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-100">Credits Completed</span>
                                    <span className="font-bold">24 / 30</span>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-white hover:bg-white/10 border border-white/20" size="sm" asChild>
                                <Link href="/student/grades">View Full Report</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
