"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { superAdminAPI } from "@/lib/api/endpoints"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Users,
    Search,
    Loader2,
    Building2,
    GraduationCap,
    UserCheck,
    Shield,
    Filter
} from "lucide-react"

interface UserType {
    _id: string
    name: string
    email: string
    role: string
    schoolName?: string
    isActive?: boolean
    createdAt?: string
}

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [schools, setSchools] = useState<any[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            // Fetch schools to get user counts
            const schoolsRes: any = await superAdminAPI.getSchools()
            let schoolsList: any[] = []
            if (schoolsRes?.data?.data && Array.isArray(schoolsRes.data.data)) {
                schoolsList = schoolsRes.data.data
            } else if (schoolsRes?.data && Array.isArray(schoolsRes.data)) {
                schoolsList = schoolsRes.data
            }
            setSchools(schoolsList)

            // Build users list from schools (admins at least)
            const usersList: UserType[] = []
            schoolsList.forEach((school: any) => {
                // Each school has an admin
                if (school.admin) {
                    usersList.push({
                        _id: school.admin._id || school.admin,
                        name: school.admin.name || school.adminEmail || 'School Admin',
                        email: school.admin.email || school.adminEmail || '',
                        role: 'admin',
                        schoolName: school.name,
                        isActive: school.isActive,
                        createdAt: school.createdAt
                    })
                }
            })
            setUsers(usersList)
        } catch (error) {
            console.error("Failed to fetch users:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const stats = [
        { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600 bg-blue-100" },
        { label: "Admins", value: users.filter(u => u.role === 'admin').length, icon: Shield, color: "text-purple-600 bg-purple-100" },
        { label: "Teachers", value: users.filter(u => u.role === 'teacher').length, icon: UserCheck, color: "text-emerald-600 bg-emerald-100" },
        { label: "Students", value: users.filter(u => u.role === 'student').length, icon: GraduationCap, color: "text-amber-600 bg-amber-100" },
    ]

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <Badge className="bg-purple-600">Super Admin</Badge>
            case 'admin':
                return <Badge className="bg-indigo-600">School Admin</Badge>
            case 'teacher':
                return <Badge className="bg-emerald-600">Teacher</Badge>
            case 'student':
                return <Badge className="bg-amber-600">Student</Badge>
            default:
                return <Badge variant="outline">{role}</Badge>
        }
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Users</h1>
                    <p className="text-slate-500">
                        Manage all users across the platform
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="shadow-sm border-slate-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Users Table */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">All Users</CardTitle>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-40">
                                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                    <SelectValue placeholder="Filter role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admins</SelectItem>
                                    <SelectItem value="teacher">Teachers</SelectItem>
                                    <SelectItem value="student">Students</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>School</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user._id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{user.name}</p>
                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{user.schoolName || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={user.isActive !== false ? "text-green-600 border-green-200 bg-green-50" : "text-slate-500"}
                                                >
                                                    {user.isActive !== false ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="shadow-sm border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">User Management</h3>
                            <p className="text-sm text-slate-600">
                                Users are managed at the school level. School Admins can add teachers and students within their schools.
                                As a Super Admin, you can view all users across the platform and manage school-level access.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
