"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminAPI, academicAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    Save,
    Trash2,
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Calendar,
    ChevronDown,
    AlertCircle,
    Users,
    ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

// Native Select Component
function NativeSelect({ value, onChange, options, placeholder, disabled = false }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
    );
}

export default function EditStudentPage() {
    const router = useRouter();
    const params = useParams();
    const studentId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "other",
        bloodGroup: "",
        enrollmentStatus: "active",
        currentClassLevel: "",
        section: "",
        rollNumber: "",
        academicYear: "",
        guardian: {
            name: "",
            email: "",
            phone: "",
            relation: "Father",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: ""
            }
        },
        emergencyContact: {
            name: "",
            phone: "",
            relation: ""
        }
    });

    useEffect(() => {
        if (studentId) {
            fetchData();
        }
    }, [studentId]);

    const fetchData = async () => {
        try {
            const [studentRes, classesRes, yearsRes] = await Promise.all([
                adminAPI.getStudent(studentId),
                academicAPI.getClasses(),
                academicAPI.getAcademicYears()
            ]);

            const student = (studentRes as any).data;
            if (!student) {
                toast.error("Student not found");
                router.push("/admin/students");
                return;
            }

            setClasses((classesRes as any).data || []);
            setYears((yearsRes as any).data || []);

            setFormData({
                name: student.name || "",
                email: student.email || "",
                phone: student.phone || "",
                dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : "",
                gender: student.gender || "other",
                bloodGroup: student.bloodGroup || "",
                enrollmentStatus: student.enrollmentStatus || "active",
                currentClassLevel: student.currentClassLevel?._id || student.currentClassLevel || "",
                section: student.section || "",
                rollNumber: student.rollNumber || "",
                academicYear: student.academicYear?._id || student.academicYear || "",
                guardian: {
                    name: student.guardian?.name || "",
                    email: student.guardian?.email || "",
                    phone: student.guardian?.phone || "",
                    relation: student.guardian?.relation || "Father",
                    address: {
                        street: student.guardian?.address?.street || "",
                        city: student.guardian?.address?.city || "",
                        state: student.guardian?.address?.state || "",
                        country: student.guardian?.address?.country || "",
                        zipCode: student.guardian?.address?.zipCode || ""
                    }
                },
                emergencyContact: {
                    name: student.emergencyContact?.name || "",
                    phone: student.emergencyContact?.phone || "",
                    relation: student.emergencyContact?.relation || ""
                }
            });
        } catch (error: any) {
            toast.error("Failed to load student data");
            router.push("/admin/students");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminAPI.updateStudent(studentId, formData);
            toast.success("Student updated successfully!");
            router.push(`/admin/students/${studentId}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to update student");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminAPI.deleteStudent(studentId);
            toast.success("Student deleted successfully");
            router.push("/admin/students");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete student");
        }
        setDeleteDialogOpen(false);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent: 'guardian' | 'emergencyContact', field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const updateAddress = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            guardian: {
                ...prev.guardian,
                address: { ...prev.guardian.address, [field]: value }
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2 text-slate-500 hover:text-indigo-600 font-bold">
                        <Link href={`/admin/students/${studentId}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">Edit Student Record</h1>
                    <p className="text-slate-500">Modify personal and academic information for this student.</p>
                </div>
                <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-100 font-bold" onClick={() => setDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Record
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <Card className="border-none shadow-lg shadow-slate-200/50">
                    <CardHeader className="border-b border-slate-50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-indigo-600 uppercase tracking-wider font-extrabold">
                            <User className="h-5 w-5" /> Basic Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-600 font-bold">Full Name *</Label>
                            <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-600 font-bold">Email Address *</Label>
                            <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-600 font-bold">Phone Number</Label>
                            <Input id="phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-slate-600 font-bold">Date of Birth</Label>
                            <Input id="dob" type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-bold">Gender</Label>
                            <NativeSelect value={formData.gender} onChange={(v) => updateField("gender", v)} placeholder="Select Gender" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodGroup" className="text-slate-600 font-bold">Blood Group</Label>
                            <Input id="bloodGroup" value={formData.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)} placeholder="e.g., O+" className="rounded-xl border-slate-200" />
                        </div>
                    </CardContent>
                </Card>

                {/* Academic Information */}
                <Card className="border-none shadow-lg shadow-slate-200/50">
                    <CardHeader className="border-b border-slate-50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-purple-600 uppercase tracking-wider font-extrabold">
                            <GraduationCap className="h-5 w-5" /> Academic Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                        <div className="space-y-2 lg:col-span-2">
                            <Label className="text-slate-600 font-bold">Class Level</Label>
                            <NativeSelect value={formData.currentClassLevel} onChange={(v) => updateField("currentClassLevel", v)} placeholder="Select Class Level" options={classes.map(c => ({ value: c._id, label: c.name }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section" className="text-slate-600 font-bold">Section</Label>
                            <Input id="section" value={formData.section} onChange={(e) => updateField("section", e.target.value)} placeholder="A, B, C..." className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roll" className="text-slate-600 font-bold">Roll Number</Label>
                            <Input id="roll" value={formData.rollNumber} onChange={(e) => updateField("rollNumber", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Label className="text-slate-600 font-bold">Enrollment Status</Label>
                            <NativeSelect value={formData.enrollmentStatus} onChange={(v) => updateField("enrollmentStatus", v)} placeholder="Set Status" options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "withdrawn", label: "Withdrawn" }, { value: "graduated", label: "Graduated" }]} />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Label className="text-slate-600 font-bold">Academic Year</Label>
                            <NativeSelect value={formData.academicYear} onChange={(v) => updateField("academicYear", v)} placeholder="Select Year" options={years.map(y => ({ value: y._id, label: y.name }))} />
                        </div>
                    </CardContent>
                </Card>

                {/* Guardian & Emergency Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-none shadow-lg shadow-slate-200/50">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg text-amber-600 uppercase tracking-wider font-extrabold">
                                <Users className="h-5 w-5" /> Guardian Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-bold">Primary Guardian Name</Label>
                                <Input value={formData.guardian.name} onChange={(e) => updateNestedField("guardian", "name", e.target.value)} className="rounded-xl border-slate-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold">Relation</Label>
                                    <Input value={formData.guardian.relation} onChange={(e) => updateNestedField("guardian", "relation", e.target.value)} className="rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold">Phone</Label>
                                    <Input value={formData.guardian.phone} onChange={(e) => updateNestedField("guardian", "phone", e.target.value)} className="rounded-xl border-slate-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-bold">Email</Label>
                                <Input value={formData.guardian.email} onChange={(e) => updateNestedField("guardian", "email", e.target.value)} className="rounded-xl border-slate-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg shadow-slate-200/50">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg text-red-600 uppercase tracking-wider font-extrabold">
                                <ShieldAlert className="h-5 w-5" /> Emergency Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-bold">Emergency Contact Name</Label>
                                <Input value={formData.emergencyContact.name} onChange={(e) => updateNestedField("emergencyContact", "name", e.target.value)} className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-bold">Phone</Label>
                                <Input value={formData.emergencyContact.phone} onChange={(e) => updateNestedField("emergencyContact", "phone", e.target.value)} className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-bold">Relation</Label>
                                <Input value={formData.emergencyContact.relation} onChange={(e) => updateNestedField("emergencyContact", "relation", e.target.value)} className="rounded-xl border-slate-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Address Section */}
                <Card className="border-none shadow-lg shadow-slate-200/50">
                    <CardHeader className="border-b border-slate-50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-700 uppercase tracking-wider font-extrabold">
                            <MapPin className="h-5 w-5" /> Home Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-slate-600 font-bold">Street Address</Label>
                            <Input value={formData.guardian.address.street} onChange={(e) => updateAddress("street", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-bold">City</Label>
                            <Input value={formData.guardian.address.city} onChange={(e) => updateAddress("city", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-bold">State</Label>
                            <Input value={formData.guardian.address.state} onChange={(e) => updateAddress("state", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-bold">Country</Label>
                            <Input value={formData.guardian.address.country} onChange={(e) => updateAddress("country", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-bold">ZIP Code</Label>
                            <Input value={formData.guardian.address.zipCode} onChange={(e) => updateAddress("zipCode", e.target.value)} className="rounded-xl border-slate-200" />
                        </div>
                    </CardContent>
                </Card>

                {/* Final Actions */}
                <div className="flex items-center justify-end gap-4 pb-12">
                    <Button type="button" variant="ghost" asChild className="text-slate-500 font-bold">
                        <Link href={`/admin/students/${studentId}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-12 h-12 font-bold shadow-lg shadow-indigo-100">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Save Records
                    </Button>
                </div>
            </form>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-center text-xl font-bold">Permanently Delete Student?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center px-4">
                            This action cannot be undone. This will permanently delete <strong>{formData.name}</strong>'s
                            academic record, enrollment history, and grades from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-xl px-8 font-bold">
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
