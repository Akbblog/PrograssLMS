"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Loader2,
    Plus,
    Users,
    Pencil,
    Trash2,
    Eye,
    Search,
    MoreVertical,
    UserPlus,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Mail,
    GraduationCap,
    LayoutGrid,
    Table2,
    Phone
} from "lucide-react";
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { toast } from "sonner";

// Action Menu Component
function ActionMenu({ onView, onEdit, onDelete }: {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        e.preventDefault();
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100"
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            >
                <MoreVertical className="h-4 w-4" />
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                    <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-50 py-1">
                        <button
                            className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={(e) => handleClick(e, onView)}
                        >
                            <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Profile
                        </button>
                        <button
                            className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={(e) => handleClick(e, onEdit)}
                        >
                            <Pencil className="mr-2 h-4 w-4 text-slate-400" /> Edit
                        </button>
                        <hr className="my-1" />
                        <button
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={(e) => handleClick(e, onDelete)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}



// Informative Teacher Card
function TeacherCard({ teacher, onView, onEdit, onDelete }: {
    teacher: any;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const getStatusBadge = () => {
        if (teacher.isWithdrawn) return <Badge className="bg-red-100 text-red-700">Withdrawn</Badge>;
        if (teacher.isSuspended) return <Badge className="bg-amber-100 text-amber-700">Suspended</Badge>;
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    };

    const getSubjectName = () => {
        if (!teacher.subject) return null;
        return typeof teacher.subject === 'object' ? teacher.subject.name : teacher.subject;
    };

    const getClassName = () => {
        if (!teacher.classLevel) return null;
        return typeof teacher.classLevel === 'object' ? teacher.classLevel.name : teacher.classLevel;
    };

    const formatDate = (date: string) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200" onClick={onView}>
            <CardContent className="p-4">
                {/* Header with avatar, name, status */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                                {teacher.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{teacher.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{teacher.email}</p>
                        </div>
                    </div>
                    <ActionMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
                </div>

                {/* Subject - Primary teaching area */}
                <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">
                            {getSubjectName() || <span className="text-slate-400 italic">No subject assigned</span>}
                        </span>
                    </div>
                    {getClassName() && (
                        <div className="flex items-center gap-2 mt-1">
                            <GraduationCap className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{getClassName()}</span>
                        </div>
                    )}
                </div>

                {/* Additional details */}
                <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    {teacher.employmentType && (
                        <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {teacher.employmentType}
                        </span>
                    )}
                    {teacher.experience && (
                        <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {teacher.experience} exp
                        </span>
                    )}
                    {(teacher.dateEmployed || teacher.joiningDate) && (
                        <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            Joined {formatDate(teacher.dateEmployed || teacher.joiningDate)}
                        </span>
                    )}
                </div>

                {/* Footer with status and phone */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    {getStatusBadge()}
                    {teacher.phone && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {teacher.phone}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


export default function AdminTeachersPage() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<any>(null);

    useEffect(() => { fetchTeachers(); }, []);
    useEffect(() => { filterTeachers(); }, [searchQuery, statusFilter, teachers]);

    const fetchTeachers = async () => {
        try {
            const response = await adminAPI.getTeachers();
            const data = (response as any).data || [];
            setTeachers(data);
            setFilteredTeachers(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to load teachers");
        } finally {
            setLoading(false);
        }
    };

    const filterTeachers = () => {
        let filtered = [...teachers];
        if (statusFilter === "active") filtered = filtered.filter(t => !t.isWithdrawn && !t.isSuspended);
        else if (statusFilter === "suspended") filtered = filtered.filter(t => t.isSuspended);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name?.toLowerCase().includes(q) ||
                t.email?.toLowerCase().includes(q)
            );
        }
        setFilteredTeachers(filtered);
    };

    const handleDelete = (teacher: any) => {
        setTeacherToDelete(teacher);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!teacherToDelete) return;
        try {
            await adminAPI.deleteTeacher(teacherToDelete._id);
            toast.success("Teacher deleted successfully");
            fetchTeachers();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete teacher");
        } finally {
            setDeleteDialogOpen(false);
            setTeacherToDelete(null);
        }
    };

    const getStatusBadge = (teacher: any) => {
        if (teacher.isWithdrawn) return <Badge className="bg-red-100 text-red-700">Withdrawn</Badge>;
        if (teacher.isSuspended) return <Badge className="bg-amber-100 text-amber-700">Suspended</Badge>;
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const total = teachers.length
    const activeCount = teachers.filter(t => !t.isWithdrawn && !t.isSuspended).length
    const suspendedCount = teachers.filter(t => t.isSuspended).length
    const subjectsCount = new Set(teachers.filter(t => t.subject).map(t => typeof t.subject === 'object' ? t.subject._id : t.subject)).size

    return (
        <AdminPageLayout
            title="Teachers"
            description="Manage faculty members"
            actions={<Button asChild className="btn-responsive-lg w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"><Link href="/admin/teachers/create"><UserPlus className="mr-2 h-4 w-4" /> Add Teacher</Link></Button>}
            stats={(
                <>
                    <SummaryStatCard title="Total" value={total} icon={<Users className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="Active" value={activeCount} icon={<CheckCircle2 className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Suspended" value={suspendedCount} icon={<AlertCircle className="h-4 w-4 text-white" />} variant="orange" />
                    <SummaryStatCard title="Subjects" value={subjectsCount} icon={<BookOpen className="h-4 w-4 text-white" />} variant="blue" />
                </>
            )}
        >

            {/* Filters - Mobile optimized */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search teachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-mobile pl-8"
                        />
                    </div>
                </div>
                
                {/* Filter Pills - Horizontal scroll on mobile */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {["all", "active", "suspended"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f as any)}
                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all whitespace-nowrap ${statusFilter === f ? "bg-purple-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* View Toggle - Mobile optimized */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("card")}
                            className={`p-2 rounded-md transition-all touch-target-sm ${viewMode === "card" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"}`}
                            title="Card view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-2 rounded-md transition-all touch-target-sm ${viewMode === "table" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"}`}
                            title="Table view"
                        >
                            <Table2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {filteredTeachers.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-slate-700">No teachers found</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center px-2">
                            {searchQuery ? "Try adjusting your search" : "Add your first teacher to get started"}
                        </p>
                        {!searchQuery && (
                            <Button asChild className="btn-responsive-lg mt-4">
                                <Link href="/admin/teachers/create"><Plus className="mr-2 h-4 w-4" /> Add Teacher</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : viewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredTeachers.map((teacher) => (
                        <TeacherCard
                            key={teacher._id}
                            teacher={teacher}
                            onView={() => router.push(`/admin/teachers/${teacher._id}`)}
                            onEdit={() => router.push(`/admin/teachers/${teacher._id}/edit`)}
                            onDelete={() => handleDelete(teacher)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto mobile-scroll">
                        <table className="w-full text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b sticky top-0">
                                <tr>
                                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-600">Teacher</th>
                                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-600 hidden md:table-cell">Subject</th>
                                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-600 hidden lg:table-cell">Class</th>
                                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-600">Status</th>
                                    <th className="text-right px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher._id} className="hover:bg-slate-50">
                                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                                                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs sm:text-sm">
                                                        {teacher.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate text-xs sm:text-sm">{teacher.name}</p>
                                                    <p className="text-xs text-slate-500 truncate hidden sm:block">{teacher.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                                            {teacher.subject ? (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                                    {typeof teacher.subject === 'object' ? teacher.subject.name : teacher.subject}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell text-slate-600">
                                            {teacher.classLevel ? (
                                                typeof teacher.classLevel === 'object' ? teacher.classLevel.name : teacher.classLevel
                                            ) : "—"}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3">{getStatusBadge(teacher)}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                                            <ActionMenu
                                                onView={() => router.push(`/admin/teachers/${teacher._id}`)}
                                                onEdit={() => router.push(`/admin/teachers/${teacher._id}/edit`)}
                                                onDelete={() => handleDelete(teacher)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <p className="text-xs sm:text-sm text-slate-500 text-center">
                Showing {filteredTeachers.length} of {teachers.length} teachers
            </p>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="max-w-sm sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg">Delete Teacher?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm">
                            This will permanently delete <strong>{teacherToDelete?.name}</strong> and remove all their data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2 sm:gap-4">
                        <AlertDialogCancel className="btn-responsive flex-1">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="btn-responsive flex-1 bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminPageLayout>
    );
}
