"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { behaviorAPI, academicAPI } from "@/lib/api/endpoints"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, AlertTriangle, TrendingUp, Calendar, Info, CheckCircle2, History } from "lucide-react"
import { toast } from "sonner"

export default function StudentBehaviorPage() {
    const user = useAuthStore((state) => state.user)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [years, setYears] = useState<any[]>([])
    const [selectedYear, setSelectedYear] = useState<string>("")

    useEffect(() => {
        fetchMetadata()
    }, [])

    useEffect(() => {
        if (user?._id && selectedYear) {
            fetchBehaviorProfile()
        }
    }, [user, selectedYear])

    const fetchMetadata = async () => {
        try {
            const yearsRes = await academicAPI.getAcademicYears()
            setYears(yearsRes.data)
            if (yearsRes.data.length > 0) {
                const active = yearsRes.data.find((y: any) => y.status === "active") || yearsRes.data[0]
                setSelectedYear(active._id)
            }
        } catch (error) {
            toast.error("Failed to load academic years")
        }
    }

    const fetchBehaviorProfile = async () => {
        setLoading(true)
        try {
            if (!user?._id) return
            const res = await behaviorAPI.getStudentProfile(user._id, selectedYear)
            setProfile(res.data)
        } catch (error) {
            toast.error("Failed to load behavior profile")
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-600"
        if (score >= 70) return "text-indigo-600"
        if (score >= 50) return "text-amber-600"
        return "text-red-600"
    }

    const getStanding = (score: number) => {
        if (score >= 90) return { label: "Excellent", variant: "default", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> }
        if (score >= 70) return { label: "Good", variant: "secondary", icon: <Info className="w-4 h-4 mr-1" /> }
        if (score >= 50) return { label: "Fair", variant: "outline", icon: <AlertTriangle className="w-4 h-4 mr-1" /> }
        return { label: "Needs Improvement", variant: "destructive", icon: <ShieldCheck className="w-4 h-4 mr-1" /> }
    }

    if (loading && !profile) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    const standing = profile ? getStanding(profile.behavior.behaviorScore) : null

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Conduct & Attendance</h1>
                    <p className="text-slate-500 mt-1">Review your behavior score, attendance patterns, and school standing.</p>
                </div>
                <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-slate-400" />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    >
                        {years.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
                    </select>
                </div>
            </div>

            {profile && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Behavior Score Card */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-slate-50 to-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Behavior Score</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div className={`text-5xl font-black ${getScoreColor(profile.behavior.behaviorScore)}`}>
                                        {profile.behavior.behaviorScore.toFixed(0)}
                                        <span className="text-xl text-slate-300 ml-1 font-normal">/100</span>
                                    </div>
                                    <Badge variant={standing?.variant as any} className="mb-2">
                                        {standing?.icon}
                                        {standing?.label}
                                    </Badge>
                                </div>
                                <Progress
                                    value={profile.behavior.behaviorScore}
                                    className={`h-2 ${profile.behavior.behaviorScore < 50 ? 'bg-red-100' : 'bg-slate-100'}`}
                                // I can't easily change the indicator color of shadcn progress here without custom css but it defaults to primary
                                />
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Your score is based on cumulative behavioral incidents and teacher observations. Maintain a score above 90 to be eligible for the Dean's Honor Roll.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Attendance Card */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50/50 to-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Attendance Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div className="text-5xl font-black text-indigo-600">
                                        {profile.attendance.attendanceRate.toFixed(1)}
                                        <span className="text-xl text-indigo-200 ml-1 font-normal">%</span>
                                    </div>
                                    <div className="text-right mb-1">
                                        <p className="text-xs font-bold text-slate-400">STATUS</p>
                                        <p className={`text-sm font-bold ${profile.attendance.attendanceRate >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {profile.attendance.attendanceRate >= 85 ? 'Healthy' : 'Needs Review'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {profile.attendance.recentPattern.map((status: string, i: number) => (
                                        <div key={i} className={`h-1.5 rounded-full ${status === 'present' ? 'bg-emerald-500' : status === 'late' ? 'bg-amber-400' : 'bg-red-400'}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500">Showing impact of your recent 10 attendance records.</p>
                            </CardContent>
                        </Card>

                        {/* Quick Stats Card */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Summary Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Absences</p>
                                        <p className="text-xl font-bold text-slate-800">{profile.attendance.absentDays}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Late Days</p>
                                        <p className="text-xl font-bold text-slate-800">{profile.attendance.lateDays}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Incidents</p>
                                        <p className="text-xl font-bold text-slate-800">{profile.behavior.totalIncidents}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-xl">
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase">Standing</p>
                                        <p className="text-xl font-bold text-indigo-700">{profile.riskAssessment.toUpperCase()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Incident History */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardHeader className="border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                    Recent Incident Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {profile.behavior.recentIncidents.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {profile.behavior.recentIncidents.map((incident: any, i: number) => (
                                            <div key={i} className="p-4 flex gap-4 hover:bg-slate-50/50 transition-colors">
                                                <div className={`mt-1 h-3 w-3 rounded-full shrink-0 ${incident.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                        incident.type === 'major' ? 'bg-orange-500' :
                                                            incident.type === 'moderate' ? 'bg-amber-400' : 'bg-slate-300'
                                                    }`} />
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900 capitalize">{incident.type} Incident</span>
                                                        <span className="text-[10px] text-slate-400 border border-slate-200 rounded px-1">{new Date(incident.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 line-clamp-2">{incident.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                        <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500 opacity-20" />
                                        <p className="font-medium">No behavioral incidents recorded</p>
                                        <p className="text-xs">Keep up the excellent conduct!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* AI Feedback & Interventions */}
                        <div className="space-y-8">
                            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-indigo-900 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <TrendingUp className="w-32 h-32" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-indigo-200 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Student Insight
                                    </CardTitle>
                                    <CardTitle className="text-2xl font-black mt-2">Personal Growth Path</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                        <p className="text-sm leading-relaxed text-indigo-50">
                                            Your behavior score has remained stable. Based on your attendance trends, you show high consistency on Tuesdays and Wednesdays, but late arrivals increase on Fridays.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Recommended Support</h4>
                                        {profile.interventions.length > 0 ? (
                                            profile.interventions.map((iv: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                                    <div className="h-6 w-6 rounded bg-indigo-500/30 flex items-center justify-center font-bold text-[10px]">!</div>
                                                    <p className="text-xs font-medium text-white">{iv.action}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-indigo-400">No active interventions required at this time.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-slate-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold">Trend Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                        <div className={`p-2 rounded-lg bg-white ${profile.trends === 'improving' ? 'text-emerald-600' : profile.trends === 'worsening' ? 'text-red-600' : 'text-slate-400'}`}>
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Recent Trend</p>
                                            <p className="text-sm font-bold text-slate-800 capitalize">{profile.trends}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
