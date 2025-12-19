"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { superAdminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, School, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SchoolType {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subscription: {
        plan: string;
        status: string;
        endDate: string;
    };
    isActive: boolean;
}

export default function SchoolsPage() {
    const router = useRouter();
    const [schools, setSchools] = useState<SchoolType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const res: any = await superAdminAPI.getSchools();
            // API returns { status: "success", data: { results, totalRevenue, data: [schools] } }
            // So we need res.data.data
            if (res?.data?.data && Array.isArray(res.data.data)) {
                setSchools(res.data.data);
            } else if (res?.data && Array.isArray(res.data)) {
                setSchools(res.data);
            } else {
                console.error("Unexpected API response format:", res);
                setSchools([]);
            }
        } catch (error) {
            console.error("Failed to fetch schools:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSchools = schools.filter((school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
                    <p className="text-muted-foreground">
                        Manage all registered schools and their subscriptions.
                    </p>
                </div>
                <Button asChild>
                    <a href="/superadmin/schools/create"><Plus className="mr-2 h-4 w-4" /> Add School</a>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Schools</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search schools..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Subscription Ends</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSchools.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No schools found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSchools.map((school) => (
                                        <TableRow key={school._id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <School className="h-4 w-4" />
                                                    </div>
                                                    {school.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{school.email}</span>
                                                    <span className="text-muted-foreground">{school.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {school.subscription.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={school.isActive ? "default" : "destructive"}
                                                    className={school.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                                                >
                                                    {school.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(school.subscription.endDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="sm">
                                                    <a href={`/superadmin/schools/${school._id}`}>View</a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
