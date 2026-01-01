"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Key,
    Save,
    Loader2,
    Shield,
    Briefcase,
    Award
} from "lucide-react"

export default function TeacherProfilePage() {
    const user = useAuthStore((state) => state.user)
    const [saving, setSaving] = useState(false)

    // Profile settings
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [qualifications, setQualifications] = useState("")
    const [experience, setExperience] = useState("")
    const [specialization, setSpecialization] = useState("")

    // Security settings
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            // TODO: Call API to update teacher profile
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setSaving(true)
        try {
            // TODO: Call API to change password
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Password changed successfully")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (error) {
            toast.error("Failed to change password")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500">
                    Manage your personal and professional information
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="professional" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Professional
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {name.charAt(0) || "T"}
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Change Photo</Button>
                                    <p className="text-sm text-slate-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        disabled
                                    />
                                    <p className="text-xs text-slate-500">Contact admin to change your email</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </Label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Address
                                </Label>
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your address"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Teacher Information Card */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                Teacher Information
                            </CardTitle>
                            <CardDescription>
                                Your teaching details (read-only)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-600">Teacher ID</Label>
                                    <p className="text-sm font-medium text-slate-900">{user?.teacherId || "N/A"}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600">Department</Label>
                                    <p className="text-sm font-medium text-slate-900">{user?.program || "N/A"}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600">Subjects</Label>
                                    <p className="text-sm font-medium text-slate-900">
                                        {user?.subject && user.subject.length > 0 
                                            ? user.subject.join(", ") 
                                            : "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600">Joined Date</Label>
                                    <p className="text-sm font-medium text-slate-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Professional Settings */}
                <TabsContent value="professional" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="w-5 h-5 text-indigo-600" />
                                Professional Details
                            </CardTitle>
                            <CardDescription>
                                Update your qualifications and experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Qualifications</Label>
                                <Textarea
                                    value={qualifications}
                                    onChange={(e) => setQualifications(e.target.value)}
                                    placeholder="e.g., M.Ed in Mathematics, B.Sc in Computer Science"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Years of Experience</Label>
                                <Input
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="e.g., 5 years"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Areas of Specialization</Label>
                                <Textarea
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    placeholder="e.g., Advanced Mathematics, Computer Programming, Educational Technology"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Key className="w-5 h-5 text-indigo-600" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Update your password regularly for better security
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleChangePassword} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
