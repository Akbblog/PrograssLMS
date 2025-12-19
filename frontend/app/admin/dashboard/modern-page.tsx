"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronDown, Search, Bell, Users, BookOpen, BarChart3, Settings, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    const stats = [
        { label: "Total Students", value: "1,245", icon: "👥", color: "bg-blue-50 border-blue-200" },
        { label: "Active Teachers", value: "45", icon: "👨‍🏫", color: "bg-green-50 border-green-200" },
        { label: "Courses", value: "32", icon: "📚", color: "bg-purple-50 border-purple-200" },
        { label: "Revenue", value: "$45,230", icon: "💰", color: "bg-orange-50 border-orange-200" }
    ]

    const recentActivities = [
        { type: "Student Enrolled", description: "John Doe enrolled in Product Design", time: "2 hours ago", icon: "✅" },
        { type: "Course Created", description: "New course: Advanced UI Design", time: "5 hours ago", icon: "📘" },
        { type: "Payment Received", description: "$500 payment from ABC School", time: "1 day ago", icon: "💳" },
        { type: "Assignment Submitted", description: "50 assignments submitted", time: "2 days ago", icon: "📄" }
    ]

    const topCourses = [
        { name: "Product Design Course", students: 234, progress: 65, revenue: "$5,200" },
        { name: "UX Design Fundamentals", students: 189, progress: 55, revenue: "$4,100" },
        { name: "Interaction Design", students: 156, progress: 42, revenue: "$3,400" }
    ]

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-56 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="h-16 border-b border-gray-200 flex items-center px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">D</span>
                        </div>
                        <span className="font-bold text-gray-900" style={{ letterSpacing: "0.08em" }}>DESIGNO</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="px-3 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-3">
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-sm">Dashboard</span>
                    </div>
                    <div className="px-3 py-2 text-gray-600 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition">
                        <Users className="w-4 h-4" />
                        <span className="font-medium text-sm">Students</span>
                    </div>
                    <div className="px-3 py-2 text-gray-600 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium text-sm">Courses</span>
                    </div>
                    <div className="px-3 py-2 text-gray-600 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition">
                        <BarChart3 className="w-4 h-4" />
                        <span className="font-medium text-sm">Analytics</span>
                    </div>
                    <div className="px-3 py-2 text-gray-600 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition">
                        <Settings className="w-4 h-4" />
                        <span className="font-medium text-sm">Settings</span>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Button
                        onClick={handleLogout}
                        className="w-full bg-gray-200 text-gray-900 hover:bg-gray-300 flex items-center gap-2 justify-center"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-orange-500 rounded-lg">
                            <Search className="w-4 h-4 text-orange-500" />
                            <input type="text" placeholder="Search" className="bg-transparent text-sm outline-none w-full text-gray-900" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                            <Bell className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{user?.name?.charAt(0) || "A"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{user?.name || "Admin"}</span>
                                <span className="text-xs text-gray-500">School Admin</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                    {/* Greeting */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
                        <p className="text-gray-600 text-lg">Monitor your school's performance and activity</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`border rounded-lg p-6 shadow-sm ${stat.color}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
                            <div className="space-y-4">
                                {recentActivities.map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                        <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">{activity.type}</p>
                                            <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">School Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Student Growth</span>
                                    <span className="text-sm font-semibold text-green-600">+12%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Course Enrollment</span>
                                    <span className="text-sm font-semibold text-orange-600">+8%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Revenue</span>
                                    <span className="text-sm font-semibold text-blue-600">+15%</span>
                                </div>
                                <button className="w-full mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                                    View Reports
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Top Courses */}
                    <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Students</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCourses.map((course, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition last:border-b-0">
                                            <td className="py-3 px-4 text-sm text-gray-900 font-medium">{course.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{course.students}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                                                        <div className="h-full bg-orange-500" style={{ width: `${course.progress}%` }} />
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-700">{course.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-semibold text-gray-900">{course.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
