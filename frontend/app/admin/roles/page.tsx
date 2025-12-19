"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
    Plus,
    UserCog,
    Edit,
    Trash2,
    Search,
    Loader2,
    Shield,
    Users,
    Key,
    Lock,
    RefreshCw
} from "lucide-react"
import { roleAPI } from "@/lib/api/endpoints"

interface Permission {
    key: string
    label: string
    description: string
}

interface PermissionCategory {
    label: string
    permissions: Permission[]
}

interface Role {
    _id: string
    name: string
    description: string
    color: string
    permissions: Record<string, boolean>
    usersCount: number
    type: "system" | "custom"
    isDeletable: boolean
}

export default function RoleManagementPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [permissionCategories, setPermissionCategories] = useState<Record<string, PermissionCategory>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#6366f1",
        permissions: {} as Record<string, boolean>,
    })

    useEffect(() => {
        fetchRoles()
        fetchPermissions()
    }, [])

    const fetchRoles = async () => {
        try {
            const res: any = await roleAPI.getAll()
            setRoles(res.data || [])
        } catch (error) {
            console.error("Failed to load roles:", error)
            toast.error("Failed to load roles")
        } finally {
            setLoading(false)
        }
    }

    const fetchPermissions = async () => {
        try {
            const res: any = await roleAPI.getPermissions()
            setPermissionCategories(res.data || {})
        } catch (error) {
            console.error("Failed to load permissions:", error)
        }
    }

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("Please enter a role name")
            return
        }

        setSaving(true)
        try {
            if (editingRole) {
                await roleAPI.update(editingRole._id, formData)
                toast.success("Role updated successfully")
            } else {
                await roleAPI.create(formData)
                toast.success("Role created successfully")
            }
            setIsDialogOpen(false)
            resetForm()
            fetchRoles()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save role")
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (role: Role) => {
        setEditingRole(role)
        setFormData({
            name: role.name,
            description: role.description || "",
            color: role.color,
            permissions: role.permissions || {},
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        const role = roles.find(r => r._id === id)
        if (!role?.isDeletable) {
            toast.error("Cannot delete system roles")
            return
        }
        if (confirm("Are you sure you want to delete this role?")) {
            try {
                await roleAPI.delete(id)
                toast.success("Role deleted")
                fetchRoles()
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete role")
            }
        }
    }

    const resetForm = () => {
        setEditingRole(null)
        setFormData({
            name: "",
            description: "",
            color: "#6366f1",
            permissions: {},
        })
    }

    const togglePermission = (permissionKey: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permissionKey]: !prev.permissions[permissionKey]
            }
        }))
    }

    const toggleCategoryPermissions = (categoryKey: string) => {
        const category = permissionCategories[categoryKey]
        if (!category) return

        const categoryPerms = category.permissions.map(p => p.key)
        const allSelected = categoryPerms.every(p => formData.permissions[p])

        if (allSelected) {
            // Uncheck all
            setFormData(prev => {
                const newPerms = { ...prev.permissions }
                categoryPerms.forEach(p => { newPerms[p] = false })
                return { ...prev, permissions: newPerms }
            })
        } else {
            // Check all
            setFormData(prev => {
                const newPerms = { ...prev.permissions }
                categoryPerms.forEach(p => { newPerms[p] = true })
                return { ...prev, permissions: newPerms }
            })
        }
    }

    const getPermissionCount = (role: Role): number => {
        if (!role.permissions) return 0
        return Object.values(role.permissions).filter(Boolean).length
    }

    const getPermissionLabels = (role: Role): string[] => {
        if (!role.permissions) return []
        const labels: string[] = []
        Object.entries(permissionCategories).forEach(([_, category]) => {
            category.permissions.forEach(perm => {
                if (role.permissions[perm.key]) {
                    labels.push(perm.label)
                }
            })
        })
        return labels
    }

    const filteredRoles = roles.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const colorOptions = [
        { value: "#6366f1", label: "Indigo" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#10b981", label: "Green" },
        { value: "#f59e0b", label: "Amber" },
        { value: "#ef4444", label: "Red" },
        { value: "#3b82f6", label: "Blue" },
        { value: "#6b7280", label: "Gray" },
    ]

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
                    <h1 className="text-3xl font-bold text-slate-900">Role Management</h1>
                    <p className="text-slate-500">
                        Define roles and assign permissions to teachers
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchRoles}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingRole ? "Edit" : "Create"} Role</DialogTitle>
                                <DialogDescription>
                                    Define the role name and select permissions
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Role Name *</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Senior Teacher"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color</Label>
                                        <div className="flex gap-2">
                                            {colorOptions.map(color => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    className={`w-8 h-8 rounded-full ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                                                        }`}
                                                    style={{ backgroundColor: color.value }}
                                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of this role"
                                    />
                                </div>

                                <Separator />

                                <div>
                                    <Label className="text-base font-semibold">Permissions</Label>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Select the permissions this role should have
                                    </p>

                                    <div className="space-y-6">
                                        {Object.entries(permissionCategories).map(([categoryKey, category]) => {
                                            const categoryPerms = category.permissions
                                            const selectedCount = categoryPerms.filter(p => formData.permissions[p.key]).length
                                            const allSelected = selectedCount === categoryPerms.length && categoryPerms.length > 0

                                            return (
                                                <div key={categoryKey} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={allSelected}
                                                                onCheckedChange={() => toggleCategoryPermissions(categoryKey)}
                                                            />
                                                            <span className="font-medium text-slate-900">{category.label}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {selectedCount}/{categoryPerms.length}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 ml-6">
                                                        {categoryPerms.map(perm => (
                                                            <div
                                                                key={perm.key}
                                                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${formData.permissions[perm.key]
                                                                        ? 'bg-indigo-50 border-indigo-200'
                                                                        : 'bg-white border-slate-200 hover:bg-slate-50'
                                                                    }`}
                                                                onClick={() => togglePermission(perm.key)}
                                                            >
                                                                <Checkbox
                                                                    checked={formData.permissions[perm.key] || false}
                                                                    onCheckedChange={() => togglePermission(perm.key)}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900">{perm.label}</p>
                                                                    <p className="text-xs text-slate-500">{perm.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} disabled={saving}>
                                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {editingRole ? "Update Role" : "Create Role"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <UserCog className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Roles</p>
                                <p className="text-2xl font-bold text-slate-900">{roles.length}</p>
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
                                <p className="text-sm text-slate-500">Users Assigned</p>
                                <p className="text-2xl font-bold text-slate-900">{roles.reduce((sum, r) => sum + (r.usersCount || 0), 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Key className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Permissions</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {Object.values(permissionCategories).reduce((sum, cat) => sum + cat.permissions.length, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search roles..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRoles.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        <UserCog className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No roles found</p>
                        <p className="text-sm mt-1">Create a role to get started</p>
                    </div>
                ) : (
                    filteredRoles.map((role) => {
                        const permLabels = getPermissionLabels(role)
                        return (
                            <Card key={role._id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: role.color + '20' }}
                                            >
                                                <Shield className="h-5 w-5" style={{ color: role.color }} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">{role.name}</h3>
                                                    {role.type === "system" && (
                                                        <Badge variant="outline" className="text-xs">System</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500">{role.description || "No description"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600"
                                                onClick={() => handleDelete(role._id)}
                                                disabled={!role.isDeletable}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {role.usersCount || 0} users
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Key className="w-4 h-4" />
                                            {getPermissionCount(role)} permissions
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {permLabels.slice(0, 5).map((label, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {label}
                                            </Badge>
                                        ))}
                                        {permLabels.length > 5 && (
                                            <Badge variant="outline" className="text-xs bg-slate-100">
                                                +{permLabels.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Info */}
            <Card className="shadow-sm border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Role-Based Access Control</h3>
                            <p className="text-sm text-slate-600">
                                Roles allow you to define different levels of access for teachers. Each role can have specific permissions
                                that control what features and data the user can access. Assign roles to teachers from the Teachers page.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
