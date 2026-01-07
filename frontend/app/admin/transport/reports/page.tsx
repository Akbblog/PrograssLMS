"use client";

import React, { useEffect, useState } from 'react';
import AdminPageLayout from '@/components/layouts/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transportAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import Link from 'next/link';
import {
    Loader2,
    Bus,
    Route,
    Users,
    DollarSign,
    MapPin,
    TrendingUp,
    FileText,
    Download,
    ArrowLeft
} from 'lucide-react';

interface RouteStats {
    _id: string;
    routeName: string;
    routeCode: string;
    totalStudents: number;
    monthlyRevenue: number;
    stops: number;
    vehicle?: string;
}

interface VehicleStats {
    _id: string;
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    currentLoad: number;
    utilization: number;
    route?: string;
}

export default function TransportReportsPage() {
    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [routesRes, vehiclesRes, allocationsRes] = await Promise.all([
                transportAPI.getRoutes(),
                transportAPI.getVehicles(),
                transportAPI.getAllocations()
            ]);
            setRoutes(unwrapArray((routesRes as any)?.data, 'routes'));
            setVehicles(unwrapArray((vehiclesRes as any)?.data, 'vehicles'));
            setAllocations(unwrapArray((allocationsRes as any)?.data, 'allocations'));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const stats = {
        totalRoutes: routes.length,
        activeRoutes: routes.filter(r => r.isActive !== false).length,
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'active').length,
        totalStudents: allocations.filter(a => a.isActive !== false).length,
        totalCapacity: vehicles.filter(v => v.status === 'active').reduce<number>((sum, v) => sum + (v.capacity || 0), 0),
        monthlyRevenue: allocations.filter(a => a.isActive !== false).reduce<number>((sum, a) => sum + (a.monthlyFee || 0), 0)
    };

    // Route-wise stats
    const routeStats: RouteStats[] = routes.map(route => {
        const routeAllocations = allocations.filter(a => a.route?._id === route._id && a.isActive !== false);
        return {
            _id: route._id,
            routeName: route.routeName,
            routeCode: route.routeCode,
            totalStudents: routeAllocations.length,
            monthlyRevenue: routeAllocations.reduce<number>((sum, a) => sum + (a.monthlyFee || 0), 0),
            stops: route.stops?.length || 0,
            vehicle: route.vehicle?.vehicleNumber
        };
    }).sort((a, b) => b.totalStudents - a.totalStudents);

    // Vehicle utilization
    const vehicleStats: VehicleStats[] = vehicles.map(vehicle => {
        const vehicleRoute = routes.find(r => r.vehicle?._id === vehicle._id);
        const routeAllocations = vehicleRoute 
            ? allocations.filter(a => a.route?._id === vehicleRoute._id && a.isActive !== false).length 
            : 0;
        return {
            _id: vehicle._id,
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity || 0,
            currentLoad: routeAllocations,
            utilization: vehicle.capacity ? Math.round((routeAllocations / vehicle.capacity) * 100) : 0,
            route: vehicleRoute?.routeName
        };
    }).sort((a, b) => b.utilization - a.utilization);

    // Stop-wise distribution
    const stopDistribution = routes.flatMap(route => {
        return (route.stops || []).map((stop: any) => {
            const studentsAtStop = allocations.filter(
                a => a.route?._id === route._id && (a.pickupStop === stop.name || a.dropStop === stop.name) && a.isActive !== false
            ).length;
            return {
                routeName: route.routeName,
                stopName: stop.name,
                time: stop.time,
                students: studentsAtStop
            };
        });
    });

    if (loading) {
        return (
            <AdminPageLayout title="Transport Reports" description="Analytics and insights">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Transport Reports" description="Analytics and insights">
            <div className="p-6 space-y-6">
                {/* Back Button */}
                <div>
                    <Link href="/admin/transport">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Transport
                        </Button>
                    </Link>
                </div>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Route className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.activeRoutes}</div>
                            <p className="text-xs text-muted-foreground">of {stats.totalRoutes} total</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bus className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.activeVehicles}</div>
                            <p className="text-xs text-muted-foreground">{stats.totalCapacity} total capacity</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Students Using Transport</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.totalCapacity ? Math.round((stats.totalStudents / stats.totalCapacity) * 100) : 0}% capacity utilization
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">from transport fees</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid grid-cols-3 w-[400px]">
                        <TabsTrigger value="overview">Route Analysis</TabsTrigger>
                        <TabsTrigger value="vehicles">Vehicle Utilization</TabsTrigger>
                        <TabsTrigger value="stops">Stop Distribution</TabsTrigger>
                    </TabsList>

                    {/* Route Analysis */}
                    <TabsContent value="overview">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-slate-50/50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-purple-600" />
                                            Route-wise Analysis
                                        </CardTitle>
                                        <CardDescription>Student distribution and revenue by route</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" /> Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Route</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Stops</TableHead>
                                            <TableHead>Students</TableHead>
                                            <TableHead>Monthly Revenue</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {routeStats.map((route) => (
                                            <TableRow key={route._id}>
                                                <TableCell className="font-medium">{route.routeName}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{route.routeCode}</Badge>
                                                </TableCell>
                                                <TableCell>{route.vehicle || 'Not assigned'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        {route.stops}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-blue-100 text-blue-700">
                                                        {route.totalStudents} students
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-green-600">
                                                    ${route.monthlyRevenue.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {routeStats.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    No routes configured yet
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Vehicle Utilization */}
                    <TabsContent value="vehicles">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-slate-50/50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bus className="h-5 w-5 text-blue-600" />
                                            Vehicle Utilization Report
                                        </CardTitle>
                                        <CardDescription>Capacity usage by vehicle</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" /> Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Assigned Route</TableHead>
                                            <TableHead>Capacity</TableHead>
                                            <TableHead>Current Load</TableHead>
                                            <TableHead>Utilization</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vehicleStats.map((vehicle) => (
                                            <TableRow key={vehicle._id}>
                                                <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{vehicle.vehicleType}</Badge>
                                                </TableCell>
                                                <TableCell>{vehicle.route || 'Not assigned'}</TableCell>
                                                <TableCell>{vehicle.capacity} seats</TableCell>
                                                <TableCell>{vehicle.currentLoad} students</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full ${
                                                                    vehicle.utilization >= 90 ? 'bg-red-500' :
                                                                    vehicle.utilization >= 70 ? 'bg-yellow-500' :
                                                                    'bg-green-500'
                                                                }`}
                                                                style={{ width: `${Math.min(vehicle.utilization, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-sm font-medium ${
                                                            vehicle.utilization >= 90 ? 'text-red-600' :
                                                            vehicle.utilization >= 70 ? 'text-yellow-600' :
                                                            'text-green-600'
                                                        }`}>
                                                            {vehicle.utilization}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {vehicleStats.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    No vehicles configured yet
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Stop Distribution */}
                    <TabsContent value="stops">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-slate-50/50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-green-600" />
                                            Stop-wise Student Distribution
                                        </CardTitle>
                                        <CardDescription>Number of students at each stop</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" /> Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Route</TableHead>
                                            <TableHead>Stop Name</TableHead>
                                            <TableHead>Pickup/Drop Time</TableHead>
                                            <TableHead>Students</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stopDistribution.map((stop, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{stop.routeName}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        {stop.stopName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{stop.time}</TableCell>
                                                <TableCell>
                                                    <Badge className={stop.students > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}>
                                                        {stop.students} students
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {stopDistribution.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                    No stops configured yet
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminPageLayout>
    );
}
