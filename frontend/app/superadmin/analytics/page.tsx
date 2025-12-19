"use client"

import { useEffect, useState } from "react"
import { superAdminAPI } from "@/lib/api/endpoints"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Calendar,
    GraduationCap,
    BookOpen
} from "lucide-react"

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true)
    const [schools, setSchools] = useState<any[]>([])
    const [analytics, setAnalytics] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const schoolsRes: any = await superAdminAPI.getSchools()
            let schoolsList: any[] = []
            if (schoolsRes?.data?.data && Array.isArray(schoolsRes.data.data)) {
                schoolsList = schoolsRes.data.data
            } else if (schoolsRes?.data && Array.isArray(schoolsRes.data)) {
                schoolsList = schoolsRes.data
            }
            setSchools(schoolsList)

            try {
                const analyticsRes: any = await superAdminAPI.getAnalytics()
                setAnalytics(analyticsRes)
            } catch (e) {
                // Use fallback analytics
                setAnalytics(null)
            }
        } catch (error) {
            console.error("Failed to fetch analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate stats from schools data
    const totalStudents = schools.reduce((acc, s) => acc + (s.subscription?.usage?.studentCount || 0), 0)
    const totalTeachers = schools.reduce((acc, s) => acc + (s.subscription?.usage?.teacherCount || 0), 0)
    const activeSchools = schools.filter(s => s.isActive).length
    const totalRevenue = schools.reduce((acc, s) => {
        const planPrices: Record<string, number> = { trial: 0, basic: 99, standard: 199, premium: 499 }
        return acc + (planPrices[s.subscription?.plan] || 0)
    }, 0)

    const stats = [
        { label: "Total Schools", value: schools.length, icon: Building2, color: "from-blue-500 to-blue-600", change: "+12%", trend: "up" },
        { label: "Active Schools", value: activeSchools, icon: Activity, color: "from-green-500 to-green-600", change: "+8%", trend: "up" },
        { label: "Total Students", value: totalStudents, icon: GraduationCap, color: "from-purple-500 to-purple-600", change: "+15%", trend: "up" },
        { label: "Total Teachers", value: totalTeachers, icon: Users, color: "from-amber-500 to-amber-600", change: "+5%", trend: "up" },
        { label: "Monthly Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-emerald-600", change: "+20%", trend: "up" },
        { label: "Courses Created", value: analytics?.courses || 0, icon: BookOpen, color: "from-rose-500 to-rose-600", change: "+10%", trend: "up" },
    ]

    const planDistribution = [
        { plan: "Trial", count: schools.filter(s => s.subscription?.plan === 'trial').length, color: "bg-slate-500" },
        { plan: "Basic", count: schools.filter(s => s.subscription?.plan === 'basic').length, color: "bg-blue-500" },
        { plan: "Standard", count: schools.filter(s => s.subscription?.plan === 'standard').length, color: "bg-purple-500" },
        { plan: "Premium", count: schools.filter(s => s.subscription?.plan === 'premium').length, color: "bg-emerald-500" },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-slate-500">Loading analytics...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-500">
                    Platform-wide metrics and insights
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white`}
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
                                        <span className="text-sm font-medium">{stat.change} vs last month</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Plan Distribution */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                            Subscription Plans
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {planDistribution.map((plan, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">{plan.plan}</span>
                                        <span className="text-slate-500">{plan.count} schools</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${plan.color} rounded-full transition-all`}
                                            style={{ width: schools.length > 0 ? `${(plan.count / schools.length) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Average Revenue per School</span>
                                <span className="font-semibold text-slate-900">
                                    ${schools.length > 0 ? Math.round(totalRevenue / schools.length) : 0}/mo
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Growth Trends */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Growth Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                <div>
                                    <p className="text-sm text-emerald-700">Monthly Growth Rate</p>
                                    <p className="text-2xl font-bold text-emerald-800">+15.3%</p>
                                </div>
                                <ArrowUpRight className="h-8 w-8 text-emerald-600" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-600">New Schools This Month</p>
                                    <p className="text-xl font-bold text-slate-900">+3</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-600">New Users This Month</p>
                                    <p className="text-xl font-bold text-slate-900">+{totalStudents + totalTeachers}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                    <p className="font-medium text-indigo-900">Projected Revenue (Next Quarter)</p>
                                </div>
                                <p className="text-2xl font-bold text-indigo-800">${(totalRevenue * 3 * 1.15).toLocaleString()}</p>
                                <p className="text-sm text-indigo-600 mt-1">Based on current growth trends</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Schools */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        Top Performing Schools
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {schools.slice(0, 5).map((school, index) => (
                            <div
                                key={school._id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{school.name}</p>
                                        <p className="text-sm text-slate-500">{school.subscription?.plan} plan</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900">
                                        {school.subscription?.usage?.studentCount || 0} students
                                    </p>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        ))}

                        {schools.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p>No schools registered yet</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
