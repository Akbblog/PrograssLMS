"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { academicAPI } from "@/lib/api/endpoints";
import { unwrapArray } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    ArrowLeft,
    BookOpen,
    Users,
    Save,
    Trash2,
    GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface Subject {
    _id: string;
    name: string;
    description?: string;
    code?: string;
    teacher?: { _id: string; name: string };
    students?: any[];
    createdAt?: string;
}

export default function SubjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.id as string;

    const [subjectData, setSubjectData] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        code: ""
    });

    const fetchSubjectData = useCallback(async () => {
        try {
            const res: any = await academicAPI.getSubjects();
            const allSubjects = unwrapArray(res?.data, "subjects");
            const subject = allSubjects.find((s: any) => s._id === subjectId);
            if (subject) {
                setSubjectData(subject);
                setFormData({
                    name: subject.name || "",
                    description: subject.description || "",
                    code: subject.code || ""
                });
            } else {
                toast.error("Subject not found");
                router.push("/admin/academic");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load subject data");
            router.push("/admin/academic");
        } finally {
            setLoading(false);
        }
    }, [subjectId, router]);

    useEffect(() => {
        if (subjectId) {
            fetchSubjectData();
        }
    }, [subjectId, fetchSubjectData]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Subject name is required");
            return;
        }
        setSaving(true);
        try {
            await academicAPI.updateSubject(subjectId, formData);
            toast.success("Subject updated successfully");
            fetchSubjectData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to update subject");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this subject? This action cannot be undone.")) return;
        try {
            await academicAPI.deleteSubject(subjectId);
            toast.success("Subject deleted successfully");
            router.push("/admin/academic");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete subject");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading subject data...</p>
                </div>
            </div>
        );
    }

    if (!subjectData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <BookOpen className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Subject not found</h2>
                <p className="text-slate-500 mb-4">The subject you're looking for doesn't exist.</p>
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
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{subjectData.name}</h1>
                            <p className="text-slate-500">Subject Details & Management</p>
                        </div>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Subject
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Code</p>
                                <p className="text-xl font-bold text-slate-900">{subjectData.code || "N/A"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Teacher</p>
                                <p className="text-xl font-bold text-slate-900">{subjectData.teacher?.name || "Not Assigned"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Students</p>
                                <p className="text-xl font-bold text-slate-900">{subjectData.students?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Form */}
            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle>Subject Information</CardTitle>
                    <CardDescription>Update subject details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                Subject Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                required
                                placeholder="e.g. Mathematics, English"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subject Code</Label>
                            <Input
                                placeholder="e.g. MATH101"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Optional description for the subject"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
