"use client";

import { useEffect, useState, useCallback } from "react";
import { academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    Loader2,
    Plus,
    BookOpen,
    Calendar,
    Trash2,
    Edit,
    ChevronDown,
    Clock,
    School,
    RefreshCw,
    CheckCircle2
} from "lucide-react";
import GraduationCap from "@/components/icons/GraduationCap";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

// Types
interface ClassLevel {
    _id: string;
    name: string;
    description?: string;
    capacity?: number;
    students?: string[];
}

interface Subject {
    _id: string;
    name: string;
    description?: string;
    code?: string;
    teacher?: { name: string };
}

interface Program {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
    subjects?: string[];
}

interface AcademicYear {
    _id: string;
    name: string;
    fromYear: string;
    toYear: string;
    isCurrent: boolean;
}

interface AcademicTerm {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
}

// Native Select component
function NativeSelect({
    value,
    onValueChange,
    placeholder,
    options,
    disabled = false
}: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                disabled={disabled}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
    );
}

export default function AdminAcademicPage() {
    // Data states
    const [classes, setClasses] = useState<ClassLevel[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [terms, setTerms] = useState<AcademicTerm[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Dialog states
    const [classDialogOpen, setClassDialogOpen] = useState(false);
    const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
    const [yearDialogOpen, setYearDialogOpen] = useState(false);
    const [termDialogOpen, setTermDialogOpen] = useState(false);
    const [programDialogOpen, setProgramDialogOpen] = useState(false);

    // Edit states
    const [editingClass, setEditingClass] = useState<ClassLevel | null>(null);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    const [editingTerm, setEditingTerm] = useState<AcademicTerm | null>(null);

    // Form states
    const [classForm, setClassForm] = useState({ name: "", description: "", capacity: "" });
    const [subjectForm, setSubjectForm] = useState({ name: "", description: "", code: "" });
    const [yearForm, setYearForm] = useState({ name: "", fromYear: "", toYear: "", isCurrent: false });
    const [termForm, setTermForm] = useState({ name: "", description: "", duration: "", startDate: "", endDate: "" });
    const [programForm, setProgramForm] = useState({ name: "", description: "", duration: "" });

    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("classes");

    const fetchData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const [classesRes, subjectsRes, programsRes, yearsRes, termsRes] = await Promise.all([
                academicAPI.getClasses(),
                academicAPI.getSubjects(),
                academicAPI.getPrograms().catch(() => ({ data: [] })),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);

            setClasses(unwrapArray((classesRes as any)?.data, "classes"));
            setSubjects(unwrapArray((subjectsRes as any)?.data, "subjects"));
            setPrograms(unwrapArray((programsRes as any)?.data, "programs"));
            setYears(unwrapArray((yearsRes as any)?.data, "years"));
            setTerms(unwrapArray((termsRes as any)?.data, "terms"));
            if (showRefresh) toast.success("Data refreshed successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to load data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset forms
    const resetClassForm = () => {
        setClassForm({ name: "", description: "", capacity: "" });
        setEditingClass(null);
    };

    const resetSubjectForm = () => {
        setSubjectForm({ name: "", description: "", code: "" });
        setEditingSubject(null);
    };

    const resetProgramForm = () => {
        setProgramForm({ name: "", description: "", duration: "" });
        setEditingProgram(null);
    };

    const resetYearForm = () => {
        setYearForm({ name: "", fromYear: "", toYear: "", isCurrent: false });
        setEditingYear(null);
    };

    const resetTermForm = () => {
        setTermForm({ name: "", description: "", duration: "", startDate: "", endDate: "" });
        setEditingTerm(null);
    };

    // Open edit dialogs
    const openEditClass = (cls: ClassLevel) => {
        setEditingClass(cls);
        setClassForm({
            name: cls.name,
            description: cls.description || "",
            capacity: cls.capacity?.toString() || ""
        });
        setClassDialogOpen(true);
    };

    const openEditSubject = (subject: Subject) => {
        setEditingSubject(subject);
        setSubjectForm({
            name: subject.name,
            description: subject.description || "",
            code: subject.code || ""
        });
        setSubjectDialogOpen(true);
    };

    const openEditProgram = (program: Program) => {
        setEditingProgram(program);
        setProgramForm({
            name: program.name,
            description: program.description || "",
            duration: program.duration || ""
        });
        setProgramDialogOpen(true);
    };

    const openEditYear = (year: AcademicYear) => {
        setEditingYear(year);
        setYearForm({
            name: year.name,
            fromYear: year.fromYear ? new Date(year.fromYear).toISOString().split('T')[0] : "",
            toYear: year.toYear ? new Date(year.toYear).toISOString().split('T')[0] : "",
            isCurrent: year.isCurrent
        });
        setYearDialogOpen(true);
    };

    const openEditTerm = (term: AcademicTerm) => {
        setEditingTerm(term);
        setTermForm({
            name: term.name,
            description: term.description || "",
            duration: term.duration || "",
            startDate: term.startDate ? new Date(term.startDate).toISOString().split('T')[0] : "",
            endDate: term.endDate ? new Date(term.endDate).toISOString().split('T')[0] : ""
        });
        setTermDialogOpen(true);
    };

    // Class CRUD
    const handleSubmitClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classForm.name) {
            toast.error("Class name is required");
            return;
        }
        setSubmitting(true);
        try {
            if (editingClass) {
                await academicAPI.updateClass(editingClass._id, classForm);
                toast.success("Class updated successfully");
            } else {
                await academicAPI.createClass(classForm);
                toast.success("Class created successfully");
            }
            setClassDialogOpen(false);
            resetClassForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save class");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;
        try {
            await academicAPI.deleteClass(id);
            toast.success("Class deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete class");
        }
    };

    // Subject CRUD
    const handleSubmitSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectForm.name) {
            toast.error("Subject name is required");
            return;
        }
        setSubmitting(true);
        try {
            if (editingSubject) {
                await academicAPI.updateSubject(editingSubject._id, subjectForm);
                toast.success("Subject updated successfully");
            } else {
                await academicAPI.createSimpleSubject(subjectForm);
                toast.success("Subject created successfully");
            }
            setSubjectDialogOpen(false);
            resetSubjectForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save subject");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        try {
            await academicAPI.deleteSubject(id);
            toast.success("Subject deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete subject");
        }
    };

    // Program CRUD
    const handleSubmitProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!programForm.name) {
            toast.error("Program name is required");
            return;
        }
        setSubmitting(true);
        try {
            if (editingProgram) {
                await academicAPI.updateProgram(editingProgram._id, programForm);
                toast.success("Program updated successfully");
            } else {
                await academicAPI.createProgram({ ...programForm, description: programForm.description || "No description" });
                toast.success("Program created successfully");
            }
            setProgramDialogOpen(false);
            resetProgramForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save program");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProgram = async (id: string) => {
        if (!confirm("Are you sure you want to delete this program?")) return;
        try {
            await academicAPI.deleteProgram(id);
            toast.success("Program deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete program");
        }
    };

    // Academic Year CRUD
    const handleSubmitYear = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!yearForm.name || !yearForm.fromYear || !yearForm.toYear) {
            toast.error("Please fill all required fields");
            return;
        }
        setSubmitting(true);
        try {
            if (editingYear) {
                await adminAPI.updateAcademicYear(editingYear._id, yearForm);
                toast.success("Academic year updated successfully");
            } else {
                await adminAPI.createAcademicYear(yearForm);
                toast.success("Academic year created successfully");
            }
            setYearDialogOpen(false);
            resetYearForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save academic year");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteYear = async (id: string) => {
        if (!confirm("Are you sure you want to delete this academic year?")) return;
        try {
            await adminAPI.deleteAcademicYear(id);
            toast.success("Academic year deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete academic year");
        }
    };

    // Academic Term CRUD
    const handleSubmitTerm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!termForm.name) {
            toast.error("Term name is required");
            return;
        }
        setSubmitting(true);
        try {
            if (editingTerm) {
                await adminAPI.updateAcademicTerm(editingTerm._id, termForm);
                toast.success("Academic term updated successfully");
            } else {
                await adminAPI.createAcademicTerm(termForm);
                toast.success("Academic term created successfully");
            }
            setTermDialogOpen(false);
            resetTermForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save academic term");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTerm = async (id: string) => {
        if (!confirm("Are you sure you want to delete this term?")) return;
        try {
            await adminAPI.deleteAcademicTerm(id);
            toast.success("Academic term deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete academic term");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading academic data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Academic Structure</h1>
                        <p className="text-slate-500">Manage classes, subjects, programs, years, and terms</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("classes")}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Classes</p>
                                <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("subjects")}>
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
                <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("programs")}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <School className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Programs</p>
                                <p className="text-2xl font-bold text-slate-900">{programs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("years")}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Years</p>
                                <p className="text-2xl font-bold text-slate-900">{years.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("terms")}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Terms</p>
                                <p className="text-2xl font-bold text-slate-900">{terms.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-3xl grid-cols-5 h-auto p-1 bg-slate-100">
                    <TabsTrigger value="classes" className="py-2">Classes</TabsTrigger>
                    <TabsTrigger value="subjects" className="py-2">Subjects</TabsTrigger>
                    <TabsTrigger value="programs" className="py-2">Programs</TabsTrigger>
                    <TabsTrigger value="years" className="py-2">Years</TabsTrigger>
                    <TabsTrigger value="terms" className="py-2">Terms</TabsTrigger>
                </TabsList>

                {/* Classes Tab */}
                <TabsContent value="classes" className="space-y-4 mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                    Class Levels
                                </CardTitle>
                                <CardDescription>Grade levels in your school</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { resetClassForm(); setClassDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Class
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {classes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <GraduationCap className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Classes</h3>
                                    <p className="text-slate-500">Create your first class to get started</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Students</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classes.map((cls) => (
                                            <TableRow key={cls._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{cls.name}</TableCell>
                                                <TableCell className="text-slate-500">{cls.description || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{(cls as any).studentCount ?? cls.students?.length ?? 0} students</Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditClass(cls)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClass(cls._id)}>
                                                        <Trash2 className="h-4 w-4" />
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

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="space-y-4 mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                    Subjects
                                </CardTitle>
                                <CardDescription>Courses offered in your school</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { resetSubjectForm(); setSubjectDialogOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Subject
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {subjects.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Subjects</h3>
                                    <p className="text-slate-500">Create your first subject to get started</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Teacher</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subjects.map((subject) => (
                                            <TableRow key={subject._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{subject.name}</TableCell>
                                                <TableCell className="text-slate-500">{subject.code || "—"}</TableCell>
                                                <TableCell>
                                                    {subject.teacher?.name ? (
                                                        <Badge>{subject.teacher.name}</Badge>
                                                    ) : (
                                                        <span className="text-slate-400">Not assigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditSubject(subject)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteSubject(subject._id)}>
                                                        <Trash2 className="h-4 w-4" />
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

                {/* Programs Tab */}
                <TabsContent value="programs" className="space-y-4 mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <School className="h-5 w-5 text-indigo-600" />
                                    Programs
                                </CardTitle>
                                <CardDescription>Academic programs that group subjects</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { resetProgramForm(); setProgramDialogOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Program
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {programs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <School className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Programs</h3>
                                    <p className="text-slate-500">Create programs to organize your subjects</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {programs.map((program) => (
                                            <TableRow key={program._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{program.name}</TableCell>
                                                <TableCell className="text-slate-500">{program.description || "—"}</TableCell>
                                                <TableCell>{program.duration || "—"}</TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditProgram(program)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProgram(program._id)}>
                                                        <Trash2 className="h-4 w-4" />
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

                {/* Academic Years Tab */}
                <TabsContent value="years" className="space-y-4 mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    Academic Years
                                </CardTitle>
                                <CardDescription>School year periods</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { resetYearForm(); setYearDialogOpen(true); }} className="bg-green-600 hover:bg-green-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Year
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {years.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Academic Years</h3>
                                    <p className="text-slate-500">Create your first academic year to get started</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {years.map((year) => (
                                            <TableRow key={year._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{year.name}</TableCell>
                                                <TableCell>{year.fromYear ? new Date(year.fromYear).toLocaleDateString() : "—"}</TableCell>
                                                <TableCell>{year.toYear ? new Date(year.toYear).toLocaleDateString() : "—"}</TableCell>
                                                <TableCell>
                                                    {year.isCurrent ? (
                                                        <Badge variant="success">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />Current
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-slate-500">Inactive</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditYear(year)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteYear(year._id)}>
                                                        <Trash2 className="h-4 w-4" />
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

                {/* Terms Tab */}
                <TabsContent value="terms" className="space-y-4 mt-6">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                    Academic Terms
                                </CardTitle>
                                <CardDescription>Semesters or terms within academic years</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { resetTermForm(); setTermDialogOpen(true); }} className="bg-amber-600 hover:bg-amber-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Term
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {terms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Clock className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No Academic Terms</h3>
                                    <p className="text-slate-500">Create your first academic term to get started</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {terms.map((term) => (
                                            <TableRow key={term._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="font-medium">{term.name}</TableCell>
                                                <TableCell className="text-slate-500">{term.description || "—"}</TableCell>
                                                <TableCell>{term.duration || "—"}</TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" onClick={() => openEditTerm(term)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteTerm(term._id)}>
                                                        <Trash2 className="h-4 w-4" />
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
            </Tabs>

            {/* Class Dialog */}
            <Dialog open={classDialogOpen} onOpenChange={(open) => { setClassDialogOpen(open); if (!open) resetClassForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            {editingClass ? "Edit Class" : "Create New Class"}
                        </DialogTitle>
                        <DialogDescription>{editingClass ? "Update class details" : "Add a new class level to your school"}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitClass} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">Class Name <span className="text-red-500">*</span></Label>
                            <Input required placeholder="e.g. Grade 10, Class 5A" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Capacity</Label>
                            <Input type="number" placeholder="Maximum number of students" value={classForm.capacity} onChange={(e) => setClassForm({ ...classForm, capacity: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Optional description for the class" value={classForm.description} onChange={(e) => setClassForm({ ...classForm, description: e.target.value })} />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingClass ? "Update Class" : "Create Class"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Subject Dialog */}
            <Dialog open={subjectDialogOpen} onOpenChange={(open) => { setSubjectDialogOpen(open); if (!open) resetSubjectForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            {editingSubject ? "Edit Subject" : "Create New Subject"}
                        </DialogTitle>
                        <DialogDescription>{editingSubject ? "Update subject details" : "Add a new subject to your school"}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitSubject} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">Subject Name <span className="text-red-500">*</span></Label>
                            <Input required placeholder="e.g. Mathematics, English" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subject Code</Label>
                            <Input placeholder="e.g. MATH101" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Optional description for the subject" value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} />
                        </div>
                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingSubject ? "Update Subject" : "Create Subject"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Program Dialog */}
            <Dialog open={programDialogOpen} onOpenChange={(open) => { setProgramDialogOpen(open); if (!open) resetProgramForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <School className="h-5 w-5 text-indigo-600" />
                            {editingProgram ? "Edit Program" : "Create New Program"}
                        </DialogTitle>
                        <DialogDescription>{editingProgram ? "Update program details" : "Add a new academic program"}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitProgram} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">Program Name <span className="text-red-500">*</span></Label>
                            <Input required placeholder="e.g. Science, Arts, Commerce" value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input placeholder="e.g. 4 years" value={programForm.duration} onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Optional description for the program" value={programForm.description} onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })} />
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingProgram ? "Update Program" : "Create Program"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Year Dialog */}
            <Dialog open={yearDialogOpen} onOpenChange={(open) => { setYearDialogOpen(open); if (!open) resetYearForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            {editingYear ? "Edit Academic Year" : "Create Academic Year"}
                        </DialogTitle>
                        <DialogDescription>{editingYear ? "Update academic year details" : "Define a new academic year for your school"}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitYear} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">Year Name <span className="text-red-500">*</span></Label>
                            <Input required placeholder="e.g. 2024-2025" value={yearForm.name} onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">Start Date <span className="text-red-500">*</span></Label>
                                <Input required type="date" value={yearForm.fromYear} onChange={(e) => setYearForm({ ...yearForm, fromYear: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">End Date <span className="text-red-500">*</span></Label>
                                <Input required type="date" value={yearForm.toYear} onChange={(e) => setYearForm({ ...yearForm, toYear: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isCurrent" checked={yearForm.isCurrent} onChange={(e) => setYearForm({ ...yearForm, isCurrent: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                            <Label htmlFor="isCurrent" className="cursor-pointer">Set as current academic year</Label>
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingYear ? "Update Academic Year" : "Create Academic Year"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Term Dialog */}
            <Dialog open={termDialogOpen} onOpenChange={(open) => { setTermDialogOpen(open); if (!open) resetTermForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-600" />
                            {editingTerm ? "Edit Academic Term" : "Create Academic Term"}
                        </DialogTitle>
                        <DialogDescription>{editingTerm ? "Update academic term details" : "Add a new academic term or semester"}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitTerm} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">Term Name <span className="text-red-500">*</span></Label>
                            <Input required placeholder="e.g. Term 1, First Semester" value={termForm.name} onChange={(e) => setTermForm({ ...termForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input placeholder="e.g. 3 months" value={termForm.duration} onChange={(e) => setTermForm({ ...termForm, duration: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="date" value={termForm.startDate} onChange={(e) => setTermForm({ ...termForm, startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" value={termForm.endDate} onChange={(e) => setTermForm({ ...termForm, endDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Optional description" value={termForm.description} onChange={(e) => setTermForm({ ...termForm, description: e.target.value })} />
                        </div>
                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingTerm ? "Update Academic Term" : "Create Academic Term"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
