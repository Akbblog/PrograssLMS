"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { toast } from "sonner"
import {
    Plus,
    Library,
    Edit,
    Trash2,
    Search,
    Loader2,
    BookOpen,
    Clock,
    Users,
    FileText,
    Layers,
    CheckCircle,
    Eye,
    Send
} from "lucide-react"
import { courseAPI, academicAPI } from "@/lib/api/endpoints"

interface Course {
    _id: string
    title: string
    description: string
    category: string
    difficulty: "beginner" | "intermediate" | "advanced"
    subject?: { _id: string; name: string }
    classLevels?: { _id: string; name: string }[]
    instructor?: { _id: string; name: string; email: string }
    modules: any[]
    estimatedHours: number
    enrolledStudents: any[]
    status: "draft" | "published" | "archived"
    tags: string[]
    createdAt: string
}

interface Subject {
    _id: string
    name: string
}

interface ClassLevel {
    _id: string
    name: string
}

interface Teacher {
    _id: string
    name: string
    email: string
}

export default function LearningCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [classes, setClasses] = useState<ClassLevel[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
        subject: "",
        classLevels: [] as string[],
        instructor: "",
        estimatedHours: 0,
        tags: "",
        status: "draft" as "draft" | "published" | "archived",
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [coursesRes, subjectsRes, classesRes] = await Promise.all([
                courseAPI.getAll(),
                academicAPI.getSubjects(),
                academicAPI.getClasses()
            ])
            setCourses((coursesRes as any).data || [])
            setSubjects((subjectsRes as any).data || [])
            setClasses((classesRes as any).data || [])
        } catch (error) {
            console.error("Failed to load data:", error)
            toast.error("Failed to load courses")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!formData.title) {
            toast.error("Please enter a course title")
            return
        }

        setSaving(true)
        try {
            const courseData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                difficulty: formData.difficulty,
                subject: formData.subject || undefined,
                classLevels: formData.classLevels.filter(c => c),
                instructor: formData.instructor || undefined,
                estimatedHours: formData.estimatedHours,
                tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
                status: formData.status,
            }

            if (editingCourse) {
                await courseAPI.update(editingCourse._id, courseData)
                toast.success("Course updated successfully")
            } else {
                await courseAPI.create(courseData)
                toast.success("Course created successfully")
            }

            setIsDialogOpen(false)
            resetForm()
            fetchData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save course")
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (course: Course) => {
        setEditingCourse(course)
        setFormData({
            title: course.title,
            description: course.description || "",
            category: course.category || "",
            difficulty: course.difficulty,
            subject: course.subject?._id || "",
            classLevels: course.classLevels?.map(c => c._id) || [],
            instructor: course.instructor?._id || "",
            estimatedHours: course.estimatedHours || 0,
            tags: course.tags?.join(", ") || "",
            status: course.status,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course? All modules and lessons will also be deleted.")) {
            return
        }

        try {
            await courseAPI.delete(id)
            toast.success("Course deleted successfully")
            fetchData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete course")
        }
    }

    const handlePublish = async (id: string) => {
        try {
            await courseAPI.publish(id)
            toast.success("Course published successfully")
            fetchData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to publish course")
        }
    }

    const resetForm = () => {
        setEditingCourse(null)
        setFormData({
            title: "",
            description: "",
            category: "",
            difficulty: "beginner",
            subject: "",
            classLevels: [],
            instructor: "",
            estimatedHours: 0,
            tags: "",
            status: "draft",
        })
    }

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTab = activeTab === "all" || c.status === activeTab
        return matchesSearch && matchesTab
    })

    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return <Badge className="bg-green-500">Beginner</Badge>
            case "intermediate":
                return <Badge className="bg-blue-500">Intermediate</Badge>
            case "advanced":
                return <Badge className="bg-purple-500">Advanced</Badge>
            default:
                return <Badge variant="outline">{difficulty}</Badge>
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-green-500">Published</Badge>
            case "draft":
                return <Badge variant="outline">Draft</Badge>
            case "archived":
                return <Badge className="bg-slate-500">Archived</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0)
    const totalLessons = courses.reduce((sum, c) => {
        return sum + (c.modules?.reduce((mSum: number, m: any) => mSum + (m.lessons?.length || 0), 0) || 0)
    }, 0)
    const totalModules = courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0)

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Learning Courses</h1>
                    <p className="text-slate-500">
                        Create and manage structured LMS-based learning content
                    </p>
                </div>
                <Button
                    onClick={() => {
                        resetForm()
                        setIsDialogOpen(true)
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Library className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Courses</p>
                                <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Enrolled</p>
                                <p className="text-2xl font-bold text-slate-900">{totalEnrolled}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Layers className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Modules</p>
                                <p className="text-2xl font-bold text-slate-900">{totalModules}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Lessons</p>
                                <p className="text-2xl font-bold text-slate-900">{totalLessons}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All ({courses.length})</TabsTrigger>
                        <TabsTrigger value="published">
                            Published ({courses.filter(c => c.status === "published").length})
                        </TabsTrigger>
                        <TabsTrigger value="draft">
                            Drafts ({courses.filter(c => c.status === "draft").length})
                        </TabsTrigger>
                        <TabsTrigger value="archived">
                            Archived ({courses.filter(c => c.status === "archived").length})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Course List */}
            <div className="space-y-4">
                {filteredCourses.length === 0 ? (
                    <Card className="shadow-sm border-slate-200">
                        <CardContent className="py-12 text-center text-slate-500">
                            <Library className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No courses found</p>
                            <p className="text-sm mt-1">Create your first course to get started</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCourses.map((course) => (
                        <Card key={course._id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Course Icon */}
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="h-10 w-10 text-white" />
                                    </div>

                                    {/* Course Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                                                <p className="text-slate-500 text-sm line-clamp-2">{course.description || "No description"}</p>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                {getDifficultyBadge(course.difficulty)}
                                                {getStatusBadge(course.status)}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-3">
                                            <span className="flex items-center gap-1">
                                                <Layers className="w-4 h-4" />
                                                {course.modules?.length || 0} modules
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                {course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0} lessons
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {course.estimatedHours}h
                                            </span>
                                            {course.subject && (
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    {course.subject.name}
                                                </span>
                                            )}
                                            {course.instructor && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {course.instructor.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress & Actions */}
                                        <div className="mt-4 flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-500">{course.enrolledStudents?.length || 0} enrolled</span>
                                                    {course.category && (
                                                        <span className="font-medium text-indigo-600">{course.category}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {course.status === "draft" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePublish(course._id)}
                                                        className="text-green-600"
                                                        title="Publish Course"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(course)}
                                                    title="Edit Course"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(course._id)}
                                                    title="Delete Course"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingCourse ? "Edit" : "Create"} Learning Course</DialogTitle>
                        <DialogDescription>
                            Configure the course structure and details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Course title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Course description"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Language Arts">Language Arts</SelectItem>
                                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={formData.difficulty} onValueChange={(v: any) => setFormData({ ...formData, difficulty: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((s) => (
                                            <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Estimated Hours</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={formData.estimatedHours}
                                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tags (comma separated)</Label>
                            <Input
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g. algebra, geometry, basics"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingCourse ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
