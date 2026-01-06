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
import { Plus, MoreHorizontal, Phone } from "lucide-react"
import { formatDate, unwrapArray } from "@/lib/utils"
import { adminAPI } from '@/lib/api/endpoints'
import { Skeleton } from "@/components/ui/skeleton"

import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import EmptyState from '@/components/admin/EmptyState'
import { Users } from 'lucide-react'

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true)
            try {
                const res: any = await adminAPI.getTeachers()
                const data = unwrapArray(res, "teachers")
                setTeachers(data)
            } catch (err) {
                console.warn('adminAPI.getTeachers failed, falling back to mock data', err)
                setTeachers([
                    { _id: '1', name: 'Sarah Wilson', email: 'sarah.wilson@school.edu', phone: '+1 (555) 123-4567', subject: 'Mathematics', status: 'active', createdAt: '2023-08-15' },
                    { _id: '2', name: 'James Miller', email: 'james.miller@school.edu', phone: '+1 (555) 987-6543', subject: 'Science', status: 'active', createdAt: '2023-08-20' },
                    { _id: '3', name: 'Emily Davis', email: 'emily.davis@school.edu', phone: '+1 (555) 456-7890', subject: 'English Literature', status: 'on_leave', createdAt: '2023-09-01' }
                ])
                setError('Failed to load teachers from server — showing local data.')
            } finally {
                setLoading(false)
            }
        }

        fetchTeachers()
    }, [])

    const total = teachers.length
    const active = teachers.filter(t => t.status === 'active').length
    const onLeave = teachers.filter(t => t.status === 'on_leave').length

    return (
        <AdminPageLayout
            title="Teachers"
            description="Manage teaching staff and assignments."
            actions={<Link href="/school-admin/teachers/create"><Button><Plus className="mr-2 h-4 w-4" /> Add Teacher</Button></Link>}
            stats={(
                <>
                    <SummaryStatCard title="Total Teachers" value={total} icon={<Users className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="Active" value={active} icon={<Users className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="On Leave" value={onLeave} icon={<Users className="h-4 w-4 text-white" />} variant="orange" />
                    <SummaryStatCard title="Joined This Month" value={0} icon={<Users className="h-4 w-4 text-white" />} variant="blue" />
                </>
            )}
        >
            <div className="flex justify-end mb-4">
                <Button onClick={() => window.location.href = '/school-admin/teachers/create'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                </Button>
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
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
                        ) : teachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="p-8">
                                    <EmptyState title="No teachers yet" description="Add teachers to see them here." cta={<Link href="/school-admin/teachers/create"><Button>Add Teacher</Button></Link>} />
                                </TableCell>
                            </TableRow>
                        ) : (
                            teachers.map((teacher) => (
                                <TableRow key={teacher._id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-medium py-4">
                                        <div className="flex flex-col">
                                            <span>{teacher.name}</span>
                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">{teacher.subject}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {teacher.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                                            {teacher.status === "on_leave" ? "On Leave" : "Active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">{formatDate(teacher.createdAt)}</TableCell>
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

            {error && <div className="text-sm text-amber-600">{error}</div>}
        </AdminPageLayout>
    )
}
