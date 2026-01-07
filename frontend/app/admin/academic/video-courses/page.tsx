"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
    Plus,
    Video,
    Edit,
    Trash2,
    Search,
    Loader2,
    Play,
    Clock,
    Users,
    Eye,
    Upload,
    Link as LinkIcon
} from "lucide-react"

interface VideoCourse {
    id: string
    title: string
    description: string
    instructor: string
    duration: string
    category: string
    videoUrl: string
    thumbnail: string
    enrolledCount: number
    status: "draft" | "published" | "archived"
    createdAt: string
}

export default function VideoCoursesPage() {
    const [courses, setCourses] = useState<VideoCourse[]>([
        {
            id: "1",
            title: "Introduction to Mathematics",
            description: "Fundamentals of algebra and arithmetic",
            instructor: "Dr. Sarah Johnson",
            duration: "2h 30m",
            category: "Mathematics",
            videoUrl: "https://example.com/video1",
            thumbnail: "",
            enrolledCount: 45,
            status: "published",
            createdAt: new Date().toISOString()
        },
        {
            id: "2",
            title: "Physics Fundamentals",
            description: "Basic concepts of mechanics and motion",
            instructor: "Prof. Michael Chen",
            duration: "3h 15m",
            category: "Science",
            videoUrl: "https://example.com/video2",
            thumbnail: "",
            enrolledCount: 32,
            status: "published",
            createdAt: new Date().toISOString()
        },
        {
            id: "3",
            title: "English Grammar Masterclass",
            description: "Complete grammar course for all levels",
            instructor: "Ms. Emily Davis",
            duration: "4h 00m",
            category: "Language",
            videoUrl: "https://example.com/video3",
            thumbnail: "",
            enrolledCount: 0,
            status: "draft",
            createdAt: new Date().toISOString()
        },
    ])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState<VideoCourse | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        category: "",
        videoUrl: "",
        status: "draft" as "draft" | "published" | "archived",
    })

    const handleSubmit = async () => {
        if (!formData.title || !formData.instructor) {
            toast.error("Please fill in required fields")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))

            if (editingCourse) {
                setCourses(prev => prev.map(c =>
                    c.id === editingCourse.id
                        ? { ...c, ...formData }
                        : c
                ))
                toast.success("Video course updated successfully")
            } else {
                const newCourse: VideoCourse = {
                    id: Date.now().toString(),
                    ...formData,
                    thumbnail: "",
                    enrolledCount: 0,
                    createdAt: new Date().toISOString()
                }
                setCourses(prev => [...prev, newCourse])
                toast.success("Video course created successfully")
            }

            setIsDialogOpen(false)
            resetForm()
        } catch (error) {
            toast.error("Failed to save video course")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (course: VideoCourse) => {
        setEditingCourse(course)
        setFormData({
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            duration: course.duration,
            category: course.category,
            videoUrl: course.videoUrl,
            status: course.status,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this video course?")) {
            setCourses(prev => prev.filter(c => c.id !== id))
            toast.success("Video course deleted")
        }
    }

    const resetForm = () => {
        setEditingCourse(null)
        setFormData({
            title: "",
            description: "",
            instructor: "",
            duration: "",
            category: "",
            videoUrl: "",
            status: "draft",
        })
    }

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Video Courses</h1>
                    <p className="text-slate-500">
                        Create and manage video-based learning content
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Video Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingCourse ? "Edit" : "Add"} Video Course</DialogTitle>
                            <DialogDescription>
                                Configure the video course details
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
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
                                    placeholder="Brief description of the course"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Instructor *</Label>
                                    <Input
                                        value={formData.instructor}
                                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                        placeholder="Instructor name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Input
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="e.g., 2h 30m"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="Science">Science</SelectItem>
                                            <SelectItem value="Language">Language</SelectItem>
                                            <SelectItem value="Arts">Arts</SelectItem>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            <div className="space-y-2">
                                <Label>Video URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="flex-1"
                                    />
                                    <Button variant="outline" size="icon">
                                        <Upload className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">Enter a video URL or upload a file</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingCourse ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Video className="h-6 w-6 text-indigo-600" />
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
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <Play className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Published</p>
                                <p className="text-2xl font-bold text-slate-900">{courses.filter(c => c.status === "published").length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Drafts</p>
                                <p className="text-2xl font-bold text-slate-900">{courses.filter(c => c.status === "draft").length}</p>
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
                                <p className="text-2xl font-bold text-slate-900">{courses.reduce<number>((sum, c) => sum + c.enrolledCount, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No video courses found</p>
                    </div>
                ) : (
                    filteredCourses.map((course) => (
                        <Card key={course.id} className="shadow-sm border-slate-200 hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                    <Play className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1">{course.title}</h3>
                                    {getStatusBadge(course.status)}
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{course.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {course.instructor}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {course.duration}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        <strong>{course.enrolledCount}</strong> enrolled
                                    </span>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(course.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
