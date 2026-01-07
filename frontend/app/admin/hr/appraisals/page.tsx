"use client";

import React, { useEffect, useState } from 'react';
import AdminPageLayout from '@/components/layouts/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { hrAPI, adminAPI, academicAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Loader2,
    Plus,
    Star,
    ChevronDown,
    ClipboardList,
    Target,
    User,
    Calendar,
    Search,
    Eye,
    CheckCircle,
    Clock,
    TrendingUp,
    Award
} from 'lucide-react';

interface Appraisal {
    _id: string;
    staff: { _id: string; name: string };
    academicYear: { _id: string; name: string };
    reviewPeriod: string;
    status: 'draft' | 'pending' | 'in-review' | 'completed';
    overallRating?: number;
    categories: {
        name: string;
        rating: number;
        comments?: string;
    }[];
    goals: {
        description: string;
        status: 'pending' | 'achieved' | 'partially-achieved' | 'not-achieved';
    }[];
    strengths?: string;
    areasForImprovement?: string;
    recommendations?: string;
    reviewedBy?: { name: string };
    reviewDate?: string;
    createdAt: string;
}

interface AppraisalFormData {
    staffId: string;
    academicYearId: string;
    reviewPeriod: string;
    categories: {
        name: string;
        rating: number;
        comments: string;
    }[];
    goals: {
        description: string;
        status: 'pending' | 'achieved' | 'partially-achieved' | 'not-achieved';
    }[];
    strengths: string;
    areasForImprovement: string;
    recommendations: string;
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

const defaultCategories = [
    { name: 'Teaching Quality', rating: 0, comments: '' },
    { name: 'Communication Skills', rating: 0, comments: '' },
    { name: 'Classroom Management', rating: 0, comments: '' },
    { name: 'Professional Development', rating: 0, comments: '' },
    { name: 'Teamwork & Collaboration', rating: 0, comments: '' },
    { name: 'Punctuality & Attendance', rating: 0, comments: '' }
];

const reviewPeriodOptions = [
    { value: 'Q1', label: 'Q1 (Jan-Mar)' },
    { value: 'Q2', label: 'Q2 (Apr-Jun)' },
    { value: 'Q3', label: 'Q3 (Jul-Sep)' },
    { value: 'Q4', label: 'Q4 (Oct-Dec)' },
    { value: 'H1', label: 'H1 (Jan-Jun)' },
    { value: 'H2', label: 'H2 (Jul-Dec)' },
    { value: 'Annual', label: 'Annual Review' }
];

const goalStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'achieved', label: 'Achieved' },
    { value: 'partially-achieved', label: 'Partially Achieved' },
    { value: 'not-achieved', label: 'Not Achieved' }
];

const emptyFormData: AppraisalFormData = {
    staffId: '',
    academicYearId: '',
    reviewPeriod: 'Annual',
    categories: defaultCategories,
    goals: [],
    strengths: '',
    areasForImprovement: '',
    recommendations: ''
};

export default function AppraisalsPage() {
    const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [formData, setFormData] = useState<AppraisalFormData>(emptyFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appraisalsRes, staffRes, yearsRes] = await Promise.all([
                hrAPI.getAppraisals(),
                hrAPI.getStaff(),
                academicAPI.getAcademicYears()
            ]);
            setAppraisals(unwrapArray((appraisalsRes as any)?.data, 'appraisals'));
            setStaff(unwrapArray((staffRes as any)?.data, 'staff'));
            setAcademicYears(unwrapArray((yearsRes as any)?.data, 'years'));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        const currentYear = academicYears.find(y => y.isCurrent);
        setFormData({
            ...emptyFormData,
            academicYearId: currentYear?._id || '',
            categories: [...defaultCategories]
        });
        setDialogOpen(true);
    };

    const openViewDialog = (appraisal: Appraisal) => {
        setSelectedAppraisal(appraisal);
        setViewDialogOpen(true);
    };

    const updateCategoryRating = (index: number, rating: number) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map((cat, i) => 
                i === index ? { ...cat, rating } : cat
            )
        }));
    };

    const updateCategoryComments = (index: number, comments: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map((cat, i) => 
                i === index ? { ...cat, comments } : cat
            )
        }));
    };

    const addGoal = () => {
        setFormData(prev => ({
            ...prev,
            goals: [...prev.goals, { description: '', status: 'pending' }]
        }));
    };

    const updateGoal = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.map((goal, i) => 
                i === index ? { ...goal, [field]: value } : goal
            )
        }));
    };

    const removeGoal = (index: number) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.staffId || !formData.academicYearId) {
            toast.error('Please select staff and academic year');
            return;
        }

        const hasRatings = formData.categories.some(c => c.rating > 0);
        if (!hasRatings) {
            toast.error('Please provide at least one category rating');
            return;
        }

        setProcessing(true);
        try {
            const overallRating = formData.categories.reduce<number>((sum, c) => sum + c.rating, 0) / formData.categories.length;
            
            const payload = {
                staff: formData.staffId,
                academicYear: formData.academicYearId,
                reviewPeriod: formData.reviewPeriod,
                categories: formData.categories.filter(c => c.rating > 0),
                goals: formData.goals.filter(g => g.description.trim()),
                overallRating: Math.round(overallRating * 10) / 10,
                strengths: formData.strengths,
                areasForImprovement: formData.areasForImprovement,
                recommendations: formData.recommendations,
                status: 'pending'
            };

            await hrAPI.createAppraisal(payload);
            toast.success('Appraisal created successfully');
            setDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create appraisal');
        } finally {
            setProcessing(false);
        }
    };

    const handleComplete = async (appraisalId: string) => {
        setProcessing(true);
        try {
            await hrAPI.updateAppraisal(appraisalId, { status: 'completed' });
            toast.success('Appraisal marked as completed');
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to complete appraisal');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="outline">Draft</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
            case 'in-review':
                return <Badge className="bg-blue-100 text-blue-700">In Review</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRatingStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
        );
    };

    const staffOptions = staff.map(s => ({
        value: s._id,
        label: s.name || s.email
    }));

    const yearOptions = academicYears.map(y => ({
        value: y._id,
        label: y.name + (y.isCurrent ? ' (Current)' : '')
    }));

    const filteredAppraisals = appraisals.filter(a => {
        const matchesSearch = a.staff?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || a.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const stats = {
        total: appraisals.length,
        pending: appraisals.filter(a => a.status === 'pending' || a.status === 'in-review').length,
        completed: appraisals.filter(a => a.status === 'completed').length,
        avgRating: appraisals.length > 0 
            ? (appraisals.reduce<number>((sum, a) => sum + (a.overallRating || 0), 0) / appraisals.length).toFixed(1)
            : '0.0'
    };

    if (loading) {
        return (
            <AdminPageLayout title="Appraisals" description="Staff performance reviews">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Appraisals" description="Staff performance reviews">
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Appraisals</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <ClipboardList className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Star className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1">
                                <div className="text-2xl font-bold text-blue-600">{stats.avgRating}</div>
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Performance Appraisals</CardTitle>
                                <CardDescription>Staff evaluations and feedback</CardDescription>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by staff name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                                    <Plus className="mr-2 h-4 w-4" /> New Appraisal
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="px-6 pt-4">
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="in-review">In Review</TabsTrigger>
                                    <TabsTrigger value="completed">Completed</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value={activeTab} className="m-0">
                                {filteredAppraisals.length === 0 ? (
                                    <div className="text-center py-16">
                                        <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No appraisals found</p>
                                        <Button onClick={openCreateDialog} variant="link" className="mt-2">
                                            Create your first appraisal
                                        </Button>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Staff Member</TableHead>
                                                <TableHead>Academic Year</TableHead>
                                                <TableHead>Review Period</TableHead>
                                                <TableHead>Rating</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAppraisals.map((appraisal) => (
                                                <TableRow key={appraisal._id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                                <User className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <span className="font-medium">{appraisal.staff?.name || 'Unknown'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{appraisal.academicYear?.name || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{appraisal.reviewPeriod}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {appraisal.overallRating ? getRatingStars(appraisal.overallRating) : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(appraisal.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openViewDialog(appraisal)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            {appraisal.status !== 'completed' && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleComplete(appraisal._id)}
                                                                    className="text-green-600"
                                                                >
                                                                    <CheckCircle className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Create Appraisal Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Award className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <DialogTitle>New Performance Appraisal</DialogTitle>
                                    <DialogDescription>
                                        Evaluate staff performance and provide feedback
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            {/* Staff & Period Selection */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Staff Member <span className="text-red-500">*</span></Label>
                                    <NativeSelect
                                        value={formData.staffId}
                                        onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                                        placeholder="Select staff..."
                                        options={staffOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Academic Year <span className="text-red-500">*</span></Label>
                                    <NativeSelect
                                        value={formData.academicYearId}
                                        onValueChange={(value) => setFormData({ ...formData, academicYearId: value })}
                                        placeholder="Select year..."
                                        options={yearOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Review Period</Label>
                                    <NativeSelect
                                        value={formData.reviewPeriod}
                                        onValueChange={(value) => setFormData({ ...formData, reviewPeriod: value })}
                                        placeholder="Select period..."
                                        options={reviewPeriodOptions}
                                    />
                                </div>
                            </div>

                            {/* Performance Categories */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-purple-600" />
                                    Performance Ratings
                                </Label>
                                <div className="space-y-3">
                                    {formData.categories.map((cat, index) => (
                                        <div key={index} className="p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">{cat.name}</span>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => updateCategoryRating(index, star)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`h-5 w-5 transition-colors ${
                                                                    star <= cat.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-slate-300 hover:text-yellow-300'
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <Input
                                                placeholder="Comments (optional)..."
                                                value={cat.comments}
                                                onChange={(e) => updateCategoryComments(index, e.target.value)}
                                                className="text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Goals */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-purple-600" />
                                        Goals & Objectives
                                    </Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addGoal}>
                                        <Plus className="h-3 w-3 mr-1" /> Add Goal
                                    </Button>
                                </div>
                                {formData.goals.map((goal, index) => (
                                    <div key={index} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                                        <Input
                                            placeholder="Goal description..."
                                            value={goal.description}
                                            onChange={(e) => updateGoal(index, 'description', e.target.value)}
                                            className="flex-1"
                                        />
                                        <div className="w-40">
                                            <NativeSelect
                                                value={goal.status}
                                                onValueChange={(value) => updateGoal(index, 'status', value)}
                                                placeholder="Status..."
                                                options={goalStatusOptions}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeGoal(index)}
                                            className="text-red-600"
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Feedback */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Strengths</Label>
                                    <Textarea
                                        value={formData.strengths}
                                        onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                                        placeholder="Key strengths and achievements..."
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Areas for Improvement</Label>
                                    <Textarea
                                        value={formData.areasForImprovement}
                                        onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })}
                                        placeholder="Areas that need development..."
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Recommendations</Label>
                                    <Textarea
                                        value={formData.recommendations}
                                        onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                                        placeholder="Training, promotion, or other recommendations..."
                                        rows={2}
                                    />
                                </div>
                            </div>
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
                                Create Appraisal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Appraisal Dialog */}
                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Appraisal Details</DialogTitle>
                            <DialogDescription>
                                Performance review for {selectedAppraisal?.staff?.name}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedAppraisal && (
                            <div className="space-y-4 mt-4">
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{selectedAppraisal.staff?.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedAppraisal.academicYear?.name} - {selectedAppraisal.reviewPeriod}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Overall Rating</p>
                                            {selectedAppraisal.overallRating && getRatingStars(selectedAppraisal.overallRating)}
                                        </div>
                                    </div>
                                </div>

                                {selectedAppraisal.categories && selectedAppraisal.categories.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Category Ratings</h4>
                                        {selectedAppraisal.categories.map((cat, i) => (
                                            <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                                <span className="text-sm">{cat.name}</span>
                                                {getRatingStars(cat.rating)}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedAppraisal.strengths && (
                                    <div>
                                        <h4 className="font-medium text-green-700">Strengths</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{selectedAppraisal.strengths}</p>
                                    </div>
                                )}

                                {selectedAppraisal.areasForImprovement && (
                                    <div>
                                        <h4 className="font-medium text-yellow-700">Areas for Improvement</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{selectedAppraisal.areasForImprovement}</p>
                                    </div>
                                )}

                                {selectedAppraisal.recommendations && (
                                    <div>
                                        <h4 className="font-medium text-blue-700">Recommendations</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{selectedAppraisal.recommendations}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}