"use client";

import React, { useEffect, useState } from 'react';
import AdminPageLayout from '@/components/layouts/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { transportAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Loader2,
    Plus,
    Bus,
    ChevronDown,
    Trash2,
    Edit,
    Users,
    Calendar,
    Search,
    AlertTriangle,
    CheckCircle,
    Wrench
} from 'lucide-react';

interface VehicleData {
    _id: string;
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    driverName?: string;
    driverPhone?: string;
    status: 'active' | 'maintenance' | 'inactive';
    insuranceExpiry?: string;
    fitnessExpiry?: string;
    make?: string;
    model?: string;
    year?: number;
}

interface VehicleFormData {
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    status: 'active' | 'maintenance' | 'inactive';
    insuranceExpiry: string;
    fitnessExpiry: string;
    make: string;
    model: string;
    year: number;
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

const vehicleTypes = [
    { value: 'bus', label: 'Bus' },
    { value: 'mini-bus', label: 'Mini Bus' },
    { value: 'van', label: 'Van' },
    { value: 'car', label: 'Car' }
];

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'inactive', label: 'Inactive' }
];

const emptyFormData: VehicleFormData = {
    vehicleNumber: '',
    vehicleType: 'bus',
    capacity: 0,
    driverName: '',
    driverPhone: '',
    status: 'active',
    insuranceExpiry: '',
    fitnessExpiry: '',
    make: '',
    model: '',
    year: new Date().getFullYear()
};

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<VehicleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<VehicleData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<VehicleFormData>(emptyFormData);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await transportAPI.getVehicles();
            setVehicles(unwrapArray((res as any)?.data, 'vehicles'));
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingVehicle(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (vehicle: VehicleData) => {
        setEditingVehicle(vehicle);
        setFormData({
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity,
            driverName: vehicle.driverName || '',
            driverPhone: vehicle.driverPhone || '',
            status: vehicle.status,
            insuranceExpiry: vehicle.insuranceExpiry ? vehicle.insuranceExpiry.split('T')[0] : '',
            fitnessExpiry: vehicle.fitnessExpiry ? vehicle.fitnessExpiry.split('T')[0] : '',
            make: vehicle.make || '',
            model: vehicle.model || '',
            year: vehicle.year || new Date().getFullYear()
        });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.vehicleNumber || !formData.vehicleType || !formData.capacity) {
            toast.error('Please fill in all required fields');
            return;
        }

        setProcessing(true);
        try {
            const payload = {
                vehicleNumber: formData.vehicleNumber,
                vehicleType: formData.vehicleType,
                capacity: formData.capacity,
                driverName: formData.driverName || undefined,
                driverPhone: formData.driverPhone || undefined,
                status: formData.status,
                insuranceExpiry: formData.insuranceExpiry || undefined,
                fitnessExpiry: formData.fitnessExpiry || undefined,
                make: formData.make || undefined,
                model: formData.model || undefined,
                year: formData.year || undefined
            };

            if (editingVehicle) {
                await transportAPI.updateVehicle(editingVehicle._id, payload);
                toast.success('Vehicle updated successfully');
            } else {
                await transportAPI.createVehicle(payload);
                toast.success('Vehicle added successfully');
            }
            setDialogOpen(false);
            fetchVehicles();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save vehicle');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!vehicleToDelete) return;

        setProcessing(true);
        try {
            await transportAPI.deleteVehicle(vehicleToDelete._id);
            toast.success('Vehicle deleted successfully');
            setDeleteDialogOpen(false);
            setVehicleToDelete(null);
            fetchVehicles();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete vehicle');
        } finally {
            setProcessing(false);
        }
    };

    const confirmDelete = (vehicle: VehicleData) => {
        setVehicleToDelete(vehicle);
        setDeleteDialogOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
            case 'maintenance':
                return <Badge className="bg-yellow-100 text-yellow-700"><Wrench className="h-3 w-3 mr-1" /> Maintenance</Badge>;
            case 'inactive':
                return <Badge className="bg-slate-100 text-slate-700">Inactive</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const isExpiringSoon = (dateStr?: string) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const today = new Date();
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
    };

    const isExpired = (dateStr?: string) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredVehicles = vehicles.filter(v =>
        v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driverName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'active').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        totalCapacity: vehicles.filter(v => v.status === 'active').reduce<number>((sum, v) => sum + (v.capacity || 0), 0)
    };

    const expiringSoon = vehicles.filter(v => 
        isExpiringSoon(v.insuranceExpiry) || isExpiringSoon(v.fitnessExpiry)
    ).length;

    if (loading) {
        return (
            <AdminPageLayout title="Vehicles" description="Fleet management">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Vehicles" description="Fleet management">
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Bus className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalCapacity}</div>
                            <p className="text-xs text-muted-foreground">seats available</p>
                        </CardContent>
                    </Card>
                    {expiringSoon > 0 && (
                        <Card className="border-0 shadow-lg border-l-4 border-l-yellow-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{expiringSoon}</div>
                                <p className="text-xs text-muted-foreground">insurance/fitness</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Vehicles Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Fleet Management</CardTitle>
                                <CardDescription>Manage school vehicles and drivers</CardDescription>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search vehicles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                                    <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredVehicles.length === 0 ? (
                            <div className="text-center py-16">
                                <Bus className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'No vehicles match your search' : 'No vehicles added yet'}
                                </p>
                                {!searchQuery && (
                                    <Button onClick={openCreateDialog} variant="link" className="mt-2">
                                        Add your first vehicle
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Capacity</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Insurance</TableHead>
                                        <TableHead>Fitness</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVehicles.map((vehicle) => (
                                        <TableRow key={vehicle._id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{vehicle.vehicleNumber}</p>
                                                    {vehicle.make && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {vehicle.make} {vehicle.model} {vehicle.year}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {vehicle.vehicleType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3 text-muted-foreground" />
                                                    {vehicle.capacity}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.driverName ? (
                                                    <div>
                                                        <p className="text-sm">{vehicle.driverName}</p>
                                                        {vehicle.driverPhone && (
                                                            <p className="text-xs text-muted-foreground">{vehicle.driverPhone}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">Not assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className={
                                                    isExpired(vehicle.insuranceExpiry) 
                                                        ? 'text-red-600 font-medium' 
                                                        : isExpiringSoon(vehicle.insuranceExpiry) 
                                                            ? 'text-yellow-600' 
                                                            : ''
                                                }>
                                                    {formatDate(vehicle.insuranceExpiry)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={
                                                    isExpired(vehicle.fitnessExpiry) 
                                                        ? 'text-red-600 font-medium' 
                                                        : isExpiringSoon(vehicle.fitnessExpiry) 
                                                            ? 'text-yellow-600' 
                                                            : ''
                                                }>
                                                    {formatDate(vehicle.fitnessExpiry)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(vehicle)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => confirmDelete(vehicle)}
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
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
                                    <Bus className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
                                    <DialogDescription>
                                        {editingVehicle ? 'Update vehicle details' : 'Add a new vehicle to the fleet'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <DialogBody>
                        <div className="space-y-4">
                            {/* Vehicle Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Vehicle Number <span className="text-destructive ml-1">*</span></Label>
                                    <Input
                                        value={formData.vehicleNumber}
                                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                        placeholder="e.g., AB-12-CD-3456"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Vehicle Type <span className="text-destructive ml-1">*</span></Label>
                                    <NativeSelect
                                        value={formData.vehicleType}
                                        onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                                        placeholder="Select type..."
                                        options={vehicleTypes}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Capacity <span className="text-destructive ml-1">*</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                        placeholder="Seats"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Make</Label>
                                    <Input
                                        value={formData.make}
                                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                        placeholder="e.g., Toyota"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Model</Label>
                                    <Input
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        placeholder="e.g., Hiace"
                                    />
                                </div>
                            </div>

                            {/* Driver Info */}
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-3">Driver Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Driver Name</Label>
                                        <Input
                                            value={formData.driverName}
                                            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Driver Phone</Label>
                                        <Input
                                            value={formData.driverPhone}
                                            onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Compliance Dates */}
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-3">Compliance & Status</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Insurance Expiry</Label>
                                        <Input
                                            type="date"
                                            value={formData.insuranceExpiry}
                                            onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Fitness Expiry</Label>
                                        <Input
                                            type="date"
                                            value={formData.fitnessExpiry}
                                            onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Status</Label>
                                        <NativeSelect
                                            value={formData.status}
                                            onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'maintenance' | 'inactive' })}
                                            placeholder="Select status..."
                                            options={statusOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        </DialogBody>

                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="min-w-[160px]"
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
                                    <Trash2 className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <DialogTitle>Delete Vehicle</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete vehicle "{vehicleToDelete?.vehicleNumber}"? This action cannot be undone.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={processing}
                                className="min-w-[120px]"
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}
