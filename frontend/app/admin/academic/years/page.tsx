"use client";

import { useState } from "react";
import { useAcademicYears, useCreateAcademicYear, useUpdateAcademicYear, useDeleteAcademicYear } from "@/hooks/useAcademicYears";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Calendar, Pencil, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

interface AcademicYear {
    _id: string;
    name: string;
    fromYear: string;
    toYear: string;
    isCurrent: boolean;
    createdAt: string;
}

export default function AcademicYearsPage() {
    const { data: yearsRes, isLoading: yearsLoading } = useAcademicYears();
    const years: AcademicYear[] = (yearsRes && (yearsRes as any).data) ? unwrapArray((yearsRes as any).data, "years") : [];

    const { mutateAsync: createAcademicYear } = useCreateAcademicYear();
    const { mutateAsync: updateAcademicYear } = useUpdateAcademicYear();
    const { mutateAsync: deleteAcademicYear } = useDeleteAcademicYear();

    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        fromYear: "",
        toYear: "",
        isCurrent: false
    });
    const resetForm = () => {
        setFormData({
            name: "",
            fromYear: "",
            toYear: "",
            isCurrent: false
        });
        setEditingYear(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setDialogOpen(true);
    };

    const openEditDialog = (year: AcademicYear) => {
        setEditingYear(year);
        setFormData({
            name: year.name,
            fromYear: year.fromYear ? new Date(year.fromYear).toISOString().split('T')[0] : "",
            toYear: year.toYear ? new Date(year.toYear).toISOString().split('T')[0] : "",
            isCurrent: year.isCurrent || false
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.fromYear || !formData.toYear) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSaving(true);
        try {
            if (editingYear) {
                await updateAcademicYear({ ...formData, id: editingYear._id });
                toast.success("Academic year updated successfully");
            } else {
                await createAcademicYear(formData);
                toast.success("Academic year created successfully");
            }
            setDialogOpen(false);
            resetForm();
        } catch (error: any) {
            const errorMessage = error?.message || error?.response?.data?.message || "Operation failed";
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this academic year?")) return;

        try {
            await deleteAcademicYear(id);
            toast.success("Academic year deleted successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete academic year");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (yearsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
                    <p className="text-muted-foreground">Manage academic year periods for your school</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Academic Year
                </Button>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Academic Years</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{years.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Year</CardTitle>
                        <Check className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {years.find(y => y.isCurrent)?.name || "Not Set"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Academic Years</CardTitle>
                    <CardDescription>View and manage academic year periods</CardDescription>
                </CardHeader>
                <CardContent>
                    {years.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Academic Years</h3>
                            <p className="text-muted-foreground">Create your first academic year to get started</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {years.map((year) => (
                                    <TableRow key={year._id}>
                                        <TableCell className="font-medium">{year.name}</TableCell>
                                        <TableCell>{formatDate(year.fromYear)}</TableCell>
                                        <TableCell>{formatDate(year.toYear)}</TableCell>
                                        <TableCell>
                                            {year.isCurrent ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Current
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditDialog(year)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(year._id)}
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

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingYear ? "Edit Academic Year" : "Create Academic Year"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingYear
                                ? "Update the academic year details below."
                                : "Enter the details for the new academic year."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Year Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                required
                                placeholder="e.g. 2024-2025"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fromYear">
                                    Start Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fromYear"
                                    type="date"
                                    required
                                    value={formData.fromYear}
                                    onChange={(e) => setFormData({ ...formData, fromYear: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="toYear">
                                    End Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="toYear"
                                    type="date"
                                    required
                                    value={formData.toYear}
                                    onChange={(e) => setFormData({ ...formData, toYear: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isCurrent"
                                checked={formData.isCurrent}
                                onCheckedChange={(checked) => setFormData({ ...formData, isCurrent: checked })}
                            />
                            <Label htmlFor="isCurrent">Set as current academic year</Label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingYear ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
