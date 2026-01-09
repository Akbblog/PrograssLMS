"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { unwrapArray } from "@/lib/utils"
import {
    Plus,
    ClipboardCheck,
    Edit,
    Trash2,
    Search,
    Loader2,
    FileText,
    Clock,
    Target
} from "lucide-react"
import { assessmentTypeAPI } from "@/lib/api/endpoints"

interface AssessmentType {
    _id: string
    name: string
    description: string
    weightage: number
    category: string
    isActive: boolean
    defaultDuration?: number
    defaultTotalMarks?: number
    defaultPassingMarks?: number
}

export default function AssessmentTypesPage() {
    const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingType, setEditingType] = useState<AssessmentType | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        weightage: 0,
        category: "formative",
        defaultDuration: 60,
        defaultTotalMarks: 100,
        defaultPassingMarks: 40,
    })

    // Fetch assessment types on mount
    useEffect(() => {
        fetchAssessmentTypes()
    }, [])

    const fetchAssessmentTypes = async () => {
        try {
            const res: any = await assessmentTypeAPI.getAll()
            setAssessmentTypes(unwrapArray(res?.data, "assessmentTypes"))
        } catch (error: any) {
            toast.error(error.message || "Failed to load assessment types")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("Please enter a name for the assessment type")
            return
        }

        setSubmitting(true)
        try {
            if (editingType) {
                await assessmentTypeAPI.update(editingType._id, formData)
                toast.success("Assessment type updated successfully")
            } else {
                await assessmentTypeAPI.create(formData)
                toast.success("Assessment type created successfully")
            }

            setIsDialogOpen(false)
            resetForm()
            fetchAssessmentTypes()
        } catch (error: any) {
            toast.error(error.message || "Failed to save assessment type")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (type: AssessmentType) => {
        setEditingType(type)
        setFormData({
            name: type.name,
            description: type.description || "",
            weightage: type.weightage || 0,
            category: type.category || "formative",
            defaultDuration: type.defaultDuration || 60,
            defaultTotalMarks: type.defaultTotalMarks || 100,
            defaultPassingMarks: type.defaultPassingMarks || 40,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this assessment type?")) {
            try {
                await assessmentTypeAPI.delete(id)
                toast.success("Assessment type deleted")
                fetchAssessmentTypes()
            } catch (error: any) {
                toast.error(error.message || "Failed to delete assessment type")
            }
        }
    }

    const resetForm = () => {
        setEditingType(null)
        setFormData({
            name: "",
            description: "",
            weightage: 0,
            category: "formative",
            defaultDuration: 60,
            defaultTotalMarks: 100,
            defaultPassingMarks: 40,
        })
    }

    const filteredTypes = assessmentTypes.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalWeightage = assessmentTypes.reduce<number>((sum, t) => sum + t.weightage, 0)

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Assessment Types</h1>
                    <p className="text-slate-500">
                        Configure different types of assessments and their weightages
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Assessment Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
                                    <ClipboardCheck className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <DialogTitle>{editingType ? "Edit" : "Add"} Assessment Type</DialogTitle>
                                    <DialogDescription>
                                        Configure the assessment type details and weightage
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <DialogBody>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Name <span className="text-destructive ml-1">*</span></Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Quiz, Exam, Project"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Description</Label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of this assessment type"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Weightage (%)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={formData.weightage}
                                            onChange={(e) => setFormData({ ...formData, weightage: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Category</Label>
                                        <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="formative">Formative</SelectItem>
                                                <SelectItem value="summative">Summative</SelectItem>
                                                <SelectItem value="diagnostic">Diagnostic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </DialogBody>

                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={loading} className="min-w-[120px]">
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingType ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <ClipboardCheck className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Types</p>
                                <p className="text-2xl font-bold text-slate-900">{assessmentTypes.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Target className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Weightage</p>
                                <p className={`text-2xl font-bold ${totalWeightage === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                                    {totalWeightage}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Active</p>
                                <p className="text-2xl font-bold text-slate-900">{assessmentTypes.filter(t => t.isActive).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle>All Assessment Types</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Weightage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTypes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                        No assessment types found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTypes.map((type) => (
                                    <TableRow key={type._id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell className="text-slate-500 max-w-xs truncate">{type.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {type.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-indigo-600">{type.weightage}%</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={type.isActive ? "bg-green-500" : "bg-slate-500"}>
                                                {type.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(type)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(type._id)} className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Info */}
            {totalWeightage !== 100 && (
                <Card className="shadow-sm border-amber-200 bg-amber-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <p className="text-sm text-amber-800">
                                <strong>Note:</strong> Total weightage is {totalWeightage}%. It should equal 100% for accurate grading calculations.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
