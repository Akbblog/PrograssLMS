"use client";

import { useEffect, useState } from "react";
import { academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function AdminSchedulePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res: any = await academicAPI.getClasses();
                setClasses(res.data || []);
            } catch (error) {
                toast.error("Failed to load classes");
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
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
                    <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
                    <p className="text-muted-foreground">View and manage class timetables</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Timetable View
                        </div>
                        <div className="w-[200px]">
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c: any) => (
                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!selectedClass ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">Select a Class</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                Please select a class from the dropdown to view its schedule.
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg p-4">
                            {/* Placeholder for actual timetable grid */}
                            <div className="grid grid-cols-6 gap-4 text-center text-sm">
                                <div className="font-bold bg-slate-100 p-2">Time</div>
                                <div className="font-bold bg-slate-100 p-2">Mon</div>
                                <div className="font-bold bg-slate-100 p-2">Tue</div>
                                <div className="font-bold bg-slate-100 p-2">Wed</div>
                                <div className="font-bold bg-slate-100 p-2">Thu</div>
                                <div className="font-bold bg-slate-100 p-2">Fri</div>

                                {/* Mock Rows */}
                                <div className="p-2 border-b">08:00 - 09:00</div>
                                <div className="p-2 border-b bg-blue-50">Math</div>
                                <div className="p-2 border-b bg-green-50">Science</div>
                                <div className="p-2 border-b bg-blue-50">Math</div>
                                <div className="p-2 border-b bg-purple-50">English</div>
                                <div className="p-2 border-b bg-green-50">Science</div>

                                <div className="p-2 border-b">09:00 - 10:00</div>
                                <div className="p-2 border-b bg-purple-50">English</div>
                                <div className="p-2 border-b bg-blue-50">Math</div>
                                <div className="p-2 border-b bg-green-50">Science</div>
                                <div className="p-2 border-b bg-blue-50">Math</div>
                                <div className="p-2 border-b bg-purple-50">English</div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 text-center">
                                * This is a visual representation. Actual schedule data integration required.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
