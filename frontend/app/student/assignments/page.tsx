"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { assignmentAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function StudentAssignmentsPage() {
    const user = useAuthStore((state) => state.user);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [submissionContent, setSubmissionContent] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user?._id) {
            fetchAssignments(user._id);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchAssignments = async (userId?: string) => {
        try {
            if (!userId) return;
            const response = await assignmentAPI.getAssignments({ studentId: userId });
            setAssignments((response as any).data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (assignmentId: string) => {
        if (!submissionContent[assignmentId]?.trim()) {
            toast.error("Please enter your assignment content");
            return;
        }

        setSubmitting(assignmentId);
        try {
            await assignmentAPI.submitAssignment(assignmentId, {
                content: submissionContent[assignmentId],
            });
            toast.success("Assignment submitted successfully");
            setSubmissionContent(prev => ({ ...prev, [assignmentId]: "" }));
            fetchAssignments();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit assignment");
        } finally {
            setSubmitting(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "graded":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "submitted":
            case "late":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const pendingAssignments = assignments.filter(a => !a.mySubmission);
    const submittedAssignments = assignments.filter(a => a.mySubmission);

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
                <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                <p className="text-muted-foreground">View and submit your assignments</p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
                    <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4 mt-6">
                    {pendingAssignments.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">No pending assignments</p>
                                <p className="text-sm text-muted-foreground">You're all caught up!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        pendingAssignments.map((assignment: any) => {
                            const isOverdue = new Date(assignment.dueDate) < new Date();
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
                                            {isOverdue && (
                                                <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                                    Overdue
                                                </span>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm">{assignment.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </span>
                                            <span>Points: {assignment.totalPoints}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <Textarea
                                                placeholder="Enter your assignment content here..."
                                                value={submissionContent[assignment._id] || ""}
                                                onChange={(e) => setSubmissionContent(prev => ({ ...prev, [assignment._id]: e.target.value }))}
                                                rows={4}
                                            />
                                            <Button
                                                onClick={() => handleSubmit(assignment._id)}
                                                disabled={submitting === assignment._id}
                                                className="w-full"
                                            >
                                                {submitting === assignment._id ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Submit Assignment"
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>

                <TabsContent value="submitted" className="space-y-4 mt-6">
                    {submittedAssignments.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">No submitted assignments yet</p>
                            </CardContent>
                        </Card>
                    ) : (
                        submittedAssignments.map((assignment: any) => (
                            <Card key={assignment._id}>
                                <CardHeader>
                                    <CardTitle className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {assignment.subject?.name} • {assignment.classLevel?.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(assignment.mySubmission.status)}
                                            <span className="text-sm capitalize">{assignment.mySubmission.status}</span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="text-sm font-medium mb-2">Your Submission:</p>
                                        <p className="text-sm">{assignment.mySubmission.content}</p>
                                    </div>

                                    {assignment.mySubmission.status === "graded" && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Grade:</span>
                                                <span className="text-lg font-bold text-primary">
                                                    {assignment.mySubmission.grade} / {assignment.totalPoints}
                                                </span>
                                            </div>
                                            {assignment.mySubmission.feedback && (
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">Teacher Feedback:</p>
                                                    <p className="text-sm">{assignment.mySubmission.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-xs text-muted-foreground">
                                        Submitted: {new Date(assignment.mySubmission.submittedAt).toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
