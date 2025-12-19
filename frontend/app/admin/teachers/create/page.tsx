"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminAPI, academicAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    ArrowLeft,
    Loader2,
    User,
    GraduationCap,
    Home,
    Briefcase,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Award,
    BookOpen,
    ChevronDown,
    Check,
    Plus,
    X
} from "lucide-react";

interface TeacherFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    qualifications?: string;
    experience?: string;
    specializations?: string;
    subject?: string;
    classLevel?: string;
    academicYear?: string;
    academicTerm?: string;
    employeeId?: string;
    joiningDate?: string;
    employmentType?: string;
    salary?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
}

// Enhanced select with "Add New" option
function CreatableSelect({
    value,
    onValueChange,
    placeholder,
    options,
    disabled = false,
    onCreateNew,
    createLabel = "Create New"
}: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
    onCreateNew?: () => void;
    createLabel?: string;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => {
                    if (e.target.value === "__create_new__") {
                        onCreateNew?.();
                    } else {
                        onValueChange(e.target.value);
                    }
                }}
                disabled={disabled}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                {onCreateNew && (
                    <option value="__create_new__" className="font-medium text-purple-600">
                        ➕ {createLabel}
                    </option>
                )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
    );
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

export default function CreateTeacherPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [academicTerms, setAcademicTerms] = useState<any[]>([]);
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    // Modal states for creating new items
    const [showNewClassModal, setShowNewClassModal] = useState(false);
    const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newClassDescription, setNewClassDescription] = useState("");
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectDescription, setNewSubjectDescription] = useState("");
    const [creatingClass, setCreatingClass] = useState(false);
    const [creatingSubject, setCreatingSubject] = useState(false);

    const [formData, setFormData] = useState<TeacherFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        joiningDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [classesData, subjectsData, yearsData, termsData] = await Promise.all([
                academicAPI.getClasses(),
                academicAPI.getSubjects(),
                adminAPI.getAcademicYears(),
                adminAPI.getAcademicTerms(),
            ]);
            setClasses((classesData as any).data || []);
            setSubjects((subjectsData as any).data || []);
            setAcademicYears((yearsData as any).data || []);
            setAcademicTerms((termsData as any).data || []);

            // Set default academic year to current
            const currentYear = ((yearsData as any).data || []).find((y: any) => y.isCurrent);
            if (currentYear) {
                setFormData(prev => ({ ...prev, academicYear: currentYear._id }));
            }
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            toast.error("Failed to load form data");
        } finally {
            setDataLoading(false);
        }
    };

    // Create new class
    const handleCreateClass = async () => {
        if (!newClassName.trim()) {
            toast.error("Please enter a class name");
            return;
        }

        setCreatingClass(true);
        try {
            const response = await academicAPI.createClass({
                name: newClassName.trim(),
                description: newClassDescription.trim()
            });

            const newClass = (response as any).data;
            setClasses(prev => [...prev, newClass]);
            setFormData(prev => ({ ...prev, classLevel: newClass._id }));
            setShowNewClassModal(false);
            setNewClassName("");
            setNewClassDescription("");
            toast.success(`Class "${newClass.name}" created successfully!`);
        } catch (error: any) {
            console.error("Error creating class:", error);
            toast.error(error?.message || "Failed to create class");
        } finally {
            setCreatingClass(false);
        }
    };

    // Create new subject
    const handleCreateSubject = async () => {
        if (!newSubjectName.trim()) {
            toast.error("Please enter a subject name");
            return;
        }

        setCreatingSubject(true);
        try {
            // For subjects that don't require a program, we'll create a simple subject
            // First, check if there's a default program or create without program
            const response = await academicAPI.createSubject("default", {
                name: newSubjectName.trim(),
                description: newSubjectDescription.trim()
            });

            const newSubject = (response as any).data;
            setSubjects(prev => [...prev, newSubject]);
            setFormData(prev => ({ ...prev, subject: newSubject._id }));
            setShowNewSubjectModal(false);
            setNewSubjectName("");
            setNewSubjectDescription("");
            toast.success(`Subject "${newSubject.name}" created successfully!`);
        } catch (error: any) {
            console.error("Error creating subject:", error);
            // If program-based creation fails, try direct creation
            try {
                // Create subject directly without program dependency
                const directResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130/api/v1'}/subjects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        name: newSubjectName.trim(),
                        description: newSubjectDescription.trim()
                    })
                });

                if (directResponse.ok) {
                    const data = await directResponse.json();
                    const newSubject = data.data;
                    setSubjects(prev => [...prev, newSubject]);
                    setFormData(prev => ({ ...prev, subject: newSubject._id }));
                    setShowNewSubjectModal(false);
                    setNewSubjectName("");
                    setNewSubjectDescription("");
                    toast.success(`Subject "${newSubject.name}" created successfully!`);
                } else {
                    throw new Error("Failed to create subject");
                }
            } catch (directError) {
                toast.error(error?.message || "Failed to create subject. Make sure you have proper permissions.");
            }
        } finally {
            setCreatingSubject(false);
        }
    };

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

        setLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const payload = {
                ...submitData,
                role: "teacher",
            };

            await adminAPI.createTeacher(payload);
            toast.success("Teacher added successfully!");
            router.push("/admin/teachers");
        } catch (error: any) {
            console.error("Error creating teacher:", error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to create teacher");
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
                ...(prev[parent as keyof TeacherFormData] as any),
                [field]: value,
            },
        }));
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const employmentTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'contract', label: 'Contract' },
        { value: 'substitute', label: 'Substitute' }
    ];

    const subjectOptions = subjects.map(sub => ({ value: sub._id, label: sub.name }));
    const classOptions = classes.map(cls => ({ value: cls._id, label: cls.name }));
    const yearOptions = academicYears.map(year => ({ value: year._id, label: year.name }));
    const termOptions = academicTerms.map(term => ({ value: term._id, label: term.name }));

    if (dataLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
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
                    <Link href="/admin/teachers">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Teachers
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Add New Teacher</h1>
                        <p className="text-slate-500">Onboard a new faculty member</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[
                        { num: 1, label: 'Personal Info', icon: User },
                        { num: 2, label: 'Professional', icon: Briefcase },
                        { num: 3, label: 'Address', icon: Home }
                    ].map((s, index) => (
                        <div key={s.num} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setStep(s.num)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${step === s.num
                                    ? 'bg-purple-100 text-purple-700'
                                    : step > s.num
                                        ? 'text-green-600'
                                        : 'text-slate-400'
                                    }`}
                            >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step === s.num
                                    ? 'bg-purple-600 text-white'
                                    : step > s.num
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                                </div>
                                <span className="hidden md:inline text-sm font-medium">{s.label}</span>
                            </button>
                            {index < 2 && (
                                <div className={`w-12 md:w-24 h-0.5 mx-2 ${step > s.num ? 'bg-green-400' : 'bg-slate-200'
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
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Basic details about the teacher</CardDescription>
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
                                        placeholder="John Smith"
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
                                        placeholder="teacher@school.com"
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <Label htmlFor="employeeId">Employee ID</Label>
                                    <Input
                                        id="employeeId"
                                        placeholder="e.g., TCH-001"
                                        value={formData.employeeId || ""}
                                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Professional Information */}
                {step === 2 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>Professional Information</CardTitle>
                                    <CardDescription>Qualifications and teaching assignments</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Qualifications Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    <h3 className="font-semibold text-slate-900">Qualifications & Experience</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="qualifications">Educational Qualifications</Label>
                                        <Textarea
                                            id="qualifications"
                                            placeholder="e.g., MSc Mathematics (Harvard), BEd (MIT), Teaching Certificate..."
                                            value={formData.qualifications || ""}
                                            onChange={(e) => handleInputChange("qualifications", e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="experience">Years of Experience</Label>
                                            <Input
                                                id="experience"
                                                placeholder="e.g., 5 years"
                                                value={formData.experience || ""}
                                                onChange={(e) => handleInputChange("experience", e.target.value)}
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="specializations">Specializations</Label>
                                            <Input
                                                id="specializations"
                                                placeholder="e.g., Calculus, Statistics"
                                                value={formData.specializations || ""}
                                                onChange={(e) => handleInputChange("specializations", e.target.value)}
                                                className="h-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teaching Assignment Section */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="h-5 w-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-900">Teaching Assignment</h3>
                                    <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                                        You can create new items on-the-fly!
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center justify-between">
                                            <span>Primary Subject</span>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewSubjectModal(true)}
                                                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                            >
                                                <Plus className="h-3 w-3" /> New Subject
                                            </button>
                                        </Label>
                                        <CreatableSelect
                                            value={formData.subject || ""}
                                            onValueChange={(value) => handleInputChange("subject", value)}
                                            placeholder="Select or create subject"
                                            options={subjectOptions}
                                            onCreateNew={() => setShowNewSubjectModal(true)}
                                            createLabel="Create New Subject"
                                        />
                                        {subjects.length === 0 && (
                                            <p className="text-xs text-amber-600 flex items-center gap-1">
                                                <Plus className="h-3 w-3" /> No subjects yet. Create one above!
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center justify-between">
                                            <span>Class Assignment</span>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewClassModal(true)}
                                                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                            >
                                                <Plus className="h-3 w-3" /> New Class
                                            </button>
                                        </Label>
                                        <CreatableSelect
                                            value={formData.classLevel || ""}
                                            onValueChange={(value) => handleInputChange("classLevel", value)}
                                            placeholder="Select or create class"
                                            options={classOptions}
                                            onCreateNew={() => setShowNewClassModal(true)}
                                            createLabel="Create New Class"
                                        />
                                        {classes.length === 0 && (
                                            <p className="text-xs text-amber-600 flex items-center gap-1">
                                                <Plus className="h-3 w-3" /> No classes yet. Create one above!
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="space-y-2">
                                        <Label>Academic Year</Label>
                                        <NativeSelect
                                            value={formData.academicYear || ""}
                                            onValueChange={(value) => handleInputChange("academicYear", value)}
                                            placeholder="Select academic year"
                                            options={yearOptions}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Academic Term</Label>
                                        <NativeSelect
                                            value={formData.academicTerm || ""}
                                            onValueChange={(value) => handleInputChange("academicTerm", value)}
                                            placeholder="Select term"
                                            options={termOptions}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details Section */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    <h3 className="font-semibold text-slate-900">Employment Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="joiningDate">Joining Date</Label>
                                        <Input
                                            id="joiningDate"
                                            type="date"
                                            value={formData.joiningDate || ""}
                                            onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Employment Type</Label>
                                        <NativeSelect
                                            value={formData.employmentType || ""}
                                            onValueChange={(value) => handleInputChange("employmentType", value)}
                                            placeholder="Select type"
                                            options={employmentTypeOptions}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary">Monthly Salary</Label>
                                        <Input
                                            id="salary"
                                            type="number"
                                            placeholder="e.g., 5000"
                                            value={formData.salary || ""}
                                            onChange={(e) => handleInputChange("salary", e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Address Information */}
                {step === 3 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Home className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle>Address Information</CardTitle>
                                    <CardDescription>Teacher's residential address</CardDescription>
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
                            <Link href="/admin/teachers">Cancel</Link>
                        </Button>
                        {step < totalSteps ? (
                            <Button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                                Add Teacher
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            {/* Create New Class Modal */}
            <Dialog open={showNewClassModal} onOpenChange={setShowNewClassModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <GraduationCap className="h-4 w-4 text-purple-600" />
                            </div>
                            Create New Class
                        </DialogTitle>
                        <DialogDescription>
                            Add a new class that will be available for all teachers in your school.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newClassName">Class Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="newClassName"
                                placeholder="e.g., Grade 10, Class A, Science Section"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newClassDescription">Description (Optional)</Label>
                            <Textarea
                                id="newClassDescription"
                                placeholder="Brief description of the class..."
                                value={newClassDescription}
                                onChange={(e) => setNewClassDescription(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowNewClassModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateClass}
                            disabled={creatingClass || !newClassName.trim()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {creatingClass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Class
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create New Subject Modal */}
            <Dialog open={showNewSubjectModal} onOpenChange={setShowNewSubjectModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            Create New Subject
                        </DialogTitle>
                        <DialogDescription>
                            Add a new subject that will be available for all teachers in your school.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newSubjectName">Subject Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="newSubjectName"
                                placeholder="e.g., Mathematics, Physics, Literature"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newSubjectDescription">Description (Optional)</Label>
                            <Textarea
                                id="newSubjectDescription"
                                placeholder="Brief description of the subject..."
                                value={newSubjectDescription}
                                onChange={(e) => setNewSubjectDescription(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowNewSubjectModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateSubject}
                            disabled={creatingSubject || !newSubjectName.trim()}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {creatingSubject && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Subject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
