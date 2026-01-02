"use client";

import { useEffect, useState } from "react";
import { gradingPolicyAPI, adminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Settings2, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function GradingPolicyPage() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        policyName: "Standard Grading Policy",
        academicYear: "",
        assessmentWeights: {
            homework: 20,
            quizzes: 30,
            exams: 50,
            projects: 25,
            participation: 10
        },
        gradingScale: [
            { letter: "A", minPercentage: 90, maxPercentage: 100, gradePoints: 4.0 },
            { letter: "B", minPercentage: 80, maxPercentage: 89, gradePoints: 3.0 },
            { letter: "C", minPercentage: 70, maxPercentage: 79, gradePoints: 2.0 },
            { letter: "D", minPercentage: 60, maxPercentage: 69, gradePoints: 1.0 },
            { letter: "F", minPercentage: 0, maxPercentage: 59, gradePoints: 0.0 }
        ],
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [policiesRes, yearsRes] = await Promise.all([
                gradingPolicyAPI.getAll(),
                adminAPI.getAcademicYears()
            ]);
            setPolicies((policiesRes as any).data || []);
            setYears((yearsRes as any).data || []);

            const currentYear = ((yearsRes as any).data || []).find((y: any) => y.isCurrent);
            if (currentYear) setFormData(prev => ({ ...prev, academicYear: currentYear._id }));
        } catch (error: any) {
            toast.error(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await gradingPolicyAPI.create(formData);
            toast.success("Grading policy created");
            setIsDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to create policy");
        }
    };

    const handleDeletePolicy = async (id: string) => {
        if (!confirm("Are you sure you want to delete this policy?")) return;
        try {
            await gradingPolicyAPI.delete(id);
            toast.success("Policy deleted");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete policy");
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await gradingPolicyAPI.update(id, { isActive: !currentStatus });
            toast.success(`Policy ${!currentStatus ? 'activated' : 'deactivated'}`);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mobile-padding mobile-padding-y space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="min-w-0">
                    <h1 className="heading-responsive font-bold text-slate-900">Grading Policies</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage school-wide grading weights and scales</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="btn-responsive-lg w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Create Policy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-base sm:text-lg">New Grading Policy</DialogTitle>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Define weights for different assessment types and set up your grading scale.</p>
                        </DialogHeader>
                        <form onSubmit={handleCreatePolicy} className="space-y-4 sm:space-y-6 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs sm:text-sm">Policy Name</Label>
                                    <Input
                                        value={formData.policyName}
                                        onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
                                        placeholder="e.g. Standard 2024"
                                        className="text-xs sm:text-sm"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs sm:text-sm">Academic Year</Label>
                                    <Select value={formData.academicYear} onValueChange={(v) => setFormData({ ...formData, academicYear: v })}>
                                        <SelectTrigger className="text-xs sm:text-sm"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                        <SelectContent>
                                            {years.map(y => <SelectItem key={y._id} value={y._id} className="text-xs sm:text-sm">{y.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-sm sm:text-base font-semibold border-b pb-2">Assessment Weights (%)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                                    {Object.entries(formData.assessmentWeights).map(([key, value]) => (
                                        <div key={key} className="grid gap-1.5 sm:gap-2">
                                            <Label className="text-xs sm:text-sm capitalize">{key}</Label>
                                            <Input
                                                type="number"
                                                value={value}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    assessmentWeights: { ...formData.assessmentWeights, [key]: parseInt(e.target.value) }
                                                })}
                                                className="text-xs sm:text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 italic">* Weights determine how much each assessment type contributes to the final grade.</p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-sm sm:text-base font-semibold border-b pb-2 flex justify-between items-center gap-2">
                                    <span>Grading Scale</span>
                                    <Button type="button" variant="outline" size="sm" className="text-xs py-1 h-auto" onClick={() => setFormData({
                                        ...formData,
                                        gradingScale: [...formData.gradingScale, { letter: "", minPercentage: 0, maxPercentage: 0, gradePoints: 0 }]
                                    })}>Add Level</Button>
                                </h3>
                                <div className="space-y-2 overflow-x-auto">
                                    {formData.gradingScale.map((item, index) => (
                                        <div key={index} className="grid grid-cols-5 gap-1 sm:gap-2 items-end min-w-min sm:min-w-fit">
                                            <div className="grid gap-1">
                                                <Label className="text-[10px] sm:text-xs">Letter</Label>
                                                <Input value={item.letter} onChange={(e) => {
                                                    const newScale = [...formData.gradingScale];
                                                    newScale[index].letter = e.target.value;
                                                    setFormData({ ...formData, gradingScale: newScale });
                                                }} className="text-xs py-1 h-8" />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label className="text-[10px] sm:text-xs">Min %</Label>
                                                <Input type="number" value={item.minPercentage} onChange={(e) => {
                                                    const newScale = [...formData.gradingScale];
                                                    newScale[index].minPercentage = parseInt(e.target.value);
                                                    setFormData({ ...formData, gradingScale: newScale });
                                                }} className="text-xs py-1 h-8" />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label className="text-[10px] sm:text-xs">Max %</Label>
                                                <Input type="number" value={item.maxPercentage} onChange={(e) => {
                                                    const newScale = [...formData.gradingScale];
                                                    newScale[index].maxPercentage = parseInt(e.target.value);
                                                    setFormData({ ...formData, gradingScale: newScale });
                                                }} className="text-xs py-1 h-8" />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label className="text-[10px] sm:text-xs">GPA Pts</Label>
                                                <Input type="number" step="0.1" value={item.gradePoints} onChange={(e) => {
                                                    const newScale = [...formData.gradingScale];
                                                    newScale[index].gradePoints = parseFloat(e.target.value);
                                                    setFormData({ ...formData, gradingScale: newScale });
                                                }} className="text-xs py-1 h-8" />
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" className="mb-0.5 h-8 w-8 p-0" onClick={() => {
                                                const newScale = formData.gradingScale.filter((_, i) => i !== index);
                                                setFormData({ ...formData, gradingScale: newScale });
                                            }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-100/50 dark:bg-slate-900/50 p-3 sm:p-4 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-xs sm:text-sm">Active Policy</Label>
                                    <p className="text-xs text-slate-500">This will become the default policy for calculations.</p>
                                </div>
                                <Switch checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: v })} />
                            </div>

                            <Button type="submit" className="w-full btn-responsive-lg">Create Grading Policy</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6">
                {policies.map((policy: any) => (
                    <Card key={policy._id} className={`${policy.isActive ? "border-primary shadow-md" : "opacity-80"}`}>
                        <CardHeader className="pb-3 sm:pb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <CardTitle className="text-base sm:text-lg">{policy.policyName}</CardTitle>
                                        {policy.isActive && (
                                            <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <CardDescription className="text-xs sm:text-sm mt-1">{policy.academicYear?.name}</CardDescription>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-auto py-1 h-auto" onClick={() => handleToggleActive(policy._id, policy.isActive)}>
                                        {policy.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="py-1 h-auto" onClick={() => handleDeletePolicy(policy._id)}>
                                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                            <div>
                                <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                                    <Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Weights
                                </h4>
                                <div className="grid grid-cols-2 gap-y-1.5 sm:gap-y-2">
                                    {Object.entries(policy.assessmentWeights).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between border-b pb-0.5 sm:pb-1 pr-2 sm:pr-4">
                                            <span className="text-xs sm:text-sm capitalize text-slate-600 dark:text-slate-400">{key}</span>
                                            <span className="text-xs sm:text-sm font-bold">{value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Grading Scale</h4>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="h-7 sm:h-8">
                                                <TableHead className="h-7 sm:h-8 py-1 px-2 text-xs sm:text-sm">Grade</TableHead>
                                                <TableHead className="h-7 sm:h-8 py-1 px-1 sm:px-2 text-center text-xs sm:text-sm">Range</TableHead>
                                                <TableHead className="h-7 sm:h-8 py-1 px-1 sm:px-2 text-right text-xs sm:text-sm">Points</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {policy.gradingScale.sort((a: any, b: any) => b.minPercentage - a.minPercentage).map((item: any, i: number) => (
                                                <TableRow key={i} className="h-7 sm:h-8">
                                                    <TableCell className="h-7 sm:h-8 py-1 px-2 font-bold text-xs sm:text-sm">{item.letter}</TableCell>
                                                    <TableCell className="h-7 sm:h-8 py-1 px-1 sm:px-2 text-center text-[10px] sm:text-xs">{item.minPercentage}% - {item.maxPercentage}%</TableCell>
                                                    <TableCell className="h-7 sm:h-8 py-1 px-1 sm:px-2 text-right font-medium text-xs sm:text-sm">{item.gradePoints}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
