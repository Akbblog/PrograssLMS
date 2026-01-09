"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { academicAPI } from "@/lib/api/endpoints";
import { unwrapArray } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus, School, ArrowLeft, Pencil, Trash2, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function AdminProgramsPage() {
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: ""
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res: any = await academicAPI.getPrograms();
            setPrograms(unwrapArray(res?.data, "programs"));
        } catch (error) {
            toast.error("Failed to load programs");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await academicAPI.createProgram({
                ...formData,
                description: formData.description || "No description"
            });
            toast.success("Program created successfully");
            setDialogOpen(false);
            setFormData({ name: "", description: "", duration: "" });
            fetchPrograms();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to create program");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this program?")) return;
        try {
            await academicAPI.deleteProgram(id);
            toast.success("Program deleted successfully");
            fetchPrograms();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete program");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/academic">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Link>
                </Button>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <School className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
                        <p className="text-muted-foreground">Manage academic programs</p>
                    </div>
                </div>
                <Button onClick={() => setDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Program
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <School className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Programs</p>
                                <p className="text-2xl font-bold">{programs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle>All Programs</CardTitle>
                    <CardDescription>Academic programs in your school</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {programs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <School className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Programs Yet</h3>
                            <p className="text-muted-foreground">Create your first program to get started</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.map((program: any) => (
                                    <TableRow key={program._id}>
                                        <TableCell className="font-medium">{program.name}</TableCell>
                                        <TableCell>{program.duration || "—"}</TableCell>
                                        <TableCell>{program.subjects?.length || 0}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/academic/programs/${program._id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(program._id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                                    <School className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <DialogTitle>Create New Program</DialogTitle>
                                    <DialogDescription>Add a new academic program to your school</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <DialogBody className="space-y-4">
                            <div className="space-y-2">
                                <Label>Program Name <span className="text-destructive">*</span></Label>
                                <Input
                                    required
                                    placeholder="e.g. Science, Arts"
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
                                    placeholder="Optional description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </DialogBody>
                        <DialogFooter className="gap-3">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="min-w-[140px]">Create Program</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
