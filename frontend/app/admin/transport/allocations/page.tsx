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
import { transportAPI, adminAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Loader2,
    Plus,
    Users,
    ChevronDown,
    Trash2,
    Edit,
    Route,
    MapPin,
    Search,
    DollarSign,
    Bus
} from 'lucide-react';

interface AllocationData {
    _id: string;
    student: { _id: string; name: string; class?: string };
    route: { _id: string; routeName: string; routeCode: string; monthlyFee: number };
    pickupStop: string;
    dropStop: string;
    monthlyFee: number;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
}

interface AllocationFormData {
    studentId: string;
    routeId: string;
    pickupStop: string;
    dropStop: string;
    monthlyFee: number;
    startDate: string;
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

const emptyFormData: AllocationFormData = {
    studentId: '',
    routeId: '',
    pickupStop: '',
    dropStop: '',
    monthlyFee: 0,
    startDate: new Date().toISOString().split('T')[0]
};

export default function AllocationsPage() {
    const [allocations, setAllocations] = useState<AllocationData[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAllocation, setEditingAllocation] = useState<AllocationData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [allocationToDelete, setAllocationToDelete] = useState<AllocationData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<AllocationFormData>(emptyFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [allocationsRes, routesRes, studentsRes] = await Promise.all([
                transportAPI.getAllocations(),
                transportAPI.getRoutes(),
                adminAPI.getStudents()
            ]);
            setAllocations(unwrapArray((allocationsRes as any)?.data, 'allocations'));
            setRoutes(unwrapArray((routesRes as any)?.data, 'routes'));
            setStudents(unwrapArray((studentsRes as any)?.data, 'students'));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingAllocation(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (allocation: AllocationData) => {
        setEditingAllocation(allocation);
        setFormData({
            studentId: allocation.student?._id || '',
            routeId: allocation.route?._id || '',
            pickupStop: allocation.pickupStop || '',
            dropStop: allocation.dropStop || '',
            monthlyFee: allocation.monthlyFee,
            startDate: allocation.startDate ? allocation.startDate.split('T')[0] : ''
        });
        setDialogOpen(true);
    };

    const handleRouteChange = (routeId: string) => {
        const selectedRoute = routes.find(r => r._id === routeId);
        setFormData(prev => ({
            ...prev,
            routeId,
            pickupStop: '',
            dropStop: '',
            monthlyFee: selectedRoute?.monthlyFee || 0
        }));
    };

    const handleSubmit = async () => {
        if (!formData.studentId || !formData.routeId || !formData.pickupStop) {
            toast.error('Please fill in all required fields');
            return;
        }

        setProcessing(true);
        try {
            const payload = {
                student: formData.studentId,
                route: formData.routeId,
                pickupStop: formData.pickupStop,
                dropStop: formData.dropStop || formData.pickupStop,
                monthlyFee: formData.monthlyFee,
                startDate: formData.startDate
            };

            if (editingAllocation) {
                await transportAPI.updateAllocation(editingAllocation._id, payload);
                toast.success('Allocation updated successfully');
            } else {
                await transportAPI.createAllocation(payload);
                toast.success('Student allocated to route successfully');
            }
            setDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save allocation');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!allocationToDelete) return;

        setProcessing(true);
        try {
            await transportAPI.deleteAllocation(allocationToDelete._id);
            toast.success('Allocation removed successfully');
            setDeleteDialogOpen(false);
            setAllocationToDelete(null);
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to remove allocation');
        } finally {
            setProcessing(false);
        }
    };

    const confirmDelete = (allocation: AllocationData) => {
        setAllocationToDelete(allocation);
        setDeleteDialogOpen(true);
    };

    // Get students not yet allocated
    const allocatedStudentIds = allocations.map(a => a.student?._id);
    const availableStudents = students.filter(s => !allocatedStudentIds.includes(s._id) || editingAllocation?.student?._id === s._id);

    const studentOptions = availableStudents.map(s => ({
        value: s._id,
        label: `${s.name} ${s.class ? `(${s.class})` : ''}`
    }));

    const routeOptions = routes.filter(r => r.isActive !== false).map(r => ({
        value: r._id,
        label: `${r.routeName} (${r.routeCode}) - $${r.monthlyFee}/month`
    }));

    const selectedRoute = routes.find(r => r._id === formData.routeId);
    const stopOptions = (selectedRoute?.stops || []).map((s: any) => ({
        value: s.name,
        label: `${s.name} (${s.time})`
    }));

    const filteredAllocations = allocations.filter(a =>
        a.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.route?.routeName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        totalAllocations: allocations.length,
        activeAllocations: allocations.filter(a => a.isActive).length,
        totalRevenue: allocations.filter(a => a.isActive).reduce((sum, a) => sum + (a.monthlyFee || 0), 0)
    };

    if (loading) {
        return (
            <AdminPageLayout title="Allocations" description="Student transport allocations">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Allocations" description="Student transport allocations">
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Allocations</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.totalAllocations}</div>
                            <p className="text-xs text-muted-foreground">students using transport</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Allocations</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Bus className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activeAllocations}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">from transport fees</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Allocations Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Student Allocations</CardTitle>
                                <CardDescription>Assign students to transport routes</CardDescription>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search allocations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                                    <Plus className="mr-2 h-4 w-4" /> Allocate Student
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredAllocations.length === 0 ? (
                            <div className="text-center py-16">
                                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'No allocations match your search' : 'No student allocations yet'}
                                </p>
                                {!searchQuery && (
                                    <Button onClick={openCreateDialog} variant="link" className="mt-2">
                                        Allocate your first student
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Pickup Stop</TableHead>
                                        <TableHead>Drop Stop</TableHead>
                                        <TableHead>Monthly Fee</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAllocations.map((allocation) => (
                                        <TableRow key={allocation._id}>
                                            <TableCell className="font-medium">{allocation.student?.name || 'Unknown'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Route className="h-3 w-3 text-purple-600" />
                                                    {allocation.route?.routeName || 'Unknown'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-green-600" />
                                                    {allocation.pickupStop}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-red-600" />
                                                    {allocation.dropStop}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">${allocation.monthlyFee}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={allocation.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                                                    {allocation.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(allocation)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => confirmDelete(allocation)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <DialogTitle>{editingAllocation ? 'Edit Allocation' : 'Allocate Student'}</DialogTitle>
                                    <DialogDescription>
                                        {editingAllocation ? 'Update transport allocation' : 'Assign a student to a transport route'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Student <span className="text-red-500">*</span></Label>
                                <NativeSelect
                                    value={formData.studentId}
                                    onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                                    placeholder="Select student..."
                                    options={studentOptions}
                                    disabled={!!editingAllocation}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Route <span className="text-red-500">*</span></Label>
                                <NativeSelect
                                    value={formData.routeId}
                                    onValueChange={handleRouteChange}
                                    placeholder="Select route..."
                                    options={routeOptions}
                                />
                            </div>

                            {formData.routeId && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Pickup Stop <span className="text-red-500">*</span></Label>
                                            <NativeSelect
                                                value={formData.pickupStop}
                                                onValueChange={(value) => setFormData({ ...formData, pickupStop: value })}
                                                placeholder="Select pickup stop..."
                                                options={stopOptions}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Drop Stop</Label>
                                            <NativeSelect
                                                value={formData.dropStop}
                                                onValueChange={(value) => setFormData({ ...formData, dropStop: value })}
                                                placeholder="Same as pickup..."
                                                options={stopOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Monthly Fee</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    value={formData.monthlyFee}
                                                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Auto-filled from route fee</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter className="gap-2 mt-6">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingAllocation ? 'Update Allocation' : 'Allocate Student'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-red-600">Remove Allocation</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove "{allocationToDelete?.student?.name}" from route "{allocationToDelete?.route?.routeName}"?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={processing}
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Remove
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}
