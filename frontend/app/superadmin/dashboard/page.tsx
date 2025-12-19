'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { superAdminAPI } from "@/lib/api/endpoints"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    Users,
    Plus,
    ChevronRight,
    Activity,
    DollarSign,
    Heart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"

export default function SuperAdminDashboard() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const [isLoading, setIsLoading] = useState(true)
    const [schools, setSchools] = useState<any[]>([])
    const [systemStats, setSystemStats] = useState<any[]>([])
    const [currentDateTime, setCurrentDateTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true)
                // fetch schools
                const sResp: any = await superAdminAPI.getSchools()
                let list: any[] = []
                if (sResp?.data?.data && Array.isArray(sResp.data.data)) {
                    list = sResp.data.data
                } else if (sResp?.data && Array.isArray(sResp.data)) {
                    list = sResp.data
                }
                setSchools(list)

                // basic stats from API
                try {
                    const analytics: any = await superAdminAPI.getAnalytics()
                    const stats = [
                        { id: 1, label: "Total Schools", value: analytics?.schools?.total ?? list.length, icon: Building2, color: "from-blue-500 to-blue-600", change: "+12%", trend: "up" },
                        { id: 2, label: "Total Users", value: analytics?.users ?? "—", icon: Users, color: "from-purple-500 to-purple-600", change: "+8%", trend: "up" },
                        { id: 3, label: "System Health", value: analytics?.health ?? "99.8%", icon: Heart, color: "from-rose-500 to-rose-600", change: "+0.2%", trend: "up" },
                        { id: 4, label: "Monthly Revenue", value: analytics?.revenue?.monthly ? `$${analytics.revenue.monthly.toLocaleString()}` : "$0", icon: DollarSign, color: "from-emerald-500 to-emerald-600", change: "+15%", trend: "up" }
                    ]
                    setSystemStats(stats)
                } catch (err) {
                    setSystemStats([
                        { id: 1, label: "Total Schools", value: list.length, icon: Building2, color: "from-blue-500 to-blue-600", change: "+12%", trend: "up" },
                        { id: 2, label: "Total Users", value: "—", icon: Users, color: "from-purple-500 to-purple-600", change: "+8%", trend: "up" },
                        { id: 3, label: "System Health", value: "99.8%", icon: Heart, color: "from-rose-500 to-rose-600", change: "+0.2%", trend: "up" },
                        { id: 4, label: "Monthly Revenue", value: "$0", icon: DollarSign, color: "from-emerald-500 to-emerald-600", change: "+15%", trend: "up" }
                    ])
                }
            } catch (err) {
                console.error('Failed to load dashboard data', err)
            } finally {
                setIsLoading(false)
            }
        }
        init()
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

    return (
        <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋
                        </h1>
                        <p className="text-slate-500">
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {" • "}System overview and management
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/superadmin/schools/create')}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add School
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {systemStats.map((stat) => (
                    <Card
                        key={stat.id}
                        className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                                    <div className="flex items-center gap-1 mt-2">
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="w-4 h-4" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium">{stat.change}</span>
                                    </div>
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
                {/* Recent Activity */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-600" />
                                Recent Activity
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700">
                                <Link href="/superadmin/schools">View All Schools</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-4">
                            {schools.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No recent activity</p>
                                    <p className="text-sm">Activity will appear here once schools are added</p>
                                </div>
                            ) : (
                                schools.slice(0, 5).map((school: any, index: number) => (
                                    <div
                                        key={school._id || index}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/superadmin/schools/${school._id}`)}
                                    >
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900">{school.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {school.subscription?.usage?.studentCount || 0} students • {school.subscription?.plan || 'N/A'} plan
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={school.isActive ? "text-green-600 border-green-200 bg-green-50" : "text-slate-500"}>
                                            {school.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions & Schools Overview */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-slate-900">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2 space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/superadmin/schools/create')}
                            >
                                <Building2 className="w-4 h-4 mr-2 text-indigo-600" />
                                Add New School
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/superadmin/users')}
                            >
                                <Users className="w-4 h-4 mr-2 text-purple-600" />
                                Manage Users
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/superadmin/analytics')}
                            >
                                <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Schools Summary */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-indigo-600" />
                                    Schools
                                </CardTitle>
                                <span className="text-2xl font-bold text-indigo-600">{schools.length}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Active Schools</span>
                                    <span className="font-medium text-green-600">{schools.filter((s: any) => s.isActive).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Inactive Schools</span>
                                    <span className="font-medium text-slate-500">{schools.filter((s: any) => !s.isActive).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Trial Plans</span>
                                    <span className="font-medium">{schools.filter((s: any) => s.subscription?.plan === 'trial').length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Premium Plans</span>
                                    <span className="font-medium">{schools.filter((s: any) => s.subscription?.plan === 'premium').length}</span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full mt-4 text-indigo-600"
                                asChild
                            >
                                <Link href="/superadmin/schools">
                                    View all schools
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
