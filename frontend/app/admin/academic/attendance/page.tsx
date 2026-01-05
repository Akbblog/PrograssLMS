"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { unwrapArray } from "@/lib/utils"
import { format } from "date-fns"
import {
    Calendar as CalendarIcon,
    Check,
    X,
    Clock,
    Loader2,
    Users,
    UserCheck,
    UserX,
    AlertCircle,
    Save,
    BarChart3,
    GraduationCap,
    Briefcase
} from "lucide-react"
import { academicAPI, attendanceAPI } from "@/lib/api/endpoints"
import { cn } from "@/lib/utils"

interface Student {
    _id: string
    name: string
    studentId: string
    rollNumber?: string
    section?: string
}

interface Teacher {
    _id: string
    name: string
    email: string
    teacherId?: string
    subject?: { name: string }
}

interface AttendanceRecord {
    id: string
    status: "present" | "absent" | "late" | "excused" | "leave" | "half-day"
    remarks?: string
    checkInTime?: string
    checkOutTime?: string
}

interface ClassLevel {
    _id: string
    name: string
}

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState("students")

    // Student Attendance State
    const [classes, setClasses] = useState<ClassLevel[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [studentAttendance, setStudentAttendance] = useState<Record<string, AttendanceRecord>>({})
    const [loadingStudents, setLoadingStudents] = useState(false)

    // Academic Year and Term State
    const [academicYears, setAcademicYears] = useState<any[]>([])
    const [academicTerms, setAcademicTerms] = useState<any[]>([])
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("")
    const [selectedAcademicTerm, setSelectedAcademicTerm] = useState<string>("")

    // Teacher Attendance State
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [teacherAttendance, setTeacherAttendance] = useState<Record<string, AttendanceRecord>>({})
    const [loadingTeachers, setLoadingTeachers] = useState(false)

    const [saving, setSaving] = useState(false)

    // Fetch classes and academic periods on mount
    useEffect(() => {
        fetchClasses()
        fetchTeachers()
        fetchAcademicPeriods()
    }, [])

    // Fetch students when class is selected
    useEffect(() => {
        if (selectedClass) {
            fetchStudents()
        }
    }, [selectedClass])

    const fetchClasses = async () => {
        try {
            const res: any = await academicAPI.getClasses()
            setClasses(unwrapArray(res?.data, "classes"))
        } catch (error) {
            toast.error("Failed to load classes")
        }
    }

    const fetchAcademicPeriods = async () => {
        try {
            const [yearsRes, termsRes] = await Promise.all([
                academicAPI.getAcademicYears(),
                academicAPI.getAcademicTerms()
            ])
            const years = unwrapArray((yearsRes as any)?.data, "years")
            const terms = unwrapArray((termsRes as any)?.data, "terms")
            setAcademicYears(years)
            setAcademicTerms(terms)

            // Auto-select current academic year
            const currentYear = years.find((y: any) => y.isCurrent)
            if (currentYear) {
                setSelectedAcademicYear(currentYear._id)
            } else if (years.length > 0) {
                setSelectedAcademicYear(years[0]._id)
            }

            // Auto-select current academic term
            const currentTerm = terms.find((t: any) => t.isCurrent)
            if (currentTerm) {
                setSelectedAcademicTerm(currentTerm._id)
            } else if (terms.length > 0) {
                setSelectedAcademicTerm(terms[0]._id)
            }
        } catch (error) {
            console.error("Failed to load academic periods:", error)
        }
    }

    const fetchStudents = async () => {
        setLoadingStudents(true)
        try {
            const res: any = await academicAPI.getStudentsByClass(selectedClass)
            const studentList = unwrapArray(res?.data, "students")
            setStudents(studentList)

            // Initialize attendance records
            const initialAttendance: Record<string, AttendanceRecord> = {}
            studentList.forEach((student: Student) => {
                initialAttendance[student._id] = {
                    id: student._id,
                    status: "present",
                }
            })
            setStudentAttendance(initialAttendance)
        } catch (error) {
            toast.error("Failed to load students")
        } finally {
            setLoadingStudents(false)
        }
    }

    const fetchTeachers = async () => {
        setLoadingTeachers(true)
        try {
            const res: any = await attendanceAPI.getTeachersForAttendance()
            const teacherList = unwrapArray(res?.data, "teachers")
            setTeachers(teacherList)

            // Initialize teacher attendance
            const initialAttendance: Record<string, AttendanceRecord> = {}
            teacherList.forEach((teacher: Teacher) => {
                initialAttendance[teacher._id] = {
                    id: teacher._id,
                    status: "present",
                    checkInTime: "09:00",
                }
            })
            setTeacherAttendance(initialAttendance)
        } catch (error) {
            console.error("Failed to load teachers:", error)
        } finally {
            setLoadingTeachers(false)
        }
    }

    const handleStudentStatusChange = (studentId: string, status: AttendanceRecord["status"]) => {
        setStudentAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status,
            }
        }))
    }

    const handleTeacherStatusChange = (teacherId: string, status: AttendanceRecord["status"]) => {
        setTeacherAttendance(prev => ({
            ...prev,
            [teacherId]: {
                ...prev[teacherId],
                status,
            }
        }))
    }

    const handleMarkAllStudents = (status: "present" | "absent") => {
        const newAttendance: Record<string, AttendanceRecord> = {}
        students.forEach(student => {
            newAttendance[student._id] = {
                id: student._id,
                status,
            }
        })
        setStudentAttendance(newAttendance)
        toast.success(`Marked all students as ${status}`)
    }

    const handleMarkAllTeachers = (status: "present" | "absent") => {
        const newAttendance: Record<string, AttendanceRecord> = {}
        teachers.forEach(teacher => {
            newAttendance[teacher._id] = {
                id: teacher._id,
                status,
                checkInTime: status === "present" ? "09:00" : "",
            }
        })
        setTeacherAttendance(newAttendance)
        toast.success(`Marked all teachers as ${status}`)
    }

    const handleSaveStudentAttendance = async () => {
        if (!selectedClass) {
            toast.error("Please select a class")
            return
        }

        if (!selectedAcademicYear) {
            toast.error("Please select an academic year")
            return
        }

        if (!selectedAcademicTerm) {
            toast.error("Please select an academic term")
            return
        }

        setSaving(true)
        try {
            const records = Object.values(studentAttendance).map(record => ({
                student: record.id,
                status: record.status,
                remarks: record.remarks || "",
            }))

            await attendanceAPI.markStudentAttendance({
                classLevel: selectedClass,
                date: selectedDate.toISOString(),
                academicYear: selectedAcademicYear,
                academicTerm: selectedAcademicTerm,
                records,
            })

            toast.success("Student attendance saved successfully!")
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save attendance")
        } finally {
            setSaving(false)
        }
    }

    const handleSaveTeacherAttendance = async () => {
        setSaving(true)
        try {
            const records = Object.values(teacherAttendance).map(record => ({
                teacher: record.id,
                status: record.status,
                checkInTime: record.checkInTime || "",
                checkOutTime: record.checkOutTime || "",
                remarks: record.remarks || "",
            }))

            await attendanceAPI.markTeacherAttendance({
                date: selectedDate.toISOString(),
                records,
            })

            toast.success("Teacher attendance saved successfully!")
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to save attendance")
        } finally {
            setSaving(false)
        }
    }

    // Calculate stats
    const studentStats = {
        total: students.length,
        present: Object.values(studentAttendance).filter(a => a.status === "present").length,
        absent: Object.values(studentAttendance).filter(a => a.status === "absent").length,
        late: Object.values(studentAttendance).filter(a => a.status === "late").length,
    }
    const studentAttendanceRate = studentStats.total > 0 ? Math.round((studentStats.present / studentStats.total) * 100) : 0

    const teacherStats = {
        total: teachers.length,
        present: Object.values(teacherAttendance).filter(a => a.status === "present").length,
        absent: Object.values(teacherAttendance).filter(a => a.status === "absent").length,
        late: Object.values(teacherAttendance).filter(a => a.status === "late").length,
        leave: Object.values(teacherAttendance).filter(a => a.status === "leave").length,
    }
    const teacherAttendanceRate = teacherStats.total > 0 ? Math.round((teacherStats.present / teacherStats.total) * 100) : 0

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "present":
                return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
            case "absent":
                return <Badge className="bg-red-500 hover:bg-red-600">Absent</Badge>
            case "late":
                return <Badge className="bg-amber-500 hover:bg-amber-600">Late</Badge>
            case "excused":
                return <Badge className="bg-blue-500 hover:bg-blue-600">Excused</Badge>
            case "leave":
                return <Badge className="bg-purple-500 hover:bg-purple-600">Leave</Badge>
            case "half-day":
                return <Badge className="bg-orange-500 hover:bg-orange-600">Half Day</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Attendance Management</h1>
                    <p className="text-slate-500">
                        Mark and manage daily attendance for students and teachers
                    </p>
                </div>
            </div>

            {/* Warning if no academic years or terms */}
            {(academicYears.length === 0 || academicTerms.length === 0) && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-amber-800">Setup Required</h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    {academicYears.length === 0 && academicTerms.length === 0 ? (
                                        <>Please create an <strong>Academic Year</strong> and <strong>Academic Term</strong> before marking attendance. </>
                                    ) : academicYears.length === 0 ? (
                                        <>Please create an <strong>Academic Year</strong> before marking attendance. </>
                                    ) : (
                                        <>Please create an <strong>Academic Term</strong> before marking attendance. </>
                                    )}
                                    Go to <a href="/admin/academic/years" className="text-amber-800 underline font-medium">Academic Years</a> or <a href="/admin/academic/terms" className="text-amber-800 underline font-medium">Academic Terms</a> to set them up.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Date Picker and Academic Period - Common for both tabs */}
            <Card className="shadow-sm">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                                Attendance Date
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                                Academic Year
                            </label>
                            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year: any) => (
                                        <SelectItem key={year._id} value={year._id}>
                                            {year.name} {year.isCurrent && "(Current)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                                Academic Term
                            </label>
                            <Select value={selectedAcademicTerm} onValueChange={setSelectedAcademicTerm}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicTerms.map((term: any) => (
                                        <SelectItem key={term._id} value={term._id}>
                                            {term.name} {term.isCurrent && "(Current)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-auto p-1 bg-slate-100">
                    <TabsTrigger value="students" className="py-2.5 data-[state=active]:bg-white">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Student Attendance
                    </TabsTrigger>
                    <TabsTrigger value="teachers" className="py-2.5 data-[state=active]:bg-white">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Teacher Attendance
                    </TabsTrigger>
                </TabsList>

                {/* Student Attendance Tab */}
                <TabsContent value="students" className="mt-6 space-y-6">
                    {/* Class Selection */}
                    <Card className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                <div className="flex-1 max-w-xs">
                                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                                        Select Class
                                    </label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((cls) => (
                                                <SelectItem key={cls._id} value={cls._id}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedClass && students.length > 0 && (
                                    <div className="flex gap-2 sm:ml-auto sm:self-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleMarkAllStudents("present")}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Mark All Present
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleMarkAllStudents("absent")}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Mark All Absent
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student Stats */}
                    {selectedClass && students.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Card className="shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Total</p>
                                            <p className="text-xl font-bold text-slate-900">{studentStats.total}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-green-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <UserCheck className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Present</p>
                                            <p className="text-xl font-bold text-green-600">{studentStats.present}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-red-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                            <UserX className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Absent</p>
                                            <p className="text-xl font-bold text-red-600">{studentStats.absent}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-amber-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Late</p>
                                            <p className="text-xl font-bold text-amber-600">{studentStats.late}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-indigo-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Rate</p>
                                            <p className="text-xl font-bold text-indigo-600">{studentAttendanceRate}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Student Attendance Table */}
                    {!selectedClass ? (
                        <Card className="shadow-sm">
                            <CardContent className="py-16 text-center">
                                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">
                                    Select a Class to Begin
                                </h3>
                                <p className="text-slate-500">
                                    Choose a class from the dropdown above to mark student attendance
                                </p>
                            </CardContent>
                        </Card>
                    ) : loadingStudents ? (
                        <Card className="shadow-sm">
                            <CardContent className="py-16 text-center">
                                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-indigo-600" />
                                <p className="text-slate-500">Loading students...</p>
                            </CardContent>
                        </Card>
                    ) : students.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="py-16 text-center">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">
                                    No Students Found
                                </h3>
                                <p className="text-slate-500">
                                    There are no students enrolled in this class yet
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">
                                        {classes.find(c => c._id === selectedClass)?.name} - {format(selectedDate, "MMMM d, yyyy")}
                                    </CardTitle>
                                    <Button
                                        onClick={handleSaveStudentAttendance}
                                        disabled={saving}
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Attendance
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    {students.map((student, index) => (
                                        <div
                                            key={student._id}
                                            className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{student.name}</p>
                                                        <p className="text-xs text-slate-500">Roll: {student.rollNumber || student.studentId}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(studentAttendance[student._id]?.status || "present")}
                                            </div>
                                            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                                                <Button
                                                    size="sm"
                                                    variant={studentAttendance[student._id]?.status === "present" ? "default" : "outline"}
                                                    className={cn(
                                                        "flex-1 h-9",
                                                        studentAttendance[student._id]?.status === "present" && "bg-green-500 hover:bg-green-600"
                                                    )}
                                                    onClick={() => handleStudentStatusChange(student._id, "present")}
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Present
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={studentAttendance[student._id]?.status === "absent" ? "default" : "outline"}
                                                    className={cn(
                                                        "flex-1 h-9",
                                                        studentAttendance[student._id]?.status === "absent" && "bg-red-500 hover:bg-red-600"
                                                    )}
                                                    onClick={() => handleStudentStatusChange(student._id, "absent")}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Absent
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={studentAttendance[student._id]?.status === "late" ? "default" : "outline"}
                                                    className={cn(
                                                        "flex-1 h-9",
                                                        studentAttendance[student._id]?.status === "late" && "bg-amber-500 hover:bg-amber-600"
                                                    )}
                                                    onClick={() => handleStudentStatusChange(student._id, "late")}
                                                >
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Late
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">#</TableHead>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Roll No.</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student, index) => (
                                                <TableRow key={student._id}>
                                                    <TableCell className="font-medium text-slate-500">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <span className="font-medium">{student.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        {student.rollNumber || student.studentId}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(studentAttendance[student._id]?.status || "present")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant={studentAttendance[student._id]?.status === "present" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    studentAttendance[student._id]?.status === "present" && "bg-green-500 hover:bg-green-600"
                                                                )}
                                                                onClick={() => handleStudentStatusChange(student._id, "present")}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={studentAttendance[student._id]?.status === "absent" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    studentAttendance[student._id]?.status === "absent" && "bg-red-500 hover:bg-red-600"
                                                                )}
                                                                onClick={() => handleStudentStatusChange(student._id, "absent")}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={studentAttendance[student._id]?.status === "late" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    studentAttendance[student._id]?.status === "late" && "bg-amber-500 hover:bg-amber-600"
                                                                )}
                                                                onClick={() => handleStudentStatusChange(student._id, "late")}
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Teacher Attendance Tab */}
                <TabsContent value="teachers" className="mt-6 space-y-6">
                    {/* Quick Actions */}
                    {teachers.length > 0 && (
                        <Card className="shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkAllTeachers("present")}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        Mark All Present
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkAllTeachers("absent")}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Mark All Absent
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Teacher Stats */}
                    {teachers.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Card className="shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Total</p>
                                            <p className="text-xl font-bold text-slate-900">{teacherStats.total}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-green-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <UserCheck className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Present</p>
                                            <p className="text-xl font-bold text-green-600">{teacherStats.present}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-red-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                            <UserX className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Absent</p>
                                            <p className="text-xl font-bold text-red-600">{teacherStats.absent}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-purple-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <CalendarIcon className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">On Leave</p>
                                            <p className="text-xl font-bold text-purple-600">{teacherStats.leave}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-l-4 border-l-indigo-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Rate</p>
                                            <p className="text-xl font-bold text-indigo-600">{teacherAttendanceRate}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Teacher Attendance Table */}
                    {loadingTeachers ? (
                        <Card className="shadow-sm">
                            <CardContent className="py-16 text-center">
                                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-indigo-600" />
                                <p className="text-slate-500">Loading teachers...</p>
                            </CardContent>
                        </Card>
                    ) : teachers.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="py-16 text-center">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">
                                    No Teachers Found
                                </h3>
                                <p className="text-slate-500">
                                    There are no teachers registered in this school yet
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">
                                        Teacher Attendance - {format(selectedDate, "MMMM d, yyyy")}
                                    </CardTitle>
                                    <Button
                                        onClick={handleSaveTeacherAttendance}
                                        disabled={saving}
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Attendance
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    {teachers.map((teacher, index) => (
                                        <div
                                            key={teacher._id}
                                            className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium">
                                                        {teacher.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{teacher.name}</p>
                                                        <p className="text-xs text-slate-500">{teacher.subject?.name || "No Subject"}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(teacherAttendance[teacher._id]?.status || "present")}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                                <Button
                                                    size="sm"
                                                    variant={teacherAttendance[teacher._id]?.status === "present" ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9",
                                                        teacherAttendance[teacher._id]?.status === "present" && "bg-green-500 hover:bg-green-600"
                                                    )}
                                                    onClick={() => handleTeacherStatusChange(teacher._id, "present")}
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Present
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={teacherAttendance[teacher._id]?.status === "absent" ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9",
                                                        teacherAttendance[teacher._id]?.status === "absent" && "bg-red-500 hover:bg-red-600"
                                                    )}
                                                    onClick={() => handleTeacherStatusChange(teacher._id, "absent")}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Absent
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={teacherAttendance[teacher._id]?.status === "late" ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9",
                                                        teacherAttendance[teacher._id]?.status === "late" && "bg-amber-500 hover:bg-amber-600"
                                                    )}
                                                    onClick={() => handleTeacherStatusChange(teacher._id, "late")}
                                                >
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Late
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={teacherAttendance[teacher._id]?.status === "leave" ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9",
                                                        teacherAttendance[teacher._id]?.status === "leave" && "bg-purple-500 hover:bg-purple-600"
                                                    )}
                                                    onClick={() => handleTeacherStatusChange(teacher._id, "leave")}
                                                >
                                                    <CalendarIcon className="w-4 h-4 mr-1" />
                                                    Leave
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">#</TableHead>
                                                <TableHead>Teacher Name</TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {teachers.map((teacher, index) => (
                                                <TableRow key={teacher._id}>
                                                    <TableCell className="font-medium text-slate-500">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium block">{teacher.name}</span>
                                                                <span className="text-xs text-slate-500">{teacher.email}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        {teacher.subject?.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(teacherAttendance[teacher._id]?.status || "present")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant={teacherAttendance[teacher._id]?.status === "present" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    teacherAttendance[teacher._id]?.status === "present" && "bg-green-500 hover:bg-green-600"
                                                                )}
                                                                onClick={() => handleTeacherStatusChange(teacher._id, "present")}
                                                                title="Present"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={teacherAttendance[teacher._id]?.status === "absent" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    teacherAttendance[teacher._id]?.status === "absent" && "bg-red-500 hover:bg-red-600"
                                                                )}
                                                                onClick={() => handleTeacherStatusChange(teacher._id, "absent")}
                                                                title="Absent"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={teacherAttendance[teacher._id]?.status === "late" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    teacherAttendance[teacher._id]?.status === "late" && "bg-amber-500 hover:bg-amber-600"
                                                                )}
                                                                onClick={() => handleTeacherStatusChange(teacher._id, "late")}
                                                                title="Late"
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={teacherAttendance[teacher._id]?.status === "leave" ? "default" : "outline"}
                                                                className={cn(
                                                                    "w-8 h-8 p-0",
                                                                    teacherAttendance[teacher._id]?.status === "leave" && "bg-purple-500 hover:bg-purple-600"
                                                                )}
                                                                onClick={() => handleTeacherStatusChange(teacher._id, "leave")}
                                                                title="Leave"
                                                            >
                                                                <CalendarIcon className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
