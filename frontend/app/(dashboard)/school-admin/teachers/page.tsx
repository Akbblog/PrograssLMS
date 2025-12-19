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
import { Plus, MoreHorizontal, Search, Filter, Mail, Phone } from "lucide-react"
import { formatDate } from "@/lib/utils"
import apiClient from "@/lib/api/client"
import { Skeleton } from "@/components/ui/skeleton"

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // In a real app:
                // const response = await apiClient.get("/teachers")
                // setTeachers(response.data.data)

                // Mock data
                setTimeout(() => {
                    setTeachers([
                        {
                            _id: "1",
                            name: "Sarah Wilson",
                            email: "sarah.wilson@school.edu",
                            phone: "+1 (555) 123-4567",
                            subject: "Mathematics",
                            status: "active",
                            createdAt: "2023-08-15"
                        },
                        {
                            _id: "2",
                            name: "James Miller",
                            email: "james.miller@school.edu",
                            phone: "+1 (555) 987-6543",
                            subject: "Science",
                            status: "active",
                            createdAt: "2023-08-20"
                        },
                        {
                            _id: "3",
                            name: "Emily Davis",
                            email: "emily.davis@school.edu",
                            phone: "+1 (555) 456-7890",
                            subject: "English Literature",
                            status: "on_leave",
                            createdAt: "2023-09-01"
                        }
                    ])
                    setLoading(false)
                }, 800)
            } catch (error) {
                console.error("Failed to fetch teachers", error)
                setLoading(false)
            }
        }

        fetchTeachers()
    }, [])

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
                    <p className="text-muted-foreground">Manage teaching staff and assignments.</p>
                </div>
                <Link href="/school-admin/teachers/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Teacher
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search teachers..."
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
                            <TableHead>Teacher Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Contact</TableHead>
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
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredTeachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No teachers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <TableRow key={teacher._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{teacher.name}</span>
                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{teacher.subject}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {teacher.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                                            {teacher.status === "on_leave" ? "On Leave" : "Active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(teacher.createdAt)}</TableCell>
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
                                                <DropdownMenuItem>Assign Classes</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Suspend Account
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
