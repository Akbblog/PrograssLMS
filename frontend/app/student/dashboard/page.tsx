'use client'

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    BookOpen,
    BarChart3,
    Calendar,
    ClipboardList,
    GraduationCap,
    Clock,
    TrendingUp,
    Target,
    ChevronRight,
    Play,
    ShieldCheck,
    Wallet,
    Flame,
    Trophy,
    Zap,
    Star,
    Sparkles
} from "lucide-react"
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from "@/components/ui/lumina-card"
import { adminAPI } from "@/lib/api/endpoints"
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

    // Dashboard data from backend
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    // Gamification stats
    const gamificationData = {
        xp: 2450,
        xpToNextLevel: 3000,
        level: 12,
        streak: 7,
        achievements: 8,
        totalAchievements: 15
    }

    const studentStats = [
        { id: 1, label: "Enrolled Courses", value: dashboard ? dashboard.totalEnrolled : "6", icon: BookOpen, color: "from-indigo-500 to-indigo-600", bgLight: "bg-indigo-50" },
        { id: 2, label: "Upcoming Tasks", value: dashboard ? dashboard.upcomingAssignmentsCount : "3", icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", bgLight: "bg-emerald-50" },
        { id: 3, label: "Overall GPA", value: "3.8", icon: Target, color: "from-purple-500 to-purple-600", bgLight: "bg-purple-50" },
        { id: 4, label: "Attendance", value: "95%", icon: Calendar, color: "from-amber-500 to-amber-600", bgLight: "bg-amber-50" }
    ]

    const recentCourses = dashboard && dashboard.enrollments ? dashboard.enrollments.map((e:any, i:number) => ({
        id: e._id || i,
        title: e.subject?.name || e.classLevel?.name || 'Course',
        instructor: e.instructorName || 'Instructor',
        progress: e.progress || Math.floor(Math.random() * 60) + 20,
        nextClass: e.nextClass || 'TBD',
        color: ['from-indigo-500 to-blue-500','from-purple-500 to-violet-500','from-emerald-500 to-teal-500'][i % 3]
    })) : [
        {
            id: 1,
            title: "Mathematics - Algebra II",
            instructor: "Dr. Sarah Johnson",
            progress: 75,
            nextClass: "Today, 10:00 AM",
            color: "from-indigo-500 to-blue-500"
        },
        {
            id: 2,
            title: "Physics - Mechanics",
            instructor: "Prof. Michael Chen",
            progress: 60,
            nextClass: "Today, 2:00 PM",
            color: "from-purple-500 to-violet-500"
        },
        {
            id: 3,
            title: "English Literature",
            instructor: "Ms. Emily Davis",
            progress: 85,
            nextClass: "Tomorrow, 9:00 AM",
            color: "from-emerald-500 to-teal-500"
        }
    ]

    const upcomingAssignments = dashboard ? dashboard.upcomingAssignments || [] : [
        { id: 1, title: "Algebra Homework #5", course: "Mathematics", due: "Due Tomorrow", priority: "high" },
        { id: 2, title: "Physics Lab Report", course: "Physics", due: "Due in 3 days", priority: "medium" },
        { id: 3, title: "Essay: Shakespeare Analysis", course: "English", due: "Due in 5 days", priority: "low" },
    ]

    const todaySchedule = dashboard ? dashboard.todaysAssignments?.map((a:any, i:number) => ({ id: a._id || i, time: new Date(a.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), subject: a.subject?.name || 'Class', room: a.classLevel?.name || 'Room', status: 'upcoming' })) : [
        { id: 1, time: "10:00 AM", subject: "Mathematics", room: "Room 301", status: "upcoming" },
        { id: 2, time: "11:30 AM", subject: "Chemistry Lab", room: "Lab 102", status: "upcoming" },
        { id: 3, time: "2:00 PM", subject: "Physics", room: "Room 205", status: "upcoming" },
        { id: 4, time: "3:30 PM", subject: "History", room: "Room 401", status: "upcoming" },
    ]

    const xpProgress = (gamificationData.xp / gamificationData.xpToNextLevel) * 100

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Welcome Section with Gamification */}
            <div className="animate-fadeInUp">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    {/* Welcome Text */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-8 bg-amber-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Student Achievement Portal</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{user?.name?.split(" ")[0] || "Scholar"}</span>! 👋
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Gamification Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center animate-pulse">
                                <span className="text-xl">🔥</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Current Streak</p>
                                <p className="text-lg font-black text-slate-900">{gamificationData.streak} Days</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl shadow-indigo-100 border border-white/20">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-indigo-100/70">Academic Level</p>
                                <p className="text-lg font-black text-white">{gamificationData.level}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <LuminaCard variant="glass" className="mt-8 border-slate-100 shadow-xl shadow-slate-200/40">
                    <LuminaCardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <span className="font-black text-slate-900 tracking-tight">Experience Points (XP)</span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Ranking: Top 5%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <span className="text-sm font-black text-slate-900">{gamificationData.xp.toLocaleString()}</span>
                                <span className="text-xs font-bold text-slate-400">/ {gamificationData.xpToNextLevel.toLocaleString()} XP</span>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-[length:200%_100%] animate-shimmer rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                                style={{ width: `${xpProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level {gamificationData.level}</p>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{(gamificationData.xpToNextLevel - gamificationData.xp).toLocaleString()} XP to level up</p>
                        </div>
                    </LuminaCardContent>
                </LuminaCard>
            </div>

            {/* Quick Actions - Mobile */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                <Button asChild className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200">
                    <Link href="/student/courses">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                    </Link>
                </Button>
                <Button asChild variant="outline" className="flex-shrink-0 border-slate-200">
                    <Link href="/student/calendar">
                        <Calendar className="w-4 h-4 mr-2" />
                        Calendar
                    </Link>
                </Button>
                <Button asChild variant="outline" className="flex-shrink-0 border-slate-200">
                    <Link href="/student/grades">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Grades
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                {studentStats.map((stat, idx) => (
                    <LuminaCard
                        key={stat.id}
                        variant="gradient"
                        gradientColor={idx === 3 ? "amber" : "indigo"}
                        className="group"
                        glow
                    >
                        <LuminaCardContent className="p-4 sm:p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 text-[10px] sm:text-xs font-black uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform group-hover:scale-110" />
                                </div>
                            </div>
                        </LuminaCardContent>
                    </LuminaCard>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                {/* Current Courses */}
                <LuminaCard variant="glass" className="lg:col-span-2 shadow-2xl shadow-slate-200/50 border-slate-100">
                    <LuminaCardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <LuminaCardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-amber-500" />
                                Interactive Courses
                            </LuminaCardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-black px-4 rounded-xl">
                                <Link href="/student/courses" className="flex items-center gap-1">
                                    Full Catalog
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-4">
                            {recentCourses.map((course: any) => (
                                <div
                                    key={course.id}
                                    className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-slate-50 rounded-3xl hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-100 transition-all cursor-pointer bg-white"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-3 transition-transform relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                                        <BookOpen className="h-8 w-8 text-white relative z-10" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">In Progress</span>
                                            <h3 className="font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors truncate">{course.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-500 font-bold">{course.instructor}</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-slate-900">{course.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 group-hover:text-amber-700">{course.nextClass.split(',')[1]}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-amber-200">
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>

                {/* Today's Schedule */}
                <LuminaCard variant="glass" className="shadow-2xl shadow-slate-200/50 border-slate-100">
                    <LuminaCardHeader className="pb-4">
                        <LuminaCardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-amber-500" />
                            Daily Agenda
                        </LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-4">
                            {todaySchedule.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    className={`relative group flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 border ${index === 0
                                        ? 'border-amber-100 bg-amber-50/40 shadow-xl shadow-amber-500/5'
                                        : 'border-white hover:border-slate-100 hover:bg-slate-50/50'
                                        }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full border-2 ${index === 0 ? 'bg-amber-500 border-amber-200 animate-pulse ring-4 ring-amber-100' : 'bg-slate-200 border-white'}`}></div>
                                        {index !== todaySchedule.length - 1 && (
                                            <div className="w-0.5 h-12 bg-slate-100 mt-2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 -mt-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={`text-[10px] font-black uppercase opacity-60 tracking-widest ${index === 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                                                {item.time}
                                            </p>
                                            {index === 0 && (
                                                <Badge className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0 shadow-lg shadow-amber-100">Now</Badge>
                                            )}
                                        </div>
                                        <p className={`text-base font-black tracking-tight ${index === 0 ? 'text-slate-900' : 'text-slate-700 opacity-80'}`}>
                                            {item.subject}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-1 w-4 bg-amber-200 rounded-full"></div>
                                            <p className="text-[11px] font-bold text-slate-500 tracking-wide">{item.room}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Assignments */}
                <LuminaCard variant="glass" className="shadow-2xl shadow-slate-200/50 border-slate-100">
                    <LuminaCardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <LuminaCardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <ClipboardList className="h-6 w-6 text-amber-500" />
                                Quest Journal
                            </LuminaCardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-black px-4 rounded-xl">
                                <Link href="/student/assignments">All Tasks</Link>
                            </Button>
                        </div>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-3">
                            {upcomingAssignments.map((assignment: any) => (
                                <div
                                    key={assignment.id}
                                    className="group flex items-center gap-4 p-5 border border-slate-50 rounded-3xl hover:bg-white hover:border-amber-100 hover:shadow-xl hover:shadow-amber-500/5 transition-all"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:-rotate-2 ${assignment.priority === 'high' ? 'bg-rose-50 border border-rose-100 shadow-rose-100' :
                                        assignment.priority === 'medium' ? 'bg-amber-50 border border-amber-100 shadow-amber-100' : 'bg-slate-50 border border-slate-100 shadow-slate-100'
                                        }`}>
                                        <ClipboardList className={`h-7 w-7 ${assignment.priority === 'high' ? 'text-rose-500' :
                                            assignment.priority === 'medium' ? 'text-amber-500' : 'text-slate-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-900 text-base tracking-tight mb-0.5">{assignment.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{assignment.course}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-0 shadow-lg ${assignment.priority === 'high' ? 'bg-rose-500 text-white shadow-rose-200' :
                                                assignment.priority === 'medium' ? 'bg-amber-500 text-white shadow-amber-200' :
                                                    'bg-slate-100 text-slate-500 shadow-none'
                                                }`}
                                        >
                                            {assignment.due}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>

                {/* Performance Overview */}
                <LuminaCard variant="glass" className="shadow-2xl shadow-slate-200/50 border-slate-100">
                    <LuminaCardHeader className="pb-4">
                        <LuminaCardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-amber-500" />
                            Academic Growth
                        </LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-6">
                            {[
                                { subject: "Mathematics", grade: "A", percentage: 92, color: "from-amber-400 to-orange-500" },
                                { subject: "Physics", grade: "A-", percentage: 88, color: "from-indigo-500 to-purple-600" },
                                { subject: "English", grade: "A", percentage: 94, color: "from-emerald-500 to-teal-600" },
                                { subject: "Chemistry", grade: "B+", percentage: 85, color: "from-rose-400 to-rose-600" },
                            ].map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{item.subject}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-slate-900">{item.grade}</span>
                                            <Badge variant="outline" className="text-[10px] border-slate-100 font-bold bg-slate-50">{item.percentage}%</Badge>
                                        </div>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
                                        <div
                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 shadow-sm`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                                <Sparkles className="h-24 w-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    <h4 className="font-black text-lg tracking-tight">Elite Rank Confirmed</h4>
                                </div>
                                <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed" >You're maintaining a place in the <span className="text-amber-500 font-bold">top 10%</span> of scholars. Excellent performance!</p>
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl h-12 shadow-xl shadow-amber-500/20 border-0" asChild>
                                    <Link href="/student/grades">
                                        Detailed Analytics
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </LuminaCardContent>
                </LuminaCard>
            </div>

            {/* Conduct & Finance Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 overflow-hidden">
                <LuminaCard variant="glass" className="border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 bg-emerald-50 text-emerald-600 rounded-bl-3xl translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <LuminaCardHeader className="pb-4">
                        <LuminaCardTitle className="text-lg font-black text-slate-900">Conduct Integrity</LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <p className="text-xl font-black text-emerald-600 tracking-tight">EXCELLENT</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Integrity Score</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">98 <span className="text-slate-300 text-sm">/ 100</span></p>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full text-slate-600 font-bold border border-slate-100 hover:bg-slate-50 h-12 rounded-2xl" asChild>
                            <Link href="/student/behavior">Audit Conduct History</Link>
                        </Button>
                    </LuminaCardContent>
                </LuminaCard>

                <LuminaCard variant="glass" gradientColor="amber" className="border-amber-100 shadow-2xl shadow-amber-200/40 group relative">
                    <div className="absolute top-0 right-0 p-4 bg-rose-50 text-rose-600 rounded-bl-3xl translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <LuminaCardHeader className="pb-4">
                        <LuminaCardTitle className="text-lg font-black text-slate-900">Financial Terminal</LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Outstanding</p>
                                <p className="text-xl font-black text-rose-600 tracking-tight">$1,250.00</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Next Deadline</p>
                                <p className="text-base font-black text-slate-900 tracking-tight">Jan 15, 2024</p>
                            </div>
                        </div>
                        <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-2xl shadow-xl shadow-slate-200 border-0" asChild>
                            <Link href="/student/fees">Authorize Payment</Link>
                        </Button>
                    </LuminaCardContent>
                </LuminaCard>
            </div>
        </div>
    )
}
