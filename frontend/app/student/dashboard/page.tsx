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
    Play
} from "lucide-react"

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

    const studentStats = [
        { id: 1, label: "Enrolled Courses", value: "6", icon: BookOpen, color: "from-blue-500 to-blue-600" },
        { id: 2, label: "Completed", value: "3", icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
        { id: 3, label: "Overall GPA", value: "3.8", icon: Target, color: "from-purple-500 to-purple-600" },
        { id: 4, label: "Attendance", value: "95%", icon: Calendar, color: "from-amber-500 to-amber-600" }
    ]

    const recentCourses = [
        {
            id: 1,
            title: "Mathematics - Algebra II",
            instructor: "Dr. Sarah Johnson",
            progress: 75,
            nextClass: "Today, 10:00 AM",
            color: "bg-blue-500"
        },
        {
            id: 2,
            title: "Physics - Mechanics",
            instructor: "Prof. Michael Chen",
            progress: 60,
            nextClass: "Today, 2:00 PM",
            color: "bg-purple-500"
        },
        {
            id: 3,
            title: "English Literature",
            instructor: "Ms. Emily Davis",
            progress: 85,
            nextClass: "Tomorrow, 9:00 AM",
            color: "bg-emerald-500"
        }
    ]

    const upcomingAssignments = [
        { id: 1, title: "Algebra Homework #5", course: "Mathematics", due: "Due Tomorrow", priority: "high" },
        { id: 2, title: "Physics Lab Report", course: "Physics", due: "Due in 3 days", priority: "medium" },
        { id: 3, title: "Essay: Shakespeare Analysis", course: "English", due: "Due in 5 days", priority: "low" },
    ]

    const todaySchedule = [
        { id: 1, time: "10:00 AM", subject: "Mathematics", room: "Room 301", status: "upcoming" },
        { id: 2, time: "11:30 AM", subject: "Chemistry Lab", room: "Lab 102", status: "upcoming" },
        { id: 3, time: "2:00 PM", subject: "Physics", room: "Room 205", status: "upcoming" },
        { id: 4, time: "3:30 PM", subject: "History", room: "Room 401", status: "upcoming" },
    ]

    return (
        <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Hello, {user?.name?.split(" ")[0] || "Student"}! 👋
                        </h1>
                        <p className="text-slate-500">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {" • "}Let's continue learning today!
                        </p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <Button variant="outline" className="border-slate-200">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Calendar
                        </Button>
                        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-200">
                            <Play className="w-4 h-4 mr-2" />
                            Resume Learning
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {studentStats.map((stat) => (
                    <Card
                        key={stat.id}
                        className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Current Courses */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-600" />
                                My Courses
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700">
                                <Link href="/student/courses">
                                    View All
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-4">
                            {recentCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                                >
                                    <div className={`w-12 h-12 ${course.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                                        <p className="text-sm text-slate-500">{course.instructor}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex-1 max-w-[200px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-full transition-all"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-indigo-600">{course.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <Badge variant="outline" className="text-xs text-slate-600 border-slate-200">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {course.nextClass}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Schedule */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            Today's Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-3">
                            {todaySchedule.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg border ${index === 0 ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
                                        } transition-colors`}
                                >
                                    <div className={`text-sm font-semibold ${index === 0 ? 'text-indigo-600' : 'text-slate-500'} w-16`}>
                                        {item.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${index === 0 ? 'text-indigo-900' : 'text-slate-900'}`}>
                                            {item.subject}
                                        </p>
                                        <p className="text-xs text-slate-500">{item.room}</p>
                                    </div>
                                    {index === 0 && (
                                        <Badge className="bg-indigo-600 text-white text-xs">Next</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Assignments */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-indigo-600" />
                                Upcoming Assignments
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700">
                                <Link href="/student/assignments">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-3">
                            {upcomingAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assignment.priority === 'high' ? 'bg-red-100' :
                                        assignment.priority === 'medium' ? 'bg-amber-100' : 'bg-slate-100'
                                        }`}>
                                        <ClipboardList className={`h-5 w-5 ${assignment.priority === 'high' ? 'text-red-600' :
                                            assignment.priority === 'medium' ? 'text-amber-600' : 'text-slate-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-slate-900 text-sm">{assignment.title}</h4>
                                        <p className="text-xs text-slate-500">{assignment.course}</p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${assignment.priority === 'high' ? 'text-red-600 border-red-200 bg-red-50' :
                                            assignment.priority === 'medium' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                                                'text-slate-600 border-slate-200'
                                            }`}
                                    >
                                        {assignment.due}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Overview */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            Performance Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-4">
                            {[
                                { subject: "Mathematics", grade: "A", percentage: 92 },
                                { subject: "Physics", grade: "A-", percentage: 88 },
                                { subject: "English", grade: "A", percentage: 94 },
                                { subject: "Chemistry", grade: "B+", percentage: 85 },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-900">{item.subject}</span>
                                            <span className="text-sm font-semibold text-indigo-600">{item.grade}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 w-10 text-right">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-indigo-900">Great Progress! 🎉</h4>
                                    <p className="text-xs text-indigo-700">You're in the top 10% of your class</p>
                                </div>
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                                    <Link href="/student/grades">
                                        View Report
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
