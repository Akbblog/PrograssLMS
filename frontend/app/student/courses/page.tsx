"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { enrollmentAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function StudentCoursesPage() {
    const user = useAuthStore((state) => state.user);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchEnrollments();
        }
    }, [user]);

    const fetchEnrollments = async () => {
        try {
            if (!user?._id) return;
            const response = await enrollmentAPI.getStudentEnrollments(user._id);
            setEnrollments((response as any).data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to load courses");
        } finally {
            setLoading(false);
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
                <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                <p className="text-muted-foreground">View your enrolled courses and track progress</p>
            </div>

            {enrollments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No courses enrolled yet</p>
                        <p className="text-sm text-muted-foreground">Contact your administrator to enroll in courses</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {enrollments.map((enrollment: any) => (
                        <Card key={enrollment._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between">
                                    <span>{enrollment.subject?.name || "Course"}</span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${enrollment.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {enrollment.status}
                                    </span>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{enrollment.classLevel?.name}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>{enrollment.academicYear?.name} - {enrollment.academicTerm?.name}</span>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{enrollment.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${enrollment.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {enrollment.subject?.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {enrollment.subject.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
