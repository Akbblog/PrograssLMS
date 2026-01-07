"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateStudent } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";
import {
    ArrowLeft,
    Loader2,
    User,
    GraduationCap,
    Home,
    Users,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Shield,
    Heart,
    AlertCircle,
    ChevronDown,
    Check
} from "lucide-react";

interface StudentFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    bloodGroup?: string;
    nationality?: string;
    religion?: string;
    medicalConditions?: string;
    allergies?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    guardianInfo?: {
        fatherName?: string;
        fatherPhone?: string;
        fatherEmail?: string;
        fatherOccupation?: string;
        motherName?: string;
        motherPhone?: string;
        motherEmail?: string;
        motherOccupation?: string;
        emergencyContact?: string;
        emergencyPhone?: string;
        emergencyRelation?: string;
    };
    currentClassLevels: string[];
    academicYear?: string;
    previousSchool?: string;
    previousClass?: string;
    admissionDate?: string;
}

// Simple native select dropdown component
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
                className="w-full h-9 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

export default function CreateStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [formData, setFormData] = useState<StudentFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        currentClassLevels: [],
        admissionDate: new Date().toISOString().split('T')[0],
    });

    const { data: classesData } = useClasses();
    const { data: yearsData } = useAcademicYears();
    const createStudent = useCreateStudent();

    const classes = unwrapArray(classesData);
    const academicYears = unwrapArray(yearsData);

    useEffect(() => {
        const currentYear = (academicYears || []).find((y: any) => y.isCurrent);
        if (currentYear) setFormData(prev => ({ ...prev, academicYear: currentYear._id }));
    }, [yearsData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            setStep(1);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            setStep(1);
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            setStep(1);
            return;
        }

        if (formData.currentClassLevels.length === 0) {
            toast.error("Please select at least one class");
            setStep(2);
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const payload = {
                ...submitData,
                role: "student",
            };

            createStudent.mutate(payload, {
                onSuccess: () => {
                    toast.success("Student registered successfully!");
                    router.push("/admin/students");
                },
                onError: (err: any) => {
                    toast.error(err?.message || "Failed to create student");
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedChange = (parent: string, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...(prev[parent as keyof StudentFormData] as any),
                [field]: value,
            },
        }));
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const bloodGroupOptions = [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    const classOptions = classes.map((cls: any) => ({ value: cls._id, label: cls.name }));
    const yearOptions = academicYears.map((year: any) => ({ value: year._id, label: year.name }));

    if (!classesData || !yearsData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-2 text-slate-500">Loading form data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                    <Link href="/admin/students">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Students
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Register New Student</h1>
                        <p className="text-slate-500">Complete all required information</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[
                        { num: 1, label: 'Personal Info', icon: User },
                        { num: 2, label: 'Academic', icon: GraduationCap },
                        { num: 3, label: 'Guardian', icon: Users },
                        { num: 4, label: 'Address', icon: Home }
                    ].map((s, index) => (
                        <div key={s.num} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setStep(s.num)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${step === s.num
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : step > s.num
                                            ? 'text-green-600'
                                            : 'text-slate-400'
                                    }`}
                            >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step === s.num
                                        ? 'bg-indigo-600 text-white'
                                        : step > s.num
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                                </div>
                                <span className="hidden md:inline text-sm font-medium">{s.label}</span>
                            </button>
                            {index < 3 && (
                                <div className={`w-8 md:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-green-400' : 'bg-slate-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Basic details about the student</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="student@school.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-1">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Minimum 6 characters"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        required
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth || ""}
                                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <NativeSelect
                                        value={formData.gender || ""}
                                        onValueChange={(value) => handleInputChange("gender", value)}
                                        placeholder="Select gender"
                                        options={genderOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        value={formData.phone || ""}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bloodGroup">Blood Group</Label>
                                    <NativeSelect
                                        value={formData.bloodGroup || ""}
                                        onValueChange={(value) => handleInputChange("bloodGroup", value)}
                                        placeholder="Select blood group"
                                        options={bloodGroupOptions}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input
                                        id="nationality"
                                        placeholder="e.g., American"
                                        value={formData.nationality || ""}
                                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        placeholder="e.g., Christian"
                                        value={formData.religion || ""}
                                        onChange={(e) => handleInputChange("religion", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    <h3 className="font-semibold text-slate-900">Medical Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="medicalConditions">Medical Conditions</Label>
                                        <Textarea
                                            id="medicalConditions"
                                            placeholder="Any chronic conditions, disabilities, etc."
                                            value={formData.medicalConditions || ""}
                                            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="allergies">Allergies</Label>
                                        <Textarea
                                            id="allergies"
                                            placeholder="Food allergies, medication allergies, etc."
                                            value={formData.allergies || ""}
                                            onChange={(e) => handleInputChange("allergies", e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Academic Information */}
                {step === 2 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>Academic Information</CardTitle>
                                    <CardDescription>Class assignment and academic details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        Class <span className="text-red-500">*</span>
                                    </Label>
                                    <NativeSelect
                                        value={formData.currentClassLevels[0] || ""}
                                        onValueChange={(value) => handleInputChange("currentClassLevels", [value])}
                                        placeholder="Select class"
                                        options={classOptions}
                                    />
                                    {classes.length === 0 && (
                                        <p className="text-xs text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            No classes available. Create classes first.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Academic Year</Label>
                                    <NativeSelect
                                        value={formData.academicYear || ""}
                                        onValueChange={(value) => handleInputChange("academicYear", value)}
                                        placeholder="Select academic year"
                                        options={yearOptions}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="admissionDate">Admission Date</Label>
                                    <Input
                                        id="admissionDate"
                                        type="date"
                                        value={formData.admissionDate || ""}
                                        onChange={(e) => handleInputChange("admissionDate", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="previousSchool">Previous School</Label>
                                    <Input
                                        id="previousSchool"
                                        placeholder="Name of previous school"
                                        value={formData.previousSchool || ""}
                                        onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="previousClass">Previous Class</Label>
                                    <Input
                                        id="previousClass"
                                        placeholder="Last class attended"
                                        value={formData.previousClass || ""}
                                        onChange={(e) => handleInputChange("previousClass", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-indigo-900">Enrollment Status</h4>
                                        <p className="text-sm text-indigo-700 mt-1">
                                            Student will be enrolled as an active student upon registration.
                                            They can be enrolled in specific subjects later from the student management page.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Guardian Information */}
                {step === 3 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle>Guardian Information</CardTitle>
                                    <CardDescription>Parent and emergency contact details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Father's Information */}
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Badge variant="outline">Father's Information</Badge>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherName">Father's Name</Label>
                                        <Input
                                            id="fatherName"
                                            placeholder="Full name"
                                            value={formData.guardianInfo?.fatherName || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "fatherName", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherPhone">Father's Phone</Label>
                                        <Input
                                            id="fatherPhone"
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            value={formData.guardianInfo?.fatherPhone || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "fatherPhone", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherEmail">Father's Email</Label>
                                        <Input
                                            id="fatherEmail"
                                            type="email"
                                            placeholder="father@email.com"
                                            value={formData.guardianInfo?.fatherEmail || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "fatherEmail", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                                        <Input
                                            id="fatherOccupation"
                                            placeholder="e.g., Engineer"
                                            value={formData.guardianInfo?.fatherOccupation || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "fatherOccupation", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mother's Information */}
                            <div className="pt-4 border-t">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Badge variant="outline">Mother's Information</Badge>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="motherName">Mother's Name</Label>
                                        <Input
                                            id="motherName"
                                            placeholder="Full name"
                                            value={formData.guardianInfo?.motherName || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "motherName", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="motherPhone">Mother's Phone</Label>
                                        <Input
                                            id="motherPhone"
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            value={formData.guardianInfo?.motherPhone || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "motherPhone", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="motherEmail">Mother's Email</Label>
                                        <Input
                                            id="motherEmail"
                                            type="email"
                                            placeholder="mother@email.com"
                                            value={formData.guardianInfo?.motherEmail || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "motherEmail", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                                        <Input
                                            id="motherOccupation"
                                            placeholder="e.g., Teacher"
                                            value={formData.guardianInfo?.motherOccupation || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "motherOccupation", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="pt-4 border-t">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">Emergency Contact</Badge>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyContact">Contact Name</Label>
                                        <Input
                                            id="emergencyContact"
                                            placeholder="Full name"
                                            value={formData.guardianInfo?.emergencyContact || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "emergencyContact", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyPhone">Phone Number</Label>
                                        <Input
                                            id="emergencyPhone"
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            value={formData.guardianInfo?.emergencyPhone || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "emergencyPhone", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyRelation">Relationship</Label>
                                        <Input
                                            id="emergencyRelation"
                                            placeholder="e.g., Uncle, Aunt"
                                            value={formData.guardianInfo?.emergencyRelation || ""}
                                            onChange={(e) => handleNestedChange("guardianInfo", "emergencyRelation", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Address Information */}
                {step === 4 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Home className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle>Address Information</CardTitle>
                                    <CardDescription>Student's residential address</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="street" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    Street Address
                                </Label>
                                <Input
                                    id="street"
                                    placeholder="123 Main Street, Apt 4B"
                                    value={formData.address?.street || ""}
                                    onChange={(e) => handleNestedChange("address", "street", e.target.value)}
                                    className="h-10"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="New York"
                                        value={formData.address?.city || ""}
                                        onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State / Province</Label>
                                    <Input
                                        id="state"
                                        placeholder="NY"
                                        value={formData.address?.state || ""}
                                        onChange={(e) => handleNestedChange("address", "state", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        placeholder="United States"
                                        value={formData.address?.country || ""}
                                        onChange={(e) => handleNestedChange("address", "country", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                                    <Input
                                        id="zipCode"
                                        placeholder="10001"
                                        value={formData.address?.zipCode || ""}
                                        onChange={(e) => handleNestedChange("address", "zipCode", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                    <div>
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button asChild type="button" variant="outline">
                            <Link href="/admin/students">Cancel</Link>
                        </Button>
                        {step < totalSteps ? (
                            <Button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                                Next Step
                                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register Student
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
