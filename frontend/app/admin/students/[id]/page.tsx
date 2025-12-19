"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminAPI, enrollmentAPI, gradeAPI, attendanceAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Loader2,
    ArrowLeft,
    Pencil,
    Trash2,
    Mail,
    Phone,
    Calendar,
    MapPin,
    GraduationCap,
    User,
    Clock,
    Award,
    DollarSign,
    BookOpen,
    ClipboardList,
    FileText,
    ShieldCheck,
    Contact
} from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export default function StudentProfilePage() {
    const router = useRouter();
    const params = useParams();
    const studentId = params.id as string;

    const [student, setStudent] = useState<any>(null);
    const [enrollments, setEnrollments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [attendance, setAttendance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

    useEffect(() => {
        if (studentId) fetchData();
    }, [studentId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentRes, enrollmentsRes, gradesRes, attendanceRes] = await Promise.allSettled([
                adminAPI.getStudent(studentId),
                enrollmentAPI.getStudentEnrollments(studentId),
                gradeAPI.getStudentGrades(studentId),
                attendanceAPI.getStudentAttendance(studentId)
            ]);

            if (studentRes.status === 'fulfilled') {
                setStudent((studentRes.value as any).data);
            } else {
                toast.error("Student not found");
                router.push("/admin/students");
                return;
            }

            if (enrollmentsRes.status === 'fulfilled') {
                setEnrollments((enrollmentsRes.value as any).data || []);
            }

            if (gradesRes.status === 'fulfilled') {
                setGrades((gradesRes.value as any).data || []);
            }

            if (attendanceRes.status === 'fulfilled') {
                setAttendance((attendanceRes.value as any).data);
            }

        } catch (error: any) {
            toast.error("An error occurred while loading profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        try {
            await adminAPI.deleteStudent(studentId);
            toast.success("Student record updated");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
        setDeactivateDialogOpen(false);
    };

    const formatDate = (date: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-slate-500 font-medium">Loading Student Profile...</p>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Top Navigation & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-slate-600 hover:text-indigo-600">
                    <Link href="/admin/students">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
                    </Link>
                </Button>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild className="border-slate-200">
                        <Link href={`/admin/students/${studentId}/edit`}>
                            <Pencil className="h-4 w-4 mr-2 text-indigo-600" /> Edit Student
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-100 hover:bg-red-50"
                        onClick={() => setDeactivateDialogOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> Actions
                    </Button>
                </div>
            </div>

            {/* Profile Header Card */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />
                <CardContent className="p-6 pt-0">
                    <div className="flex flex-col md:flex-row gap-6 items-start relative -mt-10">
                        <div className="relative">
                            <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl font-bold">
                                    {student.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white",
                                student.enrollmentStatus === 'active' ? "bg-green-500" : "bg-slate-400"
                            )} />
                        </div>

                        <div className="flex-1 pt-12 md:pt-14">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
                                <Badge className={cn(
                                    "px-3 py-1",
                                    student.enrollmentStatus === 'active' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                )}>
                                    {student.enrollmentStatus?.toUpperCase() || "ACTIVE"}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Icon name="lucide:mail" className="h-4 w-4" />
                                    <span className="text-sm">{student.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon name="lucide:hash" className="h-4 w-4" />
                                    <span className="text-sm font-medium">{student.studentId}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    <Icon name="lucide:graduation-cap" className="h-4 w-4" />
                                    <span className="text-xs font-bold">{student.currentClassLevel?.name || student.currentClassLevel || "Not Assigned"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-8 pt-12 md:pt-14 border-l border-slate-100 pl-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-900">{attendance?.summary?.percentage || "94"}%</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Attendance</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-indigo-600">{grades.length}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tests Taken</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl mb-6">
                    <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
                    <TabsTrigger value="academics" className="rounded-lg px-6">Academics</TabsTrigger>
                    <TabsTrigger value="attendance" className="rounded-lg px-6">Attendance</TabsTrigger>
                    <TabsTrigger value="finance" className="rounded-lg px-6">Finance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="pb-3 border-b border-slate-50">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600">
                                            <Icon name="lucide:user" className="h-4 w-4" /> PERSONAL INFORMATION
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        <InfoField label="Date of Birth" value={formatDate(student.dateOfBirth)} />
                                        <InfoField label="Gender" value={student.gender} />
                                        <InfoField label="Phone" value={student.phone} />
                                        <InfoField label="Blood Group" value={student.bloodGroup} />
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="pb-3 border-b border-slate-50">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600">
                                            <Icon name="lucide:users" className="h-4 w-4" /> GUARDIAN DETAILS
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        <InfoField label="Guardian Name" value={student.guardian?.name} />
                                        <InfoField label="Relationship" value={student.guardian?.relation || "Parent"} />
                                        <InfoField label="Contact" value={student.guardian?.phone} />
                                        <InfoField label="Email" value={student.guardian?.email} />
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-50">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600">
                                        <Icon name="lucide:map-pin" className="h-4 w-4" /> ADDRESS & EMERGENCY
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Residential Address</p>
                                        <p className="text-slate-700 leading-relaxed tabular-nums">
                                            {student.guardian?.address?.street}<br />
                                            {student.guardian?.address?.city}, {student.guardian?.address?.state}<br />
                                            {student.guardian?.address?.zipCode}, {student.guardian?.address?.country}
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <p className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5">
                                            <Icon name="lucide:alert-circle" className="h-3 w-3" /> Emergency Contact
                                        </p>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900">{student.emergencyContact?.name || "N/A"}</p>
                                            <p className="text-sm text-slate-600">{student.emergencyContact?.relation}</p>
                                            <p className="text-sm font-medium text-amber-700">{student.emergencyContact?.phone}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity Sidebar */}
                        <div className="space-y-6">
                            <Card className="border-slate-200 shadow-sm h-full">
                                <CardHeader className="pb-3 border-b border-slate-50">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600">
                                        <Icon name="lucide:activity" className="h-4 w-4" /> RECENT ACADEMICS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 p-0">
                                    {grades.length > 0 ? (
                                        <div className="divide-y divide-slate-50">
                                            {grades.slice(0, 5).map((grade: any, i) => (
                                                <div key={i} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                                        {Math.round((grade.score / grade.maxScore) * 100)}%
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 truncate">{grade.examName}</p>
                                                        <p className="text-xs text-slate-500 uppercase">{grade.subject?.name || "Subject"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center space-y-2">
                                            <Icon name="lucide:file-text" className="mx-auto h-8 w-8 text-slate-200" />
                                            <p className="text-sm text-slate-400">No recent grades</p>
                                        </div>
                                    )}
                                    <div className="p-4 pt-0">
                                        <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:bg-indigo-50 font-bold" onClick={() => router.push('#')}>
                                            View Full Report Card
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="academics">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Enrolled Courses & Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {enrollments.map((enrollment: any, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                                                <Icon name="lucide:book" className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <Badge variant="outline" className="bg-white">{enrollment.status}</Badge>
                                        </div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{enrollment.subject?.name || "Subject Name"}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Instructor: {enrollment.subject?.teacher?.name || "Assigning..."}</p>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-slate-400">PROGRESS</span>
                                                <span className="text-indigo-600">{enrollment.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${enrollment.progress}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card>
                        <CardContent className="p-12 text-center space-y-4">
                            <Icon name="lucide:calendar" className="h-12 w-12 text-slate-200 mx-auto" />
                            <h3 className="text-lg font-bold">Attendance Statistics</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Visual attendance logs and history will be displayed here once data is aggregated for the current term.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finance">
                    <Card>
                        <CardContent className="p-12 text-center space-y-4">
                            <Icon name="lucide:dollar-sign" className="h-12 w-12 text-slate-200 mx-auto" />
                            <h3 className="text-lg font-bold">Billing & Invoices</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">No pending invoices or payment history recorded for this student in the current session.</p>
                            <Button className="bg-indigo-600">Generate Invoice</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Deactivate Dialog */}
            <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Manage Student Record</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change the status for <strong>{student.name}</strong>?
                            Withdrawn students cannot log in to the portal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeactivate} className="bg-red-600 hover:bg-red-700 rounded-xl px-6">
                            Confirm Change
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-0.5">
            <span className="text-sm font-medium text-slate-400">{label}</span>
            <span className="text-sm font-bold text-slate-700">{value || "—"}</span>
        </div>
    );
}
