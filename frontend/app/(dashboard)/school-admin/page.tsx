"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    Users, 
    GraduationCap, 
    BookOpen, 
    TrendingUp,
    Plus,
    BarChart3,
    Calendar,
    MessageSquare,
    ClipboardList,
    UserPlus,
    CloudOff
} from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
import apiClient from "@/lib/api/client"

interface DashboardStats {
    totalStudents: number
    totalTeachers: number
    activeClasses: number
    attendanceRate: number
}

interface UpcomingEvent {
    id: string
    title: string
    date: string
    type: 'meeting' | 'conference' | 'exam' | 'holiday'
}

export default function SchoolAdminDashboard() {
    const { user } = useAuthStore()
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalTeachers: 0,
        activeClasses: 0,
        attendanceRate: 94.5
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const firstName = user?.name?.split(' ')[0] || 'Admin'
    
    const today = new Date()
    const dateString = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })

    // Upcoming events (static for now)
    const upcomingEvents: UpcomingEvent[] = [
        { id: '1', title: 'Staff Meeting', date: 'Today, 10:00 AM', type: 'meeting' },
        { id: '2', title: 'Parent-Teacher Conference', date: 'Tomorrow, 2:00 PM', type: 'conference' },
        { id: '3', title: 'End of Term Exams', date: 'Dec 15-20', type: 'exam' },
        { id: '4', title: 'Winter Break', date: 'Dec 21 - Jan 5', type: 'holiday' },
    ]

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Fetch students count
                const studentsRes = await apiClient.get('/admin/students')
                const teachersRes = await apiClient.get('/admin/teachers')
                const classesRes = await apiClient.get('/academic/classes')
                
                setStats({
                    totalStudents: studentsRes.data?.students?.length || studentsRes.data?.length || 0,
                    totalTeachers: teachersRes.data?.teachers?.length || teachersRes.data?.length || 0,
                    activeClasses: classesRes.data?.classes?.length || classesRes.data?.length || 0,
                    attendanceRate: 94.5
                })
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
                setError('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const getEventIcon = (type: UpcomingEvent['type']) => {
        switch (type) {
            case 'meeting': return <Calendar className="h-4 w-4" />
            case 'conference': return <Users className="h-4 w-4" />
            case 'exam': return <ClipboardList className="h-4 w-4" />
            case 'holiday': return <Calendar className="h-4 w-4" />
        }
    }

    const getEventColor = (type: UpcomingEvent['type']) => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-600'
            case 'conference': return 'bg-purple-100 text-purple-600'
            case 'exam': return 'bg-orange-100 text-orange-600'
            case 'holiday': return 'bg-green-100 text-green-600'
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Welcome back, {firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {dateString} • Here&apos;s what&apos;s happening at your school today
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/school-admin/reports">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Reports
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/school-admin/students/add">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                    <CloudOff className="h-5 w-5" />
                    <span>{error}. Showing default values.</span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Students */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Total Students</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {loading ? '...' : stats.totalStudents}
                        </div>
                        <p className="text-xs text-blue-100 flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> +12%
                        </p>
                    </CardContent>
                </Card>

                {/* Total Teachers */}
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-purple-100">Total Teachers</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {loading ? '...' : stats.totalTeachers}
                        </div>
                        <p className="text-xs text-purple-100 flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> +5%
                        </p>
                    </CardContent>
                </Card>

                {/* Active Classes */}
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-green-100">Active Classes</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <BookOpen className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {loading ? '...' : stats.activeClasses}
                        </div>
                        <p className="text-xs text-green-100 flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> +3%
                        </p>
                    </CardContent>
                </Card>

                {/* Attendance Rate */}
                <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-orange-100">Attendance Rate</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <ClipboardList className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.attendanceRate}%</div>
                        <p className="text-xs text-orange-100 flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> +2.1%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Middle Section: Quick Actions, Recent Students, Upcoming Events */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/school-admin/students/add" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Add Student</span>
                            </Link>
                            <Link href="/school-admin/teachers/add" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Add Teacher</span>
                            </Link>
                            <Link href="/school-admin/academic/classes/add" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Create Class</span>
                            </Link>
                            <Link href="/school-admin/attendance" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Record Attendance</span>
                            </Link>
                            <Link href="/school-admin/reports" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">View Reports</span>
                            </Link>
                            <Link href="/school-admin/communication" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Messages</span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Students */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Recent Students
                        </CardTitle>
                        <Link href="/school-admin/students" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {stats.totalStudents === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <GraduationCap className="h-12 w-12 mb-3 opacity-50" />
                                <p className="text-sm font-medium">No students yet</p>
                                <p className="text-xs">Add students to see them here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">Loading recent students...</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Upcoming Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-start gap-3">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                                        {getEventIcon(event.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{event.title}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {event.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        ⚡ Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* New Enrollments */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-sm text-blue-100">New Enrollments</p>
                            </div>
                        </div>

                        {/* Today's Attendance */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">94.5%</p>
                                <p className="text-sm text-green-100">Today&apos;s Attendance</p>
                            </div>
                        </div>

                        {/* Active Classes */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{loading ? '...' : stats.activeClasses}</p>
                                <p className="text-sm text-purple-100">Active Classes</p>
                            </div>
                        </div>

                        {/* Pending Fees */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <span className="text-xl font-bold">$</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">$0</p>
                                <p className="text-sm text-amber-100">Pending Fees</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
