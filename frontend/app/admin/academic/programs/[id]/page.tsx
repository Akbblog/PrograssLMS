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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Loader2,
    ArrowLeft,
    School,
    BookOpen,
    Save,
    Trash2,
    Clock
} from "lucide-react";
import { toast } from "sonner";

interface Program {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
    code?: string;
    subjects?: any[];
    createdAt?: string;
}

export default function ProgramDetailPage() {
    const params = useParams();
    const router = useRouter();
    const programId = params.id as string;

    const [programData, setProgramData] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: ""
    });

    const fetchProgramData = useCallback(async () => {
        try {
            const res: any = await academicAPI.getPrograms();
            const allPrograms = unwrapArray(res?.data, "programs");
            const program = allPrograms.find((p: any) => p._id === programId);
            if (program) {
                setProgramData(program);
                setFormData({
                    name: program.name || "",
                    description: program.description || "",
                    duration: program.duration || ""
                });
            } else {
                toast.error("Program not found");
                router.push("/admin/academic");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load program data");
            router.push("/admin/academic");
        } finally {
            setLoading(false);
        }
    }, [programId, router]);

    useEffect(() => {
        if (programId) {
            fetchProgramData();
        }
    }, [programId, fetchProgramData]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Program name is required");
            return;
        }
        setSaving(true);
        try {
            await academicAPI.updateProgram(programId, formData);
            toast.success("Program updated successfully");
            fetchProgramData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to update program");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this program? This action cannot be undone.")) return;
        try {
            await academicAPI.deleteProgram(programId);
            toast.success("Program deleted successfully");
            router.push("/admin/academic");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete program");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading program data...</p>
                </div>
            </div>
        );
    }

    if (!programData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <School className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Program not found</h2>
                <p className="text-slate-500 mb-4">The program you're looking for doesn't exist.</p>
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
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                            <School className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{programData.name}</h1>
                            <p className="text-slate-500">Program Details & Management</p>
                        </div>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Program
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <School className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Code</p>
                                <p className="text-xl font-bold text-slate-900">{programData.code || "N/A"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Duration</p>
                                <p className="text-xl font-bold text-slate-900">{programData.duration || "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Subjects</p>
                                <p className="text-xl font-bold text-slate-900">{programData.subjects?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Form */}
            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle>Program Information</CardTitle>
                    <CardDescription>Update program details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                Program Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                required
                                placeholder="e.g. Science, Arts, Commerce"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                                placeholder="e.g. 4 years"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Optional description for the program"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Subjects List */}
            {programData.subjects && programData.subjects.length > 0 && (
                <Card className="border-0 shadow-md">
                    <CardHeader className="border-b bg-slate-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            Program Subjects
                        </CardTitle>
                        <CardDescription>Subjects under this program</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Subject Name</TableHead>
                                    <TableHead>Code</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programData.subjects.map((subject: any) => (
                                    <TableRow key={subject._id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium">{subject.name}</TableCell>
                                        <TableCell className="text-slate-500">{subject.code || "—"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
