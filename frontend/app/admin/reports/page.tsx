"use client";

import { useEffect, useState } from "react";
import { adminAPI, academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, FileText, Download, Users, BookOpen, DollarSign } from "lucide-react";
import GraduationCap from "@/components/icons/GraduationCap";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'

export default function AdminReportsPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalRevenue: 0
    'use client';

    import * as React from 'react';
    import {
        BarChart,
        Bar,
        CartesianGrid,
        Legend,
        Line,
        LineChart,
        Pie,
        PieChart,
        ResponsiveContainer,
        Tooltip,
        XAxis,
        YAxis,
    } from 'recharts';

    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
    import { Button } from '@/app/components/ui/button';
    import { reportsAPI } from '@/lib/api/endpoints';
    import { DateRangePicker, DateRangeValue } from '@/components/admin/reports/DateRangePicker';
    import { KPICard } from '@/components/admin/reports/KPICard';
    import { ChartCard } from '@/components/admin/reports/ChartCard';
    import { ExportButtons } from '@/components/admin/reports/ExportButtons';
    import { DataTable } from '@/components/admin/reports/DataTable';

    type TabKey = 'overview' | 'attendance' | 'academic' | 'finance' | 'hr' | 'transport' | 'library';

    function unwrapApiPayload<T>(payload: any): T {
        // backend uses responseStatus(handler) => { status, message, data }
        if (payload && typeof payload === 'object' && 'data' in payload) return payload.data as T;
        return payload as T;
    }

    export default function ReportsPage() {
        const [tab, setTab] = React.useState<TabKey>('overview');
        const [dateRange, setDateRange] = React.useState<DateRangeValue>({});
        const [loading, setLoading] = React.useState(false);

        const [overview, setOverview] = React.useState<any>(null);
        const [attendance, setAttendance] = React.useState<any>(null);
        const [academic, setAcademic] = React.useState<any>(null);
        const [finance, setFinance] = React.useState<any>(null);
        const [hr, setHr] = React.useState<any>(null);
        const [transport, setTransport] = React.useState<any>(null);
        const [library, setLibrary] = React.useState<any>(null);

        const refresh = React.useCallback(async () => {
            setLoading(true);
            try {
                if (tab === 'overview') {
                    const res = await reportsAPI.getDashboard(dateRange);
                    setOverview(unwrapApiPayload(res));
                } else if (tab === 'attendance') {
                    const res = await reportsAPI.getAttendance(dateRange);
                    setAttendance(unwrapApiPayload(res));
                } else if (tab === 'academic') {
                    const res = await reportsAPI.getAcademic({});
                    setAcademic(unwrapApiPayload(res));
                } else if (tab === 'finance') {
                    const res = await reportsAPI.getFinance(dateRange);
                    setFinance(unwrapApiPayload(res));
                } else if (tab === 'hr') {
                    const res = await reportsAPI.getHR({});
                    setHr(unwrapApiPayload(res));
                } else if (tab === 'transport') {
                    const res = await reportsAPI.getTransport();
                    setTransport(unwrapApiPayload(res));
                } else if (tab === 'library') {
                    const res = await reportsAPI.getLibrary(dateRange);
                    setLibrary(unwrapApiPayload(res));
                }
            } catch (e) {
                console.error('Failed to load report:', e);
            } finally {
                setLoading(false);
            }
        }, [dateRange, tab]);

        React.useEffect(() => {
            refresh();
        }, [refresh]);

        const header = (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Operational Report Dashboard</h1>
                    <p className="text-muted-foreground">Analytics across attendance, academics, finance, HR, transport, and library.</p>
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <div className="flex items-center gap-2">
                        <Button onClick={refresh} disabled={loading}>
                            {loading ? 'Loading...' : 'Refresh'}
                        </Button>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="space-y-6">
                {header}

                <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                    <TabsList className="flex h-auto flex-wrap justify-start gap-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="academic">Academic</TabsTrigger>
                        <TabsTrigger value="finance">Finance</TabsTrigger>
                        <TabsTrigger value="hr">HR</TabsTrigger>
                        <TabsTrigger value="transport">Transport</TabsTrigger>
                        <TabsTrigger value="library">Library</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">High-level KPIs for the selected date range.</div>
                            <ExportButtons
                                title="overview_report"
                                csvRows={overview?.kpis ? [overview.kpis] : []}
                                pdf={
                                    overview?.kpis
                                        ? {
                                                kpis: [
                                                    { label: 'Total Students', value: String(overview.kpis.totalStudents ?? 0) },
                                                    { label: 'Total Teachers', value: String(overview.kpis.totalTeachers ?? 0) },
                                                    { label: 'Total Classes', value: String(overview.kpis.totalClasses ?? 0) },
                                                    { label: 'Total Revenue', value: String(overview.kpis.totalRevenue ?? 0) },
                                                    { label: 'Attendance Rate', value: `${overview.kpis.attendanceRate ?? 0}%` },
                                                ],
                                            }
                                        : undefined
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Total Students" value={overview?.kpis?.totalStudents ?? 0} />
                            <KPICard title="Total Teachers" value={overview?.kpis?.totalTeachers ?? 0} />
                            <KPICard title="Total Classes" value={overview?.kpis?.totalClasses ?? 0} />
                            <KPICard title="Total Revenue" value={overview?.kpis?.totalRevenue ?? 0} />
                            <KPICard title="Attendance Rate" value={`${overview?.kpis?.attendanceRate ?? 0}%`} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <ChartCard title="Revenue Trends">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={Array.isArray(overview?.trends?.revenue) ? overview.trends.revenue : []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="currentColor" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Attendance Trends">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={Array.isArray(overview?.trends?.attendance) ? overview.trends.attendance : []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="presentRate" stroke="currentColor" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">Attendance daily trends and status breakdown.</div>
                            <ExportButtons
                                title="attendance_report"
                                csvRows={Array.isArray(attendance?.dailyTrends) ? attendance.dailyTrends : []}
                                pdf={
                                    attendance
                                        ? {
                                                kpis: [{ label: 'Total Records', value: String(attendance?.kpis?.totalRecords ?? 0) }],
                                                table: {
                                                    title: 'Daily trends',
                                                    headers: ['date', 'present', 'absent', 'late', 'excused'],
                                                    rows: (Array.isArray(attendance?.dailyTrends) ? attendance.dailyTrends : []).slice(0, 25).map((r: any) => [
                                                        r.date,
                                                        r.present ?? 0,
                                                        r.absent ?? 0,
                                                        r.late ?? 0,
                                                        r.excused ?? 0,
                                                    ]),
                                                },
                                            }
                                        : undefined
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Total Records" value={attendance?.kpis?.totalRecords ?? 0} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <ChartCard title="Daily Attendance Trend">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={Array.isArray(attendance?.dailyTrends) ? attendance.dailyTrends : []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="present" stroke="currentColor" />
                                        <Line type="monotone" dataKey="absent" stroke="currentColor" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Status Breakdown">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip />
                                        <Pie data={Array.isArray(attendance?.statusBreakdown) ? attendance.statusBreakdown : []} dataKey="value" nameKey="name" outerRadius={110} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    </TabsContent>

                    <TabsContent value="academic" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">Grade distribution and at-risk students.</div>
                            <ExportButtons
                                title="academic_report"
                                csvRows={Array.isArray(academic?.gradeDistribution) ? academic.gradeDistribution : []}
                                pdf={
                                    academic
                                        ? {
                                                kpis: [{ label: 'Total Results', value: String(academic?.kpis?.totalResults ?? 0) }],
                                                table: {
                                                    title: 'Grade distribution',
                                                    headers: ['grade', 'count'],
                                                    rows: (Array.isArray(academic?.gradeDistribution) ? academic.gradeDistribution : []).map((r: any) => [r.name, r.value]),
                                                },
                                            }
                                        : undefined
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Total Results" value={academic?.kpis?.totalResults ?? 0} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <ChartCard title="Grade Distribution">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Array.isArray(academic?.gradeDistribution) ? academic.gradeDistribution : []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="currentColor" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="At-risk Students (Avg Score < 60)">
                                <div className="h-full">
                                    <DataTable
                                        columns={[
                                            { key: 'studentId', header: 'Student', render: (r: any) => r.studentId || '-' },
                                            { key: 'avgScore', header: 'Avg Score', render: (r: any) => r.avgScore ?? '-' },
                                        ]}
                                        rows={Array.isArray(academic?.atRiskStudents) ? academic.atRiskStudents : []}
                                        emptyText="No at-risk students in range"
                                    />
                                </div>
                            </ChartCard>
                        </div>
                    </TabsContent>

                    <TabsContent value="finance" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">Collections, fee status, and overdue payments.</div>
                            <ExportButtons
                                title="finance_report"
                                csvRows={finance?.kpis ? [finance.kpis] : []}
                                pdf={
                                    finance?.kpis
                                        ? {
                                                kpis: [
                                                    { label: 'Total Collected', value: String(finance.kpis.totalCollected ?? 0) },
                                                    { label: 'Total Expected', value: String(finance.kpis.totalExpected ?? 0) },
                                                    { label: 'Payments', value: String(finance.kpis.payments ?? 0) },
                                                ],
                                            }
                                        : undefined
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Total Collected" value={finance?.kpis?.totalCollected ?? 0} />
                            <KPICard title="Total Expected" value={finance?.kpis?.totalExpected ?? 0} />
                            <KPICard title="Payments" value={finance?.kpis?.payments ?? 0} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <ChartCard title="Fee Status">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip />
                                        <Pie data={Array.isArray(finance?.feeStatus) ? finance.feeStatus : []} dataKey="value" nameKey="name" outerRadius={110} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Overdue Payments (Top 20)">
                                <div className="h-full">
                                    <DataTable
                                        columns={[
                                            { key: 'student', header: 'Student', render: (r: any) => r.student || '-' },
                                            { key: 'amountDue', header: 'Due', render: (r: any) => r.amountDue ?? '-' },
                                            { key: 'amountPaid', header: 'Paid', render: (r: any) => r.amountPaid ?? '-' },
                                            { key: 'paymentDate', header: 'Payment Date', render: (r: any) => (r.paymentDate ? String(r.paymentDate).slice(0, 10) : '-') },
                                        ]}
                                        rows={Array.isArray(finance?.overduePayments) ? finance.overduePayments : []}
                                        emptyText="No overdue payments"
                                    />
                                </div>
                            </ChartCard>
                        </div>
                    </TabsContent>

                    <TabsContent value="hr" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">Payroll and leave analytics.</div>
                            <ExportButtons
                                title="hr_report"
                                csvRows={hr?.kpis ? [hr.kpis] : []}
                                pdf={hr?.kpis ? { kpis: [{ label: 'Payroll Records', value: String(hr.kpis.payrollRecords ?? 0) }] } : undefined}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Payroll Records" value={hr?.kpis?.payrollRecords ?? 0} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <ChartCard title="Leave Types">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Array.isArray(hr?.leaveTypes) ? hr.leaveTypes : []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="currentColor" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Payroll Summary">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip />
                                        <Pie data={Array.isArray(hr?.payrollSummary) ? hr.payrollSummary : []} dataKey="value" nameKey="name" outerRadius={110} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    </TabsContent>

                    <TabsContent value="transport" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">Routes, vehicles, and driver attendance.</div>
                            <ExportButtons
                                title="transport_report"
                                csvRows={transport?.kpis ? [transport.kpis] : []}
                                pdf={
                                    transport?.kpis
                                        ? {
                                                kpis: [
                                                    { label: 'Active Routes', value: String(transport.kpis.activeRoutes ?? 0) },
                                                    { label: 'Vehicles', value: String(transport.kpis.vehicles ?? 0) },
                                                ],
                                            }
                                        : undefined
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Active Routes" value={transport?.kpis?.activeRoutes ?? 0} />
                            <KPICard title="Vehicles" value={transport?.kpis?.vehicles ?? 0} />
                        </div>
                    </TabsContent>

                    <TabsContent value="library" className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">Inventory and issues overview.</div>
                            <ExportButtons
                                title="library_report"
                                csvRows={library?.kpis ? [library.kpis] : []}
                                pdf={
                                    library?.kpis
                                        ? {
                                                kpis: [
                                                    { label: 'Total Books', value: String(library.kpis.totalBooks ?? 0) },
                                                    { label: 'Issued Count', value: String(library.kpis.issuedCount ?? 0) },
                                                    { label: 'Overdue Count', value: String(library.kpis.overdueCount ?? 0) },
                                                ],
                                            }
                                        : undefined
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KPICard title="Total Books" value={library?.kpis?.totalBooks ?? 0} />
                            <KPICard title="Issued" value={library?.kpis?.issuedCount ?? 0} />
                            <KPICard title="Overdue" value={library?.kpis?.overdueCount ?? 0} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        );
    }
