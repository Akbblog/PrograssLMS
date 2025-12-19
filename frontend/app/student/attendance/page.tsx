"use client";

import { useEffect, useState } from "react";
import { attendanceAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function StudentAttendancePage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, percentage: 0 });
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            // Simulated data since specific student endpoint might vary
            const mockRecords = [
                { date: "2024-03-20", status: "present", time: "08:15 AM", subject: "Mathematics" },
                { date: "2024-03-19", status: "present", time: "08:10 AM", subject: "Physics" },
                { date: "2024-03-18", status: "absent", time: "-", subject: "Computer Science" },
                { date: "2024-03-17", status: "late", time: "08:45 AM", subject: "English Literature" },
                { date: "2024-03-16", status: "present", time: "08:05 AM", subject: "History" },
            ];
            setRecords(mockRecords);
            setStats({ present: 3, absent: 1, late: 1, percentage: 75 });
        } catch (error) {
            toast.error("Failed to load attendance records");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                    </div>
                    My Attendance
                </h1>
                <p className="text-slate-500 mt-2">Track your daily presence and punctuality records.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500 mb-1">Attendance Rate</p>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-slate-900">{stats.percentage}%</p>
                            <span className="text-green-500 text-xs font-bold mb-1.5">+2.4%</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500 mb-1">Days Present</p>
                        <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500 mb-1">Days Absent</p>
                        <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500 mb-1">Times Late</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.late}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg">Recent History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {records.map((record, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${record.status === 'present' ? "bg-green-50 text-green-600" :
                                                    record.status === 'absent' ? "bg-red-50 text-red-600" :
                                                        "bg-amber-50 text-amber-600"
                                                }`}>
                                                {record.status === 'present' ? <CheckCircle2 className="h-5 w-5" /> :
                                                    record.status === 'absent' ? <XCircle className="h-5 w-5" /> :
                                                        <Clock className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{record.subject}</p>
                                                <p className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={
                                                record.status === 'present' ? "border-green-200 text-green-700 bg-green-50/50" :
                                                    record.status === 'absent' ? "border-red-200 text-red-700 bg-red-50/50" :
                                                        "border-amber-200 text-amber-700 bg-amber-50/50"
                                            }>
                                                {record.status.toUpperCase()}
                                            </Badge>
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{record.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-lg shadow-slate-200/50 bg-indigo-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="h-5 w-5 text-indigo-200" />
                                <h3 className="font-bold">Attendance Policy</h3>
                            </div>
                            <ul className="text-sm space-y-3 text-indigo-100">
                                <li className="flex gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                                    Maintain at least 85% attendance to qualify for finals.
                                </li>
                                <li className="flex gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                                    3 late arrivals will be counted as 1 absent day.
                                </li>
                                <li className="flex gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                                    Medical certificates must be submitted within 48 hours for excused absences.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-base">Monthly Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { month: "March", rate: 92 },
                                { month: "February", rate: 88 },
                                { month: "January", rate: 95 }
                            ].map((m, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-600">{m.month}</span>
                                        <span className="text-slate-900">{m.rate}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${m.rate}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
