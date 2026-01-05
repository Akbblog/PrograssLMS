"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Clock, Pencil, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

interface AcademicTerm {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
    academicYear?: {
        _id: string;
        name: string;
    };
    createdAt: string;
}

interface AcademicYear {
    _id: string;
    name: string;
    isCurrent: boolean;
}

// Simple native select dropdown component
function NativeSelect({
    value,
    onValueChange,
    placeholder,
    options,
    disabled = false
}: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                disabled={disabled}
                className="w-full h-9 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
    );
}

export default function AcademicTermsPage() {
    const [terms, setTerms] = useState<AcademicTerm[]>([]);
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTerm, setEditingTerm] = useState<AcademicTerm | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: "",
        academicYear: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [termsRes, yearsRes] = await Promise.all([
                adminAPI.getAcademicTerms(),
                adminAPI.getAcademicYears()
            ]);
            setTerms(unwrapArray((termsRes as any)?.data, "terms"));
            setYears(unwrapArray((yearsRes as any)?.data, "years"));
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load academic terms");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            duration: "",
            academicYear: ""
        });
        setEditingTerm(null);
    };

    const openCreateDialog = () => {
        resetForm();
        // Default to current academic year
        const currentYear = years.find(y => y.isCurrent);
        if (currentYear) {
            setFormData(prev => ({ ...prev, academicYear: currentYear._id }));
        }
        setDialogOpen(true);
    };

    const openEditDialog = (term: AcademicTerm) => {
        setEditingTerm(term);
        setFormData({
            name: term.name,
            description: term.description || "",
            duration: term.duration || "",
            academicYear: term.academicYear?._id || ""
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Please enter a term name");
            return;
        }

        setSaving(true);
        try {
            if (editingTerm) {
                await adminAPI.updateAcademicTerm(editingTerm._id, formData);
                toast.success("Academic term updated successfully");
            } else {
                await adminAPI.createAcademicTerm(formData);
                toast.success("Academic term created successfully");
            }
            setDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            const errorMessage = error?.message || error?.response?.data?.message || "Operation failed";
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this academic term?")) return;

        try {
            await adminAPI.deleteAcademicTerm(id);
            toast.success("Academic term deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete academic term");
        }
    };

    const yearOptions = years.map(y => ({
        value: y._id,
        label: y.name + (y.isCurrent ? " (Current)" : "")
    }));

    if (loading) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Academic Terms</h1>
                    <p className="text-muted-foreground">Manage terms/semesters within academic years</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Term
                </Button>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Terms</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{terms.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Academic Terms</CardTitle>
                    <CardDescription>Terms/semesters for each academic year</CardDescription>
                </CardHeader>
                <CardContent>
                    {terms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Academic Terms</h3>
                            <p className="text-muted-foreground">Create your first academic term to get started</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Academic Year</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {terms.map((term) => (
                                    <TableRow key={term._id}>
                                        <TableCell className="font-medium">{term.name}</TableCell>
                                        <TableCell>
                                            {term.academicYear?.name || (
                                                <span className="text-muted-foreground">Not assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{term.duration || "N/A"}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {term.description || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditDialog(term)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(term._id)}
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
                            {editingTerm ? "Edit Academic Term" : "Create Academic Term"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTerm
                                ? "Update the academic term details below."
                                : "Enter the details for the new academic term."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Term Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                required
                                placeholder="e.g. Term 1, Fall Semester"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <NativeSelect
                                value={formData.academicYear}
                                onValueChange={(val) => setFormData({ ...formData, academicYear: val })}
                                placeholder="Select academic year"
                                options={yearOptions}
                            />
                            {years.length === 0 && (
                                <p className="text-xs text-amber-600">
                                    No academic years available. Create one first.
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                placeholder="e.g. 3 months, Sep - Dec"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Optional description for this term"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="min-h-[80px]"
                            />
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
                                {editingTerm ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
