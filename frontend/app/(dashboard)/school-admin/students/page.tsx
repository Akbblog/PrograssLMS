"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal } from "lucide-react"
import { formatDate, unwrapArray } from "@/lib/utils"
import { adminAPI } from '@/lib/api/endpoints'
import { Skeleton } from "@/components/ui/skeleton"

import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import EmptyState from '@/components/admin/EmptyState'
import GraduationCap from '@/components/icons/GraduationCap'

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
            try {
                const res: any = await adminAPI.getStudents()
                const data = unwrapArray(res, "students")
                setStudents(data)
            } catch (err) {
                console.warn('adminAPI.getStudents failed, falling back to mock data', err)
                // Fallback mock (graceful local dev)
                setStudents([
                    { _id: '1', name: 'Alice Johnson', email: 'alice@student.school.edu', studentId: 'STU-2024-001', class: 'Grade 10-A', status: 'active', createdAt: '2024-01-15' },
                    { _id: '2', name: 'Bob Smith', email: 'bob@student.school.edu', studentId: 'STU-2024-002', class: 'Grade 10-B', status: 'active', createdAt: '2024-01-16' },
                    { _id: '3', name: 'Charlie Brown', email: 'charlie@student.school.edu', studentId: 'STU-2024-003', class: 'Grade 9-A', status: 'inactive', createdAt: '2024-01-20' }
                ])
                setError('Failed to load students from server — showing local data.')
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [])

    const total = students.length
    const active = students.filter(s => s.status === 'active').length
    const inactive = students.filter(s => s.status !== 'active').length

    return (
        <AdminPageLayout
            title="Students"
            description="Manage student records and admissions."
            actions={<Link href="/school-admin/students/create"><Button><Plus className="mr-2 h-4 w-4" /> Add Student</Button></Link>}
            stats={(
                <>
                    <SummaryStatCard title="Total Students" value={total} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Active" value={active} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Inactive" value={inactive} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="Joined This Month" value={0} icon={<GraduationCap className="h-4 w-4 text-white" />} variant="orange" />
                </>
            )}
        >
            <div className="flex justify-end mb-4">
                <Button onClick={() => window.location.href = '/school-admin/students/create'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                </Button>
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="p-8">
                                    <EmptyState title="No students yet" description="Add students to see them here. Use the Add button to register a new student." cta={<Link href="/school-admin/students/create"><Button>Add Student</Button></Link>} />
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student._id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-medium py-4">
                                        <div className="flex flex-col">
                                            <span>{student.name}</span>
                                            <span className="text-xs text-muted-foreground">{student.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">{student.studentId}</TableCell>
                                    <TableCell className="py-4">{student.class}</TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">{formatDate(student.createdAt)}</TableCell>
                                    <TableCell className="text-right py-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Suspend Student
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {error && <div className="text-sm text-amber-600">{error}</div>}
        </AdminPageLayout>
    )
}
