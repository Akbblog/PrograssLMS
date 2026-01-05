"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { assignmentAPI, academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, FileText, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

export default function TeacherAssignmentsPage() {
    const user = useAuthStore((state) => state.user);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [gradingAssignment, setGradingAssignment] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        classLevel: "",
        dueDate: "",
        totalPoints: "100",
        academicYear: "",
        academicTerm: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsRes, classesRes, subjectsRes, yearsRes, termsRes] = await Promise.all([
                assignmentAPI.getAssignments({}),
                academicAPI.getClasses(),
                academicAPI.getSubjects(),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);

            const assignmentsList = unwrapArray((assignmentsRes as any)?.data, "assignments");
            const classesList = unwrapArray((classesRes as any)?.data, "classes");
            const subjectsList = unwrapArray((subjectsRes as any)?.data, "subjects");
            const yearsList = unwrapArray((yearsRes as any)?.data, "years");
            const termsList = unwrapArray((termsRes as any)?.data, "terms");

            setAssignments(assignmentsList);
            setClasses(classesList);
            setSubjects(subjectsList);
            setYears(yearsList);
            setTerms(termsList);

            // Set defaults
            const currentYear = yearsList.find((y: any) => y.isCurrent);
            if (currentYear) setFormData(prev => ({ ...prev, academicYear: currentYear._id }));
        } catch (error: any) {
            toast.error(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await assignmentAPI.createAssignment(formData);
            toast.success("Assignment created successfully");
            setIsDialogOpen(false);
            setFormData({
                title: "",
                description: "",
                subject: "",
                classLevel: "",
                dueDate: "",
                totalPoints: "100",
                academicYear: formData.academicYear,
                academicTerm: formData.academicTerm,
            });
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to create assignment");
        }
    };

    const handleGradeSubmission = async (assignmentId: string, studentId: string, grade: number, feedback: string) => {
        try {
            await assignmentAPI.gradeSubmission(assignmentId, studentId, { grade, feedback });
            toast.success("Submission graded successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to grade submission");
        }
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
                    <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                    <p className="text-muted-foreground">Create and manage assignments</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Title</Label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Subject</Label>
                                        <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.map((subject: any) => (
                                                    <SelectItem key={subject._id} value={subject._id}>{subject.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Class</Label>
                                        <Select value={formData.classLevel} onValueChange={(value) => setFormData({ ...formData, classLevel: value })}>
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
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Due Date</Label>
                                        <Input
                                            type="date"
                                            required
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Total Points</Label>
                                        <Input
                                            type="number"
                                            required
                                            value={formData.totalPoints}
                                            onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Academic Year</Label>
                                        <Select value={formData.academicYear} onValueChange={(value) => setFormData({ ...formData, academicYear: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year: any) => (
                                                    <SelectItem key={year._id} value={year._id}>{year.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Academic Term</Label>
                                        <Select value={formData.academicTerm} onValueChange={(value) => setFormData({ ...formData, academicTerm: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Term" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {terms.map((term: any) => (
                                                    <SelectItem key={term._id} value={term._id}>{term.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Create Assignment</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {assignments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No assignments yet</p>
                        <p className="text-sm text-muted-foreground">Create your first assignment to get started</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {assignments.map((assignment: any) => {
                        const submittedCount = assignment.submissions?.filter((s: any) => s.status !== "pending").length || 0;
                        const totalSubmissions = assignment.submissions?.length || 0;

                        return (
                            <Card key={assignment._id}>
                                <CardHeader>
                                    <CardTitle className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {assignment.subject?.name} • {assignment.classLevel?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {submittedCount} / {totalSubmissions} submitted
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-4">{assignment.description}</p>
                                    {assignment.submissions && assignment.submissions.length > 0 && (
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Student</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Submitted</TableHead>
                                                        <TableHead>Grade</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {assignment.submissions.map((submission: any) => (
                                                        <TableRow key={submission._id}>
                                                            <TableCell>{submission.student?.name || "Student"}</TableCell>
                                                            <TableCell className="capitalize">{submission.status}</TableCell>
                                                            <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell>
                                                                {submission.grade ? `${submission.grade}/${assignment.totalPoints}` : "-"}
                                                            </TableCell>
                                                            <TableCell>
                                                                {submission.status !== "pending" && submission.status !== "graded" && (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const grade = prompt("Enter grade (out of " + assignment.totalPoints + "):");
                                                                            const feedback = prompt("Enter feedback (optional):");
                                                                            if (grade) {
                                                                                handleGradeSubmission(assignment._id, submission.student, parseInt(grade), feedback || "");
                                                                            }
                                                                        }}
                                                                    >
                                                                        Grade
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
