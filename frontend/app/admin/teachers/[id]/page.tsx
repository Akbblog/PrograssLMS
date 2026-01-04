"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    ArrowLeft,
    Pencil,
    Trash2,
    Mail,
    Phone,
    Calendar,
    MapPin,
    BookOpen,
    GraduationCap,
    Briefcase,
    User,
    Clock,
    Award,
    DollarSign,
    Building
} from "lucide-react";
import { toast } from "sonner";

export default function TeacherProfilePage() {
    const router = useRouter();
    const params = useParams();
    const teacherId = params.id as string;

    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

    useEffect(() => {
        if (teacherId) fetchTeacher();
    }, [teacherId]);

    const fetchTeacher = async () => {
        try {
            // Try to get individual teacher or from list
            const response = await adminAPI.getTeachers();
            const teachers = (response as any).data || [];
            const found = teachers.find((t: any) => t._id === teacherId);
            if (found) {
                setTeacher(found);
            } else {
                toast.error("Teacher not found");
                router.push("/admin/teachers");
            }
        } catch (error: any) {
            toast.error("Failed to load teacher");
            router.push("/admin/teachers");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        try {
            await adminAPI.deleteTeacher(teacherId);
            toast.success("Teacher deactivated");
            router.push("/admin/teachers");
        } catch (error: any) {
            toast.error(error.message || "Failed to deactivate");
        }
        setDeactivateDialogOpen(false);
    };

    const getStatusBadge = () => {
        if (teacher?.isWithdrawn) return <Badge variant="destructive">Withdrawn</Badge>;
        if (teacher?.isSuspended) return <Badge variant="warning">Suspended</Badge>;
        return <Badge variant="success">Active</Badge>;
    };

    const formatDate = (date: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!teacher) return null;

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href="/admin/teachers">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Teachers
                </Link>
            </Button>

            {/* Header Card */}
            <Card className="border-slate-200">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-semibold">
                                    {teacher.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                <h1 className="text-2xl font-bold text-slate-900">{teacher.name}</h1>
                                {getStatusBadge()}
                            </div>
                            <p className="text-slate-500 mb-4">{teacher.email}</p>

                            <div className="flex flex-wrap gap-2">
                                {teacher.subject && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        <BookOpen className="h-3 w-3 mr-1" />
                                        {typeof teacher.subject === 'object' ? teacher.subject.name : teacher.subject}
                                    </Badge>
                                )}
                                {teacher.classLevel && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                        <GraduationCap className="h-3 w-3 mr-1" />
                                        {typeof teacher.classLevel === 'object' ? teacher.classLevel.name : teacher.classLevel}
                                    </Badge>
                                )}
                                {teacher.employmentType && (
                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                        <Briefcase className="h-3 w-3 mr-1" />
                                        {teacher.employmentType}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            <Button variant="outline" asChild>
                                <Link href={`/admin/teachers/${teacherId}/edit`}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Link>
                            </Button>
                            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => setDeactivateDialogOpen(true)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Deactivate
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-purple-600" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={Mail} label="Email" value={teacher.email} />
                        <InfoRow icon={Phone} label="Phone" value={teacher.phone} />
                        <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(teacher.dateOfBirth)} />
                        <InfoRow icon={User} label="Gender" value={teacher.gender} />
                        <InfoRow icon={Building} label="Nationality" value={teacher.nationality} />
                        {teacher.address && (
                            <InfoRow
                                icon={MapPin}
                                label="Address"
                                value={[
                                    teacher.address.street,
                                    teacher.address.city,
                                    teacher.address.state,
                                    teacher.address.country,
                                    teacher.address.zipCode
                                ].filter(Boolean).join(", ") || "—"}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={Briefcase} label="Employee ID" value={teacher.employeeId} />
                        <InfoRow icon={Clock} label="Employment Type" value={teacher.employmentType} />
                        <InfoRow icon={Calendar} label="Joining Date" value={formatDate(teacher.dateEmployed || teacher.joiningDate)} />
                        <InfoRow icon={Award} label="Experience" value={teacher.experience} />
                        <InfoRow icon={DollarSign} label="Salary" value={teacher.salary ? `$${teacher.salary}` : "—"} />
                    </CardContent>
                </Card>

                {/* Qualifications */}
                <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-600" />
                            Qualifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.qualifications ? (
                            <p className="text-slate-700 whitespace-pre-wrap">{teacher.qualifications}</p>
                        ) : (
                            <p className="text-slate-400">No qualifications listed</p>
                        )}
                        {teacher.specialization && (
                            <div className="mt-4">
                                <p className="text-sm text-slate-500 mb-1">Specialization</p>
                                <p className="text-slate-700">{teacher.specialization}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Teaching Assignment */}
                <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-green-600" />
                            Teaching Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Primary Subject</p>
                            {teacher.subject ? (
                                <Badge className="bg-blue-100 text-blue-700">
                                    {typeof teacher.subject === 'object' ? teacher.subject.name : teacher.subject}
                                </Badge>
                            ) : (
                                <p className="text-slate-400">Not assigned</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Class Assignment</p>
                            {teacher.classLevel ? (
                                <Badge className="bg-purple-100 text-purple-700">
                                    {typeof teacher.classLevel === 'object' ? teacher.classLevel.name : teacher.classLevel}
                                </Badge>
                            ) : (
                                <p className="text-slate-400">Not assigned</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Information */}
            <Card className="border-slate-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Created</p>
                            <p className="text-slate-700">{formatDate(teacher.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Last Updated</p>
                            <p className="text-slate-700">{formatDate(teacher.updatedAt)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Account Status</p>
                            {getStatusBadge()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deactivate Dialog */}
            <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Teacher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate <strong>{teacher.name}</strong>. They won't be able to access the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeactivate} className="bg-red-600 hover:bg-red-700">
                            Deactivate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Helper component for info rows
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-slate-700 break-words">{value || "—"}</p>
            </div>
        </div>
    );
}
