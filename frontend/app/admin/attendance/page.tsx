"use client";

import { useEffect, useState } from "react";
import { academicAPI, attendanceAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Users, CheckCircle2, XCircle, Clock, Search, Filter } from "lucide-react";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { unwrapArray } from "@/lib/utils";

export default function AdminAttendancePage() {
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const classesRes: any = await academicAPI.getClasses();
            const classesData = unwrapArray(classesRes?.data, "classes");
            setClasses(classesData);
            if (classesData.length > 0) {
                setSelectedClass(classesData[0]._id);
            }
        } catch (error) {
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            // This endpoint might need to be adjusted based on actual backend implementation
            const res: any = await attendanceAPI.getAttendance(selectedClass, selectedDate);
            setAttendanceData(unwrapArray(res?.data, "attendance"));
        } catch (error) {
            toast.error("No attendance records found for this date");
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClass) fetchAttendance();
    }, [selectedClass, selectedDate]);

    if (loading && classes.length === 0) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const present = attendanceData.filter(a => a.status === 'present').length
    const absent = attendanceData.filter(a => a.status === 'absent').length

    return (
        <AdminPageLayout
            title="Attendance"
            description="Record and review student attendance"
            actions={<Button>Mark Attendance</Button>}
            stats={(
                <>
                    <SummaryStatCard title="Present" value={present} icon={<CheckCircle2 className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Absent" value={absent} icon={<XCircle className="h-4 w-4 text-white" />} variant="orange" />
                    <SummaryStatCard title="Total Enrolled" value={attendanceData.length || 0} icon={<Users className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Date" value={selectedDate} icon={<Calendar className="h-4 w-4 text-white" />} variant="purple" />
                </>
            )}
        >
            <div>
                <div className="rounded-md border bg-white overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Filter by student name..." className="pl-9 h-9 rounded-lg border-slate-200" />
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg h-9">
                            <Icon name="lucide:download" className="h-4 w-4 mr-2" /> Export Report
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600 px-6 py-4 underline decoration-slate-200 underline-offset-4">Student Name</TableHead>
                                <TableHead className="font-bold text-slate-600 px-6 py-4 underline decoration-slate-200 underline-offset-4">Status</TableHead>
                                <TableHead className="font-bold text-slate-600 px-6 py-4 underline decoration-slate-200 underline-offset-4">Check-in Time</TableHead>
                                <TableHead className="font-bold text-slate-600 px-6 py-4 underline decoration-slate-200 underline-offset-4">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData.length > 0 ? (
                                attendanceData.map((record, i) => (
                                    <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="px-6 py-4 font-medium text-slate-900">{record.student?.name}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge className={
                                                record.status === 'present' ? "bg-green-100 text-green-700" :
                                                    record.status === 'absent' ? "bg-red-100 text-red-700" :
                                                        "bg-amber-100 text-amber-700"
                                            }>
                                                {record.status?.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-500 flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {record.checkInTime || "08:00 AM"}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-400 italic text-sm">
                                            {record.remarks || "No remarks"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-3 rounded-full bg-slate-50">
                                                <Calendar className="h-8 w-8 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-medium tracking-tight uppercase text-xs">No attendance data for this selection</p>
                                            <Button variant="link" className="text-indigo-600" onClick={fetchAttendance}>
                                                Try re-fetching records
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-center pb-12">
                    <p className="text-slate-400 text-xs text-center border-t border-slate-100 pt-6 px-12 leading-relaxed">
                        Attendance records are automatically synchronized from teacher portal activity.<br />
                        Manual overrides by admins are logged for auditing purposes.
                    </p>
                </div>
            </div>
        </AdminPageLayout>
    );
}
