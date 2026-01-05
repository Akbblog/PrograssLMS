"use client";

import { useEffect, useState } from "react";
import { academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import AdminPageLayout from '@/components/layouts/AdminPageLayout';
import { unwrapArray } from "@/lib/utils";

export default function AdminSchedulePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res: any = await academicAPI.getClasses();
                setClasses(unwrapArray(res?.data, "classes"));
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
        <AdminPageLayout
            title="Class Schedule"
            description="View and manage class timetables"
            actions={
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
            }
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Timetable View
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
                        <div className="border dark:border-slate-700 rounded-lg p-4">
                            {/* Placeholder for actual timetable grid */}
                            <div className="grid grid-cols-6 gap-4 text-center text-sm">
                                <div className="font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded">Time</div>
                                <div className="font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded">Mon</div>
                                <div className="font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded">Tue</div>
                                <div className="font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded">Wed</div>
                                <div className="font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded">Thu</div>
                                <div className="font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded">Fri</div>

                                {/* Mock Rows */}
                                <div className="p-2 border-b dark:border-slate-700">08:00 - 09:00</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30 rounded">Math</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/30 rounded">Science</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30 rounded">Math</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-purple-50 dark:bg-purple-900/30 rounded">English</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/30 rounded">Science</div>

                                <div className="p-2 border-b dark:border-slate-700">09:00 - 10:00</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-purple-50 dark:bg-purple-900/30 rounded">English</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30 rounded">Math</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/30 rounded">Science</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30 rounded">Math</div>
                                <div className="p-2 border-b dark:border-slate-700 bg-purple-50 dark:bg-purple-900/30 rounded">English</div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 text-center">
                                * This is a visual representation. Actual schedule data integration required.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminPageLayout>
    );
}
