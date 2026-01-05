"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { gradeAPI, performanceAPI, academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp, Award, Calendar, Lightbulb, User } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { unwrapArray } from "@/lib/utils";

export default function StudentGradesPage() {
    const user = useAuthStore((state) => state.user);
    const [performance, setPerformance] = useState<any>(null);
    const [gradesData, setGradesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchData(user._id);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchData = async (userId: string) => {
        try {
            // Get current academic term and year first
            const [yearsRes, termsRes] = await Promise.all([
                academicAPI.getAcademicYears(),
                academicAPI.getAcademicTerms(),
            ]);

            const yearsList = unwrapArray((yearsRes as any)?.data, "years");
            const termsList = unwrapArray((termsRes as any)?.data, "terms");

            const currentYear = yearsList.find((y: any) => y.isCurrent);
            const currentTerm = termsList.find((t: any) => t.isCurrent);

            if (currentYear && currentTerm) {
                const [perfRes, gradesRes] = await Promise.all([
                    performanceAPI.getStudentPerformance(userId, currentYear._id, currentTerm._id),
                    gradeAPI.getStudentGrades(userId, { academicYear: currentYear._id, academicTerm: currentTerm._id })
                ]);
                setPerformance((perfRes as any).data);
                setGradesData((gradesRes as any).data);
            } else {
                // Fallback to general grades if no current year/term found
                const gradesRes = await gradeAPI.getStudentGrades(userId);
                setGradesData((gradesRes as any).data);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load performance data");
        } finally {
            setLoading(false);
        }
    };

    const getLetterGradeColor = (grade: string) => {
        if (!grade) return "";
        if (["A+", "A", "A-"].includes(grade)) return "text-green-600";
        if (["B+", "B", "B-"].includes(grade)) return "text-blue-600";
        if (["C+", "C", "C-"].includes(grade)) return "text-yellow-600";
        if (grade === "D") return "text-orange-600";
        return "text-red-600";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const subjects = performance?.subjectPerformance ? Object.keys(performance.subjectPerformance) : [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                    <p className="text-muted-foreground">Comprehensive view of your academic progress</p>
                </div>
                {performance && (
                    <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="text-center px-4 border-r border-primary/20">
                            <p className="text-xs text-muted-foreground uppercase font-bold">GPA</p>
                            <p className="text-2xl font-black text-primary">{performance.gpa?.toFixed(2)}</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Overall</p>
                            <p className="text-2xl font-black text-primary">{performance.overallPercentage?.toFixed(1)}%</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" /> Attendance Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-blue-700">{performance?.attendanceRate?.toFixed(1) || "0"}%</div>
                        <Progress value={performance?.attendanceRate || 0} className="h-1.5 mt-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-600" /> Subjects
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-green-700">{performance?.totalSubjects || 0}</div>
                        <p className="text-xs text-green-600/70 mt-1">Active enrollments</p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" /> Total Grades
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-purple-700">{gradesData?.totalGrades || 0}</div>
                        <p className="text-xs text-purple-600/70 mt-1">Evaluations completed</p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-orange-600" /> Rank
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-orange-700">Good</div>
                        <p className="text-xs text-orange-600/70 mt-1">Consistently performing</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Grades Section */}
                <div className="md:col-span-2 space-y-6">
                    {subjects.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">No performance data yet</p>
                                <p className="text-sm text-muted-foreground">Your grades will appear here once teachers post them</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Tabs defaultValue={subjects[0]} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto bg-transparent p-0 gap-2 border-b rounded-none mb-4">
                                {subjects.map((subject) => (
                                    <TabsTrigger
                                        key={subject}
                                        value={subject}
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-lg rounded-b-none border-b-0"
                                    >
                                        {subject}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {Object.entries(performance.subjectPerformance).map(([subject, data]: [string, any]) => {
                                const subjectAvg = data.totalWeight > 0 ? (data.totalScore / data.totalWeight) * 100 : 0;

                                return (
                                    <TabsContent key={subject} value={subject} className="mt-0">
                                        <Card className="border-none shadow-md">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl font-bold">{subject}</CardTitle>
                                                        <CardDescription>Detailed breakdown of assessments</CardDescription>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-black text-primary">{subjectAvg.toFixed(1)}%</p>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Weighted Mean</p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/50">
                                                                <TableHead>Type</TableHead>
                                                                <TableHead>Assessment Name</TableHead>
                                                                <TableHead className="text-right">Score</TableHead>
                                                                <TableHead className="text-right">Weight</TableHead>
                                                                <TableHead className="text-right">Weighted</TableHead>
                                                                <TableHead className="text-center">Grade</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {data.grades.map((grade: any) => (
                                                                <TableRow key={grade._id}>
                                                                    <TableCell className="capitalize py-3">
                                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
                                                                            {grade.assessmentType}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">{grade.examName}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        {grade.score}/{grade.maxScore}
                                                                        <span className="text-[10px] text-muted-foreground block">
                                                                            ({grade.percentage?.toFixed(1)}%)
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="text-right text-muted-foreground">
                                                                        {grade.weight}%
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-bold text-primary">
                                                                        {grade.weightedScore?.toFixed(2)}
                                                                    </TableCell>
                                                                    <TableCell className="text-center">
                                                                        <span className={`font-black text-lg ${getLetterGradeColor(grade.letterGrade)}`}>
                                                                            {grade.letterGrade}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    )}
                </div>

                {/* Sidebar Analytics */}
                <div className="space-y-6">
                    {/* Recommendations */}
                    <Card className="border-none shadow-md bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-600" />
                                Academic Growth
                            </CardTitle>
                            <CardDescription>AI-generated recommendations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {performance?.recommendations?.length > 0 ? (
                                performance.recommendations.map((rec: string, i: number) => (
                                    <div key={i} className="flex gap-3 items-start group">
                                        <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold text-primary">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-tight pt-1 group-hover:text-primary transition-colors">
                                            {rec}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-4">
                                    No specific recommendations available yet. Keep up the good work!
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Performance Trend */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Periodic Trend</CardTitle>
                            <CardDescription>Progress across terms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {performance?.performanceTrend?.map((item: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{item.term}</span>
                                        <span className="font-bold">{item.average?.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={item.average} className="h-1.5" />
                                </div>
                            ))}
                            {(!performance?.performanceTrend || performance.performanceTrend.length === 0) && (
                                <p className="text-sm text-muted-foreground italic text-center py-4">
                                    Insufficient data for trend analysis
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


