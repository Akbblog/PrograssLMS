"use client";

import { useEffect, useState } from "react";
import { financeAPI, adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, DollarSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function FeeManagementPage() {
    const [feeStructures, setFeeStructures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        dueDate: "",
        type: "tuition",
        academicYear: "",
        academicTerm: "",
        classLevels: [] as string[], // Simplified for now
    });

    // Dropdown data
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [academicTerms, setAcademicTerms] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [fees, years, terms] = await Promise.all([
                financeAPI.getFeeStructures(),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);
            setFeeStructures((fees as any).data || []);
            setAcademicYears((years as any).data || []);
            setAcademicTerms((terms as any).data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await financeAPI.createFeeStructure({
                ...formData,
                amount: Number(formData.amount),
            });
            toast.success("Fee structure created");
            setOpen(false);
            fetchData(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to create fee structure");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
                    <p className="text-muted-foreground">
                        Manage fee structures and payments.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Fee Structure
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Fee Structure</DialogTitle>
                            <DialogDescription>
                                Define a new fee head for a specific term and class.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Term 1 Tuition"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="pl-8"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tuition">Tuition</SelectItem>
                                        <SelectItem value="transport">Transport</SelectItem>
                                        <SelectItem value="library">Library</SelectItem>
                                        <SelectItem value="exam">Exam</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="academicYear">Academic Year</Label>
                                <Select
                                    value={formData.academicYear}
                                    onValueChange={(val) => setFormData({ ...formData, academicYear: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map((year: any) => (
                                            <SelectItem key={year._id} value={year._id}>
                                                {year.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="academicTerm">Academic Term</Label>
                                <Select
                                    value={formData.academicTerm}
                                    onValueChange={(val) => setFormData({ ...formData, academicTerm: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicTerms.map((term: any) => (
                                            <SelectItem key={term._id} value={term._id}>
                                                {term.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fee Structures</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Term</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feeStructures.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No fee structures found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    feeStructures.map((fee) => (
                                        <TableRow key={fee._id}>
                                            <TableCell className="font-medium">{fee.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {fee.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>${fee.amount.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{fee.academicTerm?.name}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
