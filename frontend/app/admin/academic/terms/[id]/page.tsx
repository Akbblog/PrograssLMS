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
import { Textarea } from "@/components/ui/textarea";
import {
    Loader2,
    ArrowLeft,
    Clock,
    Save,
    Trash2,
    Calendar
} from "lucide-react";
import { toast } from "sonner";

interface AcademicTerm {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
}

export default function AcademicTermDetailPage() {
    const params = useParams();
    const router = useRouter();
    const termId = params.id as string;

    const [termData, setTermData] = useState<AcademicTerm | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: "",
        startDate: "",
        endDate: ""
    });

    const fetchTermData = useCallback(async () => {
        try {
            const res: any = await adminAPI.getAcademicTerms();
            const allTerms = unwrapArray(res?.data, "terms");
            const term = allTerms.find((t: any) => t._id === termId);
            if (term) {
                setTermData(term);
                setFormData({
                    name: term.name || "",
                    description: term.description || "",
                    duration: term.duration || "",
                    startDate: term.startDate ? new Date(term.startDate).toISOString().split('T')[0] : "",
                    endDate: term.endDate ? new Date(term.endDate).toISOString().split('T')[0] : ""
                });
            } else {
                toast.error("Academic term not found");
                router.push("/admin/academic");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load academic term data");
            router.push("/admin/academic");
        } finally {
            setLoading(false);
        }
    }, [termId, router]);

    useEffect(() => {
        if (termId) {
            fetchTermData();
        }
    }, [termId, fetchTermData]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Term name is required");
            return;
        }
        setSaving(true);
        try {
            await adminAPI.updateAcademicTerm(termId, formData);
            toast.success("Academic term updated successfully");
            fetchTermData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to update academic term");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this academic term? This action cannot be undone.")) return;
        try {
            await adminAPI.deleteAcademicTerm(termId);
            toast.success("Academic term deleted successfully");
            router.push("/admin/academic");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete academic term");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading academic term data...</p>
                </div>
            </div>
        );
    }

    if (!termData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Clock className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Academic Term not found</h2>
                <p className="text-slate-500 mb-4">The academic term you're looking for doesn't exist.</p>
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
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{termData.name}</h1>
                            <p className="text-slate-500">Academic Term Details</p>
                        </div>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Term
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Duration</p>
                                <p className="text-xl font-bold text-slate-900">{termData.duration || "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Start Date</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {termData.startDate ? new Date(termData.startDate).toLocaleDateString() : "Not set"}
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
                                    {termData.endDate ? new Date(termData.endDate).toLocaleDateString() : "Not set"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Form */}
            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle>Academic Term Information</CardTitle>
                    <CardDescription>Update academic term details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                Term Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                required
                                placeholder="e.g. Term 1, First Semester"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                                placeholder="e.g. 3 months"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Optional description for the term"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
