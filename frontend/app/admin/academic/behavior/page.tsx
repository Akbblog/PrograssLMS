"use client"

import { useState, useEffect } from "react"
import { behaviorAPI, academicAPI } from "@/lib/api/endpoints"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ShieldAlert, TrendingUp, Users, AlertTriangle, ChevronRight, FileText, PieChart } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminBehaviorDashboard() {
    const [years, setYears] = useState<any[]>([])
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [alerts, setAlerts] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        fetchInitialData()
    }, [])

    useEffect(() => {
        if (selectedYear) {
            fetchBehaviorData()
        }
    }, [selectedYear])

    const fetchInitialData = async () => {
        try {
            const yearsRes = await academicAPI.getAcademicYears()
            setYears(yearsRes.data)
            if (yearsRes.data.length > 0) {
                const active = yearsRes.data.find((y: any) => y.status === "active") || yearsRes.data[0]
                setSelectedYear(active._id)
            }
        } catch (error) {
            toast.error("Failed to load academic years")
        } finally {
            setLoading(false)
        }
    }

    const fetchBehaviorData = async () => {
        try {
            const [alertsRes] = await Promise.all([
                behaviorAPI.getAlerts(selectedYear)
            ])
            setAlerts(alertsRes.data)
        } catch (error) {
            console.error(error)
        }
    }

    const getStatusColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200'
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    )

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">School Behavior Intelligence</h1>
                    <p className="text-slate-500 mt-1 text-lg">Comprehensive analytics for student discipline and institutional safety.</p>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[200px] bg-white border-slate-200 shadow-sm">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="h-1 bg-red-500 w-full" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Critical Alerts</CardTitle>
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{alerts.filter(a => a.severity === 'high').length}</div>
                        <p className="text-xs text-red-600 font-medium mt-2 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Immediate attention required
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="h-1 bg-indigo-500 w-full" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Moderate Concerns</CardTitle>
                        <AlertTriangle className="w-5 h-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{alerts.filter(a => a.severity === 'medium').length}</div>
                        <p className="text-xs text-slate-500 mt-2">Students at risk of escalation</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="h-1 bg-emerald-500 w-full" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Safety Index</CardTitle>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">92%</div>
                        <Progress value={92} className="h-1.5 mt-3 bg-slate-100" />
                        <p className="text-xs text-emerald-600 font-medium mt-2">Overall school discipline score</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="h-1 bg-amber-500 w-full" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Active Interventions</CardTitle>
                        <Users className="w-5 h-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">14</div>
                        <p className="text-xs text-amber-600 font-medium mt-2 flex items-center">
                            Ongoing behavioral support plans
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* At-Risk Students List */}
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Priority Attendance & Behavior Alerts</CardTitle>
                                <CardDescription>System-generated flags targeting threshold violations.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <FileText className="w-4 h-4 mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="w-[200px]">Student Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Severity</TableHead>
                                        <TableHead className="hidden md:table-cell">Trigger Factors</TableHead>
                                        <TableHead>Action Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts.map((alert, i) => (
                                        <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-semibold text-slate-900">{alert.student}</TableCell>
                                            <TableCell className="text-slate-600">{alert.class}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(alert.severity)}>
                                                    {alert.severity.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {alert.reasons.map((r: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                            {r.split(':')[0]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-medium text-amber-600">Review Pending</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                    Details <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories & Insights */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <PieChart className="w-5 h-5 mr-2 text-indigo-500" />
                                Incident Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { name: "Academic Integrity", count: 12, color: "bg-indigo-500" },
                                { name: "Interpersonal Safety", count: 8, color: "bg-red-500" },
                                { name: "School Property", count: 5, color: "bg-amber-500" },
                                { name: "Attendance Issues", count: 24, color: "bg-emerald-500" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600 font-medium">{item.name}</span>
                                        <span className="font-bold text-slate-900">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${(item.count / 49) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">AI Safety Insight</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                Our predictive model identifies a **12% increase** in behavioral incidents during exam periods.
                                We recommend scheduling a teacher mindfulness workshop to reduce student stress levels.
                            </p>
                            <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50 border-none">
                                View Full Analysis
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
