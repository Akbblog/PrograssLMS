"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import GraduationCap from "@/components/icons/GraduationCap";
import { toast } from "sonner";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import PageToolbar from '@/components/admin/PageToolbar'
import EmptyState from '@/components/admin/EmptyState'
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true)
        try {
            const res: any = await academicAPI.getClasses();
            const data = res?.data || res || []
            setClasses(data);
        } catch (error) {
            console.warn('Failed to load classes, using fallback', error)
            setError('Failed to load classes from server')
            // Fallback mock data
            setClasses([
                { _id: 'c1', name: 'Grade 10', description: 'Grade 10 classes', studentCount: 120 },
                { _id: 'c2', name: 'Grade 9', description: 'Grade 9 classes', studentCount: 110 }
            ])
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await academicAPI.createClass(formData);
            toast.success("Class created successfully");
            setCreateDialogOpen(false);
            setFormData({ name: "", description: "" });
            fetchClasses();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to create class";
            toast.error(errorMessage);
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;
        try {
            await academicAPI.deleteClass(id);
            toast.success("Class deleted successfully");
            fetchClasses();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete class");
        }
    };

    return (
        <AdminPageLayout
            title="Classes"
            description="Manage class levels and their students"
            actions={<Button onClick={() => setCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Class</Button>}
            stats={(
                <>
                    <SummaryStatCard title="Total Classes" value={classes.length} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Total Students" value={classes.reduce((acc, c) => acc + (c.studentCount || 0), 0)} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Active" value={classes.length} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="New This Month" value={0} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="orange" />
                </>
            )}
        >
            <div>
                <PageToolbar onAdd={() => setCreateDialogOpen(true)} query={""} setQuery={() => { }} onExport={() => { /* TODO */ }} />
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                {loading ? (
                    <div className="p-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="p-8">
                        <EmptyState title="No Classes Yet" description="Create your first class to get started" cta={<Button onClick={() => setCreateDialogOpen(true)}>Create Class</Button>} />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes.map((cls: any) => (
                                <TableRow key={cls._id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-medium py-4">{cls.name}</TableCell>
                                    <TableCell className="py-4">{cls.description || "N/A"}</TableCell>
                                    <TableCell className="py-4">{cls.studentCount ?? cls.students?.length ?? 0}</TableCell>
                                    <TableCell className="text-right py-4 space-x-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/academic/classes/${cls._id}`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteClass(cls._id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {error && <div className="text-sm text-amber-600">{error}</div>}

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Class</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Class Name</Label>
                            <Input
                                required
                                placeholder="e.g. Grade 10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full">Create Class</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
}
