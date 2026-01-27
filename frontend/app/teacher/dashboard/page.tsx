"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { toast } from "sonner"
import {
    BookOpen,
    Users,
    ClipboardCheck,
    FileText,
    Clock,
    ChevronRight,
    Plus,
    Download,
    Bell,
    CheckCircle2,
    AlertCircle,
    PenLine,
    Eye,
    ArrowRight,
    Inbox,
    Award,
    TrendingUp
} from "lucide-react"
import { teacherAPI } from '@/lib/api/endpoints'
import { IDCard } from "@/components/ui/id-card"
import { CardPreviewModal } from "@/components/ui/card-preview-modal"

export default function TeacherDashboard() {
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
        const fetch = async () => {
            try {
                const res: any = await teacherAPI.getDashboard();
                if (res?.status === 'success') setDashboard(res.data);
            } catch (err: any) {
                console.warn('Failed to fetch teacher dashboard:', err?.message || err)
            }
        }
        fetch();
    }, [])

    const handleDownloadTeacherCard = async () => {
        try {
            const response = await teacherAPI.downloadTeacherCard(user?.id);
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `teacher-${user?.id}-card.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Teacher ID card downloaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to download teacher card");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-slate-500 text-sm">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    const hour = currentDateTime.getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

    const todaysClasses = dashboard?.classes || [
        { id: 1, name: "Class 10-A", subject: "Mathematics", time: "9:00 AM", room: "Room 201", students: 30, status: "completed" },
        { id: 2, name: "Class 10-B", subject: "Mathematics", time: "10:30 AM", room: "Room 203", students: 28, status: "in-progress" },
        { id: 3, name: "Class 11-A", subject: "Mathematics", time: "12:00 PM", room: "Room 201", students: 32, status: "upcoming" },
        { id: 4, name: "Class 9-C", subject: "Mathematics", time: "2:30 PM", room: "Room 105", students: 25, status: "upcoming" }
    ]

    const stats = [
        { label: "Total Students", value: dashboard?.counts?.students || 120, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Classes Today", value: todaysClasses.length, icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Pending Grades", value: dashboard?.counts?.pendingGrades || 8, icon: PenLine, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Assignments Due", value: dashboard?.counts?.upcomingAssignments || 3, icon: FileText, color: "text-rose-600", bg: "bg-rose-50" }
    ]

    const pendingTasks = [
        { id: 1, type: "attendance", title: "Take attendance for Class 11-A", dueTime: "Before 12:00 PM", priority: "high" },
        { id: 2, type: "grading", title: "Grade Quiz: Chapter 5 - Algebra", dueTime: "Due today", priority: "high" },
        { id: 3, type: "assignment", title: "Review homework submissions", dueTime: "5 pending reviews", priority: "medium" }
    ]

    const recentSubmissions = [
        { id: 1, student: "John Smith", assignment: "Homework Ch. 4", class: "10-A", time: "10 min ago", avatar: null },
        { id: 2, student: "Sarah Johnson", assignment: "Quiz Practice", class: "10-B", time: "25 min ago", avatar: null },
        { id: 3, student: "Mike Chen", assignment: "Project Draft", class: "11-A", time: "1 hour ago", avatar: null }
    ]

    const announcements = [
        { id: 1, title: "Staff meeting tomorrow at 3 PM", type: "info", time: "2 hours ago" },
        { id: 2, title: "Parent-teacher conference next week", type: "event", time: "Yesterday" }
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
                        {greeting}, <span className="text-teal-600">{user?.name?.split(" ")[0] || "Teacher"}</span>
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10" asChild>
                        <Link href="/teacher/attendance">
                            <ClipboardCheck className="w-4 h-4 mr-2" />
                            Take Attendance
                        </Link>
                    </Button>
                    <Button className="h-10 bg-teal-600 hover:bg-teal-700" asChild>
                        <Link href="/teacher/assignments">
                            <Plus className="w-4 h-4 mr-2" />
                            New Assignment
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
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

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Classes */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-teal-600" />
                                    Today's Schedule
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700" asChild>
                                    <Link href="/teacher/schedule">
                                        View Full Schedule
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {todaysClasses.map((cls: any) => (
                                <div key={cls.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${cls.status === 'completed' ? 'bg-slate-50 border-slate-100' : cls.status === 'in-progress' ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-200 hover:border-teal-200'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls.status === 'completed' ? 'bg-slate-200' : cls.status === 'in-progress' ? 'bg-teal-600' : 'bg-slate-100'}`}>
                                        <BookOpen className={`w-5 h-5 ${cls.status === 'in-progress' ? 'text-white' : 'text-slate-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className={`font-semibold ${cls.status === 'completed' ? 'text-slate-500' : 'text-slate-800'}`}>{cls.name}</h3>
                                            {cls.status === 'in-progress' && <Badge className="bg-teal-600 text-white text-[10px] px-2 py-0">LIVE</Badge>}
                                            {cls.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        </div>
                                        <p className="text-sm text-slate-500">{cls.subject} • {cls.room}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${cls.status === 'in-progress' ? 'text-teal-600' : 'text-slate-700'}`}>{cls.time}</p>
                                        <p className="text-xs text-slate-400">{cls.students} students</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <Link href="/teacher/attendance" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                                            <ClipboardCheck className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Attendance</p>
                                    </div>
                                </Link>
                                <Link href="/teacher/grades" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                            <PenLine className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Enter Grades</p>
                                    </div>
                                </Link>
                                <Link href="/teacher/assignments" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                                            <FileText className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">Assignments</p>
                                    </div>
                                </Link>
                                <Link href="/teacher/students" className="group">
                                    <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-center">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                            <Users className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">My Students</p>
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
                                    <Award className="w-4 h-4 text-teal-600" />
                                    My ID Card
                                </CardTitle>
                                <div className="flex gap-2">
                                    <CardPreviewModal
                                        trigger={<Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Preview</Button>}
                                        cardData={{ type: 'teacher', data: user, employmentInfo: user?.employmentInfo }}
                                        onDownload={handleDownloadTeacherCard}
                                    />
                                    <Button size="sm" onClick={handleDownloadTeacherCard} className="bg-teal-600 hover:bg-teal-700">
                                        <Download className="w-4 h-4 mr-2" />Download
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center pb-6">
                            <div className="transform scale-75 origin-top -my-8">
                                <IDCard 
                                    type="teacher" 
                                    data={user ? {
                                        name: user.name,
                                        teacherId: user.employeeId || user._id || user.id,
                                        employeeId: user.employeeId || user._id || user.id
                                    } : { name: 'Teacher' }} 
                                    showQRCode={true} 
                                    showSignature={true} 
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Pending Tasks */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Pending Tasks
                                <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700">{pendingTasks.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pendingTasks.map((task) => (
                                <div key={task.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${task.priority === 'high' ? 'bg-rose-100' : 'bg-amber-100'}`}>
                                            {task.type === 'attendance' && <ClipboardCheck className={`w-4 h-4 ${task.priority === 'high' ? 'text-rose-600' : 'text-amber-600'}`} />}
                                            {task.type === 'grading' && <PenLine className={`w-4 h-4 ${task.priority === 'high' ? 'text-rose-600' : 'text-amber-600'}`} />}
                                            {task.type === 'assignment' && <FileText className={`w-4 h-4 ${task.priority === 'high' ? 'text-rose-600' : 'text-amber-600'}`} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 leading-tight">{task.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{task.dueTime}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50" size="sm">
                                View All Tasks<ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Submissions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Inbox className="w-4 h-4 text-blue-500" />
                                Recent Submissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentSubmissions.map((sub) => (
                                <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={sub.avatar || undefined} />
                                        <AvatarFallback className="bg-slate-200 text-xs">{sub.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{sub.student}</p>
                                        <p className="text-xs text-slate-500 truncate">{sub.assignment}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-[10px]">{sub.class}</Badge>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{sub.time}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50" size="sm" asChild>
                                <Link href="/teacher/assignments">View All Submissions<ArrowRight className="w-4 h-4 ml-2" /></Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Announcements */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Bell className="w-4 h-4 text-purple-500" />
                                Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
                                    <p className="text-sm font-medium text-slate-700">{ann.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{ann.time}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Performance */}
                    <Card className="border-0 shadow-sm bg-teal-600 text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4" />
                                <h3 className="text-sm font-semibold">Class Performance</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-teal-100">Average Score</span>
                                    <span className="font-bold">78%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-teal-100">Attendance Rate</span>
                                    <span className="font-bold">92%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-teal-100">Assignments Completed</span>
                                    <span className="font-bold">85%</span>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-white hover:bg-white/10 border border-white/20" size="sm" asChild>
                                <Link href="/teacher/performance">View Detailed Report</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
