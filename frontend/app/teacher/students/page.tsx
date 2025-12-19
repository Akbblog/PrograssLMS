"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { academicAPI, attendanceAPI, gradeAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function TeacherStudentsPage() {
    const user = useAuthStore((state) => state.user);
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [loading, setLoading] = useState(true);
    const [studentStats, setStudentStats] = useState<any>({});

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const response = await academicAPI.getClasses();
            setClasses((response as any).data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await academicAPI.getStudentsByClass(selectedClass);
            const studentList = (response as any).data || [];
            setStudents(studentList);

            // Fetch stats for each student
            const stats: any = {};
            for (const student of studentList) {
                try {
                    const [attendanceRes, gradesRes] = await Promise.all([
                        attendanceAPI.getStudentAttendance(student._id),
                        gradeAPI.getStudentGrades(student._id),
                    ]);

                    const attendance = (attendanceRes as any).data || [];
                    const gradesData = (gradesRes as any).data;

                    stats[student._id] = {
                        attendanceRate: attendance.length > 0
                            ? ((attendance.filter((a: any) => a.status === "present").length / attendance.length) * 100).toFixed(0)
                            : "N/A",
                        averageGrade: gradesData?.average || "N/A",
                    };
                } catch (err) {
                    stats[student._id] = {
                        attendanceRate: "N/A",
                        averageGrade: "N/A",
                    };
                }
            }
            setStudentStats(stats);
        } catch (error: any) {
            toast.error(error.message || "Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !selectedClass) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <p className="text-muted-foreground">View your class rosters and student performance</p>
            </div>

            {/* Class Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Class</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 w-full max-w-md">
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls: any) => (
                                    <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Student List */}
            {selectedClass ? (
                <>
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{students.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {students.length > 0
                                        ? Math.round(
                                            Object.values(studentStats)
                                                .filter((s: any) => s.attendanceRate !== "N/A")
                                                .reduce((sum: number, s: any) => sum + parseFloat(s.attendanceRate), 0) /
                                            Object.values(studentStats).filter((s: any) => s.attendanceRate !== "N/A").length
                                        ) || "N/A"
                                        : "N/A"}%
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {students.length > 0
                                        ? (
                                            Object.values(studentStats)
                                                .filter((s: any) => s.averageGrade !== "N/A")
                                                .reduce((sum: number, s: any) => sum + parseFloat(s.averageGrade), 0) /
                                            Object.values(studentStats).filter((s: any) => s.averageGrade !== "N/A").length
                                        ).toFixed(1) || "N/A"
                                        : "N/A"}%
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            {loading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : students.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-lg font-medium">No students in this class</p>
                                    <p className="text-sm text-muted-foreground">Students will appear here once enrolled</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Attendance Rate</TableHead>
                                            <TableHead>Average Grade</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((student: any) => {
                                            const stats = studentStats[student._id] || {};
                                            return (
                                                <TableRow key={student._id}>
                                                    <TableCell className="font-medium">{student.studentId || "N/A"}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.email}</TableCell>
                                                    <TableCell>
                                                        <span className={`font-medium ${stats.attendanceRate !== "N/A" && parseFloat(stats.attendanceRate) >= 80
                                                                ? "text-green-600"
                                                                : stats.attendanceRate !== "N/A" && parseFloat(stats.attendanceRate) >= 60
                                                                    ? "text-yellow-600"
                                                                    : "text-red-600"
                                                            }`}>
                                                            {stats.attendanceRate === "N/A" ? "N/A" : `${stats.attendanceRate}%`}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-medium ${stats.averageGrade !== "N/A" && parseFloat(stats.averageGrade) >= 80
                                                                ? "text-green-600"
                                                                : stats.averageGrade !== "N/A" && parseFloat(stats.averageGrade) >= 60
                                                                    ? "text-yellow-600"
                                                                    : "text-red-600"
                                                            }`}>
                                                            {stats.averageGrade === "N/A" ? "N/A" : `${stats.averageGrade}%`}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {student.isWithdrawn ? (
                                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Withdrawn</span>
                                                        ) : student.isSuspended ? (
                                                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Suspended</span>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Select a class</p>
                        <p className="text-sm text-muted-foreground">Choose a class above to view students</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
