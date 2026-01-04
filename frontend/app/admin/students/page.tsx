"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminAPI, enrollmentAPI, academicAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
    Plus,
    Users,
    BookOpen,
    Pencil,
    Trash2,
    Eye,
    GraduationCap,
    Search,
    MoreVertical,
    ChevronDown,
    UserPlus,
    AlertCircle,
    CheckCircle2,
    LayoutGrid,
    Table2,
    Mail,
    Phone,
    Hash
} from "lucide-react";
import { toast } from "sonner";

// Native Select
function NativeSelect({ value, onValueChange, placeholder, options, required = false }: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    required?: boolean;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                required={required}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
    );
}

// Action Menu
function ActionMenu({ onView, onEdit, onEnroll, onDelete }: {
    onView: () => void;
    onEdit: () => void;
    onEnroll: () => void;
    onDelete: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
                <MoreVertical className="h-4 w-4" />
            </Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-50 py-1">
                        <button className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onView(); setIsOpen(false); }}>
                            <Eye className="mr-2 h-4 w-4 text-slate-400" /> View
                        </button>
                        <button className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onEdit(); setIsOpen(false); }}>
                            <Pencil className="mr-2 h-4 w-4 text-slate-400" /> Edit
                        </button>
                        <button className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => { onEnroll(); setIsOpen(false); }}>
                            <BookOpen className="mr-2 h-4 w-4 text-slate-400" /> Enroll
                        </button>
                        <hr className="my-1" />
                        <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => { onDelete(); setIsOpen(false); }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Student Card
function StudentCard({ student, onView, onEdit, onEnroll, onDelete }: {
    student: any;
    onView: () => void;
    onEdit: () => void;
    onEnroll: () => void;
    onDelete: () => void;
}) {
    const getStatusBadge = () => {
        if (student.isWithdrawn) return <Badge variant="destructive">Withdrawn</Badge>;
        if (student.isSuspended) return <Badge variant="warning">Suspended</Badge>;
        return <Badge variant="success">Active</Badge>;
    };

    const getClassName = () => {
        return student.currentClassLevel?.name || student.currentClassLevels?.[0]?.name || null;
    };

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onView}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {student.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-medium text-slate-900 dark:text-white truncate">{student.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{student.email}</p>
                        </div>
                    </div>
                    <ActionMenu onView={onView} onEdit={onEdit} onEnroll={onEnroll} onDelete={onDelete} />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {student.studentId && (
                        <Badge variant="outline" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {student.studentId}
                        </Badge>
                    )}
                    {getClassName() && (
                        <Badge variant="secondary" className="text-xs">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {getClassName()}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    {getStatusBadge()}
                    {student.phone && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {student.phone}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminStudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [enrollmentDialog, setEnrollmentDialog] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<any>(null);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentForm, setEnrollmentForm] = useState({ subject: "", classLevel: "", academicYear: "", academicTerm: "" });

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { filterStudents(); }, [searchQuery, statusFilter, students]);

    const fetchData = async () => {
        try {
            const [studentsRes, subjectsRes, classesRes, yearsRes, termsRes] = await Promise.all([
                adminAPI.getStudents(),
                academicAPI.getSubjects(),
                academicAPI.getClasses(),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);

            // Handle both paginated and non-paginated responses
            const studentsData = (studentsRes as any).data;
            const studentsList = studentsData && studentsData.students ? studentsData.students : (studentsData || []);
            setStudents(studentsList);
            setSubjects((subjectsRes as any).data || []);
            setClasses((classesRes as any).data || []);
            setYears((yearsRes as any).data || []);
            setTerms((termsRes as any).data || []);

            const currentYear = ((yearsRes as any).data || []).find((y: any) => y.isCurrent);
            if (currentYear) setEnrollmentForm(prev => ({ ...prev, academicYear: currentYear._id }));
        } catch (error: any) {
            toast.error(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const filterStudents = () => {
        let filtered = [...students];
        if (statusFilter === "active") filtered = filtered.filter(s => !s.isWithdrawn && !s.isSuspended);
        else if (statusFilter === "suspended") filtered = filtered.filter(s => s.isSuspended);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q));
        }
        setFilteredStudents(filtered);
    };

    const handleEnrollStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!enrollmentDialog || !enrollmentForm.subject || !enrollmentForm.classLevel || !enrollmentForm.academicYear || !enrollmentForm.academicTerm) {
            toast.error("Please fill all required fields");
            return;
        }
        setEnrolling(true);
        try {
            await enrollmentAPI.createEnrollment({ student: enrollmentDialog._id, ...enrollmentForm });
            toast.success("Student enrolled successfully!");
            setEnrollmentDialog(null);
            setEnrollmentForm({ subject: "", classLevel: "", academicYear: enrollmentForm.academicYear, academicTerm: "" });
        } catch (error: any) {
            toast.error(error.message || "Failed to enroll student");
        } finally {
            setEnrolling(false);
        }
    };

    const handleDelete = (student: any) => { setStudentToDelete(student); setDeleteDialogOpen(true); };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await adminAPI.deleteStudent(studentToDelete._id);
            toast.success("Student deleted");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        } finally {
            setDeleteDialogOpen(false);
            setStudentToDelete(null);
        }
    };

    const getStatusBadge = (student: any) => {
        if (student.isWithdrawn) return <Badge variant="destructive">Withdrawn</Badge>;
        if (student.isSuspended) return <Badge variant="warning">Suspended</Badge>;
        return <Badge variant="success">Active</Badge>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const total = students.length
    const active = students.filter(s => !s.isWithdrawn && !s.isSuspended).length
    const suspended = students.filter(s => s.isSuspended).length
    const classesCount = classes.length

    return (
        <AdminPageLayout
            title="Students"
            description="Manage student registrations"
            actions={
                <Button asChild>
                    <Link href="/admin/students/create">
                        <UserPlus className="mr-2 h-4 w-4" /> Register Student
                    </Link>
                </Button>
            }
            stats={(
                <>
                    <SummaryStatCard title="Total" value={total} icon={<Users className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Active" value={active} icon={<CheckCircle2 className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Suspended" value={suspended} icon={<AlertCircle className="h-4 w-4 text-white" />} variant="orange" />
                    <SummaryStatCard title="Classes" value={classesCount} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="purple" />
                </>
            )}
        >

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {["all", "active", "suspended"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f as any)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-all capitalize ${statusFilter === f ? "bg-white dark:bg-slate-700 text-primary shadow-sm font-medium" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button onClick={() => setViewMode("card")} className={`p-2 rounded-md transition-all ${viewMode === "card" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-600 dark:text-slate-400"}`} title="Card view">
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button onClick={() => setViewMode("table")} className={`p-2 rounded-md transition-all ${viewMode === "table" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-600 dark:text-slate-400"}`} title="Table view">
                        <Table2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {filteredStudents.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700">No students found</h3>
                        <p className="text-slate-500 mt-1">{searchQuery ? "Try adjusting your search" : "Register your first student"}</p>
                        {!searchQuery && (
                            <Button asChild className="mt-4">
                                <Link href="/admin/students/create"><Plus className="mr-2 h-4 w-4" /> Register Student</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : viewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredStudents.map((student) => (
                        <StudentCard
                            key={student._id}
                            student={student}
                            onView={() => router.push(`/admin/students/${student._id}`)}
                            onEdit={() => router.push(`/admin/students/${student._id}/edit`)}
                            onEnroll={() => setEnrollmentDialog(student)}
                            onDelete={() => handleDelete(student)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Student</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 hidden md:table-cell">Student ID</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 hidden md:table-cell">Class</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Status</th>
                                    <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                                                        {student.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">{student.name}</p>
                                                    <p className="text-sm text-slate-500 truncate">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <code className="text-sm bg-slate-100 px-2 py-0.5 rounded">{student.studentId || "—"}</code>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-600">
                                            {student.currentClassLevel?.name || student.currentClassLevels?.[0]?.name || "—"}
                                        </td>
                                        <td className="px-4 py-3">{getStatusBadge(student)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <ActionMenu
                                                onView={() => router.push(`/admin/students/${student._id}`)}
                                                onEdit={() => router.push(`/admin/students/${student._id}/edit`)}
                                                onEnroll={() => setEnrollmentDialog(student)}
                                                onDelete={() => handleDelete(student)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <p className="text-sm text-slate-500 text-center">Showing {filteredStudents.length} of {students.length} students</p>

            {/* Enrollment Dialog */}
            <Dialog open={!!enrollmentDialog} onOpenChange={() => setEnrollmentDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Enroll in Course
                        </DialogTitle>
                        <DialogDescription>Enrolling <strong>{enrollmentDialog?.name}</strong></DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEnrollStudent} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Subject *</Label>
                            <NativeSelect value={enrollmentForm.subject} onValueChange={(v) => setEnrollmentForm({ ...enrollmentForm, subject: v })} placeholder="Select Subject" options={subjects.map((s: any) => ({ value: s._id, label: s.name }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Class Level *</Label>
                            <NativeSelect value={enrollmentForm.classLevel} onValueChange={(v) => setEnrollmentForm({ ...enrollmentForm, classLevel: v })} placeholder="Select Class" options={classes.map((c: any) => ({ value: c._id, label: c.name }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Academic Year *</Label>
                            <NativeSelect value={enrollmentForm.academicYear} onValueChange={(v) => setEnrollmentForm({ ...enrollmentForm, academicYear: v })} placeholder="Select Year" options={years.map((y: any) => ({ value: y._id, label: y.name }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Academic Term *</Label>
                            <NativeSelect value={enrollmentForm.academicTerm} onValueChange={(v) => setEnrollmentForm({ ...enrollmentForm, academicTerm: v })} placeholder="Select Term" options={terms.map((t: any) => ({ value: t._id, label: t.name }))} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={enrolling}>
                            {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enroll Student
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{studentToDelete?.name}</strong> and their data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
