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
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute, useVehicles } from '@/hooks/useTransport';
import {
    Loader2,
    Plus,
    Route,
    MapPin,
    ChevronDown,
    Trash2,
    Edit,
    Bus,
    DollarSign,
    Search,
    Clock
} from 'lucide-react';

interface Stop {
    name: string;
    time: string;
    distance?: number;
}

interface RouteData {
    _id: string;
    routeName: string;
    routeCode: string;
    vehicle?: { _id: string; vehicleNumber: string };
    stops: Stop[];
    monthlyFee: number;
    description?: string;
    isActive: boolean;
}

interface RouteFormData {
    routeName: string;
    routeCode: string;
    vehicleId: string;
    monthlyFee: number;
    description: string;
    stops: Stop[];
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

const emptyFormData: RouteFormData = {
    routeName: '',
    routeCode: '',
    vehicleId: '',
    monthlyFee: 0,
    description: '',
    stops: [{ name: '', time: '07:00' }]
};

export default function RoutesPage() {
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<RouteData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [routeToDelete, setRouteToDelete] = useState<RouteData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<RouteFormData>(emptyFormData);

    const { data: routesRes, isLoading: routesLoading } = useRoutes();
    const routes = (routesRes && (routesRes as any).data) ? unwrapArray((routesRes as any).data, 'routes') : (routesRes || []);

    const { data: vehiclesRes } = useVehicles();
    const vehicles = (vehiclesRes && (vehiclesRes as any).data) ? unwrapArray((vehiclesRes as any).data, 'vehicles') : (vehiclesRes || []);

    const { mutateAsync: createRoute } = useCreateRoute();
    const { mutateAsync: updateRoute } = useUpdateRoute();
    const { mutateAsync: deleteRoute } = useDeleteRoute();
    const openCreateDialog = () => {
        setEditingRoute(null);
        setFormData({ ...emptyFormData, routeCode: generateRouteCode() });
        setDialogOpen(true);
    };

    const openEditDialog = (route: RouteData) => {
        setEditingRoute(route);
        setFormData({
            routeName: route.routeName,
            routeCode: route.routeCode,
            vehicleId: route.vehicle?._id || '',
            monthlyFee: route.monthlyFee,
            description: route.description || '',
            stops: route.stops.length > 0 ? route.stops : [{ name: '', time: '07:00' }]
        });
        setDialogOpen(true);
    };

    const generateRouteCode = () => {
        const num = routes.length + 1;
        return `R${String(num).padStart(3, '0')}`;
    };

    const addStop = () => {
        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, { name: '', time: '07:00' }]
        }));
    };

    const removeStop = (index: number) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index)
        }));
    };

    const updateStop = (index: number, field: keyof Stop, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.map((stop, i) => 
                i === index ? { ...stop, [field]: value } : stop
            )
        }));
    };

    const handleSubmit = async () => {
        if (!formData.routeName || !formData.routeCode) {
            toast.error('Please fill in all required fields');
            return;
        }

        const validStops = formData.stops.filter(s => s.name.trim());
        if (validStops.length === 0) {
            toast.error('Please add at least one stop');
            return;
        }

        setProcessing(true);
        try {
            const payload = {
                routeName: formData.routeName,
                routeCode: formData.routeCode,
                vehicle: formData.vehicleId || undefined,
                monthlyFee: formData.monthlyFee,
                description: formData.description,
                stops: validStops
            };

            if (editingRoute) {
                await updateRoute({ id: editingRoute._id, ...payload });
                toast.success('Route updated successfully');
            } else {
                await createRoute(payload);
                toast.success('Route created successfully');
            }
            setDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save route');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!routeToDelete) return;

        setProcessing(true);
        try {
            await deleteRoute(routeToDelete._id);
            toast.success('Route deleted successfully');
            setDeleteDialogOpen(false);
            setRouteToDelete(null);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete route');
        } finally {
            setProcessing(false);
        }
    };

    const confirmDelete = (route: RouteData) => {
        setRouteToDelete(route);
        setDeleteDialogOpen(true);
    };

    const vehicleOptions = vehicles
        .filter((v: any) => v.status === 'active')
        .map((v: any) => ({
            value: v._id,
            label: `${v.vehicleNumber} - ${v.vehicleType} (${v.capacity} seats)`
        }));

    const filteredRoutes = routes.filter((r: any) =>
        r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.routeCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        totalRoutes: routes.length,
        activeRoutes: routes.filter((r: any) => r.isActive).length,
        totalStops: routes.reduce((sum: number, r: any) => sum + (r.stops?.length || 0), 0)
    };

    if (routesLoading) {
        return (
            <AdminPageLayout title="Routes" description="Manage routes and stops">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Routes" description="Manage transport routes and stops">
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Route className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.totalRoutes}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Bus className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activeRoutes}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stops</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalStops}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Routes Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Transport Routes</CardTitle>
                                <CardDescription>Manage pickup/drop routes with stops</CardDescription>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search routes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                                    <Plus className="mr-2 h-4 w-4" /> Add Route
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredRoutes.length === 0 ? (
                            <div className="text-center py-16">
                                <Route className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'No routes match your search' : 'No routes configured yet'}
                                </p>
                                {!searchQuery && (
                                    <Button onClick={openCreateDialog} variant="link" className="mt-2">
                                        Add your first route
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Stops</TableHead>
                                        <TableHead>Monthly Fee</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRoutes.map((route: any) => (
                                        <TableRow key={route._id}>
                                            <TableCell className="font-medium">{route.routeName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{route.routeCode}</Badge>
                                            </TableCell>
                                            <TableCell>{route.vehicle?.vehicleNumber || 'Not assigned'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {route.stops?.length || 0} stops
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">${route.monthlyFee}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={route.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                                                    {route.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(route)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => confirmDelete(route)}
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
                                    <Route className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <DialogTitle>{editingRoute ? 'Edit Route' : 'Add Route'}</DialogTitle>
                                    <DialogDescription>{editingRoute ? 'Update route details' : 'Create a new route and its stops'}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <DialogBody>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Route Name <span className="text-destructive ml-1">*</span></Label>
                                    <Input
                                        value={formData.routeName}
                                        onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                                        placeholder="e.g., North City Route"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Route Code <span className="text-destructive ml-1">*</span></Label>
                                    <Input
                                        value={formData.routeCode}
                                        onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
                                        placeholder="e.g., R001"
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Assign Vehicle</Label>
                                    <NativeSelect
                                        value={formData.vehicleId}
                                        onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                                        placeholder="Select vehicle..."
                                        options={vehicleOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Monthly Fee <span className="text-destructive ml-1">*</span></Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={formData.monthlyFee}
                                            onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                                            className="pl-10 h-10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional route description..."
                                />
                            </div>

                            {/* Stops Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-foreground">Route Stops <span className="text-destructive ml-1">*</span></Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addStop}>
                                        <Plus className="h-3 w-3 mr-1" /> Add Stop
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {formData.stops.map((stop, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <Input
                                                value={stop.name}
                                                onChange={(e) => updateStop(index, 'name', e.target.value)}
                                                placeholder="Stop name..."
                                                className="flex-1 h-10"
                                            />
                                            <Input
                                                type="time"
                                                value={stop.time}
                                                onChange={(e) => updateStop(index, 'time', e.target.value)}
                                                className="w-28 h-10"
                                            />
                                            {formData.stops.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeStop(index)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
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
                                {editingRoute ? 'Update Route' : 'Save Route'}
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
                                    <DialogTitle>Delete Route</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete the route "{routeToDelete?.routeName}"? This action cannot be undone.
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
