"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, BookOpen, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        program: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjectsRes, programsRes] = await Promise.all([
                academicAPI.getSubjects(),
                academicAPI.getPrograms()
            ]);
            setSubjects(unwrapArray((subjectsRes as any)?.data, "subjects"));
            setPrograms(unwrapArray((programsRes as any)?.data, "programs"));
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Use simple subject creation if no program is selected
            if (formData.program) {
                await academicAPI.createSubject(formData.program, {
                    name: formData.name,
                    description: formData.description
                });
            } else {
                await academicAPI.createSimpleSubject({
                    name: formData.name,
                    description: formData.description
                });
            }
            toast.success("Subject created successfully");
            setCreateDialogOpen(false);
            setFormData({ name: "", description: "", program: "" });
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to create subject");
        }
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        try {
            await academicAPI.deleteSubject(id);
            toast.success("Subject deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete subject");
        }
    };

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
                    <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
                    <p className="text-muted-foreground">Manage subjects and curriculum</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subjects.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    {subjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Subjects Yet</h3>
                            <p className="text-muted-foreground">Create your first subject to get started</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjects.map((subject: any) => (
                                    <TableRow key={subject._id}>
                                        <TableCell className="font-medium">{subject.name}</TableCell>
                                        <TableCell>{subject.description || "N/A"}</TableCell>
                                        <TableCell>{subject.program?.name || "N/A"}</TableCell>
                                        <TableCell>{subject.teacher?.name || "Not assigned"}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/academic/subjects/${subject._id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteSubject(subject._id)}
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
                </CardContent>
            </Card>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Subject</DialogTitle>
                        <DialogDescription>
                            Add a new subject to your curriculum. You can optionally assign it to a program.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubject} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Subject Name</Label>
                            <Input
                                required
                                placeholder="e.g. Mathematics"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Program <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                            <Select
                                value={formData.program}
                                onValueChange={(val) => setFormData({ ...formData, program: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Program (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p: any) => (
                                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full">Create Subject</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
