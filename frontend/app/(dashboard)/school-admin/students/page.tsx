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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Search, Filter } from "lucide-react"
import { formatDate } from "@/lib/utils"
import apiClient from "@/lib/api/client"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // In a real app:
                // const response = await apiClient.get("/students")
                // setStudents(response.data.data)

                // Mock data
                setTimeout(() => {
                    setStudents([
                        {
                            _id: "1",
                            name: "Alice Johnson",
                            email: "alice@student.school.edu",
                            studentId: "STU-2024-001",
                            class: "Grade 10-A",
                            status: "active",
                            createdAt: "2024-01-15"
                        },
                        {
                            _id: "2",
                            name: "Bob Smith",
                            email: "bob@student.school.edu",
                            studentId: "STU-2024-002",
                            class: "Grade 10-B",
                            status: "active",
                            createdAt: "2024-01-16"
                        },
                        {
                            _id: "3",
                            name: "Charlie Brown",
                            email: "charlie@student.school.edu",
                            studentId: "STU-2024-003",
                            class: "Grade 9-A",
                            status: "inactive",
                            createdAt: "2024-01-20"
                        }
                    ])
                    setLoading(false)
                }, 800)
            } catch (error) {
                console.error("Failed to fetch students", error)
                setLoading(false)
            }
        }

        fetchStudents()
    }, [])

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground">Manage student records and admissions.</p>
                </div>
                <Link href="/school-admin/students/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
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
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{student.name}</span>
                                            <span className="text-xs text-muted-foreground">{student.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(student.createdAt)}</TableCell>
                                    <TableCell className="text-right">
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
        </div>
    )
}
