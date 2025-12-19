"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { financeAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function StudentFeesPage() {
    const user = useAuthStore((state) => state.user);
    const [dueFees, setDueFees] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchFees();
        }
    }, [user?._id]);

    const fetchFees = async () => {
        try {
            const [due, history] = await Promise.all([
                financeAPI.getDueFees(user!._id),
                financeAPI.getStudentPayments(user!._id),
            ]);
            setDueFees((due as any).data || []);
            setPayments((history as any).data || []);
        } catch (error) {
            console.error("Failed to fetch fees:", error);
            toast.error("Failed to load fee information");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalDue = dueFees.reduce((acc, curr) => acc + curr.due, 0);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fees & Payments</h1>
                <p className="text-gray-600">View your outstanding dues and payment history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-orange-500 text-white border-none">
                    <CardHeader>
                        <CardTitle className="text-white/90">Total Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-2">${totalDue.toFixed(2)}</div>
                        <p className="text-white/80 text-sm">
                            You have {dueFees.length} pending fee items.
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Due Fees</CardTitle>
                        <CardDescription>Fees that need to be paid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dueFees.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                                <p>No dues pending! You are all caught up.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dueFees.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">{item.feeStructure.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {new Date(item.feeStructure.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">${item.due.toFixed(2)}</p>
                                            <Button size="sm" className="mt-1 bg-orange-500 hover:bg-orange-600 text-white">
                                                Pay Now
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Fee Name</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No payment history found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{payment.feeStructure.name}</TableCell>
                                        <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                                        <TableCell className="capitalize">{payment.paymentMethod.replace("_", " ")}</TableCell>
                                        <TableCell>
                                            <Badge variant={payment.status === "paid" ? "default" : "secondary"}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

import { CheckCircle2 } from "lucide-react";
