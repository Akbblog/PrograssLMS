"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

export default function TeacherSchedulePage() {
    const user = useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [schedules, setSchedules] = useState<any[]>([]);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setIsLoading(false);
            // TODO: Fetch from API when endpoint is ready
            // For now, show sample data
            setSchedules([
                { id: 1, class: "Grade 10-A", subject: "Mathematics", day: "Monday", time: "9:00 AM - 10:30 AM", room: "Room 201", students: 30 },
                { id: 2, class: "Grade 10-B", subject: "Mathematics", day: "Monday", time: "10:45 AM - 12:15 PM", room: "Room 203", students: 28 },
                { id: 3, class: "Grade 11-A", subject: "Mathematics", day: "Tuesday", time: "9:00 AM - 10:30 AM", room: "Room 201", students: 32 },
                { id: 4, class: "Grade 9-C", subject: "Mathematics", day: "Wednesday", time: "2:30 PM - 4:00 PM", room: "Room 105", students: 25 },
            ]);
        } catch (error: any) {
            toast.error(error.message || "Failed to load schedule");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
                <p className="text-muted-foreground">View your class schedule and classroom assignments</p>
            </div>

            {/* Schedule Cards */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                    </div>
                ) : schedules.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No schedule available</p>
                            <p className="text-sm text-muted-foreground">Your schedule will appear here once it's assigned</p>
                        </CardContent>
                    </Card>
                ) : (
                    schedules.map((schedule) => (
                        <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">{schedule.class}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{schedule.subject}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {schedule.day}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                {schedule.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                {schedule.room}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                {schedule.students} students
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:text-right">
                                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {schedule.subject}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
