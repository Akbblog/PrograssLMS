"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    BookOpen,
    Users,
    BarChart3,
    ClipboardList,
    FileText,
    Clock,
    TrendingUp,
    ChevronRight
} from "lucide-react"

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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    const teacherStats = [
        { id: 1, label: "Total Classes", value: "4", icon: BookOpen, color: "from-blue-500 to-blue-600" },
        { id: 2, label: "Total Students", value: "120", icon: Users, color: "from-purple-500 to-purple-600" },
        { id: 3, label: "Avg. Performance", value: "78%", icon: TrendingUp, color: "from-emerald-500 to-emerald-600" },
        { id: 4, label: "Assignments", value: "12", icon: ClipboardList, color: "from-amber-500 to-amber-600" }
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
        <div className="p-8 space-y-8">
            {/* Welcome Section */}
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Hello, {user?.name?.split(" ")[0] || "Teacher"}! 👋
                    </h1>
                </div>
                <p className="text-slate-500">
                    {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {" • "}Manage your classes and students
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teacherStats.map((stat) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Classes */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-indigo-600" />
                                Today's Schedule
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                                View Full Schedule
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-3">
                            {classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-slate-900">{cls.name}</h3>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${cls.status === 'Completed' ? 'text-green-600 bg-green-50 border-green-200' :
                                                    cls.status === 'In Progress' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                                                        'text-slate-500 bg-slate-50 border-slate-200'
                                                    }`}
                                            >
                                                {cls.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-500">{cls.subject} • {cls.time}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-indigo-600">{cls.students}</p>
                                        <p className="text-xs text-slate-500">Students</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <activity.icon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                            <h4 className="font-semibold text-indigo-900 mb-1">Quick Actions</h4>
                            <p className="text-xs text-indigo-700 mb-3">What would you like to do?</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button size="sm" variant="outline" className="text-xs h-8 justify-start border-indigo-200 hover:bg-indigo-50">
                                    <ClipboardList className="w-3 h-3 mr-1" />
                                    New Assignment
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-8 justify-start border-indigo-200 hover:bg-indigo-50">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Enter Grades
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
