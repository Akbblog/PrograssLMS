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
    ArrowDownRight,
    Sparkles,
    Shield,
    Globe
} from "lucide-react"
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from "@/components/ui/lumina-card"

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
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-8 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Global Command Center</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Overview</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            <span className="text-slate-300">|</span>
                            Active Root Session
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/superadmin/schools/create')}
                        className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 font-bold gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Provision New School
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {systemStats.map((stat, idx) => (
                    <LuminaCard
                        key={stat.id}
                        variant="gradient"
                        gradientColor={idx === 0 ? 'indigo' : idx === 1 ? 'purple' : idx === 2 ? 'rose' : 'emerald'}
                        glow
                        className="group"
                    >
                        <LuminaCardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-3xl font-black mt-1 tracking-tight">{stat.value}</h3>
                                    <div className="flex items-center gap-1 mt-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 w-fit">
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="w-3 h-3 text-white" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3 text-white" />
                                        )}
                                        <span className="text-[10px] font-bold text-white">{stat.change}</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
                                    <stat.icon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
                                </div>
                            </div>
                        </LuminaCardContent>
                    </LuminaCard>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <LuminaCard variant="glass" className="lg:col-span-2 border-slate-100 shadow-2xl shadow-slate-200/50">
                    <LuminaCardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <LuminaCardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Activity className="h-6 w-6 text-indigo-600" />
                                Registered Institutions
                            </LuminaCardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold px-4 rounded-xl">
                                <Link href="/superadmin/schools">Export List</Link>
                            </Button>
                        </div>
                    </LuminaCardHeader>
                    <LuminaCardContent>
                        <div className="space-y-3">
                            {schools.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                        <Building2 className="h-10 w-10 opacity-20" />
                                    </div>
                                    <p className="font-bold text-lg text-slate-600">No schools provisioned</p>
                                    <p className="text-sm">Start by adding your first educational institution.</p>
                                </div>
                            ) : (
                                schools.slice(0, 6).map((school: any, index: number) => (
                                    <div
                                        key={school._id || index}
                                        className="group flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
                                        onClick={() => router.push(`/superadmin/schools/${school._id}`)}
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-3 transition-transform">
                                            <Building2 className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-bold text-slate-900 tracking-tight">{school.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {school.subscription?.usage?.studentCount || 0} Capacity
                                                </p>
                                                <span className="text-slate-300">•</span>
                                                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-2 py-0.5 rounded-md">
                                                    {school.subscription?.plan || 'Standard'} Plan
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${school.isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-slate-200 text-slate-500"}`}>
                                            {school.isActive ? 'Active' : 'Offline'}
                                        </Badge>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                            <ChevronRight className="w-5 h-5 text-indigo-600" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </LuminaCardContent>
                </LuminaCard>

                {/* Quick Actions & Schools Overview */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <LuminaCard variant="glass" className="border-slate-100 shadow-2xl shadow-slate-200/50">
                        <LuminaCardHeader className="pb-4">
                            <LuminaCardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-500" />
                                Core Operations
                            </LuminaCardTitle>
                        </LuminaCardHeader>
                        <LuminaCardContent className="space-y-3">
                            <button
                                onClick={() => router.push('/superadmin/schools/create')}
                                className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                            >
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">Provision School</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New deployment</p>
                                </div>
                            </button>
                            <button
                                onClick={() => router.push('/superadmin/users')}
                                className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
                            >
                                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-100 transition-transform group-hover:scale-110">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">Security Control</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Manage access</p>
                                </div>
                            </button>
                            <button
                                onClick={() => router.push('/superadmin/analytics')}
                                className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                            >
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 transition-transform group-hover:scale-110">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">Global Insights</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System metrics</p>
                                </div>
                            </button>
                        </LuminaCardContent>
                    </LuminaCard>

                    {/* Schools Summary */}
                    <LuminaCard variant="glass" gradientColor="indigo" className="border-indigo-100 shadow-2xl shadow-indigo-200/50 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Building2 className="w-32 h-32" />
                        </div>
                        <LuminaCardHeader className="pb-4">
                            <div className="flex items-center justify-between relative z-10">
                                <LuminaCardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    Network Health
                                </LuminaCardTitle>
                                <div className="px-3 py-1 bg-indigo-600 rounded-lg text-white font-black text-xl shadow-lg shadow-indigo-100">
                                    {schools.length}
                                </div>
                            </div>
                        </LuminaCardHeader>
                        <LuminaCardContent className="relative z-10">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">
                                        <span>Capacity Utilization</span>
                                        <span className="text-indigo-600">84%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                        <div className="h-full w-[84%] bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</p>
                                        <p className="text-2xl font-black text-slate-900 mt-0.5">{schools.filter((s: any) => s.isActive).length}</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offline</p>
                                        <p className="text-2xl font-black text-slate-900 mt-0.5">{schools.filter((s: any) => !s.isActive).length}</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full mt-6 text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl gap-2"
                                asChild
                            >
                                <Link href="/superadmin/schools">
                                    Enter Network Control
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </LuminaCardContent>
                    </LuminaCard>
                </div>
            </div>
        </div>
    )
}
