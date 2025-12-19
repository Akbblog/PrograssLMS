"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react"
import apiClient from "@/lib/api/client"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get("/superadmin/analytics")
                setStats(response.data.data)
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch stats", error)
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium shadow-sm hover:shadow-md transition">📊 Dashboard</button>
                    <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">🏫 Schools</button>
                    <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">👥 Users</button>
                    <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">📈 Analytics</button>
                    <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">⚙️ Settings</button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.schools.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.schools.active} active, {stats?.schools.suspended} suspended
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats?.revenue.monthly)}</div>
                        <p className="text-xs text-muted-foreground">
                            Est. Annual: {formatCurrency(stats?.revenue.annual)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.usage.totalStudents.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all schools
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">
                            New schools this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-md bg-muted/10">
                            Revenue Chart Component
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Plan Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                    <span className="text-sm font-medium">Basic Plan</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{stats?.schools.basic} schools</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium">Standard Plan</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{stats?.schools.standard} schools</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                                    <span className="text-sm font-medium">Premium Plan</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{stats?.schools.premium} schools</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                    <span className="text-sm font-medium">Trial</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{stats?.schools.trial} schools</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[300px]" />
                <Skeleton className="col-span-3 h-[300px]" />
            </div>
        </div>
    )
}
