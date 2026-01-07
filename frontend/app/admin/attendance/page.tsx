"use client";

import { useEffect, useState } from "react";
import { useClasses } from '@/hooks/useClasses';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { useAttendanceByDate, useStudentsForAttendance, useMarkAttendance } from '@/hooks/useAttendance';
import { attendanceAPI } from '@/lib/api/endpoints';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Users, CheckCircle2, XCircle, Clock, Search, Filter, ArrowLeft } from "lucide-react";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { unwrapArray } from "@/lib/utils";

export default function AdminAttendancePage() {
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isMarkOpen, setIsMarkOpen] = useState(false);
    const [markLoading, setMarkLoading] = useState(false);

    // Modal student statuses
    const [studentStatuses, setStudentStatuses] = useState<Record<string, 'present' | 'absent'>>({});

    // Academic periods for modal
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
    const [selectedAcademicTerm, setSelectedAcademicTerm] = useState<string>("");

    // Use hooks
    const { data: classesRes, isLoading: classesLoading } = useClasses();
    const classes: any[] = (classesRes && (classesRes as any).data) ? unwrapArray((classesRes as any).data, 'classes') : unwrapArray(classesRes);

    const { data: yearsRes } = useAcademicYears();
    const academicYears: any[] = (yearsRes && (yearsRes as any).data)
        ? unwrapArray((yearsRes as any).data, 'years')
        : unwrapArray(yearsRes);

    const { data: termsRes } = useAcademicTerms();
    const academicTerms: any[] = (termsRes && (termsRes as any).data)
        ? unwrapArray((termsRes as any).data, 'terms')
        : unwrapArray(termsRes);

    const { data: attendanceRes, isLoading: attendanceLoading, refetch: refetchAttendance } = useAttendanceByDate(selectedClass, selectedDate, !!(selectedClass && selectedDate));
    const attendanceData: any[] = (attendanceRes && (attendanceRes as any).data)
        ? unwrapArray((attendanceRes as any).data, 'attendance')
        : unwrapArray(attendanceRes);

    const { data: studentsRes, isLoading: studentsLoading } = useStudentsForAttendance(selectedClass, !!selectedClass);
    const students: any[] = (studentsRes && (studentsRes as any).data)
        ? unwrapArray((studentsRes as any).data, 'students')
        : unwrapArray(studentsRes);

    const { mutateAsync: markAttendance } = useMarkAttendance();

    // Set defaults when dependencies load
    useEffect(() => {
        if (!selectedClass && classes.length > 0) setSelectedClass(classes[0]._id);
    }, [classes]);

    useEffect(() => {
        if (!selectedAcademicYear && academicYears.length > 0) {
            const currentYear = academicYears.find((y: any) => y.isCurrent);
            setSelectedAcademicYear(currentYear?._id || academicYears[0]._id);
        }
    }, [academicYears]);

    useEffect(() => {
        if (!selectedAcademicTerm && academicTerms.length > 0) {
            const currentTerm = academicTerms.find((t: any) => t.isCurrent);
            setSelectedAcademicTerm(currentTerm?._id || academicTerms[0]._id);
        }
    }, [academicTerms]);

    useEffect(() => {
        if (selectedClass && selectedDate) {
            // ensure query re-fetches when selection changes
            refetchAttendance();
        }
    }, [selectedClass, selectedDate]);

    const openMarkModal = async () => {
        if (!selectedClass) {
            toast.error("Please select a class first");
            return;
        }

        // Initialize statuses using existing attendance data and student list
        const initialStatuses: Record<string, 'present' | 'absent'> = {};
        students.forEach((s: any) => {
            const existing = attendanceData.find((a: any) => (a.student?._id === s._id || a.student === s._id));
            initialStatuses[s._id] = (existing?.status as 'present' | 'absent') || 'present';
        });
        setStudentStatuses(initialStatuses);

        setIsMarkOpen(true);
    }

    const handleMarkAllStudents = (status: 'present' | 'absent') => {
        const newStatuses: Record<string, 'present' | 'absent'> = {};
        students.forEach(s => {
            newStatuses[s._id] = status;
        });
        setStudentStatuses(newStatuses);
        toast.success(`Marked all students as ${status}`);
    }

    const handleStudentStatusChange = (studentId: string, status: 'present' | 'absent') => {
        setStudentStatuses(prev => ({ ...prev, [studentId]: status }));
    }

    const handleSaveStudentAttendance = async () => {
        if (!selectedClass) {
            toast.error("Please select a class");
            return;
        }
        if (!selectedAcademicYear) {
            toast.error("Please select an academic year");
            return;
        }
        if (!selectedAcademicTerm) {
            toast.error("Please select an academic term");
            return;
        }

        setMarkLoading(true);
        try {
            const records = Object.entries(studentStatuses).map(([studentId, status]) => ({
                student: studentId,
                status,
                remarks: "",
            }));

            await markAttendance({
                classLevel: selectedClass,
                date: new Date(selectedDate).toISOString(),
                academicYear: selectedAcademicYear,
                academicTerm: selectedAcademicTerm,
                records,
            });

            toast.success("Student attendance saved successfully!");
            // Refresh attendance view
            await refetchAttendance();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save attendance");
        } finally {
            setMarkLoading(false);
            setIsMarkOpen(false);
        }
    }

    if (classesLoading && classes.length === 0) {
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
            actions={<Button onClick={openMarkModal} className="bg-primary text-white">Mark Attendance</Button>}
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
                                            <Button variant="link" className="text-indigo-600" onClick={() => refetchAttendance()}>
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

                {/* Mark Attendance Dialog */}
                <Dialog open={isMarkOpen} onOpenChange={setIsMarkOpen}>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <DialogTitle>Mark Attendance</DialogTitle>
                                    <DialogDescription>Quickly mark attendance for a class and date</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label>Class</Label>
                                    <Select onValueChange={(v:any) => setSelectedClass(v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Select class" /></SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Academic Year</Label>
                                    <Select onValueChange={(v:any) => { /* keep existing selectedAcademicYear state */ setSelectedAcademicYear(v) }}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Select year" /></SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map(y => <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="p-4 border-b">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Students</CardTitle>
                                                <CardDescription>Toggle status for each student below</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleMarkAllStudents('present')}>Mark All Present</Button>
                                                <Button variant="outline" size="sm" onClick={() => handleMarkAllStudents('absent')}>Mark All Absent</Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        {studentsLoading && students.length === 0 ? (
                                            <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                                        ) : students.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No students for selected class.</p>
                                        ) : (
                                            <div className="grid gap-3">
                                                {students.map(s => (
                                                    <div key={s._id} className="flex items-center justify-between p-2 rounded-lg border">
                                                        <div>
                                                            <div className="font-medium">{s.name}</div>
                                                            <div className="text-xs text-muted-foreground">{s.rollNumber || s.studentId}</div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant={studentStatuses[s._id] === 'present' ? 'default' : 'ghost'} onClick={() => handleStudentStatusChange(s._id, 'present')}>Present</Button>
                                                            <Button size="sm" variant={studentStatuses[s._id] === 'absent' ? 'destructive' : 'ghost'} onClick={() => handleStudentStatusChange(s._id, 'absent')}>Absent</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsMarkOpen(false)}>Cancel</Button>
                            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" onClick={async () => {
                                setMarkLoading(true);
                                try {
                                    // reuse existing save handler
                                    await handleSaveStudentAttendance();
                                    setIsMarkOpen(false);
                                } finally { setMarkLoading(false); }
                            }} disabled={markLoading || !selectedClass}>
                                {markLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : 'Save Attendance'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}
