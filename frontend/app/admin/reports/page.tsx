"use client";

import { useEffect, useState } from "react";
import { adminAPI, academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, FileText, Download, Users, BookOpen, DollarSign } from "lucide-react";
import GraduationCap from "@/components/icons/GraduationCap";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalRevenue: 0
    });
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState("overview");

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [statsRes, studentsRes, teachersRes, classesRes] = await Promise.all([
                adminAPI.getDashboardStats(),
                adminAPI.getStudents(),
                adminAPI.getTeachers(),
                academicAPI.getClasses()
            ]);

            setStats((statsRes as any).data || { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalRevenue: 0 });
            setStudents((studentsRes as any).data || []);
            setTeachers((teachersRes as any).data || []);
            setClasses((classesRes as any).data || []);
        } catch (error) {
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    const handleExportReport = () => {
        // Basic CSV export
        let csvContent = "";
        let filename = "";

        if (selectedReport === "students") {
            csvContent = "Name,Email,Class,Status\n";
            students.forEach(s => {
                csvContent += `"${s.name}","${s.email}","${s.currentClassLevel?.name || 'N/A'}","${s.isWithdrawn ? 'Withdrawn' : 'Active'}"\n`;
            });
            filename = "students_report.csv";
        } else if (selectedReport === "teachers") {
            csvContent = "Name,Email,Subject,Status\n";
            teachers.forEach(t => {
                csvContent += `"${t.name}","${t.email}","${t.subject?.name || 'N/A'}","${t.isWithdrawn ? 'Inactive' : 'Active'}"\n`;
            });
            filename = "teachers_report.csv";
        } else {
            csvContent = "Metric,Value\n";
            csvContent += `"Total Students","${stats.totalStudents}"\n`;
            csvContent += `"Total Teachers","${stats.totalTeachers}"\n`;
            csvContent += `"Total Classes","${stats.totalClasses}"\n`;
            csvContent += `"Total Revenue","${stats.totalRevenue}"\n`;
            filename = "overview_report.csv";
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        toast.success("Report downloaded successfully");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">View and export school reports</p>
                </div>
                <div className="flex gap-4">
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Report" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="overview">Overview</SelectItem>
                            <SelectItem value="students">Students</SelectItem>
                            <SelectItem value="teachers">Teachers</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-indigo-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClasses}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {selectedReport === "overview" && "Overview Report"}
                        {selectedReport === "students" && "Students Report"}
                        {selectedReport === "teachers" && "Teachers Report"}
                    </CardTitle>
                    <CardDescription>
                        {selectedReport === "overview" && "Summary of all school metrics"}
                        {selectedReport === "students" && `${students.length} students in total`}
                        {selectedReport === "teachers" && `${teachers.length} teachers in total`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {selectedReport === "overview" && (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Student Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {classes.map((cls: any) => (
                                                <div key={cls._id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                                    <span className="text-sm font-medium">{cls.name}</span>
                                                    <span className="text-sm text-muted-foreground">{cls.students?.length || 0} students</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Quick Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                                <span className="text-sm font-medium">Active Students</span>
                                                <span className="text-sm text-green-600">{students.filter(s => !s.isWithdrawn).length}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                                <span className="text-sm font-medium">Withdrawn Students</span>
                                                <span className="text-sm text-red-600">{students.filter(s => s.isWithdrawn).length}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                                <span className="text-sm font-medium">Active Teachers</span>
                                                <span className="text-sm text-green-600">{teachers.filter(t => !t.isWithdrawn).length}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {selectedReport === "students" && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student: any) => (
                                    <TableRow key={student._id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.currentClassLevel?.name || "N/A"}</TableCell>
                                        <TableCell>
                                            {student.isWithdrawn ? (
                                                <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Withdrawn</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {selectedReport === "teachers" && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher: any) => (
                                    <TableRow key={teacher._id}>
                                        <TableCell className="font-medium">{teacher.name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.subject?.name || "N/A"}</TableCell>
                                        <TableCell>
                                            {teacher.isWithdrawn ? (
                                                <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Inactive</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
