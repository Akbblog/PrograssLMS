"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { superAdminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Calendar, Mail, MapPin, Phone, ShieldCheck, Loader2, Edit, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SchoolType {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    subscription: {
        plan: string;
        status: string;
        startDate: string;
        endDate: string;
        limits: {
            maxStudents: number;
            maxTeachers: number;
            maxClasses: number;
        };
        usage: {
            studentCount: number;
            teacherCount: number;
            classCount: number;
        };
    };
    isActive: boolean;
    isSuspended: boolean;
    suspensionReason?: string;
    primaryAdmin?: {
        name: string;
        email: string;
    };
    features?: any;
}

export default function SchoolDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [school, setSchool] = useState<SchoolType | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Edit State
    const [editOpen, setEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", phone: "", street: "", city: "", state: "", country: "", zipCode: "" });

    // Suspend State
    const [suspendOpen, setSuspendOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState("");

    // Subscription State
    const [subOpen, setSubOpen] = useState(false);
    const [subForm, setSubForm] = useState({ plan: "", status: "", endDate: "" });

    // Module Toggle State
    const [modules, setModules] = useState({
        teachers: true,
        students: true,
        academics: true,
        attendance: true,
        exams: true,
        finance: true,
        communication: true,
        reports: true,
        roles: true,
    });
    const [moduleLoading, setModuleLoading] = useState(false);

    // Delete State
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchSchoolDetails(params.id as string);
        }
    }, [params.id]);

    const fetchSchoolDetails = async (id: string) => {
        try {
            const res: any = await superAdminAPI.getSchool(id);
            // API returns { status: "success", data: school }
            if (res.status === "success" && res.data) {
                setSchool(res.data);
            } else if (res._id) {
                // Fallback if API returns direct object (unlikely given current backend)
                setSchool(res);
            } else {
                console.error("Unexpected API response:", res);
                toast.error("Failed to load school details");
            }
            // Initialize forms
            const schoolData = (res.status === "success" && res.data) ? res.data : (res._id ? res : null);

            if (schoolData) {
                setEditForm({
                    name: schoolData.name,
                    phone: schoolData.phone,
                    street: schoolData.address?.street || "",
                    city: schoolData.address?.city || "",
                    state: schoolData.address?.state || "",
                    country: schoolData.address?.country || "",
                    zipCode: schoolData.address?.zipCode || "",
                });
                setSubForm({
                    plan: schoolData.subscription?.plan || "trial",
                    status: schoolData.subscription?.status || "active",
                    endDate: schoolData.subscription?.endDate ? new Date(schoolData.subscription.endDate).toISOString().split('T')[0] : "",
                });

                // Initialize modules state safely
                setModules({
                    teachers: schoolData.features?.canManageTeachers !== false,
                    students: schoolData.features?.canManageStudents !== false,
                    academics: schoolData.features?.canManageAcademics !== false,
                    attendance: schoolData.features?.canManageAttendance !== false,
                    exams: schoolData.features?.canManageExams !== false,
                    finance: schoolData.features?.canManageFinance !== false,
                    communication: schoolData.features?.canManageCommunication !== false,
                    reports: schoolData.features?.canViewReports !== false,
                    roles: schoolData.features?.canManageRoles !== false,
                });
            }
        } catch (error) {
            console.error("Failed to fetch school details:", error);
            toast.error("Failed to load school details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSchool = async () => {
        if (!school) return;
        setActionLoading(true);
        try {
            const payload = {
                name: editForm.name,
                phone: editForm.phone,
                address: {
                    street: editForm.street,
                    city: editForm.city,
                    state: editForm.state,
                    country: editForm.country,
                    zipCode: editForm.zipCode,
                }
            };
            await superAdminAPI.updateSchool(school._id, payload);
            toast.success("School updated successfully");
            setEditOpen(false);
            fetchSchoolDetails(school._id);
        } catch (error: any) {
            toast.error(error.message || "Failed to update school");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!school) return;
        setActionLoading(true);
        try {
            const isSuspending = !school.isSuspended;
            await superAdminAPI.toggleSchoolStatus(school._id, {
                isSuspended: isSuspending,
                suspensionReason: isSuspending ? suspendReason : ""
            });
            toast.success(`School ${isSuspending ? 'suspended' : 'activated'} successfully`);
            setSuspendOpen(false);
            fetchSchoolDetails(school._id);
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleModule = async (module: keyof typeof modules, value: boolean) => {
        if (!school) return;
        setModuleLoading(true);
        // Optimistic update
        const newModules = { ...modules, [module]: value };
        setModules(newModules);

        try {
            await superAdminAPI.updateSchool(school._id, {
                features: {
                    ...school.features, // keep existing features
                    canManageTeachers: newModules.teachers,
                    canManageStudents: newModules.students,
                    canManageAcademics: newModules.academics,
                    canManageAttendance: newModules.attendance,
                    canManageExams: newModules.exams,
                    canManageFinance: newModules.finance,
                    canManageCommunication: newModules.communication,
                    canViewReports: newModules.reports,
                    canManageRoles: newModules.roles,
                }
            });
            toast.success(`${module.charAt(0).toUpperCase() + module.slice(1)} module ${value ? 'enabled' : 'disabled'}`);
            // No need to refetch full details for a simple toggle, state is already updated
        } catch (error: any) {
            // Revert on error
            setModules({ ...modules, [module]: !value });
            toast.error(error.message || "Failed to update module settings");
        } finally {
            setModuleLoading(false);
        }
    };

    const handleUpdateSubscription = async () => {
        if (!school) return;
        setActionLoading(true);
        try {
            await superAdminAPI.updateSubscription(school._id, subForm);
            toast.success("Subscription updated successfully");
            setSubOpen(false);
            fetchSchoolDetails(school._id);
        } catch (error: any) {
            toast.error(error.message || "Failed to update subscription");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSchool = async () => {
        if (!school) return;
        setActionLoading(true);
        try {
            await superAdminAPI.deleteSchool(school._id);
            toast.success("School deleted successfully");
            setDeleteOpen(false);
            router.push("/superadmin/schools");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete school");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!school) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold">School not found</h2>
                <Button onClick={() => router.back()} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schools
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Mail className="h-4 w-4" /> {school.email}
                            <span className="mx-2">•</span>
                            <Phone className="h-4 w-4" /> {school.phone}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Edit Dialog */}
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Edit className="w-4 h-4 mr-2" /> Edit School</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Edit School Details</DialogTitle>
                                <DialogDescription>Update school information and address.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                        Module Access Control
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Teachers Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable management of teachers</p>
                                            </div>
                                            <Switch
                                                checked={modules.teachers}
                                                onCheckedChange={(val) => handleToggleModule('teachers', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Students Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable management of students</p>
                                            </div>
                                            <Switch
                                                checked={modules.students}
                                                onCheckedChange={(val) => handleToggleModule('students', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Academic Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable classes, subjects management</p>
                                            </div>
                                            <Switch
                                                checked={modules.academics}
                                                onCheckedChange={(val) => handleToggleModule('academics', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Attendance Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable attendance tracking</p>
                                            </div>
                                            <Switch
                                                checked={modules.attendance}
                                                onCheckedChange={(val) => handleToggleModule('attendance', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Exams Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable exam management</p>
                                            </div>
                                            <Switch
                                                checked={modules.exams}
                                                onCheckedChange={(val) => handleToggleModule('exams', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Finance Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable fee management</p>
                                            </div>
                                            <Switch
                                                checked={modules.finance}
                                                onCheckedChange={(val) => handleToggleModule('finance', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Communication Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable messaging/announcements</p>
                                            </div>
                                            <Switch
                                                checked={modules.communication}
                                                onCheckedChange={(val) => handleToggleModule('communication', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Reports Module</Label>
                                                <p className="text-xs text-muted-foreground">Enable analytics reports</p>
                                            </div>
                                            <Switch
                                                checked={modules.reports}
                                                onCheckedChange={(val) => handleToggleModule('reports', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Roles & Permissions</Label>
                                                <p className="text-xs text-muted-foreground">Enable role management</p>
                                            </div>
                                            <Switch
                                                checked={modules.roles}
                                                onCheckedChange={(val) => handleToggleModule('roles', val)}
                                                disabled={moduleLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>School Name</Label>
                                    <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phone</Label>
                                    <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Street</Label>
                                    <Input value={editForm.street} onChange={(e) => setEditForm({ ...editForm, street: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>City</Label>
                                        <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>State</Label>
                                        <Input value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>Country</Label>
                                        <Input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Zip Code</Label>
                                        <Input value={editForm.zipCode} onChange={(e) => setEditForm({ ...editForm, zipCode: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateSchool} disabled={actionLoading}>
                                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Suspend Dialog */}
                    <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
                        <DialogTrigger asChild>
                            <Button variant={school.isSuspended ? "default" : "destructive"}>
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                {school.isSuspended ? "Activate School" : "Suspend School"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{school.isSuspended ? "Activate School" : "Suspend School"}</DialogTitle>
                                <DialogDescription>
                                    {school.isSuspended
                                        ? "Are you sure you want to activate this school? Access will be restored."
                                        : "Are you sure you want to suspend this school? Access will be blocked for all users."}
                                </DialogDescription>
                            </DialogHeader>
                            {!school.isSuspended && (
                                <div className="py-4">
                                    <Label>Reason for Suspension</Label>
                                    <Textarea
                                        placeholder="e.g. Non-payment of dues"
                                        value={suspendReason}
                                        onChange={(e) => setSuspendReason(e.target.value)}
                                    />
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSuspendOpen(false)}>Cancel</Button>
                                <Button
                                    variant={school.isSuspended ? "default" : "destructive"}
                                    onClick={handleToggleStatus}
                                    disabled={actionLoading}
                                >
                                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {school.isSuspended ? "Activate" : "Suspend"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete School
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete School Permanently</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to permanently delete this school? This action cannot be undone.
                                    All school data, admins, teachers, students, and records will be permanently removed.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 bg-red-50 border border-red-200 rounded-lg px-4">
                                <p className="text-sm text-red-700 font-medium">
                                    ⚠️ You are about to delete: <strong>{school.name}</strong>
                                </p>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteSchool}
                                    disabled={actionLoading}
                                >
                                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete Permanently
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {school.isSuspended && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <div>
                        <p className="font-semibold">This school is currently suspended.</p>
                        <p className="text-sm">Reason: {school.suspensionReason || "No reason provided"}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <p>
                                        {school.address.street}<br />
                                        {school.address.city}, {school.address.state} {school.address.zipCode}<br />
                                        {school.address.country}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Primary Admin</h3>
                                <div className="flex items-start gap-2">
                                    <ShieldCheck className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{school.primaryAdmin?.name || "N/A"}</p>
                                        <p className="text-sm text-muted-foreground">{school.primaryAdmin?.email || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Subscription & Usage</h3>
                                <Dialog open={subOpen} onOpenChange={setSubOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">Manage Subscription</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Manage Subscription</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label>Plan</Label>
                                                <Select value={subForm.plan} onValueChange={(val) => setSubForm({ ...subForm, plan: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Plan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="trial">Trial</SelectItem>
                                                        <SelectItem value="basic">Basic</SelectItem>
                                                        <SelectItem value="standard">Standard</SelectItem>
                                                        <SelectItem value="premium">Premium</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Status</Label>
                                                <Select value={subForm.status} onValueChange={(val) => setSubForm({ ...subForm, status: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="expired">Expired</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>End Date</Label>
                                                <Input type="date" value={subForm.endDate} onChange={(e) => setSubForm({ ...subForm, endDate: e.target.value })} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setSubOpen(false)}>Cancel</Button>
                                            <Button onClick={handleUpdateSubscription} disabled={actionLoading}>
                                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                                    <p className="text-2xl font-bold capitalize">{school.subscription.plan}</p>
                                    <Badge variant={school.subscription.status === "active" ? "default" : "destructive"} className="mt-2">
                                        {school.subscription.status}
                                    </Badge>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm font-medium text-muted-foreground">Students</p>
                                    <p className="text-2xl font-bold">
                                        {school.subscription.usage.studentCount} / {school.subscription.limits.maxStudents}
                                    </p>
                                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-full"
                                            style={{ width: `${Math.min(100, (school.subscription.usage.studentCount / school.subscription.limits.maxStudents) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                                    <p className="text-2xl font-bold">
                                        {school.subscription.usage.teacherCount} / {school.subscription.limits.maxTeachers}
                                    </p>
                                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-full"
                                            style={{ width: `${Math.min(100, (school.subscription.usage.teacherCount / school.subscription.limits.maxTeachers) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Subscription ends on {new Date(school.subscription.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button className="w-full justify-start" variant="outline" onClick={() => setSubOpen(true)}>
                                Manage Subscription
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                Reset Admin Password
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                View Audit Logs
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
