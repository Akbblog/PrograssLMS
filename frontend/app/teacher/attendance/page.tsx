"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { attendanceAPI, academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

export default function TeacherAttendancePage() {
    const user = useAuthStore((state) => state.user);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [students, setStudents] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; remarks: string }>>({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Academic Context
    const [academicYear, setAcademicYear] = useState<string>("");
    const [academicTerm, setAcademicTerm] = useState<string>("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [classesRes, yearsRes, termsRes] = await Promise.all([
                academicAPI.getClasses(),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);

            setClasses(unwrapArray((classesRes as any)?.data, "classes"));

            // Set current year/term (logic to find current one)
            const years = unwrapArray((yearsRes as any)?.data, "years");
            const terms = unwrapArray((termsRes as any)?.data, "terms");
            const currentYear = years.find((y: any) => y.isCurrent) || years[0];
            const currentTerm = terms.find((t: any) => t.isCurrent) || terms[0]; // Assuming isCurrent flag exists or pick first

            if (currentYear) setAcademicYear(currentYear._id);
            if (currentTerm) setAcademicTerm(currentTerm._id);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            toast.error("Failed to load classes");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (selectedClass && date) {
            fetchStudentsAndAttendance();
        }
    }, [selectedClass, date]);

    const fetchStudentsAndAttendance = async () => {
        setLoading(true);
        try {
            // Fetch students for the class
            const studentsRes = await academicAPI.getStudentsByClass(selectedClass);
            const studentsList = unwrapArray((studentsRes as any)?.data, "students");
            setStudents(studentsList);

            // Fetch existing attendance for the date
            try {
                const attendanceRes = await attendanceAPI.getAttendance(selectedClass, date);
                const existingRecord = (attendanceRes as any).data;

                if (existingRecord) {
                    const recordMap: Record<string, any> = {};
                    existingRecord.records.forEach((r: any) => {
                        recordMap[r.student._id] = { status: r.status, remarks: r.remarks || "" };
                    });
                    setAttendanceData(recordMap);
                } else {
                    // Initialize default (Present)
                    const defaultMap: Record<string, any> = {};
                    studentsList.forEach((s: any) => {
                        defaultMap[s._id] = { status: "present", remarks: "" };
                    });
                    setAttendanceData(defaultMap);
                }
            } catch (err) {
                // No attendance found, initialize default
                const defaultMap: Record<string, any> = {};
                studentsList.forEach((s: any) => {
                    defaultMap[s._id] = { status: "present", remarks: "" };
                });
                setAttendanceData(defaultMap);
            }

        } catch (error) {
            console.error("Failed to fetch students:", error);
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    };

    const handleRemarksChange = (studentId: string, remarks: string) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks },
        }));
    };

    const handleSubmit = async () => {
        if (!selectedClass || !academicYear || !academicTerm) {
            toast.error("Missing academic context");
            return;
        }

        try {
            const records = Object.entries(attendanceData).map(([studentId, data]) => ({
                student: studentId,
                status: data.status,
                remarks: data.remarks,
            }));

            await attendanceAPI.markAttendance({
                classLevel: selectedClass,
                academicYear,
                academicTerm,
                date,
                records,
            });

            toast.success("Attendance saved successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to save attendance");
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
                <Button onClick={handleSubmit} disabled={loading || !selectedClass}>
                    <Save className="mr-2 h-4 w-4" /> Save Attendance
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Class & Date Selection</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-end">
                    <div className="grid gap-2 w-full max-w-xs">
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls: any) => (
                                    <SelectItem key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2 w-full max-w-xs">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedClass && (
                <Card>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Remarks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                No students found in this class.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        students.map((student) => (
                                            <TableRow key={student._id}>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {["present", "absent", "late", "excused"].map((status) => (
                                                            <div key={status} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`${student._id}-${status}`}
                                                                    checked={attendanceData[student._id]?.status === status}
                                                                    onCheckedChange={() => handleStatusChange(student._id, status)}
                                                                />
                                                                <Label htmlFor={`${student._id}-${status}`} className="capitalize">
                                                                    {status}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        placeholder="Optional remarks"
                                                        value={attendanceData[student._id]?.remarks || ""}
                                                        onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
