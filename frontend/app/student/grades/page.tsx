"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { gradeAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";

export default function StudentGradesPage() {
    const user = useAuthStore((state) => state.user);
    const [gradesData, setGradesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchGrades();
        }
    }, [user]);

    const fetchGrades = async () => {
        try {
            if (!user?._id) return;
            const response = await gradeAPI.getStudentGrades(user._id);
            setGradesData((response as any).data);
        } catch (error: any) {
            toast.error(error.message || "Failed to load grades");
        } finally {
            setLoading(false);
        }
    };

    const getLetterGradeColor = (grade: string) => {
        if (["A+", "A", "A-"].includes(grade)) return "text-green-600";
        if (["B+", "B", "B-"].includes(grade)) return "text-blue-600";
        if (["C+", "C", "C-"].includes(grade)) return "text-yellow-600";
        if (grade === "D") return "text-orange-600";
        return "text-red-600";
    };

    // Group grades by subject
    const groupedGrades = gradesData?.grades?.reduce((acc: any, grade: any) => {
        const subjectName = grade.subject?.name || "Unknown";
        if (!acc[subjectName]) acc[subjectName] = [];
        acc[subjectName].push(grade);
        return acc;
    }, {}) || {};

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Grades</h1>
                <p className="text-muted-foreground">View your academic performance and grades</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gradesData?.average || "0"}%</div>
                        <p className="text-xs text-muted-foreground">Across all subjects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gradesData?.totalGrades || 0}</div>
                        <p className="text-xs text-muted-foreground">Grades received</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Object.keys(groupedGrades).length}</div>
                        <p className="text-xs text-muted-foreground">Active subjects</p>
                    </CardContent>
                </Card>
            </div>

            {/* Grades by Subject */}
            {Object.keys(groupedGrades).length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Award className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No grades yet</p>
                        <p className="text-sm text-muted-foreground">Your grades will appear here once teachers post them</p>
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue={Object.keys(groupedGrades)[0]} className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        {Object.keys(groupedGrades).map((subject) => (
                            <TabsTrigger key={subject} value={subject}>
                                {subject}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {Object.entries(groupedGrades).map(([subject, grades]: [string, any]) => {
                        const subjectAverage = grades.reduce((sum: number, g: any) => sum + g.percentage, 0) / grades.length;

                        return (
                            <TabsContent key={subject} value={subject} className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>{subject}</CardTitle>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">{subjectAverage.toFixed(1)}%</p>
                                                <p className="text-xs text-muted-foreground">Subject Average</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Exam/Assessment</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead className="text-right">Score</TableHead>
                                                    <TableHead className="text-right">Grade</TableHead>
                                                    <TableHead>Remarks</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {grades.map((grade: any) => (
                                                    <TableRow key={grade._id}>
                                                        <TableCell className="font-medium">{grade.examName}</TableCell>
                                                        <TableCell className="capitalize">{grade.examType}</TableCell>
                                                        <TableCell>{new Date(grade.gradedAt).toLocaleDateString()}</TableCell>
                                                        <TableCell className="text-right">
                                                            {grade.score}/{grade.maxScore}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className={`font-bold ${getLetterGradeColor(grade.letterGrade)}`}>
                                                                {grade.letterGrade}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {grade.remarks || "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            )}
        </div>
    );
}
