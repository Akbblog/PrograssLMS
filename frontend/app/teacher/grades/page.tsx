"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { gradeAPI, academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Award } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

export default function TeacherGradesPage() {
    const user = useAuthStore((state) => state.user);
    const [grades, setGrades] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filters
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        student: "",
        subject: "",
        classLevel: "",
        academicYear: "",
        academicTerm: "",
        assessmentType: "quiz",
        examName: "",
        score: "",
        maxScore: "100",
        weight: "",
        isLate: false,
        latePenalty: "0",
        remarks: "",
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
            if (selectedSubject) {
                fetchGrades();
            }
        }
    }, [selectedClass, selectedSubject]);

    const fetchInitialData = async () => {
        try {
            const [classesRes, subjectsRes, yearsRes, termsRes] = await Promise.all([
                academicAPI.getClasses(),
                academicAPI.getSubjects(),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);

            const classesList = unwrapArray((classesRes as any)?.data, "classes");
            const subjectsList = unwrapArray((subjectsRes as any)?.data, "subjects");
            const yearsList = unwrapArray((yearsRes as any)?.data, "years");
            const termsList = unwrapArray((termsRes as any)?.data, "terms");

            setClasses(classesList);
            setSubjects(subjectsList);
            setYears(yearsList);
            setTerms(termsList);

            const currentYear = yearsList.find((y: any) => y.isCurrent);
            if (currentYear) setFormData(prev => ({ ...prev, academicYear: currentYear._id }));
        } catch (error: any) {
            toast.error(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await academicAPI.getStudentsByClass(selectedClass);
            setStudents(unwrapArray((response as any)?.data, "students"));
        } catch (error: any) {
            console.error("Failed to fetch students:", error);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await gradeAPI.getClassGrades({
                classLevel: selectedClass,
                subject: selectedSubject,
            });
            setGrades(unwrapArray((response as any)?.data, "grades"));
        } catch (error: any) {
            console.error("Failed to fetch grades:", error);
        }
    };

    const handleCreateGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await gradeAPI.createGrade({
                ...formData,
                score: parseFloat(formData.score),
                maxScore: parseFloat(formData.maxScore),
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                latePenalty: parseFloat(formData.latePenalty),
            });
            toast.success("Grade added successfully");
            setIsDialogOpen(false);
            setFormData(prev => ({
                ...prev,
                student: "",
                examName: "",
                score: "",
                weight: "",
                isLate: false,
                latePenalty: "0",
                remarks: "",
            }));
            if (selectedClass && selectedSubject) {
                fetchGrades();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add grade");
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
                    <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
                    <p className="text-muted-foreground">Enter and manage student grades with weighted calculations</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={!selectedClass || !selectedSubject}>
                            <Plus className="mr-2 h-4 w-4" /> Add Grade
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Grade</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateGrade} className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Student</Label>
                                    <Select required value={formData.student} onValueChange={(value) => setFormData({ ...formData, student: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student: any) => (
                                                <SelectItem key={student._id} value={student._id}>{student.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Subject</Label>
                                        <Select required value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
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
                                        <Select required value={formData.classLevel} onValueChange={(value) => setFormData({ ...formData, classLevel: value })}>
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
                                        <Label>Assessment Type</Label>
                                        <Select value={formData.assessmentType} onValueChange={(value) => setFormData({ ...formData, assessmentType: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="homework">Homework</SelectItem>
                                                <SelectItem value="quiz">Quiz</SelectItem>
                                                <SelectItem value="exam">Exam</SelectItem>
                                                <SelectItem value="project">Project</SelectItem>
                                                <SelectItem value="participation">Participation</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Assessment Name</Label>
                                        <Input
                                            required
                                            value={formData.examName}
                                            onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                            placeholder="e.g., Chapter 1 Quiz"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Score</Label>
                                        <Input
                                            type="number"
                                            required
                                            value={formData.score}
                                            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Max Score</Label>
                                        <Input
                                            type="number"
                                            required
                                            value={formData.maxScore}
                                            onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Weight (%)</Label>
                                        <Input
                                            type="number"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            placeholder="Default used if empty"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Late Submission?</Label>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <input
                                                type="checkbox"
                                                id="isLate"
                                                checked={formData.isLate}
                                                onChange={(e) => setFormData({ ...formData, isLate: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="isLate" className="font-normal cursor-pointer">Yes, student submitted late</Label>
                                        </div>
                                    </div>
                                    {formData.isLate && (
                                        <div className="grid gap-2">
                                            <Label>Late Penalty (%)</Label>
                                            <Input
                                                type="number"
                                                value={formData.latePenalty}
                                                onChange={(e) => setFormData({ ...formData, latePenalty: e.target.value })}
                                            />
                                        </div>
                                    )}
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
                                <div className="grid gap-2">
                                    <Label>Remarks (Optional)</Label>
                                    <Input
                                        value={formData.remarks}
                                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                        placeholder="Additional comments"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Save Grade</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <div className="grid gap-2 w-full max-w-xs">
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
                    <div className="grid gap-2 w-full max-w-xs">
                        <Label>Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
                </CardContent>
            </Card>

            {/* Grades Table */}
            {selectedClass && selectedSubject ? (
                <Card>
                    <CardContent className="pt-6">
                        {grades.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">No grades yet</p>
                                <p className="text-sm text-muted-foreground">Add grades using the button above</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Assessment</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Raw Score</TableHead>
                                        <TableHead>Weighted</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {grades.map((grade: any) => (
                                        <TableRow key={grade._id}>
                                            <TableCell className="font-medium">{grade.student?.name}</TableCell>
                                            <TableCell>{grade.examName}</TableCell>
                                            <TableCell className="capitalize">{grade.assessmentType}</TableCell>
                                            <TableCell>{grade.score}/{grade.maxScore} ({grade.percentage?.toFixed(1)}%)</TableCell>
                                            <TableCell>{grade.weightedScore?.toFixed(2)} / {grade.weight}</TableCell>
                                            <TableCell className="font-bold">{grade.letterGrade}</TableCell>
                                            <TableCell>
                                                {grade.isLate ? (
                                                    <span className="text-destructive text-xs font-semibold px-2 py-1 rounded-full bg-destructive/10">Late (-{grade.latePenalty}%)</span>
                                                ) : (
                                                    <span className="text-green-600 text-xs font-semibold px-2 py-1 rounded-full bg-green-100">On Time</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{new Date(grade.gradedAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Award className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Select class and subject</p>
                        <p className="text-sm text-muted-foreground">Choose filters above to view and manage grades</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
