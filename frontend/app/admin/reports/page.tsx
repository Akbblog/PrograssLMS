/*
 * NOTE: This file previously got corrupted during a merge (two pages combined).
 * It must remain a valid single-module client component for Vercel/Turbopack parsing.
 * 
 * REDESIGNED: January 2026 - Premium UI/UX with LuminaCard design system
 */

'use client';

import * as React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { reportsAPI } from '@/lib/api/endpoints';
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from '@/components/ui/lumina-card';

import { DateRangePicker, DateRangeValue } from '@/components/admin/reports/DateRangePicker';
import { KPICard } from '@/components/admin/reports/KPICard';
import { ChartCard } from '@/components/admin/reports/ChartCard';
import { ExportButtons } from '@/components/admin/reports/ExportButtons';
import { DataTable } from '@/components/admin/reports/DataTable';

import {
    BarChart3,
    Users,
    GraduationCap,
    Calendar,
    DollarSign,
    BookOpen,
    Bus,
    UserCheck,
    TrendingUp,
    Clock,
    AlertTriangle,
    Briefcase,
    FileText,
    RefreshCw,
    LayoutDashboard,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react';

type TabKey = 'overview' | 'attendance' | 'academic' | 'finance' | 'hr' | 'transport' | 'library';

// Chart colors using design system
const CHART_COLORS = {
    primary: 'hsl(234 89% 59%)', // Indigo
    secondary: 'hsl(195 97% 65%)', // Cyan
    success: 'hsl(162 73% 47%)', // Teal
    warning: 'hsl(37 92% 56%)', // Amber
    danger: 'hsl(14 100% 70%)', // Rose
    muted: 'hsl(215 16% 47%)',
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.secondary];

const tabConfig: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'attendance', label: 'Attendance', icon: UserCheck },
    { key: 'academic', label: 'Academic', icon: GraduationCap },
    { key: 'finance', label: 'Finance', icon: DollarSign },
    { key: 'hr', label: 'HR', icon: Briefcase },
    { key: 'transport', label: 'Transport', icon: Bus },
    { key: 'library', label: 'Library', icon: BookOpen },
];

function unwrapApiPayload<T>(payload: any): T {
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

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

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

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Premium Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                Analytics Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {currentDate} • Comprehensive operational insights
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <Button
                        onClick={refresh}
                        disabled={loading}
                        variant="outline"
                        className="gap-2 rounded-lg border-border hover:bg-primary/5 hover:border-primary/20 transition-all"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Tabs with Premium Styling */}
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                <div className="border-b border-border">
                    <TabsList className="h-auto p-1 bg-muted/30 rounded-xl inline-flex flex-wrap gap-1">
                        {tabConfig.map((t) => (
                            <TabsTrigger
                                key={t.key}
                                value={t.key}
                                className="gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                            >
                                <t.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{t.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <LayoutDashboard className="w-3 h-3 mr-1" />
                                Overview
                            </Badge>
                            <span className="text-sm text-muted-foreground">High-level KPIs for the selected period</span>
                        </div>
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

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <KPICard
                            title="Total Students"
                            value={overview?.kpis?.totalStudents ?? 0}
                            icon={GraduationCap}
                            variant="primary"
                            trend={{ value: 12, direction: 'up' }}
                            loading={loading}
                        />
                        <KPICard
                            title="Total Teachers"
                            value={overview?.kpis?.totalTeachers ?? 0}
                            icon={Users}
                            variant="secondary"
                            trend={{ value: 5, direction: 'up' }}
                            loading={loading}
                        />
                        <KPICard
                            title="Total Classes"
                            value={overview?.kpis?.totalClasses ?? 0}
                            icon={BookOpen}
                            variant="success"
                            trend={{ value: 3, direction: 'up' }}
                            loading={loading}
                        />
                        <KPICard
                            title="Total Revenue"
                            value={`$${(overview?.kpis?.totalRevenue ?? 0).toLocaleString()}`}
                            icon={DollarSign}
                            variant="warning"
                            trend={{ value: 8, direction: 'up' }}
                            loading={loading}
                        />
                        <KPICard
                            title="Attendance Rate"
                            value={`${overview?.kpis?.attendanceRate ?? 0}%`}
                            icon={UserCheck}
                            variant="default"
                            trend={{ value: 2, direction: 'up' }}
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Revenue Trends"
                            loading={loading}
                            empty={!Array.isArray(overview?.trends?.revenue) || overview.trends.revenue.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Array.isArray(overview?.trends?.revenue) ? overview.trends.revenue : []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={CHART_COLORS.primary}
                                        strokeWidth={2}
                                        dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                        <ChartCard
                            title="Attendance Trends"
                            loading={loading}
                            empty={!Array.isArray(overview?.trends?.attendance) || overview.trends.attendance.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Array.isArray(overview?.trends?.attendance) ? overview.trends.attendance : []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="presentRate"
                                        stroke={CHART_COLORS.success}
                                        strokeWidth={2}
                                        dot={{ fill: CHART_COLORS.success, strokeWidth: 2 }}
                                        name="Present Rate %"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Attendance
                            </Badge>
                            <span className="text-sm text-muted-foreground">Daily trends and status breakdown</span>
                        </div>
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
                                                rows: (Array.isArray(attendance?.dailyTrends) ? attendance.dailyTrends : [])
                                                    .slice(0, 25)
                                                    .map((r: any) => [r.date, r.present ?? 0, r.absent ?? 0, r.late ?? 0, r.excused ?? 0]),
                                            },
                                        }
                                    : undefined
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            title="Total Records"
                            value={attendance?.kpis?.totalRecords ?? 0}
                            icon={FileText}
                            variant="primary"
                            loading={loading}
                        />
                        <KPICard
                            title="Present Today"
                            value={attendance?.kpis?.presentToday ?? '-'}
                            icon={CheckCircle}
                            variant="success"
                            loading={loading}
                        />
                        <KPICard
                            title="Absent Today"
                            value={attendance?.kpis?.absentToday ?? '-'}
                            icon={XCircle}
                            variant="danger"
                            loading={loading}
                        />
                        <KPICard
                            title="Late Arrivals"
                            value={attendance?.kpis?.lateToday ?? '-'}
                            icon={Clock}
                            variant="warning"
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Daily Attendance Trend"
                            loading={loading}
                            empty={!Array.isArray(attendance?.dailyTrends) || attendance.dailyTrends.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Array.isArray(attendance?.dailyTrends) ? attendance.dailyTrends : []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="present" stroke={CHART_COLORS.success} strokeWidth={2} name="Present" />
                                    <Line type="monotone" dataKey="absent" stroke={CHART_COLORS.danger} strokeWidth={2} name="Absent" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                        <ChartCard
                            title="Status Breakdown"
                            loading={loading}
                            empty={!Array.isArray(attendance?.statusBreakdown) || attendance.statusBreakdown.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Pie
                                        data={Array.isArray(attendance?.statusBreakdown) ? attendance.statusBreakdown : []}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={2}
                                    >
                                        {(Array.isArray(attendance?.statusBreakdown) ? attendance.statusBreakdown : []).map((_: any, idx: number) => (
                                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </TabsContent>

                {/* Academic Tab */}
                <TabsContent value="academic" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <GraduationCap className="w-3 h-3 mr-1" />
                                Academic
                            </Badge>
                            <span className="text-sm text-muted-foreground">Grade distribution and at-risk students</span>
                        </div>
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

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <KPICard
                            title="Total Results"
                            value={academic?.kpis?.totalResults ?? 0}
                            icon={FileText}
                            variant="primary"
                            loading={loading}
                        />
                        <KPICard
                            title="Average Score"
                            value={`${academic?.kpis?.averageScore ?? '-'}%`}
                            icon={TrendingUp}
                            variant="success"
                            loading={loading}
                        />
                        <KPICard
                            title="At-Risk Students"
                            value={academic?.atRiskStudents?.length ?? 0}
                            icon={AlertTriangle}
                            variant="warning"
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Grade Distribution"
                            loading={loading}
                            empty={!Array.isArray(academic?.gradeDistribution) || academic.gradeDistribution.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Array.isArray(academic?.gradeDistribution) ? academic.gradeDistribution : []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                        <LuminaCard variant="default" className="border-none shadow-card">
                            <LuminaCardHeader className="pb-3 border-b border-border/50">
                                <LuminaCardTitle className="text-base font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-warning" />
                                    At-Risk Students (Avg Score &lt; 60)
                                </LuminaCardTitle>
                            </LuminaCardHeader>
                            <LuminaCardContent className="pt-4">
                                <DataTable
                                    columns={[
                                        { key: 'studentId', header: 'Student', render: (r: any) => r.studentId || '-' },
                                        { key: 'avgScore', header: 'Avg Score', render: (r: any) => (
                                            <Badge variant={r.avgScore < 40 ? 'destructive' : 'secondary'} className="font-mono">
                                                {r.avgScore ?? '-'}%
                                            </Badge>
                                        )},
                                    ]}
                                    rows={Array.isArray(academic?.atRiskStudents) ? academic.atRiskStudents : []}
                                    emptyText="No at-risk students in range"
                                    loading={loading}
                                    maxHeight="260px"
                                />
                            </LuminaCardContent>
                        </LuminaCard>
                    </div>
                </TabsContent>

                {/* Finance Tab */}
                <TabsContent value="finance" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Finance
                            </Badge>
                            <span className="text-sm text-muted-foreground">Collections, fee status, and overdue payments</span>
                        </div>
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

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <KPICard
                            title="Total Collected"
                            value={`$${(finance?.kpis?.totalCollected ?? 0).toLocaleString()}`}
                            icon={DollarSign}
                            variant="success"
                            loading={loading}
                        />
                        <KPICard
                            title="Total Expected"
                            value={`$${(finance?.kpis?.totalExpected ?? 0).toLocaleString()}`}
                            icon={TrendingUp}
                            variant="primary"
                            loading={loading}
                        />
                        <KPICard
                            title="Payments Made"
                            value={finance?.kpis?.payments ?? 0}
                            icon={FileText}
                            variant="secondary"
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Fee Status Distribution"
                            loading={loading}
                            empty={!Array.isArray(finance?.feeStatus) || finance.feeStatus.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Pie
                                        data={Array.isArray(finance?.feeStatus) ? finance.feeStatus : []}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={2}
                                    >
                                        {(Array.isArray(finance?.feeStatus) ? finance.feeStatus : []).map((_: any, idx: number) => (
                                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                        <LuminaCard variant="default" className="border-none shadow-card">
                            <LuminaCardHeader className="pb-3 border-b border-border/50">
                                <LuminaCardTitle className="text-base font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-warning" />
                                    Overdue Payments (Top 20)
                                </LuminaCardTitle>
                            </LuminaCardHeader>
                            <LuminaCardContent className="pt-4">
                                <DataTable
                                    columns={[
                                        { key: 'student', header: 'Student', render: (r: any) => r.student || '-' },
                                        { key: 'amountDue', header: 'Due', render: (r: any) => (
                                            <span className="font-mono text-destructive">${r.amountDue ?? '-'}</span>
                                        )},
                                        { key: 'amountPaid', header: 'Paid', render: (r: any) => (
                                            <span className="font-mono text-success">${r.amountPaid ?? '-'}</span>
                                        )},
                                        { key: 'paymentDate', header: 'Date', render: (r: any) => (r.paymentDate ? String(r.paymentDate).slice(0, 10) : '-') },
                                    ]}
                                    rows={Array.isArray(finance?.overduePayments) ? finance.overduePayments : []}
                                    emptyText="No overdue payments"
                                    loading={loading}
                                    maxHeight="260px"
                                />
                            </LuminaCardContent>
                        </LuminaCard>
                    </div>
                </TabsContent>

                {/* HR Tab */}
                <TabsContent value="hr" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <Briefcase className="w-3 h-3 mr-1" />
                                HR
                            </Badge>
                            <span className="text-sm text-muted-foreground">Payroll and leave analytics</span>
                        </div>
                        <ExportButtons
                            title="hr_report"
                            csvRows={hr?.kpis ? [hr.kpis] : []}
                            pdf={hr?.kpis ? { kpis: [{ label: 'Payroll Records', value: String(hr.kpis.payrollRecords ?? 0) }] } : undefined}
                        />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <KPICard
                            title="Payroll Records"
                            value={hr?.kpis?.payrollRecords ?? 0}
                            icon={FileText}
                            variant="primary"
                            loading={loading}
                        />
                        <KPICard
                            title="Total Staff"
                            value={hr?.kpis?.totalStaff ?? '-'}
                            icon={Users}
                            variant="secondary"
                            loading={loading}
                        />
                        <KPICard
                            title="Pending Leave"
                            value={hr?.kpis?.pendingLeaves ?? '-'}
                            icon={Calendar}
                            variant="warning"
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Leave Types Distribution"
                            loading={loading}
                            empty={!Array.isArray(hr?.leaveTypes) || hr.leaveTypes.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Array.isArray(hr?.leaveTypes) ? hr.leaveTypes : []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="value" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="Leave Requests" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                        <ChartCard
                            title="Payroll Summary"
                            loading={loading}
                            empty={!Array.isArray(hr?.payrollSummary) || hr.payrollSummary.length === 0}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Pie
                                        data={Array.isArray(hr?.payrollSummary) ? hr.payrollSummary : []}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={2}
                                    >
                                        {(Array.isArray(hr?.payrollSummary) ? hr.payrollSummary : []).map((_: any, idx: number) => (
                                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </TabsContent>

                {/* Transport Tab */}
                <TabsContent value="transport" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <Bus className="w-3 h-3 mr-1" />
                                Transport
                            </Badge>
                            <span className="text-sm text-muted-foreground">Routes and vehicles overview</span>
                        </div>
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

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            title="Active Routes"
                            value={transport?.kpis?.activeRoutes ?? 0}
                            icon={Bus}
                            variant="primary"
                            loading={loading}
                        />
                        <KPICard
                            title="Vehicles"
                            value={transport?.kpis?.vehicles ?? 0}
                            icon={Bus}
                            variant="secondary"
                            loading={loading}
                        />
                        <KPICard
                            title="Students Enrolled"
                            value={transport?.kpis?.studentsEnrolled ?? '-'}
                            icon={GraduationCap}
                            variant="success"
                            loading={loading}
                        />
                        <KPICard
                            title="Total Capacity"
                            value={transport?.kpis?.totalCapacity ?? '-'}
                            icon={Users}
                            variant="default"
                            loading={loading}
                        />
                    </div>
                </TabsContent>

                {/* Library Tab */}
                <TabsContent value="library" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Library
                            </Badge>
                            <span className="text-sm text-muted-foreground">Inventory and circulation overview</span>
                        </div>
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

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            title="Total Books"
                            value={library?.kpis?.totalBooks ?? 0}
                            icon={BookOpen}
                            variant="primary"
                            loading={loading}
                        />
                        <KPICard
                            title="Currently Issued"
                            value={library?.kpis?.issuedCount ?? 0}
                            icon={FileText}
                            variant="secondary"
                            loading={loading}
                        />
                        <KPICard
                            title="Overdue Items"
                            value={library?.kpis?.overdueCount ?? 0}
                            icon={AlertTriangle}
                            variant="warning"
                            loading={loading}
                        />
                        <KPICard
                            title="Available"
                            value={library?.kpis?.availableCount ?? '-'}
                            icon={CheckCircle}
                            variant="success"
                            loading={loading}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
