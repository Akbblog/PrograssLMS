"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClasses, useCreateClass, useDeleteClass } from "@/hooks/useClasses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import GraduationCap from "@/components/icons/GraduationCap";
import { toast } from "sonner";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import EmptyState from '@/components/admin/EmptyState'
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminClassesPage() {
    const { data: classesRes, isLoading: classesLoading } = useClasses();
    const classes = (classesRes && (classesRes as any).data) ? (classesRes as any).data : (classesRes || []);

    const { mutateAsync: createClass, isLoading: creating } = useCreateClass();
    const { mutateAsync: deleteClass } = useDeleteClass();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [error, setError] = useState<string | null>(null);

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createClass(formData);
            toast.success("Class created successfully");
            setCreateDialogOpen(false);
            setFormData({ name: "", description: "" });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to create class";
            toast.error(errorMessage);
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;
        try {
            await deleteClass(id);
            toast.success("Class deleted successfully");
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
                    <SummaryStatCard title="Total Students" value={classes.reduce((acc: number, c: any) => acc + (c.studentCount || 0), 0)} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Active" value={classes.length} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="New This Month" value={0} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="orange" />
                </>
            )}
        >
            <div className="flex justify-end mb-4">
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Class
                </Button>
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                {classesLoading ? (
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Class</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass}>
                        <DialogBody>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="className" className="text-sm font-medium text-foreground">Class Name</Label>
                                    <Input
                                        id="className"
                                        required
                                        placeholder="e.g. Grade 10"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="Optional description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </DialogBody>
                        <DialogFooter className="gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="min-w-[120px]" disabled={creating}>
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Class
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
}
