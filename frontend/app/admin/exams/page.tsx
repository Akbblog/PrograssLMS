"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useExams } from "@/hooks/useExams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, FileText, Calendar, Clock, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { unwrapArray } from "@/lib/utils";

export default function AdminExamsPage() {
    const router = useRouter();
    const { data: examsRes, isLoading: examsLoading } = useExams();
    const exams: any[] = (examsRes && (examsRes as any).data)
        ? unwrapArray((examsRes as any).data, "exams")
        : unwrapArray(examsRes);

    const loading = examsLoading;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const upcoming = exams.filter(e => new Date(e.examDate) > new Date()).length
    const live = exams.filter(e => e.examStatus === 'live').length

    return (
        <AdminPageLayout
            title="Exams"
            description="Manage examinations and results"
            actions={<Button onClick={() => router.push('/admin/exams/create')}><Plus className="mr-2 h-4 w-4" /> Schedule Exam</Button>}
            stats={(
                <>
                    <SummaryStatCard title="Total Exams" value={exams.length} icon={<FileText className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Upcoming" value={upcoming} icon={<Calendar className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Live" value={live} icon={<Clock className="h-4 w-4 text-white" />} variant="orange" />
                    <SummaryStatCard title="Questions" value={exams.reduce((acc, e) => acc + (e.questions?.length || 0), 0)} icon={<FileText className="h-4 w-4 text-white" />} variant="purple" />
                </>
            )}
        >
            <div>
                <div className="rounded-md border bg-white">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Exam Schedule</CardTitle>
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
                                            <TableRow key={exam._id} className="hover:bg-slate-50 transition-colors">
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
            </div>
        </AdminPageLayout>
    );
}
