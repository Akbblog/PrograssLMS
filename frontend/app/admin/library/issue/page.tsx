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
import { libraryAPI, adminAPI } from '@/lib/api/endpoints';
import { unwrapArray } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Loader2,
    BookOpen,
    Search,
    ArrowRightLeft,
    Clock,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    User,
    Calendar,
    RotateCcw,
    DollarSign
} from 'lucide-react';

interface BookIssue {
    _id: string;
    book: { _id: string; title: string; isbn?: string };
    borrower: { _id: string; name?: string };
    borrowerType: 'Student' | 'Teacher';
    issueDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'issued' | 'returned' | 'overdue' | 'lost';
    fineAmount: number;
    finePaid: boolean;
    renewalCount: number;
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

export default function LibraryIssuePage() {
    const [issues, setIssues] = useState<BookIssue[]>([]);
    const [overdueIssues, setOverdueIssues] = useState<BookIssue[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('issue');
    const [issueDialogOpen, setIssueDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<BookIssue | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [issueForm, setIssueForm] = useState({
        bookId: '',
        borrowerId: '',
        borrowerType: 'Student' as 'Student' | 'Teacher',
        dueDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issuesRes, overdueRes, booksRes, studentsRes, teachersRes] = await Promise.all([
                libraryAPI.getIssues(),
                libraryAPI.getOverdue(),
                libraryAPI.getBooks(),
                adminAPI.getStudents(),
                adminAPI.getTeachers()
            ]);
            
            setIssues(unwrapArray((issuesRes as any)?.data, 'issues'));
            setOverdueIssues(unwrapArray((overdueRes as any)?.data, 'overdue'));
            setBooks(unwrapArray((booksRes as any)?.data, 'books'));
            setStudents(unwrapArray((studentsRes as any)?.data, 'students'));
            setTeachers(unwrapArray((teachersRes as any)?.data, 'teachers'));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetIssueForm = () => {
        setIssueForm({
            bookId: '',
            borrowerId: '',
            borrowerType: 'Student',
            dueDate: ''
        });
    };

    const getDefaultDueDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 14); // Default 2 weeks
        return date.toISOString().split('T')[0];
    };

    const handleIssueBook = async () => {
        if (!issueForm.bookId || !issueForm.borrowerId || !issueForm.dueDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        setProcessing(true);
        try {
            await libraryAPI.issueBook({
                book: issueForm.bookId,
                borrower: issueForm.borrowerId,
                borrowerType: issueForm.borrowerType,
                dueDate: issueForm.dueDate
            });
            toast.success('Book issued successfully');
            setIssueDialogOpen(false);
            resetIssueForm();
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to issue book');
        } finally {
            setProcessing(false);
        }
    };

    const handleReturnBook = async () => {
        if (!selectedIssue) return;

        setProcessing(true);
        try {
            await libraryAPI.returnBook(selectedIssue._id, {
                returnDate: new Date().toISOString(),
                condition: 'good'
            });
            toast.success('Book returned successfully');
            setReturnDialogOpen(false);
            setSelectedIssue(null);
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to return book');
        } finally {
            setProcessing(false);
        }
    };

    const handleRenewBook = async (issueId: string) => {
        setProcessing(true);
        try {
            await libraryAPI.renewBook(issueId);
            toast.success('Book renewed successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to renew book');
        } finally {
            setProcessing(false);
        }
    };

    const openIssueDialog = () => {
        setIssueForm(prev => ({
            ...prev,
            dueDate: getDefaultDueDate()
        }));
        setIssueDialogOpen(true);
    };

    const openReturnDialog = (issue: BookIssue) => {
        setSelectedIssue(issue);
        setReturnDialogOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'issued':
                return <Badge className="bg-blue-100 text-blue-700"><BookOpen className="h-3 w-3 mr-1" /> Issued</Badge>;
            case 'returned':
                return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Returned</Badge>;
            case 'overdue':
                return <Badge className="bg-red-100 text-red-700"><AlertTriangle className="h-3 w-3 mr-1" /> Overdue</Badge>;
            case 'lost':
                return <Badge className="bg-slate-100 text-slate-700">Lost</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysOverdue = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = today.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const bookOptions = books.filter(b => (b.availableCopies || 0) > 0).map(b => ({
        value: b._id,
        label: `${b.title} (${b.isbn || 'No ISBN'})`
    }));

    const borrowerOptions = issueForm.borrowerType === 'Student'
        ? students.map(s => ({ value: s._id, label: s.name || s.email }))
        : teachers.map(t => ({ value: t._id, label: t.name || t.email }));

    const activeIssues = issues.filter(i => i.status === 'issued');
    const stats = {
        totalIssued: activeIssues.length,
        overdue: overdueIssues.length,
        returnedToday: issues.filter(i => i.status === 'returned' && 
            new Date(i.returnDate || '').toDateString() === new Date().toDateString()).length
    };

    if (loading) {
        return (
            <AdminPageLayout title="Issue / Return" description="Manage book circulation">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Book Circulation" description="Issue and return library books">
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Currently Issued</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalIssued}</div>
                            <p className="text-xs text-muted-foreground">Active circulations</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                            <p className="text-xs text-muted-foreground">Need attention</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Returned Today</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.returnedToday}</div>
                            <p className="text-xs text-muted-foreground">Today's returns</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <ArrowRightLeft className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{books.reduce((sum, b) => sum + (b.availableCopies || 0), 0)}</div>
                            <p className="text-xs text-muted-foreground">Ready for issue</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <TabsList className="grid grid-cols-4 w-[400px]">
                            <TabsTrigger value="issue">Issue Book</TabsTrigger>
                            <TabsTrigger value="return">Return</TabsTrigger>
                            <TabsTrigger value="active">Active Issues</TabsTrigger>
                            <TabsTrigger value="overdue">Overdue</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Issue Book Tab */}
                    <TabsContent value="issue">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Issue a Book</CardTitle>
                                        <CardDescription>Lend a book to a student or teacher</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="max-w-xl space-y-4">
                                    <div className="space-y-2">
                                        <Label>Book <span className="text-red-500">*</span></Label>
                                        <NativeSelect
                                            value={issueForm.bookId}
                                            onValueChange={(value) => setIssueForm({ ...issueForm, bookId: value })}
                                            placeholder="Select a book..."
                                            options={bookOptions}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Borrower Type <span className="text-red-500">*</span></Label>
                                            <NativeSelect
                                                value={issueForm.borrowerType}
                                                onValueChange={(value) => setIssueForm({ ...issueForm, borrowerType: value as 'Student' | 'Teacher', borrowerId: '' })}
                                                placeholder="Select type..."
                                                options={[
                                                    { value: 'Student', label: 'Student' },
                                                    { value: 'Teacher', label: 'Teacher' }
                                                ]}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Borrower <span className="text-red-500">*</span></Label>
                                            <NativeSelect
                                                value={issueForm.borrowerId}
                                                onValueChange={(value) => setIssueForm({ ...issueForm, borrowerId: value })}
                                                placeholder="Select borrower..."
                                                options={borrowerOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Due Date <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="date"
                                            value={issueForm.dueDate}
                                            onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                                        />
                                        <p className="text-sm text-muted-foreground">Default: 14 days from today</p>
                                    </div>
                                    <Button
                                        onClick={handleIssueBook}
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <BookOpen className="mr-2 h-4 w-4" /> Issue Book
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Return Tab */}
                    <TabsContent value="return">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <RotateCcw className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Return a Book</CardTitle>
                                        <CardDescription>Process book returns</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-4">
                                    <div className="relative max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by book title, ISBN, or borrower..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                {activeIssues.length === 0 ? (
                                    <div className="text-center py-12">
                                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No active issues to return</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Book</TableHead>
                                                <TableHead>Borrower</TableHead>
                                                <TableHead>Issue Date</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {activeIssues
                                                .filter(i => 
                                                    i.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    i.borrower?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map((issue) => (
                                                <TableRow key={issue._id}>
                                                    <TableCell className="font-medium">{issue.book?.title || 'Unknown'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">{issue.borrowerType}</Badge>
                                                            {issue.borrower?.name || 'Unknown'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{formatDate(issue.issueDate)}</TableCell>
                                                    <TableCell>{formatDate(issue.dueDate)}</TableCell>
                                                    <TableCell>
                                                        {getDaysOverdue(issue.dueDate) > 0 ? (
                                                            <Badge className="bg-red-100 text-red-700">
                                                                {getDaysOverdue(issue.dueDate)} days overdue
                                                            </Badge>
                                                        ) : (
                                                            getStatusBadge(issue.status)
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openReturnDialog(issue)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Return
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Active Issues Tab */}
                    <TabsContent value="active">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle>Active Issues</CardTitle>
                                <CardDescription>All currently issued books</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {activeIssues.length === 0 ? (
                                    <div className="text-center py-16">
                                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No active issues</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Book</TableHead>
                                                <TableHead>Borrower</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Issue Date</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Renewals</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {activeIssues.map((issue) => (
                                                <TableRow key={issue._id}>
                                                    <TableCell className="font-medium">{issue.book?.title || 'Unknown'}</TableCell>
                                                    <TableCell>{issue.borrower?.name || 'Unknown'}</TableCell>
                                                    <TableCell><Badge variant="outline">{issue.borrowerType}</Badge></TableCell>
                                                    <TableCell>{formatDate(issue.issueDate)}</TableCell>
                                                    <TableCell>{formatDate(issue.dueDate)}</TableCell>
                                                    <TableCell>{issue.renewalCount || 0}/2</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            {(issue.renewalCount || 0) < 2 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRenewBook(issue._id)}
                                                                >
                                                                    <RotateCcw className="h-4 w-4 mr-1" /> Renew
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openReturnDialog(issue)}
                                                                className="text-green-600"
                                                            >
                                                                Return
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
                    </TabsContent>

                    {/* Overdue Tab */}
                    <TabsContent value="overdue">
                        <Card className="border-0 shadow-lg border-t-4 border-t-red-500">
                            <CardHeader className="border-b bg-red-50/50">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    <div>
                                        <CardTitle className="text-red-700">Overdue Books</CardTitle>
                                        <CardDescription>Books that have exceeded their due date</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {overdueIssues.length === 0 ? (
                                    <div className="text-center py-16">
                                        <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No overdue books!</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Book</TableHead>
                                                <TableHead>Borrower</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Days Overdue</TableHead>
                                                <TableHead>Fine</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {overdueIssues.map((issue) => {
                                                const daysOverdue = getDaysOverdue(issue.dueDate);
                                                const fine = daysOverdue * 1; // $1 per day
                                                return (
                                                    <TableRow key={issue._id} className="bg-red-50/30">
                                                        <TableCell className="font-medium">{issue.book?.title || 'Unknown'}</TableCell>
                                                        <TableCell>{issue.borrower?.name || 'Unknown'}</TableCell>
                                                        <TableCell className="text-red-600">{formatDate(issue.dueDate)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="destructive">{daysOverdue} days</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold text-red-600">${fine.toFixed(2)}</span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => openReturnDialog(issue)}
                                                                variant="destructive"
                                                            >
                                                                Return Now
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Return Dialog */}
                <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <RotateCcw className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <DialogTitle>Confirm Return</DialogTitle>
                                    <DialogDescription>
                                        Process book return
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        {selectedIssue && (
                            <div className="space-y-4 mt-4">
                                <div className="p-4 rounded-lg bg-slate-50">
                                    <p className="font-medium">{selectedIssue.book?.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Borrowed by: {selectedIssue.borrower?.name}
                                    </p>
                                </div>
                                {getDaysOverdue(selectedIssue.dueDate) > 0 && (
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                        <div className="flex items-center gap-2 text-red-700">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span className="font-medium">Overdue by {getDaysOverdue(selectedIssue.dueDate)} days</span>
                                        </div>
                                        <p className="text-sm text-red-600 mt-1">
                                            Fine: ${(getDaysOverdue(selectedIssue.dueDate) * 1).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter className="gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setReturnDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReturnBook}
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Return
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
}
