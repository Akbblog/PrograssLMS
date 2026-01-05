"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { academicAPI, adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";
import {
    ArrowLeft,
    Loader2,
    BookOpen,
    Users,
    Hash,
    ChevronDown,
    Tag
} from "lucide-react";

interface SubjectFormData {
    name: string;
    code: string;
    category: string;
    credits: number;
    description: string;
    teachers: string[];
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

const categoryOptions = [
    { value: "core", label: "Core Subject" },
    { value: "elective", label: "Elective" },
    { value: "language", label: "Language" },
    { value: "arts", label: "Arts & Creativity" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Physical Education" },
    { value: "technology", label: "Technology" },
    { value: "other", label: "Other" }
];

export default function CreateSubjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [teachers, setTeachers] = useState<any[]>([]);

    const [formData, setFormData] = useState<SubjectFormData>({
        name: "",
        code: "",
        category: "",
        credits: 1,
        description: "",
        teachers: []
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const teachersRes = await adminAPI.getTeachers();
            const teachersList = unwrapArray((teachersRes as any)?.data, "teachers");
            setTeachers(teachersList);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load form data");
        } finally {
            setDataLoading(false);
        }
    };

    const toggleTeacher = (teacherId: string) => {
        setFormData(prev => ({
            ...prev,
            teachers: prev.teachers.includes(teacherId)
                ? prev.teachers.filter(t => t !== teacherId)
                : [...prev.teachers, teacherId]
        }));
    };

    const generateCode = () => {
        if (formData.name) {
            const code = formData.name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase())
                .join('') + '101';
            setFormData(prev => ({ ...prev, code }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Subject name is required";
        }

        if (!formData.code.trim()) {
            newErrors.code = "Subject code is required";
        }

        if (!formData.category) {
            newErrors.category = "Please select a category";
        }

        if (formData.credits < 0) {
            newErrors.credits = "Credits cannot be negative";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setLoading(true);
        try {
            await academicAPI.createSimpleSubject({
                name: formData.name,
                code: formData.code,
                category: formData.category,
                credits: formData.credits,
                description: formData.description,
                teachers: formData.teachers
            });
            
            toast.success("Subject created successfully!");
            router.push("/admin/academic/subjects");
        } catch (error: any) {
            console.error("Error creating subject:", error);
            toast.error(error?.message || "Failed to create subject");
        } finally {
            setLoading(false);
        }
    };

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
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                    <Link href="/admin/academic/subjects">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Subjects
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Create New Subject</h1>
                        <p className="text-muted-foreground">
                            Add a new subject to the curriculum
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Subject Details</CardTitle>
                                <CardDescription>Basic information about the subject</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Subject Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Mathematics, Physics"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">
                                    Subject Code <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="code"
                                        placeholder="e.g., MATH101"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className={errors.code ? "border-red-500" : ""}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={generateCode}
                                        disabled={!formData.name}
                                    >
                                        <Hash className="h-4 w-4" />
                                    </Button>
                                </div>
                                {errors.code && (
                                    <p className="text-sm text-red-500">{errors.code}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <NativeSelect
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    placeholder="Select category..."
                                    options={categoryOptions}
                                />
                                {errors.category && (
                                    <p className="text-sm text-red-500">{errors.category}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credits">Credits</Label>
                                <Input
                                    id="credits"
                                    type="number"
                                    min={0}
                                    placeholder="1"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                                    className={errors.credits ? "border-red-500" : ""}
                                />
                                {errors.credits && (
                                    <p className="text-sm text-red-500">{errors.credits}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of what this subject covers..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Assign Teachers */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Assign Teachers</CardTitle>
                                <CardDescription>Select teachers who can teach this subject</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {teachers.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-muted-foreground">No teachers available</p>
                                <Button asChild variant="link" className="mt-2">
                                    <Link href="/admin/teachers/create">Add Teachers First</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {teachers.map((teacher) => (
                                        <label
                                            key={teacher._id}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                                ${formData.teachers.includes(teacher._id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }
                                            `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.teachers.includes(teacher._id)}
                                                onChange={() => toggleTeacher(teacher._id)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {teacher.name || `${teacher.firstName} ${teacher.lastName}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {teacher.email}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    {formData.teachers.length} teacher(s) assigned
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Preview */}
                {formData.name && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl bg-white shadow flex items-center justify-center">
                                    <BookOpen className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{formData.name || "Subject Name"}</h3>
                                        {formData.code && (
                                            <Badge variant="outline">{formData.code}</Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.category && (
                                            <Badge className="bg-green-100 text-green-700">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {categoryOptions.find(c => c.value === formData.category)?.label}
                                            </Badge>
                                        )}
                                        {formData.credits > 0 && (
                                            <Badge variant="secondary">
                                                {formData.credits} Credit{formData.credits > 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                        {formData.teachers.length > 0 && (
                                            <Badge variant="secondary">
                                                <Users className="h-3 w-3 mr-1" />
                                                {formData.teachers.length} Teacher{formData.teachers.length > 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/academic/subjects")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Subject
                    </Button>
                </div>
            </form>
        </div>
    );
}
