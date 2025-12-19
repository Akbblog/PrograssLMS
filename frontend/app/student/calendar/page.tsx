"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { assignmentAPI, attendanceAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon, CheckCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

export default function StudentCalendarPage() {
    const user = useAuthStore((state) => state.user);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            if (!user?._id) return;
            const [assignmentsRes, attendanceRes] = await Promise.all([
                assignmentAPI.getAssignments({ studentId: user._id }),
                attendanceAPI.getStudentAttendance(user._id),
            ]);

            setAssignments((assignmentsRes as any).data || []);
            setAttendance((attendanceRes as any).data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to load calendar data");
        } finally {
            setLoading(false);
        }
    };

    // Get upcoming assignments (next 7 days)
    const upcomingAssignments = assignments
        .filter((a: any) => {
            const dueDate = new Date(a.dueDate);
            const today = new Date();
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return dueDate >= today && dueDate <= nextWeek && !a.mySubmission;
        })
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Recent attendance (last 10 days)
    const recentAttendance = attendance.slice(0, 10);

    // Calculate attendance stats
    const totalDays = attendance.length;
    const presentDays = attendance.filter((a: any) => a.status === "present").length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "0";

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
                <h1 className="text-3xl font-bold tracking-tight">Calendar & Schedule</h1>
                <p className="text-muted-foreground">Track your assignments and attendance</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendanceRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {presentDays} present out of {totalDays} days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
                        <p className="text-xs text-muted-foreground">Due in next 7 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assignments.length}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Upcoming Assignments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingAssignments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No upcoming assignments</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingAssignments.map((assignment: any) => (
                                    <div
                                        key={assignment._id}
                                        className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{assignment.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {assignment.subject?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {new Date(assignment.dueDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {Math.ceil(
                                                    (new Date(assignment.dueDate).getTime() - Date.now()) /
                                                    (1000 * 60 * 60 * 24)
                                                )}{" "}
                                                days left
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentAttendance.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No attendance records</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentAttendance.map((record: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            {record.status === "present" ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : record.status === "late" ? (
                                                <Clock className="h-5 w-5 text-yellow-500" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-red-500" />
                                            )}
                                            <div>
                                                <p className="font-medium capitalize">{record.status}</p>
                                                {record.remarks && (
                                                    <p className="text-xs text-muted-foreground">{record.remarks}</p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(record.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
