"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
    Settings,
    User,
    Bell,
    Shield,
    Mail,
    Key,
    Save,
    Loader2
} from "lucide-react"

export default function SettingsPage() {
    const user = useAuthStore((state) => state.user)
    const [saving, setSaving] = useState(false)

    // Profile settings
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [newSchoolAlerts, setNewSchoolAlerts] = useState(true)
    const [systemAlerts, setSystemAlerts] = useState(true)
    const [weeklyReports, setWeeklyReports] = useState(true)

    // Security settings
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    const handleSaveNotifications = async () => {
        setSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Notification preferences saved")
        } catch (error) {
            toast.error("Failed to save preferences")
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

    return (
        <div className="p-8 space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">
                    Manage your account and system preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {name.charAt(0) || "S"}
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Change Photo</Button>
                                    <p className="text-sm text-slate-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} disabled={saving}>
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-indigo-600" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-slate-500" />
                                        <div>
                                            <p className="font-medium text-slate-900">Email Notifications</p>
                                            <p className="text-sm text-slate-500">Receive notifications via email</p>
                                        </div>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">New School Registrations</p>
                                        <p className="text-sm text-slate-500">Get notified when a new school is registered</p>
                                    </div>
                                    <Switch checked={newSchoolAlerts} onCheckedChange={setNewSchoolAlerts} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">System Alerts</p>
                                        <p className="text-sm text-slate-500">Critical system alerts and warnings</p>
                                    </div>
                                    <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">Weekly Reports</p>
                                        <p className="text-sm text-slate-500">Receive weekly summary reports</p>
                                    </div>
                                    <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveNotifications} disabled={saving}>
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
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
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleChangePassword} disabled={saving}>
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Key className="w-4 h-4 mr-2" />
                                    )}
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-600" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                                </div>
                                <Button variant="outline" size="sm">Enable</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Active Sessions</p>
                                    <p className="text-sm text-slate-500">Manage your active login sessions</p>
                                </div>
                                <Button variant="outline" size="sm">View Sessions</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Login History</p>
                                    <p className="text-sm text-slate-500">View your recent login activity</p>
                                </div>
                                <Button variant="outline" size="sm">View History</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
