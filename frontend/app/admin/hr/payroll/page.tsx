"use client";

import React, { useEffect, useState } from 'react';
import AdminPageLayout from '@/components/layouts/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hrAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Loader2,
    DollarSign,
    Calendar,
    Users,
    FileText,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    Play,
    Banknote,
    TrendingUp
} from 'lucide-react';

interface PayrollItem {
    _id: string;
    staff: { _id: string; personalInfo?: { firstName: string; lastName: string }; name?: string };
    month: number;
    year: number;
    basicSalary: number;
    allowances: { type: string; amount: number }[];
    deductions: { type: string; amount: number }[];
    netSalary: number;
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    createdAt: string;
}

// Native select component
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
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const getMonthName = (month: number) => monthOptions.find(m => m.value === String(month))?.label || '';

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    const [generateForm, setGenerateForm] = useState({
        month: String(new Date().getMonth() + 1),
        year: String(new Date().getFullYear()),
        staffId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [payrollsRes, staffRes] = await Promise.all([
                hrAPI.getPayrolls(),
                hrAPI.getStaff()
            ]);
            setPayrolls(unwrapArray((payrollsRes as any)?.data, 'payrolls'));
            setStaff(unwrapArray((staffRes as any)?.data, 'staff'));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // Use mock data for demo
            setPayrolls([]);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePayroll = async () => {
        if (!generateForm.month || !generateForm.year) {
            toast.error('Please select month and year');
            return;
        }

        setGenerating(true);
        try {
            await hrAPI.generatePayroll({
                month: parseInt(generateForm.month),
                year: parseInt(generateForm.year),
                staffId: generateForm.staffId || undefined
            });
            toast.success('Payroll generated successfully');
            setGenerateDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to generate payroll');
        } finally {
            setGenerating(false);
        }
    };

    const handleProcessPayroll = async (payrollId: string) => {
        setProcessing(payrollId);
        try {
            await hrAPI.processPayroll(payrollId);
            toast.success('Payroll processed successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to process payroll');
        } finally {
            setProcessing(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
            case 'approved':
                return <Badge className="bg-blue-100 text-blue-700"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
            case 'paid':
                return <Badge className="bg-green-100 text-green-700"><Banknote className="h-3 w-3 mr-1" /> Paid</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getStaffName = (staffItem: any) => {
        if (!staffItem) return 'Unknown';
        if (staffItem.personalInfo) {
            return `${staffItem.personalInfo.firstName} ${staffItem.personalInfo.lastName}`;
        }
        return staffItem.name || 'Unknown';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const filteredPayrolls = payrolls.filter(p => {
        if (activeTab === 'all') return true;
        return p.status === activeTab;
    });

    const stats = {
        total: payrolls.length,
        pending: payrolls.filter(p => p.status === 'pending').length,
        paid: payrolls.filter(p => p.status === 'paid').length,
        totalPaid: payrolls.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.netSalary || 0), 0)
    };

    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - 2 + i;
        return { value: String(year), label: String(year) };
    });

    const staffOptions = staff.map(s => ({
        value: s._id,
        label: getStaffName(s)
    }));

    if (loading) {
        return (
            <AdminPageLayout title="Payroll" description="Generate and process payroll">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Payroll Management" description="Generate and process staff payroll">
            <div className="p-6 space-y-6">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Payroll Overview</h2>
                        <p className="text-muted-foreground">Manage salary processing and payments</p>
                    </div>
                    <Button onClick={() => setGenerateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Play className="mr-2 h-4 w-4" /> Generate Payroll
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Payroll entries</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Awaiting approval</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paid</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
                            <p className="text-xs text-muted-foreground">Completed payments</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalPaid)}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payroll Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Payroll Records</CardTitle>
                                <CardDescription>View and manage all payroll entries</CardDescription>
                            </div>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-4 w-[300px]">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="approved">Approved</TabsTrigger>
                                    <TabsTrigger value="paid">Paid</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredPayrolls.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <DollarSign className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold">No Payroll Records</h3>
                                <p className="text-muted-foreground mb-4">Generate payroll to get started</p>
                                <Button onClick={() => setGenerateDialogOpen(true)}>
                                    <Play className="mr-2 h-4 w-4" /> Generate Payroll
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead>Staff Member</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Basic Salary</TableHead>
                                        <TableHead>Allowances</TableHead>
                                        <TableHead>Deductions</TableHead>
                                        <TableHead>Net Salary</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayrolls.map((payroll) => {
                                        const totalAllowances = payroll.allowances?.reduce((sum, a) => sum + a.amount, 0) || 0;
                                        const totalDeductions = payroll.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
                                        
                                        return (
                                            <TableRow key={payroll._id}>
                                                <TableCell className="font-medium">
                                                    {getStaffName(payroll.staff)}
                                                </TableCell>
                                                <TableCell>
                                                    {getMonthName(payroll.month)} {payroll.year}
                                                </TableCell>
                                                <TableCell>{formatCurrency(payroll.basicSalary || 0)}</TableCell>
                                                <TableCell className="text-green-600">
                                                    +{formatCurrency(totalAllowances)}
                                                </TableCell>
                                                <TableCell className="text-red-600">
                                                    -{formatCurrency(totalDeductions)}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    {formatCurrency(payroll.netSalary || 0)}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedPayroll(payroll)}
                                                        >
                                                            View
                                                        </Button>
                                                        {payroll.status === 'pending' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleProcessPayroll(payroll._id)}
                                                                disabled={processing === payroll._id}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                {processing === payroll._id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    'Approve'
                                                                )}
                                                            </Button>
                                                        )}
                                                        {payroll.status === 'paid' && (
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Generate Payroll Dialog */}
                <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <DialogTitle>Generate Payroll</DialogTitle>
                                    <DialogDescription>
                                        Generate payroll for staff members
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Month <span className="text-red-500">*</span></Label>
                                    <NativeSelect
                                        value={generateForm.month}
                                        onValueChange={(value) => setGenerateForm({ ...generateForm, month: value })}
                                        placeholder="Select month"
                                        options={monthOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Year <span className="text-red-500">*</span></Label>
                                    <NativeSelect
                                        value={generateForm.year}
                                        onValueChange={(value) => setGenerateForm({ ...generateForm, year: value })}
                                        placeholder="Select year"
                                        options={yearOptions}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Staff Member (Optional)</Label>
                                <NativeSelect
                                    value={generateForm.staffId}
                                    onValueChange={(value) => setGenerateForm({ ...generateForm, staffId: value })}
                                    placeholder="All staff members"
                                    options={[{ value: '', label: 'All Staff Members' }, ...staffOptions]}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Leave empty to generate for all staff
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setGenerateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGeneratePayroll}
                                disabled={generating}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Payroll
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Payroll Details Dialog */}
                <Dialog open={!!selectedPayroll} onOpenChange={() => setSelectedPayroll(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Payroll Details</DialogTitle>
                            <DialogDescription>
                                {selectedPayroll && `${getMonthName(selectedPayroll.month)} ${selectedPayroll.year}`}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedPayroll && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-slate-50">
                                    <h4 className="font-medium mb-2">Staff: {getStaffName(selectedPayroll.staff)}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>Basic Salary:</div>
                                        <div className="font-medium">{formatCurrency(selectedPayroll.basicSalary || 0)}</div>
                                    </div>
                                </div>

                                {selectedPayroll.allowances?.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2 text-green-600">Allowances</h4>
                                        {selectedPayroll.allowances.map((a, i) => (
                                            <div key={i} className="flex justify-between text-sm py-1">
                                                <span>{a.type}</span>
                                                <span className="text-green-600">+{formatCurrency(a.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedPayroll.deductions?.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2 text-red-600">Deductions</h4>
                                        {selectedPayroll.deductions.map((d, i) => (
                                            <div key={i} className="flex justify-between text-sm py-1">
                                                <span>{d.type}</span>
                                                <span className="text-red-600">-{formatCurrency(d.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">Net Salary</span>
                                        <span className="font-bold text-2xl text-purple-600">
                                            {formatCurrency(selectedPayroll.netSalary || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedPayroll(null)}>
                                Close
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Download className="mr-2 h-4 w-4" /> Download Payslip
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}