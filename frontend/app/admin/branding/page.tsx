"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, Upload, Globe, CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function BrandingSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        schoolName: "Progress International Academy",
        primaryColor: "#4F46E5",
        secondaryColor: "#7C3AED",
        logoUrl: "",
        customDomain: "academy.progresslms.com"
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Branding settings updated successfully!");
            setSaving(false);
        }, 1000);
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100">
                        <Palette className="h-6 w-6 text-indigo-600" />
                    </div>
                    Branding & Identity
                </h1>
                <p className="text-slate-500 mt-2">Customize how your school appears to students, teachers, and parents.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visual Identity */}
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Visual Identity</CardTitle>
                            <CardDescription>Upload your logo and choose your primary colors.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label>School Logo</Label>
                                <div className="flex items-center gap-6">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                                        <Upload className="h-8 w-8 text-slate-300 group-hover:text-indigo-400" />
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Recommended: 512x512px SVG or PNG.<br />
                                            Maximum size: 2MB.
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex gap-2">
                                        <div className="h-10 w-10 rounded-md shadow-inner border border-slate-200" style={{ backgroundColor: formData.primaryColor }} />
                                        <Input
                                            value={formData.primaryColor || "#4F46E5"}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <div className="h-10 w-10 rounded-md shadow-inner border border-slate-200" style={{ backgroundColor: formData.secondaryColor }} />
                                        <Input
                                            value={formData.secondaryColor || "#7C3AED"}
                                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* School Info */}
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Domain & Naming</CardTitle>
                            <CardDescription>Configure your custom domain and official school name.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Official School Name</Label>
                                <Input
                                    value={formData.schoolName}
                                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                    placeholder="Enter school name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Globe className="h-3.5 w-3.5" /> Custom Domain
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.customDomain}
                                        onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                        placeholder="academy.yourschool.com"
                                    />
                                    <Button variant="secondary" type="button">Verify</Button>
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">Status: <span className="text-green-600">Active & Verified</span></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Card */}
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="border-b border-slate-800">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Icon name="lucide:eye" className="h-4 w-4 text-indigo-400" /> Real-time Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                            <div className="w-64 h-48 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: formData.primaryColor }} />
                                    <span className="font-bold text-sm truncate">{formData.schoolName}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded" />
                                    <div className="h-2 w-2/3 bg-white/5 rounded" />
                                </div>
                                <Button size="sm" className="w-full text-[10px] font-bold uppercase" style={{ backgroundColor: formData.primaryColor }}>
                                    Sample Action
                                </Button>
                            </div>

                            <div className="flex-1 space-y-4 max-w-sm">
                                <h3 className="text-xl font-bold italic">"Your vision, our platform."</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    This is how your primary action buttons and UI highlights will look.
                                    The colors are applied globally to your LMS portal.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4 pb-12">
                    <Button variant="ghost" type="button">Reset Changes</Button>
                    <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 px-12 rounded-xl font-bold shadow-lg shadow-indigo-100">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Save Branding
                    </Button>
                </div>
            </form>
        </div>
    );
}
