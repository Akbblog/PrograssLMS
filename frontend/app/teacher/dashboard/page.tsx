"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    Search,
    BookOpen,
    Users,
    BarChart3,
    ClipboardList,
    FileText,
    Clock,
    TrendingUp,
    ChevronRight,
    Plus,
    Target,
    Sparkles,
    Calendar
} from "lucide-react"
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from "@/components/ui/lumina-card"

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading command center...</p>
                </div>
            </div>
        )
    }

    const teacherStats = [
        { id: 1, label: "Total Classes", value: "4", icon: BookOpen, color: "from-teal-500 to-teal-600" },
        { id: 2, label: "Total Students", value: "120", icon: Users, color: "from-cyan-500 to-cyan-600" },
        { id: 3, label: "Avg. Performance", value: "78%", icon: TrendingUp, color: "from-emerald-500 to-emerald-600" },
        { id: 4, label: "Pending Tasks", value: "12", icon: ClipboardList, color: "from-amber-500 to-amber-600" }
    ]

    const classes = [
        { id: 1, name: "Class 10-A", students: 30, subject: "Mathematics", time: "9:00 AM - 10:00 AM", status: "Completed" },
        { id: 2, name: "Class 10-B", students: 28, subject: "English", time: "10:15 AM - 11:15 AM", status: "In Progress" },
        { id: 3, name: "Class 11-A", students: 32, subject: "Physics", time: "11:30 AM - 12:30 PM", status: "Upcoming" },
        { id: 4, name: "Class 9-C", students: 25, subject: "History", time: "2:00 PM - 3:00 PM", status: "Upcoming" }
    ]

    const recentActivities = [
        { id: 1, action: "Graded quiz for Class 10-A", time: "2 hours ago", icon: FileText },
        { id: 2, action: "Posted assignment for Class 11-A", time: "4 hours ago", icon: ClipboardList },
        { id: 3, action: "Took attendance for Class 10-B", time: "Yesterday", icon: Users },
    ]

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Welcome Section */}
            <div className="animate-fadeInUp">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-8 bg-teal-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">Educator Command Center</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Command, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">{user?.name?.split(" ")[0] || "Professor"}</span>! 🧑‍🏫
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 font-bold px-6 rounded-2xl h-12 shadow-sm" asChild>
                            <Link href="/teacher/schedule">
                                Full Schedule
                            </Link>
                        </Button>
                        <Button className="bg-slate-900 hover:bg-black text-white font-bold px-6 rounded-2xl h-12 shadow-xl shadow-slate-200 border-0" asChild>
                            <Link href="/teacher/assignments/new">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Task
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                {teacherStats.map((stat) => (
                    <LuminaCard
                        key={stat.id}
                        variant="gradient"
                        gradientColor="teal"
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
                {/* Today's Schedule */}
                <LuminaCard variant="glass" className="lg:col-span-2 shadow-2xl shadow-slate-200/50 border-slate-100">
                    <LuminaCardHeader className="pb-6">
                        <div className="flex items-center justify-between">
                            <LuminaCardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Clock className="h-6 w-6 text-teal-500" />
                                Teaching Agenda
                            </LuminaCardTitle>
                            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 font-black px-4 rounded-xl">
                                Full Roster
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-4">
                            {classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-slate-50 rounded-3xl hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-100 transition-all cursor-pointer bg-white"
                                >
                                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 transition-all duration-500 shadow-sm relative overflow-hidden">
                                        <BookOpen className="h-8 w-8 text-teal-600 group-hover:text-white transition-colors relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors text-lg uppercase">{cls.name}</h3>
                                            <Badge
                                                className={`rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest border-0 ${cls.status === 'Completed' ? 'bg-emerald-500 text-white shadow-emerald-100' :
                                                    cls.status === 'In Progress' ? 'bg-amber-500 text-white shadow-amber-100 animate-pulse' :
                                                        'bg-slate-100 text-slate-400'
                                                    }`}
                                            >
                                                {cls.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 font-bold tracking-tight">{cls.subject} <span className="mx-2 opacity-30">•</span> {cls.time}</p>
                                    </div>
                                    <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 sm:border-l border-slate-50 pt-3 sm:pt-0 sm:pl-6">
                                        <p className="text-3xl font-black text-teal-600 tabular-nums leading-none tracking-tight">{cls.students}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Enrolled</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>

                {/* Recent Activity */}
                <LuminaCard variant="glass" className="shadow-2xl shadow-slate-200/50 border-slate-100">
                    <LuminaCardHeader className="pb-6">
                        <LuminaCardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-teal-500" />
                            Operations Log
                        </LuminaCardTitle>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-teal-50/50 transition-all group overflow-hidden relative">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                        <activity.icon className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 tracking-tight leading-snug">{activity.action}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-br from-teal-600 via-emerald-700 to-teal-800 rounded-3xl text-white relative overflow-hidden shadow-2xl group">
                            <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Target className="w-4 h-4 text-emerald-300" />
                                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-100">
                                        Active Directives
                                    </h4>
                                </div>
                                <p className="text-sm text-teal-50 mb-6 font-bold leading-relaxed">System identified <span className="text-emerald-300 text-lg mx-1">3</span> incomplete attendance markers for today.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button size="sm" variant="ghost" className="text-[10px] h-11 justify-center bg-white/10 hover:bg-white/20 text-white border-white/20 font-black uppercase tracking-widest rounded-xl transition-all">
                                        Post Tasks
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-[10px] h-11 justify-center bg-white/10 hover:bg-white/20 text-white border-white/20 font-black uppercase tracking-widest rounded-xl transition-all">
                                        Grade Prep
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </LuminaCardContent>
                </LuminaCard>
            </div>
        </div>
    )
}
