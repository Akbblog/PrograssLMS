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
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import PageToolbar from '@/components/admin/PageToolbar'

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
            const studentsData = (studentsRes as any)?.data;
            const teachersData = (teachersRes as any)?.data;
            const classesData = (classesRes as any)?.data;

            setStudents(Array.isArray(studentsData) ? studentsData : (studentsData?.students || []));
            setTeachers(Array.isArray(teachersData) ? teachersData : (teachersData?.teachers || []));
            setClasses(Array.isArray(classesData) ? classesData : (classesData?.classes || []));
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
        <AdminPageLayout
            title="Reports"
            description="View and export school reports"
            actions={<div className="flex gap-2"><Select value={selectedReport} onValueChange={setSelectedReport}><SelectTrigger className="w-[200px]"><SelectValue placeholder="Select Report" /></SelectTrigger><SelectContent><SelectItem value="overview">Overview</SelectItem><SelectItem value="students">Students</SelectItem><SelectItem value="teachers">Teachers</SelectItem></SelectContent></Select><Button onClick={handleExportReport}><Download className="mr-2 h-4 w-4" /> Export CSV</Button></div>}
            stats={(
                <>
                    <SummaryStatCard title="Total Students" value={stats.totalStudents} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Total Teachers" value={stats.totalTeachers} icon={<Users className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="Total Classes" value={stats.totalClasses} icon={<BookOpen className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign className="h-4 w-4 text-white" />} variant="orange" />
                </>
            )}
        >
            <div>
                <PageToolbar onExport={handleExportReport} />
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> {selectedReport === "overview" ? 'Overview Report' : selectedReport === 'students' ? 'Students Report' : 'Teachers Report'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedReport === 'overview' && (
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
                                        <TableRow key={student._id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="font-medium py-4">{student.name}</TableCell>
                                            <TableCell className="py-4">{student.email}</TableCell>
                                            <TableCell className="py-4">{student.currentClassLevel?.name || "N/A"}</TableCell>
                                            <TableCell className="py-4">{student.isWithdrawn ? <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Withdrawn</span> : <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>}</TableCell>
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
                                        <TableRow key={teacher._id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="font-medium py-4">{teacher.name}</TableCell>
                                            <TableCell className="py-4">{teacher.email}</TableCell>
                                            <TableCell className="py-4">{teacher.subject?.name || "N/A"}</TableCell>
                                            <TableCell className="py-4">{teacher.isWithdrawn ? <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Inactive</span> : <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminPageLayout>
    );
}
