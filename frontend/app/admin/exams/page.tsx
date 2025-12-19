"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { examAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, FileText, Calendar, Clock, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminExamsPage() {
    const router = useRouter();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await examAPI.getAll();
                setExams((res as any).data || []);
            } catch (error) {
                console.error("Failed to fetch exams:", error);
                toast.error("Failed to load exams");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

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
                    <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
                    <p className="text-muted-foreground">Manage examinations and results</p>
                </div>
                <Button onClick={() => router.push('/admin/exams/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Schedule Exam
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Exam Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {exams.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Exams Scheduled</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                Get started by scheduling a new examination for your students.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exams.map((exam) => (
                                    <TableRow key={exam._id}>
                                        <TableCell className="font-medium">{exam.name}</TableCell>
                                        <TableCell>{exam.subject?.name || '-'}</TableCell>
                                        <TableCell>{exam.classLevel?.name || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(exam.examDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {exam.examTime} ({exam.duration})
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{exam.questions?.length || 0} Qs</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={exam.examStatus === 'live' ? 'bg-green-500' : 'bg-amber-500'}>
                                                {exam.examStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
