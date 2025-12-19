"use client";

import { useEffect, useState } from "react";
import { financeAPI, adminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, DollarSign, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function AdminFinancePage() {
    const [feeStructures, setFeeStructures] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Form state
    const [feeForm, setFeeForm] = useState({
        name: "",
        amount: "",
        classLevel: "",
        academicYear: "",
        academicTerm: "",
        dueDate: "",
        description: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [feesRes, classesRes, yearsRes, termsRes] = await Promise.all([
                financeAPI.getFeeStructures(),
                adminAPI.getClasses(), // Assuming this exists in adminAPI or academicAPI
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);

            setFeeStructures((feesRes as any).data || []);
            setClasses((classesRes as any).data || []);
            setYears((yearsRes as any).data || []);
            setTerms((termsRes as any).data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to load finance data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await financeAPI.createFeeStructure({
                ...feeForm,
                amount: Number(feeForm.amount)
            });
            toast.success("Fee structure created successfully");
            setCreateDialogOpen(false);
            fetchData();
            setFeeForm({
                name: "",
                amount: "",
                classLevel: "",
                academicYear: "",
                academicTerm: "",
                dueDate: "",
                description: ""
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to create fee structure");
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
                    <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
                    <p className="text-muted-foreground">Manage fee structures and payments</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Fee Structure
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fee Structures</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{feeStructures.length}</div>
                    </CardContent>
                </Card>
                {/* Add more stats as needed */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fee Structures</CardTitle>
                </CardHeader>
                <CardContent>
                    {feeStructures.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Fee Structures</h3>
                            <p className="text-muted-foreground text-sm mt-2">Create your first fee structure to get started</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Term</TableHead>
                                    <TableHead>Due Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feeStructures.map((fee: any) => (
                                    <TableRow key={fee._id}>
                                        <TableCell className="font-medium">{fee.name}</TableCell>
                                        <TableCell>{formatCurrency(fee.amount)}</TableCell>
                                        <TableCell>{fee.classLevel?.name || "All Classes"}</TableCell>
                                        <TableCell>{fee.academicTerm?.name || "N/A"}</TableCell>
                                        <TableCell>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Fee Structure</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateFee} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fee Name</Label>
                                <Input
                                    required
                                    placeholder="e.g. Tuition Fee Term 1"
                                    value={feeForm.name}
                                    onChange={(e) => setFeeForm({ ...feeForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={feeForm.amount}
                                    onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Class Level</Label>
                                <Select
                                    value={feeForm.classLevel}
                                    onValueChange={(val) => setFeeForm({ ...feeForm, classLevel: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((c: any) => (
                                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Select
                                    value={feeForm.academicYear}
                                    onValueChange={(val) => setFeeForm({ ...feeForm, academicYear: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y: any) => (
                                            <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Academic Term</Label>
                                <Select
                                    value={feeForm.academicTerm}
                                    onValueChange={(val) => setFeeForm({ ...feeForm, academicTerm: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {terms.map((t: any) => (
                                            <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input
                                    required
                                    type="date"
                                    value={feeForm.dueDate}
                                    onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label>Description</Label>
                                <Input
                                    placeholder="Optional description"
                                    value={feeForm.description}
                                    onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Create Fee Structure</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
