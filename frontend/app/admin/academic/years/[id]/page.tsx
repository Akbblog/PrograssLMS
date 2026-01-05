"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminAPI } from "@/lib/api/endpoints";
import { unwrapArray } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    ArrowLeft,
    Calendar,
    Save,
    Trash2,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface AcademicYear {
    _id: string;
    name: string;
    fromYear: string;
    toYear: string;
    isCurrent: boolean;
    createdAt?: string;
}

export default function AcademicYearDetailPage() {
    const params = useParams();
    const router = useRouter();
    const yearId = params.id as string;

    const [yearData, setYearData] = useState<AcademicYear | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        fromYear: "",
        toYear: "",
        isCurrent: false
    });

    const fetchYearData = useCallback(async () => {
        try {
            const res: any = await adminAPI.getAcademicYears();
            const allYears = unwrapArray(res?.data, "years");
            const year = allYears.find((y: any) => y._id === yearId);
            if (year) {
                setYearData(year);
                setFormData({
                    name: year.name || "",
                    fromYear: year.fromYear ? new Date(year.fromYear).toISOString().split('T')[0] : "",
                    toYear: year.toYear ? new Date(year.toYear).toISOString().split('T')[0] : "",
                    isCurrent: year.isCurrent || false
                });
            } else {
                toast.error("Academic year not found");
                router.push("/admin/academic");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load academic year data");
            router.push("/admin/academic");
        } finally {
            setLoading(false);
        }
    }, [yearId, router]);

    useEffect(() => {
        if (yearId) {
            fetchYearData();
        }
    }, [yearId, fetchYearData]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.fromYear || !formData.toYear) {
            toast.error("Please fill all required fields");
            return;
        }
        setSaving(true);
        try {
            await adminAPI.updateAcademicYear(yearId, formData);
            toast.success("Academic year updated successfully");
            fetchYearData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to update academic year");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this academic year? This action cannot be undone.")) return;
        try {
            await adminAPI.deleteAcademicYear(yearId);
            toast.success("Academic year deleted successfully");
            router.push("/admin/academic");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete academic year");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading academic year data...</p>
                </div>
            </div>
        );
    }

    if (!yearData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Calendar className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Academic Year not found</h2>
                <p className="text-slate-500 mb-4">The academic year you're looking for doesn't exist.</p>
                <Button asChild>
                    <Link href="/admin/academic">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academic
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/academic">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{yearData.name}</h1>
                                {yearData.isCurrent && (
                                    <Badge variant="success">
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Current
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">Academic Year Details</p>
                        </div>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Year
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Start Date</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {yearData.fromYear ? new Date(yearData.fromYear).toLocaleDateString() : "Not set"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">End Date</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {yearData.toYear ? new Date(yearData.toYear).toLocaleDateString() : "Not set"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Form */}
            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle>Academic Year Information</CardTitle>
                    <CardDescription>Update academic year details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                Year Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                required
                                placeholder="e.g. 2024-2025"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    Start Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.fromYear}
                                    onChange={(e) => setFormData({ ...formData, fromYear: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    End Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.toYear}
                                    onChange={(e) => setFormData({ ...formData, toYear: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isCurrent"
                                checked={formData.isCurrent}
                                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <Label htmlFor="isCurrent" className="cursor-pointer">Set as current academic year</Label>
                        </div>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
