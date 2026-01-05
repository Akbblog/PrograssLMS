"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    Loader2,
    ArrowLeft,
    GraduationCap,
    Users,
    BookOpen,
    Save,
    Trash2,
    UserPlus,
    Plus,
    X
} from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

interface ClassLevel {
    _id: string;
    name: string;
    description?: string;
    capacity?: number;
    students?: any[];
    subjects?: any[];
    teachers?: any[];
    createdAt?: string;
}

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    const [classData, setClassData] = useState<ClassLevel | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [allSubjects, setAllSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        capacity: ""
    });

    const fetchClassData = useCallback(async () => {
        try {
            // Fetch class data
            const res: any = await academicAPI.getClass(classId);
            const data = res.data || res;
            setClassData(data);
            setFormData({
                name: data.name || "",
                description: data.description || "",
                capacity: data.capacity?.toString() || ""
            });

            // Fetch students by class level
            try {
                const studentsRes: any = await academicAPI.getStudentsByClass(classId);
                const studentsData = studentsRes?.data;
                setStudents(Array.isArray(studentsData) ? studentsData : (studentsData?.students || []));
            } catch {
                setStudents(data.students || []);
            }

            // Fetch subjects by class level
            try {
                const subjectsRes: any = await academicAPI.getSubjectsByClass(classId);
                const subjectsData = subjectsRes?.data;
                setSubjects(Array.isArray(subjectsData) ? subjectsData : (subjectsData?.subjects || []));
            } catch {
                setSubjects(data.subjects || []);
            }

            // Fetch teachers by class level
            try {
                const teachersRes: any = await academicAPI.getTeachersByClass(classId);
                const teachersData = teachersRes?.data;
                setTeachers(Array.isArray(teachersData) ? teachersData : (teachersData?.teachers || []));
            } catch {
                setTeachers(data.teachers || []);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load class data");
            router.push("/admin/academic");
        } finally {
            setLoading(false);
        }
    }, [classId, router]);

    // Fetch all available subjects in the school
    const fetchAllSubjects = useCallback(async () => {
        try {
            const res: any = await academicAPI.getSubjects();
            setAllSubjects(unwrapArray(res?.data, "subjects"));
        } catch {
            setAllSubjects([]);
        }
    }, []);

    useEffect(() => {
        if (classId) {
            fetchClassData();
            fetchAllSubjects();
        }
    }, [classId, fetchClassData, fetchAllSubjects]);

    // Assign a subject to this class
    const handleAssignSubject = async (subjectId: string) => {
        try {
            await academicAPI.assignSubjectToClass(classId, subjectId);
            toast.success("Subject assigned to class");
            setAssignDialogOpen(false);
            fetchClassData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to assign subject");
        }
    };

    // Remove a subject from this class
    const handleRemoveSubject = async (subjectId: string) => {
        if (!confirm("Remove this subject from the class?")) return;
        try {
            await academicAPI.removeSubjectFromClass(classId, subjectId);
            toast.success("Subject removed from class");
            fetchClassData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to remove subject");
        }
    };

    // Get unassigned subjects (subjects not already in this class)
    const unassignedSubjects = allSubjects.filter(
        (s) => !subjects.some((assigned) => assigned._id === s._id)
    );

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Class name is required");
            return;
        }
        setSaving(true);
        try {
            await academicAPI.updateClass(classId, {
                name: formData.name,
                description: formData.description,
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined
            });
            toast.success("Class updated successfully");
            fetchClassData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to update class");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
        try {
            await academicAPI.deleteClass(classId);
            toast.success("Class deleted successfully");
            router.push("/admin/academic");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete class");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading class data...</p>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <GraduationCap className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Class not found</h2>
                <p className="text-slate-500 mb-4">The class you're looking for doesn't exist.</p>
                <Button asChild>
                    <Link href="/admin/academic">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academic
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/academic">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{classData.name}</h1>
                            <p className="text-slate-500">Class Details & Management</p>
                        </div>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Class
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Students</p>
                                <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Subjects</p>
                                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Capacity</p>
                                <p className="text-2xl font-bold text-slate-900">{classData.capacity || "Unlimited"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full max-w-xl grid-cols-4 h-auto p-1 bg-slate-100">
                    <TabsTrigger value="details" className="py-2">Details</TabsTrigger>
                    <TabsTrigger value="students" className="py-2">Students ({students.length})</TabsTrigger>
                    <TabsTrigger value="subjects" className="py-2">Subjects ({subjects.length})</TabsTrigger>
                    <TabsTrigger value="teachers" className="py-2">Teachers ({teachers.length})</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="border-b bg-slate-50/50">
                            <CardTitle>Class Information</CardTitle>
                            <CardDescription>Update class details</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        Class Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        required
                                        placeholder="e.g. Grade 10, Class 5A"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Capacity</Label>
                                    <Input
                                        type="number"
                                        placeholder="Maximum number of students"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Optional description for the class"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Students in {classData.name}
                                </CardTitle>
                                <CardDescription>Students enrolled in this class</CardDescription>
                            </div>
                            <Button size="sm" asChild>
                                <Link href="/admin/students">
                                    <UserPlus className="mr-2 h-4 w-4" /> Manage Students
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {students.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Students</h3>
                                    <p className="text-slate-500">No students are enrolled in this class yet</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((student: any) => (
                                            <TableRow key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell className="text-slate-500 dark:text-slate-400">{student.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="success">
                                                        {student.enrollmentStatus || 'Active'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                    Subjects for {classData.name}
                                </CardTitle>
                                <CardDescription>Subjects taught in this class</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setAssignDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="mr-2 h-4 w-4" /> Assign Subject
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {subjects.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Subjects</h3>
                                    <p className="text-slate-500">No subjects are assigned to this class yet</p>
                                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => setAssignDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" /> Assign a Subject
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Teacher</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subjects.map((subject: any) => (
                                            <TableRow key={subject._id} className="hover:bg-slate-50">
                                                <TableCell className="font-medium">{subject.name}</TableCell>
                                                <TableCell className="text-slate-500">{subject.teacher?.name || "Not assigned"}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveSubject(subject._id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Teachers Tab */}
                <TabsContent value="teachers" className="mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-green-600" />
                                    Teachers for {classData.name}
                                </CardTitle>
                                <CardDescription>Teachers assigned to this class</CardDescription>
                            </div>
                            <Button size="sm" asChild>
                                <Link href="/admin/teachers">
                                    <UserPlus className="mr-2 h-4 w-4" /> Manage Teachers
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {teachers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Teachers</h3>
                                    <p className="text-slate-500">No teachers are assigned to this class yet</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Subject</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachers.map((teacher: any) => (
                                            <TableRow key={teacher._id} className="hover:bg-slate-50">
                                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                                <TableCell className="text-slate-500">{teacher.email}</TableCell>
                                                <TableCell>
                                                    <Badge className="bg-purple-100 text-purple-700">
                                                        {teacher.subject?.name || "No subject"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Assign Subject Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Assign Subject to {classData?.name}</DialogTitle>
                        <DialogDescription>
                            Select a subject to assign to this class
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {unassignedSubjects.length === 0 ? (
                            <div className="text-center py-6">
                                <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No available subjects to assign</p>
                                <p className="text-sm text-slate-400 mt-1">Create subjects first in Academic → Subjects</p>
                                <Button className="mt-4" variant="outline" asChild>
                                    <Link href="/admin/academic">Go to Academic</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {unassignedSubjects.map((subject: any) => (
                                    <div
                                        key={subject._id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">{subject.name}</p>
                                            <p className="text-sm text-slate-500">
                                                {subject.teacher?.name || "No teacher assigned"}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAssignSubject(subject._id)}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Assign
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
