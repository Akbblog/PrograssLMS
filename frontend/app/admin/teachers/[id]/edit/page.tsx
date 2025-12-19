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
import { Badge } from "@/components/ui/badge";
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
    Briefcase,
    BookOpen,
    GraduationCap,
    Calendar,
    ChevronDown,
    AlertCircle
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

export default function EditTeacherPage() {
    const router = useRouter();
    const params = useParams();
    const teacherId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        employmentType: "",
        experience: "",
        qualifications: "",
        specialization: "",
        subject: "",
        classLevel: "",
        salary: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        }
    });

    useEffect(() => {
        if (teacherId) {
            fetchData();
        }
    }, [teacherId]);

    const fetchData = async () => {
        try {
            // Fetch teacher data, classes, and subjects in parallel
            const [teachersRes, classesRes, subjectsRes] = await Promise.all([
                adminAPI.getTeachers(),
                academicAPI.getClasses(),
                academicAPI.getSubjects()
            ]);

            const teachers = (teachersRes as any).data || [];
            const teacher = teachers.find((t: any) => t._id === teacherId);

            if (!teacher) {
                toast.error("Teacher not found");
                router.push("/admin/teachers");
                return;
            }

            setClasses((classesRes as any).data || []);
            setSubjects((subjectsRes as any).data || []);

            // Populate form with teacher data
            setFormData({
                name: teacher.name || "",
                email: teacher.email || "",
                phone: teacher.phone || "",
                dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : "",
                gender: teacher.gender || "",
                nationality: teacher.nationality || "",
                employmentType: teacher.employmentType || "",
                experience: teacher.experience || "",
                qualifications: teacher.qualifications || "",
                specialization: teacher.specialization || "",
                subject: typeof teacher.subject === 'object' ? teacher.subject?._id : teacher.subject || "",
                classLevel: typeof teacher.classLevel === 'object' ? teacher.classLevel?._id : teacher.classLevel || "",
                salary: teacher.salary?.toString() || "",
                address: {
                    street: teacher.address?.street || "",
                    city: teacher.address?.city || "",
                    state: teacher.address?.state || "",
                    country: teacher.address?.country || "",
                    zipCode: teacher.address?.zipCode || ""
                }
            });
        } catch (error: any) {
            toast.error("Failed to load teacher data");
            router.push("/admin/teachers");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await adminAPI.updateTeacher(teacherId, {
                ...formData,
                salary: formData.salary ? parseFloat(formData.salary) : undefined
            });
            toast.success("Teacher updated successfully!");
            router.push(`/admin/teachers/${teacherId}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to update teacher");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminAPI.deleteTeacher(teacherId);
            toast.success("Teacher deleted successfully");
            router.push("/admin/teachers");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete teacher");
        }
        setDeleteDialogOpen(false);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateAddress = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
                        <Link href="/admin/teachers">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Teachers
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Teacher</h1>
                    <p className="text-slate-500">Update teacher information</p>
                </div>
                <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 border-red-200"
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Teacher
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-purple-600" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <NativeSelect
                                value={formData.gender}
                                onChange={(v) => updateField("gender", v)}
                                placeholder="Select Gender"
                                options={[
                                    { value: "Male", label: "Male" },
                                    { value: "Female", label: "Female" },
                                    { value: "Other", label: "Other" }
                                ]}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                                id="nationality"
                                value={formData.nationality}
                                onChange={(e) => updateField("nationality", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <NativeSelect
                                value={formData.employmentType}
                                onChange={(v) => updateField("employmentType", v)}
                                placeholder="Select Type"
                                options={[
                                    { value: "Full-time", label: "Full-time" },
                                    { value: "Part-time", label: "Part-time" },
                                    { value: "Contract", label: "Contract" }
                                ]}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => updateField("experience", e.target.value)}
                                placeholder="e.g., 5 years"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Monthly Salary</Label>
                            <Input
                                id="salary"
                                type="number"
                                value={formData.salary}
                                onChange={(e) => updateField("salary", e.target.value)}
                                placeholder="e.g., 5000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                                id="specialization"
                                value={formData.specialization}
                                onChange={(e) => updateField("specialization", e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="qualifications">Qualifications</Label>
                            <Textarea
                                id="qualifications"
                                value={formData.qualifications}
                                onChange={(e) => updateField("qualifications", e.target.value)}
                                placeholder="List degrees, certifications, etc."
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Teaching Assignment */}
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <GraduationCap className="h-5 w-5 text-green-600" />
                            Teaching Assignment
                        </CardTitle>
                        <CardDescription>
                            Assign subject and class to this teacher
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Primary Subject</Label>
                            <NativeSelect
                                value={formData.subject}
                                onChange={(v) => updateField("subject", v)}
                                placeholder="Select Subject"
                                options={subjects.map(s => ({ value: s._id, label: s.name }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Class Assignment</Label>
                            <NativeSelect
                                value={formData.classLevel}
                                onChange={(v) => updateField("classLevel", v)}
                                placeholder="Select Class"
                                options={classes.map(c => ({ value: c._id, label: c.name }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5 text-amber-600" />
                            Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                                id="street"
                                value={formData.address.street}
                                onChange={(e) => updateAddress("street", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={formData.address.city}
                                onChange={(e) => updateAddress("city", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                                id="state"
                                value={formData.address.state}
                                onChange={(e) => updateAddress("state", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={formData.address.country}
                                onChange={(e) => updateAddress("country", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                            <Input
                                id="zipCode"
                                value={formData.address.zipCode}
                                onChange={(e) => updateAddress("zipCode", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href={`/admin/teachers/${teacherId}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </form>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-center">Delete Teacher?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            This action cannot be undone. This will permanently delete <strong>{formData.name}</strong>'s
                            account and remove all their data from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
