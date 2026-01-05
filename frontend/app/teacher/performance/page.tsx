"use client";

import { useEffect, useState } from "react";
import { performanceAPI, academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Users, TrendingUp, AlertCircle, Award, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { unwrapArray } from "@/lib/utils";

export default function TeacherPerformancePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("");

    const [performance, setPerformance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedSubject && selectedYear && selectedTerm) {
            fetchPerformance();
        }
    }, [selectedClass, selectedSubject, selectedYear, selectedTerm]);

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
            const currentTerm = termsList.find((t: any) => t.isCurrent);

            if (currentYear) setSelectedYear(currentYear._id);
            if (currentTerm) setSelectedTerm(currentTerm._id);

        } catch (error: any) {
            toast.error("Failed to load filters");
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformance = async () => {
        setFetching(true);
        try {
            const res = await performanceAPI.getClassPerformance(
                selectedClass,
                selectedSubject,
                selectedYear,
                selectedTerm
            );
            setPerformance((res as any).data);
        } catch (error: any) {
            toast.error(error.message || "No data for this selection");
            setPerformance(null);
        } finally {
            setFetching(false);
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Class Analysis</h1>
                <p className="text-muted-foreground">Monitor academic excellence and identify students who need support.</p>
            </div>

            {/* Filter Section */}
            <Card>
                <CardHeader className="pb-3 px-6">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Analytics Filters</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-4 gap-4 px-6 pb-6">
                    <div className="grid gap-2">
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>{classes.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                            <SelectContent>{subjects.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Academic Year</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                            <SelectContent>{years.map(y => <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Academic Term</Label>
                        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                            <SelectTrigger><SelectValue placeholder="Select Term" /></SelectTrigger>
                            <SelectContent>{terms.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {fetching ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                </div>
            ) : performance ? (
                <div className="space-y-6">
                    {/* Performance Overview */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">{performance.totalStudents}</div>
                                <p className="text-xs text-muted-foreground">Total enrolled</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">{performance.classAverage?.toFixed(1)}%</div>
                                <Progress value={performance.classAverage} className="h-1.5 mt-2" />
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                                <Award className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">{performance.topPerformers?.[0]?.averageScore?.toFixed(1) || 0}%</div>
                                <p className="text-xs text-muted-foreground truncate">{performance.topPerformers?.[0]?.studentName}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">Struggling</CardTitle>
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-destructive">{performance.strugglingStudents?.length || 0}</div>
                                <p className="text-xs text-muted-foreground">Below 60% average</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Grade Distribution */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" /> Grade Distribution
                                </CardTitle>
                                <CardDescription>Percentage of students per grade tier</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(performance.gradeDistribution || {}).map(([grade, count]: [string, any]) => {
                                    const percentage = (count / performance.totalStudents) * 100;
                                    return (
                                        <div key={grade} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-bold w-8">{grade}</span>
                                                <span className="text-muted-foreground">{count} students ({percentage.toFixed(0)}%)</span>
                                            </div>
                                            <Progress value={percentage} className="h-2" />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Top Performers */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Top Performers</CardTitle>
                                <CardDescription>Students with the highest weighted averages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead className="text-right">Average</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {performance.topPerformers?.map((p: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                                                    {p.studentName}
                                                </TableCell>
                                                <TableCell className="text-right font-black text-primary">{p.averageScore?.toFixed(1)}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Struggling Students Detail */}
                    {performance.strugglingStudents?.length > 0 && (
                        <Card className="border-none shadow-md border-t-4 border-t-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-lg text-destructive">At-Risk Students</CardTitle>
                                <CardDescription>Students whose current performance is below passing grade (60%)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {performance.strugglingStudents.map((s: any, i: number) => (
                                        <div key={i} className="p-3 rounded-lg border bg-destructive/5 flex justify-between items-center">
                                            <span className="font-medium">{s.studentName}</span>
                                            <span className="text-destructive font-bold">{s.averageScore?.toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
                    <BarChart3 className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Select class details to view performance analytics</p>
                </div>
            )}
        </div>
    );
}
