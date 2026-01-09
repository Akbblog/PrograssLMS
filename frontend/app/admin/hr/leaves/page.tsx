"use client";

import React, { useEffect, useState } from 'react';
import AdminPageLayout from '@/components/layouts/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogBody } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hrAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Loader2,
    Calendar,
    Plus,
    CheckCircle,
    XCircle,
    Clock,
    ChevronDown,
    CalendarDays,
    Briefcase,
    Heart,
    Plane,
    AlertTriangle
} from 'lucide-react';

interface LeaveApplication {
    _id: string;
    staff: { _id: string; personalInfo?: { firstName: string; lastName: string }; name?: string };
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: any;
    reviewNote?: string;
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

const leaveTypeOptions = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
];

const getLeaveIcon = (type: string) => {
    switch (type) {
        case 'sick': return <Heart className="h-4 w-4" />;
        case 'earned': return <Briefcase className="h-4 w-4" />;
        case 'casual': return <Plane className="h-4 w-4" />;
        default: return <CalendarDays className="h-4 w-4" />;
    }
};

export default function LeavesPage() {
    const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const [formData, setFormData] = useState({
        staffId: '',
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leavesRes, staffRes] = await Promise.all([
                hrAPI.getLeaves(),
                hrAPI.getStaff()
            ]);
            setLeaves(unwrapArray((leavesRes as any)?.data, 'leaves'));
            setStaff(unwrapArray((staffRes as any)?.data, 'staff'));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setLeaves([]);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            staffId: '',
            leaveType: '',
            fromDate: '',
            toDate: '',
            reason: ''
        });
    };

    const handleApplyLeave = async () => {
        if (!formData.staffId || !formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason) {
            toast.error('Please fill in all required fields');
            return;
        }

        const fromDate = new Date(formData.fromDate);
        const toDate = new Date(formData.toDate);
        if (toDate < fromDate) {
            toast.error('End date must be after start date');
            return;
        }

        setSaving(true);
        try {
            await hrAPI.applyLeave({
                staff: formData.staffId,
                leaveType: formData.leaveType,
                fromDate: formData.fromDate,
                toDate: formData.toDate,
                reason: formData.reason
            });
            toast.success('Leave application submitted successfully');
            setApplyDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to submit leave application');
        } finally {
            setSaving(false);
        }
    };

    const handleApprove = async (leaveId: string) => {
        setProcessing(leaveId);
        try {
            await hrAPI.approveLeave(leaveId);
            toast.success('Leave approved successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to approve leave');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (leaveId: string) => {
        setProcessing(leaveId);
        try {
            await hrAPI.rejectLeave(leaveId, 'Leave request rejected');
            toast.success('Leave rejected');
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to reject leave');
        } finally {
            setProcessing(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
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

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysBetween = (from: string, to: string) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const filteredLeaves = leaves.filter(l => {
        if (activeTab === 'all') return true;
        return l.status === activeTab;
    });

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status === 'pending').length,
        approved: leaves.filter(l => l.status === 'approved').length,
        rejected: leaves.filter(l => l.status === 'rejected').length
    };

    const staffOptions = staff.map(s => ({
        value: s._id,
        label: getStaffName(s)
    }));

    if (loading) {
        return (
            <AdminPageLayout title="Leaves" description="Apply and manage leaves">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Leave Management" description="Apply and manage staff leaves">
            <div className="p-6 space-y-6">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Leave Applications</h2>
                        <p className="text-muted-foreground">Manage leave requests and approvals</p>
                    </div>
                    <Button onClick={() => setApplyDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" /> Apply Leave
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
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
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leaves Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Leave Requests</CardTitle>
                                <CardDescription>View and manage all leave applications</CardDescription>
                            </div>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-4 w-[320px]">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="approved">Approved</TabsTrigger>
                                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredLeaves.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <Calendar className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold">No Leave Requests</h3>
                                <p className="text-muted-foreground mb-4">No leave applications found</p>
                                <Button onClick={() => setApplyDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Apply Leave
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead>Staff Member</TableHead>
                                        <TableHead>Leave Type</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeaves.map((leave) => (
                                        <TableRow key={leave._id}>
                                            <TableCell className="font-medium">
                                                {getStaffName(leave.staff)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getLeaveIcon(leave.leaveType)}
                                                    <span className="capitalize">{leave.leaveType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {getDaysBetween(leave.fromDate, leave.toDate)} days
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <p className="truncate text-sm text-muted-foreground">
                                                    {leave.reason}
                                                </p>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(leave.status)}</TableCell>
                                            <TableCell className="text-right">
                                                {leave.status === 'pending' && (
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleApprove(leave._id)}
                                                            disabled={processing === leave._id}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            {processing === leave._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReject(leave._id)}
                                                            disabled={processing === leave._id}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Apply Leave Dialog */}
                <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-sm">
                                    <Calendar className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <DialogTitle>Apply for Leave</DialogTitle>
                                    <DialogDescription>
                                        Submit a new leave application
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <DialogBody>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Staff Member <span className="text-destructive ml-1">*</span></Label>
                                    <NativeSelect
                                        value={formData.staffId}
                                        onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                                        placeholder="Select staff member"
                                        options={staffOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Leave Type <span className="text-destructive ml-1">*</span></Label>
                                    <NativeSelect
                                        value={formData.leaveType}
                                        onValueChange={(value) => setFormData({ ...formData, leaveType: value })}
                                        placeholder="Select leave type"
                                        options={leaveTypeOptions}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">From Date <span className="text-destructive ml-1">*</span></Label>
                                        <Input
                                            type="date"
                                            value={formData.fromDate}
                                            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">To Date <span className="text-destructive ml-1">*</span></Label>
                                        <Input
                                            type="date"
                                            value={formData.toDate}
                                            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Reason <span className="text-destructive ml-1">*</span></Label>
                                    <Textarea
                                        placeholder="Explain the reason for leave..."
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </DialogBody>
                        <DialogFooter className="gap-3">
                            <Button
                                variant="outline"
                                onClick={() => { setApplyDialogOpen(false); resetForm(); }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleApplyLeave}
                                disabled={saving}
                                className="min-w-[120px]"
                            >
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}