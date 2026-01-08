"use client"

import { useState, useEffect } from "react"
import useSchoolSettings from '@/hooks/useSchoolSettings'
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
    Settings,
    User,
    Bell,
    Shield,
    School,
    Key,
    Save,
    Loader2,
    Globe,
    Clock,
    Mail,
    Palette
} from "lucide-react"
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'

export default function AdminSettingsPage() {
    const user = useAuthStore((state) => state.user)
    const [saving, setSaving] = useState(false)

    // Profile settings
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")

    // School settings
    // School settings (will be hydrated from server)
    const [schoolName, setSchoolName] = useState("")
    const [schoolEmail, setSchoolEmail] = useState("")
    const [schoolPhone, setSchoolPhone] = useState("")
    const [schoolAddress, setSchoolAddress] = useState("")
    const [timezone, setTimezone] = useState("America/New_York")
    const [academicYear, setAcademicYear] = useState("2024-2025")

    // React Query hook for server-backed school settings
    const { school, isLoading: schoolLoading, updateSchool } = useSchoolSettings()

    // Hydrate local state when server data arrives
    useEffect(() => {
        if (school) {
            setSchoolName(school.name || "")
            setSchoolEmail(school.email || "")
            setSchoolPhone(school.phone || "")
            setSchoolAddress(school.address || "")
            setTimezone(school.timezone || "America/New_York")
            setAcademicYear(school.currentAcademicYear || academicYear)
        }
    }, [school])
    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [newStudentAlerts, setNewStudentAlerts] = useState(true)
    const [attendanceAlerts, setAttendanceAlerts] = useState(true)
    const [paymentAlerts, setPaymentAlerts] = useState(true)
    const [systemAlerts, setSystemAlerts] = useState(true)

    // Appearance settings
    const [theme, setTheme] = useState("light")
    const [primaryColor, setPrimaryColor] = useState("indigo")

    // Security settings
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

    const handleSave = async (section: string) => {
        setSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(`${section} updated successfully`)
        } catch (error) {
            toast.error(`Failed to update ${section}`)
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

    const notificationCount = [emailNotifications, newStudentAlerts, attendanceAlerts, paymentAlerts, systemAlerts].filter(Boolean).length

    return (
        <AdminPageLayout
            title="Settings"
            description="Manage your school and account settings"
            actions={<Button onClick={() => handleSave('All settings')}><Save className="w-4 h-4 mr-2" />Save All</Button>}
            stats={(
                <>
                    <SummaryStatCard title="Active Alerts" value={notificationCount} icon={<Bell className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Academic Year" value={academicYear} icon={<Clock className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Theme" value={theme} icon={<Palette className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="Admins" value={1} icon={<User className="h-4 w-4 text-white" />} variant="orange" />
                </>
            )}
        >
            <Tabs defaultValue="school" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 gap-1 flex-wrap">
                    <TabsTrigger value="school" className="flex items-center gap-2">
                        <School className="w-4 h-4" />
                        School
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* School Settings */}
                <TabsContent value="school" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="w-5 h-5 text-primary" />
                                School Information
                            </CardTitle>
                            <CardDescription>
                                Update your school's basic information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>School Name</Label>
                                    <Input
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={schoolEmail}
                                        onChange={(e) => setSchoolEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={schoolPhone}
                                        onChange={(e) => setSchoolPhone(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Current Academic Year</Label>
                                    <Select value={academicYear} onValueChange={setAcademicYear}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2023-2024">2023-2024</SelectItem>
                                            <SelectItem value="2024-2025">2024-2025</SelectItem>
                                            <SelectItem value="2025-2026">2025-2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea
                                    value={schoolAddress}
                                    onChange={(e) => setSchoolAddress(e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select value={timezone} onValueChange={setTimezone}>
                                    <SelectTrigger className="w-full md:w-64">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                        <SelectItem value="Europe/London">GMT (London)</SelectItem>
                                        <SelectItem value="Asia/Dubai">GST (Dubai)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={async () => {
                                    setSaving(true)
                                    try {
                                        await updateSchool({
                                            name: schoolName,
                                            email: schoolEmail,
                                            phone: schoolPhone,
                                            address: schoolAddress,
                                            timezone,
                                            currentAcademicYear: academicYear,
                                        })
                                        toast.success("School information updated")
                                    } catch (error) {
                                        toast.error("Failed to update school information")
                                    } finally {
                                        setSaving(false)
                                    }
                                }} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                    {name.charAt(0) || "A"}
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Change Photo</Button>
                                    <p className="text-sm text-slate-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => handleSave("Profile")} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-slate-500" />
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via email</p>
                                    </div>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">New Student Enrollments</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when new students enroll</p>
                                </div>
                                <Switch checked={newStudentAlerts} onCheckedChange={setNewStudentAlerts} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Attendance Alerts</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Alerts for low attendance rates</p>
                                </div>
                                <Switch checked={attendanceAlerts} onCheckedChange={setAttendanceAlerts} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Payment Notifications</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Alerts for fee payments and dues</p>
                                </div>
                                <Switch checked={paymentAlerts} onCheckedChange={setPaymentAlerts} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">System Alerts</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Critical system notifications</p>
                                </div>
                                <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => handleSave("Notifications")} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5 text-primary" />
                                Appearance Settings
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={`p-4 rounded-lg border-2 transition-colors ${theme === "light" ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700"
                                                }`}
                                        >
                                            <div className="w-full h-20 bg-white rounded border border-slate-200 mb-2"></div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Light</p>
                                        </button>
                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={`p-4 rounded-lg border-2 transition-colors ${theme === "dark" ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700"
                                                }`}
                                        >
                                            <div className="w-full h-20 bg-slate-800 rounded border border-slate-700 mb-2"></div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Dark</p>
                                        </button>
                                        <button
                                            onClick={() => setTheme("system")}
                                            className={`p-4 rounded-lg border-2 transition-colors ${theme === "system" ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700"
                                                }`}
                                        >
                                            <div className="w-full h-20 bg-gradient-to-r from-white to-slate-800 rounded border border-slate-200 mb-2"></div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">System</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Accent Color</Label>
                                    <div className="flex gap-3">
                                        {["indigo", "purple", "blue", "green", "amber", "red"].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setPrimaryColor(color)}
                                                className={`w-10 h-10 rounded-full bg-${color}-500 ${primaryColor === color ? "ring-2 ring-offset-2 ring-slate-900" : ""
                                                    }`}
                                                style={{
                                                    backgroundColor:
                                                        color === "indigo" ? "#6366f1" :
                                                            color === "purple" ? "#a855f7" :
                                                                color === "blue" ? "#3b82f6" :
                                                                    color === "green" ? "#22c55e" :
                                                                        color === "amber" ? "#f59e0b" :
                                                                            "#ef4444"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => handleSave("Appearance")} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-primary" />
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                                </div>
                                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Active Sessions</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your login sessions</p>
                                </div>
                                <Button variant="outline" size="sm">View Sessions</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Login History</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">View your recent login activity</p>
                                </div>
                                <Button variant="outline" size="sm">View History</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminPageLayout>
    );
}
