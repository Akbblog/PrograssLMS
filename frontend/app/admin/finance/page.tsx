"use client";

import { useEffect, useState } from "react";
import { financeAPI, academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus, DollarSign, CreditCard, FileText, TrendingUp, Landmark, Calendar, PieChart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminFinancePage() {
    const [feeStructures, setFeeStructures] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [report, setReport] = useState<any>(null);
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Advanced Form State
    const [feeForm, setFeeForm] = useState({
        name: "",
        description: "",
        academicYear: "",
        feeCategories: [
            { category: "tuition", name: "Primary Tuition", amount: "", isOptional: false, installmentAllowed: true }
        ],
        paymentPlans: [
            { name: "Full Payment", type: "full", lateFeePolicy: { enabled: true, gracePeriodDays: 10, lateFeeAmount: 50 } }
        ]
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchFinancialReport();
            fetchReminders();
        }
    }, [selectedYear]);

    const fetchMetadata = async () => {
        try {
            const [feesRes, classesRes, yearsRes] = await Promise.all([
                financeAPI.getFeeStructures(),
                academicAPI.getClasses(),
                academicAPI.getAcademicYears(),
            ]);

            setFeeStructures(feesRes.data || []);
            setClasses(classesRes.data || []);
            setYears(yearsRes.data || []);

            if (yearsRes.data.length > 0) {
                const active = yearsRes.data.find((y: any) => y.status === "active") || yearsRes.data[0];
                setSelectedYear(active._id);
            }
        } catch (error: any) {
            toast.error("Failed to load metadata");
        } finally {
            setLoading(false);
        }
    };

    const fetchFinancialReport = async () => {
        try {
            const res = await financeAPI.getFinancialReport({ academicYearId: selectedYear });
            setReport(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReminders = async () => {
        try {
            const res = await financeAPI.getReminders();
            setReminders(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateFee = async (e: React.FormEvent) => {
        e.preventDefault();
        // Transformation logic for advanced schema
        try {
            const payload = {
                ...feeForm,
                feeCategories: feeForm.feeCategories.map(c => ({ ...c, amount: Number(c.amount) }))
            };
            await financeAPI.createFeeStructure(payload);
            toast.success("Fee structure created successfully");
            setCreateDialogOpen(false);
            fetchMetadata();
        } catch (error: any) {
            toast.error(error.message || "Failed to create fee structure");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>

    return (
        <AdminPageLayout
            title="Finance"
            description="Advanced fee management, billing & revenue"
            actions={<div className="flex items-center gap-3"><Select value={selectedYear} onValueChange={setSelectedYear}><SelectTrigger className="w-[200px] bg-white"><SelectValue placeholder="Academic Year" /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>)}</SelectContent></Select><Button onClick={() => setCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"><Plus className="mr-2 h-4 w-4" /> New Fee Policy</Button></div>}
            stats={(
                <>
                    <SummaryStatCard title="Total Revenue" value={formatCurrency(report?.totalRevenue || 0)} icon={<DollarSign className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Received" value={formatCurrency(report?.receivedPayments || 0)} icon={<TrendingUp className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Pending" value={formatCurrency(report?.pendingPayments || 0)} icon={<PieChart className="h-4 w-4 text-white" />} variant="orange" />
                    <SummaryStatCard title="Overdue" value={formatCurrency(report?.overdueAmount || 0)} icon={<ShieldCheck className="h-4 w-4 text-white" />} variant="purple" />
                </>
            )}
        >
            <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Institutional Finance</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Advanced fee management, automated billing, and revenue intelligence.</p>
                </div>
            </div>

            {/* Financial Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Revenue (Year)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(report?.totalRevenue || 0)}</div>
                        <div className="flex items-center mt-2 text-xs text-success font-bold">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +4.5% from last period
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Received Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-success">{formatCurrency(report?.receivedPayments || 0)}</div>
                        <Badge variant="outline" className="mt-2 text-[10px] bg-success/10 text-success border-success/20 uppercase font-bold">Collected</Badge>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pending Collection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-400">{formatCurrency(report?.pendingPayments || 0)}</div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-3">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(report?.receivedPayments / (report?.receivedPayments + report?.pendingPayments)) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-card bg-destructive/5 dark:bg-destructive/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-destructive uppercase tracking-wide">Overdue Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-destructive">{formatCurrency(report?.overdueAmount || 0)}</div>
                        <p className="text-xs text-destructive/80 mt-2 font-bold underline cursor-pointer hover:text-destructive">View at-risk accounts</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="structures" className="w-full">
                <TabsList className="bg-transparent border-b border-slate-200 dark:border-slate-700 w-full justify-start rounded-none h-auto p-0 gap-8">
                    <TabsTrigger value="structures" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 pt-0 font-bold text-slate-500 hover:text-slate-700 data-[state=active]:text-primary transition-all">Fee Structures</TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 pt-0 font-bold text-slate-500 hover:text-slate-700 data-[state=active]:text-primary transition-all">Analytics & Reports</TabsTrigger>
                    <TabsTrigger value="reminders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 pt-0 font-bold text-slate-500 hover:text-slate-700 data-[state=active]:text-primary transition-all flex items-center gap-2">
                        Payment Reminders
                        {reminders.length > 0 && <Badge className="bg-destructive h-5 px-1.5 min-w-[20px] justify-center text-[10px]">{reminders.length}</Badge>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="structures" className="mt-8 space-y-6">
                    <Card className="border-none shadow-card overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Policy Name</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Year</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Categories</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Total Base Amount</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Status</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feeStructures.map(fee => (
                                        <TableRow key={fee._id}>
                                            <TableCell className="font-bold text-slate-900 dark:text-white">{fee.name}</TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-400">{fee.academicYear?.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {fee.feeCategories?.map((c: any, i: number) => (
                                                        <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">{c.category}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(fee.feeCategories?.reduce((sum: number, c: any) => sum + c.amount, 0) || 0)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={fee.status === 'active' ? 'bg-success hover:bg-success/90' : 'bg-slate-400'}>{fee.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/5">Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-none shadow-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-bold text-lg">Class-wise Breakdown</CardTitle>
                                <CardDescription>Collection progress across different grade levels.</CardDescription>
                            </div>
                            <PieChart className="w-5 h-5 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {report?.classWiseBreakdown && Object.entries(report.classWiseBreakdown).map(([className, data]: [string, any]) => (
                                    <div key={className} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{className}</span>
                                            <span className="text-slate-500 font-medium">{formatCurrency(data.paid)} / {formatCurrency(data.total)}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${(data.paid / data.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-bold text-lg">Payment Methods</CardTitle>
                                <CardDescription>Distribution of collection channels.</CardDescription>
                            </div>
                            <CreditCard className="w-5 h-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center h-[300px] space-y-4">
                            {report?.paymentMethodBreakdown && Object.entries(report.paymentMethodBreakdown).map(([method, amount]: [string, any]) => (
                                <div key={method} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{method}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reminders" className="mt-8">
                    <Card className="border-none shadow-card overflow-hidden">
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">Automated Reminder Queue</CardTitle>
                            <CardDescription>Pending alerts for overdue and upcoming payments.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow>
                                        <TableHead className="font-bold">Type</TableHead>
                                        <TableHead className="font-bold">Student</TableHead>
                                        <TableHead className="font-bold">Guardian Email</TableHead>
                                        <TableHead className="font-bold">Amount Due</TableHead>
                                        <TableHead className="font-bold">Status Info</TableHead>
                                        <TableHead className="text-right font-bold">Notify</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reminders.map((reminder, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Badge className={reminder.type === 'overdue' ? 'bg-destructive' : 'bg-info'}>
                                                    {reminder.type.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-900 dark:text-white">{reminder.student}</TableCell>
                                            <TableCell className="text-slate-500">{reminder.guardianEmail}</TableCell>
                                            <TableCell className="font-black text-slate-900 dark:text-white">{formatCurrency(reminder.amountDue)}</TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                {reminder.type === 'overdue' ? `${reminder.daysOverdue} days late` : `Due in ${reminder.daysUntilDue} days`}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/50 font-bold">Send Alert</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Create Fee Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">Configure Fee Policy</DialogTitle>
                        <DialogDescription>Define advanced fee categories and behavioral discount logic.</DialogDescription>
                    </DialogHeader>
                    {/* Simplified form for demo */}
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700 dark:text-slate-300">Policy Name</Label>
                                <Input placeholder="Annual Tution 2024" value={feeForm.name} onChange={(e) => setFeeForm({ ...feeForm, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700 dark:text-slate-300">Academic Year</Label>
                                <Select value={feeForm.academicYear} onValueChange={(val) => setFeeForm({ ...feeForm, academicYear: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>
                                        {years.map(y => <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 dark:text-slate-300">Primary Amount</Label>
                            <Input type="number" value={feeForm.feeCategories[0].amount} onChange={(e) => {
                                let cats = [...feeForm.feeCategories];
                                cats[0].amount = e.target.value;
                                setFeeForm({ ...feeForm, feeCategories: cats });
                            }} />
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <Button onClick={handleCreateFee} className="flex-1 bg-primary text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30">Active Policy</Button>
                            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="h-11 rounded-xl font-bold border-slate-200 dark:border-slate-700">Cancel</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
