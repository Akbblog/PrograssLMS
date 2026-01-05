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
    GraduationCap,
    Users,
    BookOpen,
    Settings,
    ChevronDown,
    Plus,
    X,
    User
} from "lucide-react";

interface ClassFormData {
    name: string;
    description: string;
    sections: string[];
    capacity: number;
    classTeacher: string;
    subjects: string[];
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

export default function CreateClassPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [allSubjects, setAllSubjects] = useState<any[]>([]);
    const [newSection, setNewSection] = useState("");

    const [formData, setFormData] = useState<ClassFormData>({
        name: "",
        description: "",
        sections: ["A"],
        capacity: 30,
        classTeacher: "",
        subjects: []
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teachersRes, subjectsRes] = await Promise.all([
                adminAPI.getTeachers(),
                academicAPI.getSubjects()
            ]);
            
            const teachersList = unwrapArray((teachersRes as any)?.data, "teachers");
            const subjectsList = unwrapArray((subjectsRes as any)?.data, "subjects");
            
            setTeachers(teachersList);
            setAllSubjects(subjectsList);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load form data");
        } finally {
            setDataLoading(false);
        }
    };

    const addSection = () => {
        if (!newSection.trim()) {
            toast.error("Please enter a section name");
            return;
        }
        if (formData.sections.includes(newSection.toUpperCase())) {
            toast.error("Section already exists");
            return;
        }
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection.toUpperCase()]
        }));
        setNewSection("");
    };

    const removeSection = (section: string) => {
        if (formData.sections.length <= 1) {
            toast.error("At least one section is required");
            return;
        }
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s !== section)
        }));
    };

    const toggleSubject = (subjectId: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subjectId)
                ? prev.subjects.filter(s => s !== subjectId)
                : [...prev.subjects, subjectId]
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Class name is required";
        }

        if (formData.sections.length === 0) {
            newErrors.sections = "At least one section is required";
        }

        if (formData.capacity < 1) {
            newErrors.capacity = "Capacity must be at least 1";
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
            await academicAPI.createClass({
                name: formData.name,
                description: formData.description,
                sections: formData.sections,
                capacity: formData.capacity,
                classTeacher: formData.classTeacher || undefined,
                subjects: formData.subjects
            });
            
            toast.success("Class created successfully!");
            router.push("/admin/academic/classes");
        } catch (error: any) {
            console.error("Error creating class:", error);
            toast.error(error?.message || "Failed to create class");
        } finally {
            setLoading(false);
        }
    };

    const teacherOptions = teachers.map(t => ({
        value: t._id,
        label: t.name || `${t.firstName} ${t.lastName}`
    }));

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
                    <Link href="/admin/academic/classes">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Classes
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Create New Class</h1>
                        <p className="text-muted-foreground">
                            Set up a new class with sections, capacity, and assign teachers
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                                <CardDescription>Class name and description</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Class Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Grade 10, Class 5"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">
                                    Capacity per Section <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min={1}
                                    placeholder="30"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                    className={errors.capacity ? "border-red-500" : ""}
                                />
                                {errors.capacity && (
                                    <p className="text-sm text-red-500">{errors.capacity}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of this class..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sections */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Sections</CardTitle>
                                <CardDescription>Define class sections (e.g., A, B, C)</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.sections.map((section) => (
                                <Badge
                                    key={section}
                                    variant="secondary"
                                    className="px-3 py-1.5 text-sm flex items-center gap-1"
                                >
                                    Section {section}
                                    <button
                                        type="button"
                                        onClick={() => removeSection(section)}
                                        className="ml-1 hover:text-red-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="New section name (e.g., D)"
                                value={newSection}
                                onChange={(e) => setNewSection(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())}
                                className="max-w-xs"
                            />
                            <Button type="button" variant="outline" onClick={addSection}>
                                <Plus className="h-4 w-4 mr-1" /> Add Section
                            </Button>
                        </div>
                        {errors.sections && (
                            <p className="text-sm text-red-500">{errors.sections}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Total capacity: {formData.sections.length * formData.capacity} students
                        </p>
                    </CardContent>
                </Card>

                {/* Class Teacher */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Class Teacher</CardTitle>
                                <CardDescription>Assign a teacher to manage this class</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="max-w-md">
                            <Label htmlFor="classTeacher" className="mb-2 block">
                                Select Class Teacher
                            </Label>
                            <NativeSelect
                                value={formData.classTeacher}
                                onValueChange={(value) => setFormData({ ...formData, classTeacher: value })}
                                placeholder="Select a teacher..."
                                options={teacherOptions}
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                                The class teacher will be responsible for this class
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Subjects */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Settings className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Subjects</CardTitle>
                                <CardDescription>Select subjects taught in this class</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {allSubjects.length === 0 ? (
                            <div className="text-center py-8">
                                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-muted-foreground">No subjects available</p>
                                <Button asChild variant="link" className="mt-2">
                                    <Link href="/admin/academic/subjects">Create Subjects First</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {allSubjects.map((subject) => (
                                    <label
                                        key={subject._id}
                                        className={`
                                            flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                                            ${formData.subjects.includes(subject._id)
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.subjects.includes(subject._id)}
                                            onChange={() => toggleSubject(subject._id)}
                                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-medium">{subject.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-4">
                            {formData.subjects.length} subject(s) selected
                        </p>
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/academic/classes")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Class
                    </Button>
                </div>
            </form>
        </div>
    );
}
