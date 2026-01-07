"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { financeAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, DollarSign, CreditCard, CheckCircle2, AlertCircle, Calendar, ArrowRight, Wallet, History, Receipt } from "lucide-react";
import { toast } from "sonner";
import { cn, unwrapArray } from "@/lib/utils";

export default function StudentFeesPage() {
    const user = useAuthStore((state) => state.user);
    const [dueFees, setDueFees] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchFees(user._id);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchFees = async (userId?: string) => {
        try {
            if (!userId) return;
            const [due, history] = await Promise.all([
                financeAPI.getDueFees(userId),
                financeAPI.getStudentPayments(userId),
            ]);
            setDueFees(unwrapArray((due as any)?.data, "dueFees"));
            setPayments(unwrapArray((history as any)?.data, "payments"));
        } catch (error) {
            console.error("Failed to fetch fees:", error);
            toast.error("Failed to load fee information");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    const totalDue = dueFees.reduce<number>((acc, curr) => acc + (curr.due || 0), 0);
    const totalPaid = payments.reduce<number>((acc, curr) => acc + (curr.amountPaid || 0), 0);
    const paymentProgress = totalPaid + totalDue > 0 ? (totalPaid / (totalPaid + totalDue)) * 100 : 0;

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finances & Billing</h1>
                    <p className="text-slate-500 mt-1">Manage your education investment and track payment history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-600">
                        <Receipt className="w-4 h-4" /> Download Statement
                    </Button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-xl bg-indigo-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Total Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-5xl font-black">{formatCurrency(totalDue)}</div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-indigo-100 font-medium">
                                <span>Collection Progress</span>
                                <span>{paymentProgress.toFixed(0)}%</span>
                            </div>
                            <Progress value={paymentProgress} className="h-1.5 bg-indigo-400/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-emerald-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Total Settled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-emerald-700">{formatCurrency(totalPaid)}</div>
                        <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> All verified transactions
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Due Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-800">
                            {dueFees.length > 0 && dueFees[0].feeStructure.dueDate
                                ? new Date(dueFees[0].feeStructure.dueDate).toLocaleDateString()
                                : "No Dues"}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Scheduled payment
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Fees Section */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Outstanding Invoices</CardTitle>
                            <CardDescription>Fees pending for the current academic term.</CardDescription>
                        </div>
                        <DollarSign className="w-5 h-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent className="p-0">
                        {dueFees.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 opacity-20 mb-4" />
                                <p className="font-bold text-slate-600">Your account is fully paid!</p>
                                <p className="text-sm">Enjoy your semester with zero dues.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {dueFees.map((item, index) => (
                                    <div key={index} className="p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-900">{item.feeStructure.name}</p>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-black bg-white border-indigo-100 text-indigo-600">PENDING</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Due {new Date(item.feeStructure.dueDate).toLocaleDateString()}</span>
                                                    {item.feeStructure.description && <span>• {item.feeStructure.description}</span>}
                                                </div>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <p className="text-xl font-black text-slate-900">{formatCurrency(item.due)}</p>
                                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-100">
                                                    PAY <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* History Section */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Settlements</CardTitle>
                            <CardDescription>List of successfully verified transactions.</CardDescription>
                        </div>
                        <History className="w-5 h-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="py-4">Invoice / Date</TableHead>
                                    <TableHead>Channel</TableHead>
                                    <TableHead className="text-right">Settled</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-48 text-slate-400 font-medium italic">
                                            No transaction history available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment._id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="py-4 font-medium">
                                                <p className="text-slate-900">{payment.feeStructure.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-3 h-3 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{payment.paymentMethod.replace("_", " ")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="space-y-1">
                                                    <p className="font-black text-emerald-600">{formatCurrency(payment.amountPaid)}</p>
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black tracking-widest px-1.5 h-4">SUCCESS</Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Security Notice */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-indigo-900">Secure Payment Gateway</h4>
                    <p className="text-xs text-indigo-600 mt-0.5 leading-relaxed">
                        Your payments are processed through encrypted channels. Transactions are reflected in your statement within 24 hours of verification. If you face any issues, contact the finance office at <span className="underline font-bold">finance@progresslms.com</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
