"use client";

import { useEffect, useState } from "react";
import { superAdminAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Plus, Search, Filter, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function SuperAdminSubscriptionsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const subPlans = [
        { name: "Basic", schools: 124, revenue: "$1,240/mo", status: "active" },
        { name: "Premium", schools: 342, revenue: "$6,840/mo", status: "active" },
        { name: "Enterprise", schools: 89, revenue: "$17,800/mo", status: "active" },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-100">
                            <CreditCard className="h-6 w-6 text-green-600" />
                        </div>
                        Subscription Management
                    </h1>
                    <p className="text-slate-500 mt-2">Manage revenue, plans, and school billing cycles.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100">
                    <Plus className="h-4 w-4 mr-2" /> Create New Plan
                </Button>
            </div>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-indigo-600 text-white overflow-hidden relative">
                    <CardContent className="p-6">
                        <TrendingUp className="h-12 w-12 text-white/10 absolute right-4 top-4" />
                        <p className="text-sm font-medium text-indigo-100">Monthly Recurring Revenue</p>
                        <p className="text-3xl font-bold mt-2">$25,880</p>
                        <p className="text-xs text-indigo-200 mt-4 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500">Active Subscriptions</p>
                        <p className="text-3xl font-bold text-slate-900">555</p>
                        <div className="h-1.5 w-full bg-slate-100 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-4/5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500">Churn Rate</p>
                        <p className="text-3xl font-bold text-slate-900">0.8%</p>
                        <p className="text-xs text-green-600 mt-4 font-bold">Stable Performance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Plans Table */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Subscription Plans</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg">Export CSV</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600 px-6 py-4">Plan Name</TableHead>
                                <TableHead className="font-bold text-slate-600 px-6 py-4">Active Schools</TableHead>
                                <TableHead className="font-bold text-slate-600 px-6 py-4">Monthly Revenue</TableHead>
                                <TableHead className="font-bold text-slate-600 px-6 py-4">Status</TableHead>
                                <TableHead className="text-right px-6 py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subPlans.map((plan, i) => (
                                <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="px-6 py-4 font-bold text-slate-900">{plan.name}</TableCell>
                                    <TableCell className="px-6 py-4 text-slate-600">{plan.schools} Schools</TableCell>
                                    <TableCell className="px-6 py-4 font-mono font-bold text-indigo-600">{plan.revenue}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600">
                                            <Icon name="lucide:pencil" className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-center pb-12">
                <p className="text-slate-400 text-xs text-center border-t border-slate-100 pt-6 px-12 leading-relaxed max-w-2xl">
                    Payments are processed through a secure third-party gateway. Billing cycles are calculated based
                    on the school's registration date. Subscription changes are applied at the start of the next billing cycle.
                </p>
            </div>
        </div>
    );
}
