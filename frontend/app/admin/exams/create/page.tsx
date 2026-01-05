"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { academicAPI, questionAPI, adminAPI, courseAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, ArrowLeft, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CreateExamPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Dropdown Data
    const [subjects, setSubjects] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        subject: "",
        program: "",
        academicTerm: "",
        academicYear: "",
        classLevel: "",
        duration: "30 minutes",
        examDate: "",
        examTime: "",
        passMark: 50,
        totalMark: 100,
        examType: "Quiz"
    });

    // Question Selection
    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [questionSearch, setQuestionSearch] = useState("");

    useEffect(() => {
        const fetchDependencies = async () => {
            setLoading(true);
            try {
                const [subjRes, progRes, termRes, yearRes, classRes] = await Promise.all([
                    academicAPI.getSubjects(),
                    academicAPI.getPrograms(),
                    academicAPI.getAcademicTerms(),
                    academicAPI.getAcademicYears(),
                    academicAPI.getClasses()
                ]);

                setSubjects(unwrapArray(subjRes?.data, "subjects"));
                setPrograms(unwrapArray(progRes?.data, "programs"));
                setTerms(unwrapArray(termRes?.data, "terms"));
                setYears(unwrapArray(yearRes?.data, "years"));
                setClasses(unwrapArray(classRes?.data, "classes"));
            } catch (error) {
                console.error("Failed to load dependencies:", error);
                toast.error("Failed to load form data");
            } finally {
                setLoading(false);
            }
        };

        fetchDependencies();
    }, []);

    const fetchQuestions = async () => {
        if (!formData.subject) {
            toast.error("Please select a subject first");
            return;
        }

        try {
            // Fetch questions for the selected subject
            // The API might need query params. Assuming getAll supports basic filtering or returns all.
            // If backend supports filtering: questionAPI.getAll({ subject: formData.subject })
            const res = await questionAPI.getAll();
            const allQuestions = unwrapArray((res as any)?.data, "questions");

            // Filter client-side if API doesn't support generic filtering yet
            // Assuming question object has a populated 'subject' or subject ID
            const filtered = allQuestions.filter((q: any) =>
                (q.subject?._id === formData.subject || q.subject === formData.subject)
            );

            setAvailableQuestions(filtered);
            setIsQuestionModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            toast.error("Failed to load questions");
        }
    };

    const handleQuestionToggle = (question: any) => {
        const exists = selectedQuestions.find(q => q._id === question._id);
        if (exists) {
            setSelectedQuestions(selectedQuestions.filter(q => q._id !== question._id));
        } else {
            setSelectedQuestions([...selectedQuestions, question]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // In a real app we'd construct a dedicated API call for creating exams
            // Since we don't have a direct export for 'examAPI' in endpoints yet, we'll use axios directly 
            // BUT wait, I updated endpoints.ts? No I didn't update endpoints.ts with examAPI yet.
            // I'll assume we can use a direct fetch or add it.
            // Let's use generic api instance or fetch.

            // Construct payload
            const payload = {
                ...formData,
                questions: selectedQuestions.map(q => q._id)
            };

            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130/api/v1'}/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to create exam');

            toast.success("Exam created successfully!");
            router.push("/admin/exams");
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.message || "Failed to create exam");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">Create New Exam</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Exam Name</Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Mid-Term Mathematics"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Program</Label>
                            <Select
                                value={formData.program}
                                onValueChange={(val) => setFormData({ ...formData, program: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p) => (
                                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Class Level</Label>
                            <Select
                                value={formData.classLevel}
                                onValueChange={(val) => setFormData({ ...formData, classLevel: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select
                                value={formData.subject}
                                onValueChange={(val) => setFormData({ ...formData, subject: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((s) => (
                                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <Select
                                value={formData.academicYear}
                                onValueChange={(val) => setFormData({ ...formData, academicYear: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Term</Label>
                            <Select
                                value={formData.academicTerm}
                                onValueChange={(val) => setFormData({ ...formData, academicTerm: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {terms.map((t) => (
                                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                required
                                value={formData.examDate}
                                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                required
                                value={formData.examTime}
                                onChange={(e) => setFormData({ ...formData, examTime: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Duration (e.g. 30 minutes)</Label>
                            <Input
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Instructions for students..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Questions Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Questions ({selectedQuestions.length})</CardTitle>
                        <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={fetchQuestions} variant="outline" className="border-dashed">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Questions from Bank
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Select Questions</DialogTitle>
                                </DialogHeader>

                                <div className="py-4">
                                    <Input
                                        placeholder="Search questions..."
                                        value={questionSearch}
                                        onChange={(e) => setQuestionSearch(e.target.value)}
                                        className="mb-4"
                                    />

                                    <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
                                        {availableQuestions
                                            .filter(q => q.questionText?.toLowerCase().includes(questionSearch.toLowerCase()))
                                            .map((q) => (
                                                <div key={q._id} className="flex items-start gap-3 p-3 border-b last:border-0 hover:bg-slate-50">
                                                    <Checkbox
                                                        checked={selectedQuestions.some(sel => sel._id === q._id)}
                                                        onCheckedChange={() => handleQuestionToggle(q)}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm text-slate-900 line-clamp-2">{q.questionText}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">{q.questionType}</Badge>
                                                            <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {availableQuestions.length === 0 && (
                                            <div className="p-8 text-center text-slate-500">No questions found for this subject.</div>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setIsQuestionModalOpen(false)}>Done</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {selectedQuestions.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 border-2 border-dashed rounded-lg">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No questions added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedQuestions.map((q, index) => (
                                    <div key={q._id || index} className="flex items-start gap-4 p-4 border rounded-lg bg-white">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{q.questionText}</p>
                                            <div className="mt-2 space-y-1">
                                                {q.options?.map((opt: any, i: number) => (
                                                    <div key={i} className={`text-sm flex items-center gap-2 ${opt.isCorrect ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                                                        <div className={`w-2 h-2 rounded-full ${opt.isCorrect ? 'bg-green-600' : 'bg-slate-300'}`} />
                                                        {opt.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleQuestionToggle(q)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={submitting || selectedQuestions.length === 0}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Exam
                    </Button>
                </div>
            </form>
        </div>
    );
}
