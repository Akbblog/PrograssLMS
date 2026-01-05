"use client";

import { useEffect, useState } from "react";
import { questionAPI, academicAPI } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    Loader2,
    Plus,
    HelpCircle,
    Pencil,
    Trash2,
    Search,
    ChevronDown,
    CheckCircle2,
    XCircle,
    Upload,
    FileText,
    Image as ImageIcon,
    Video,
    X
} from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

interface QuestionOption {
    text: string;
    isCorrect: boolean;
}

interface Question {
    _id: string;
    questionText: string;
    questionType: string;
    options: QuestionOption[];
    correctAnswer?: string;
    explanation?: string;
    marks: number;
    negativeMark: number;
    difficulty: string;
    subject?: { _id: string; name: string };
    classLevel?: { _id: string; name: string };
    tags: string[];
    media: { type: string; url: string; title: string }[];
    isActive: boolean;
    createdAt: string;
}

// Simple native select dropdown component
function NativeSelect({
    value,
    onValueChange,
    placeholder,
    options,
    disabled = false
}: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                disabled={disabled}
                className="w-full h-9 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
    );
}

export default function QuestionBankPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSubject, setFilterSubject] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        questionText: "",
        questionType: "mcq",
        options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ] as QuestionOption[],
        correctAnswer: "",
        explanation: "",
        marks: 1,
        negativeMark: 0,
        difficulty: "medium",
        subject: "",
        classLevel: "",
        tags: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [questionsRes, subjectsRes, classesRes] = await Promise.all([
                questionAPI.getAll(),
                academicAPI.getSubjects(),
                academicAPI.getClasses()
            ]);
            setQuestions(unwrapArray((questionsRes as any)?.data, "questions"));
            setSubjects(unwrapArray((subjectsRes as any)?.data, "subjects"));
            setClasses(unwrapArray((classesRes as any)?.data, "classes"));
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load question bank data");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            questionText: "",
            questionType: "mcq",
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false }
            ],
            correctAnswer: "",
            explanation: "",
            marks: 1,
            negativeMark: 0,
            difficulty: "medium",
            subject: "",
            classLevel: "",
            tags: "",
        });
        setEditingQuestion(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setDialogOpen(true);
    };

    const openEditDialog = (question: Question) => {
        setEditingQuestion(question);
        setFormData({
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.options.length > 0
                ? question.options
                : [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }],
            correctAnswer: question.correctAnswer || "",
            explanation: question.explanation || "",
            marks: question.marks,
            negativeMark: question.negativeMark,
            difficulty: question.difficulty,
            subject: question.subject?._id || "",
            classLevel: question.classLevel?._id || "",
            tags: question.tags.join(", "),
        });
        setDialogOpen(true);
    };

    const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
        const newOptions = [...formData.options];
        if (field === 'isCorrect' && value === true) {
            // For MCQ, only one correct answer
            newOptions.forEach((opt, i) => opt.isCorrect = i === index);
        } else {
            // TypeScript safe update
            const option = { ...newOptions[index] };
            if (field === 'text') option.text = value as string;
            else if (field === 'isCorrect') option.isCorrect = value as boolean;
            newOptions[index] = option;
        }
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: "", isCorrect: false }]
        });
    };

    const removeOption = (index: number) => {
        if (formData.options.length <= 2) return;
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async () => {
        if (!formData.questionText) {
            toast.error("Please enter the question text");
            return;
        }

        if (formData.questionType === 'mcq') {
            const validOptions = formData.options.filter(o => o.text.trim());
            if (validOptions.length < 2) {
                toast.error("Please add at least 2 options for MCQ");
                return;
            }
            if (!formData.options.some(o => o.isCorrect)) {
                toast.error("Please mark the correct answer");
                return;
            }
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                options: formData.questionType === 'mcq' ? formData.options.filter(o => o.text.trim()) : [],
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            };

            if (editingQuestion) {
                await questionAPI.update(editingQuestion._id, payload);
                toast.success("Question updated successfully");
            } else {
                await questionAPI.create(payload);
                toast.success("Question created successfully");
            }
            setDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || "Failed to save question");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        try {
            await questionAPI.delete(id);
            toast.success("Question deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete question");
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !filterSubject || q.subject?._id === filterSubject;
        const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
        return matchesSearch && matchesSubject && matchesDifficulty;
    });

    const subjectOptions = subjects.map(s => ({ value: s._id, label: s.name }));
    const classOptions = classes.map(c => ({ value: c._id, label: c.name }));
    const difficultyOptions = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
    ];
    const questionTypeOptions = [
        { value: 'mcq', label: 'Multiple Choice (MCQ)' },
        { value: 'true-false', label: 'True/False' },
        { value: 'short', label: 'Short Answer' },
        { value: 'long', label: 'Long Answer / Essay' },
        { value: 'fill-blank', label: 'Fill in the Blank' },
    ];

    const getDifficultyBadge = (difficulty: string) => {
        const colors: Record<string, string> = {
            easy: "bg-green-100 text-green-700",
            medium: "bg-yellow-100 text-yellow-700",
            hard: "bg-red-100 text-red-700"
        };
        return <Badge className={colors[difficulty] || "bg-gray-100"}>{difficulty}</Badge>;
    };

    const getTypeBadge = (type: string) => {
        const labels: Record<string, string> = {
            mcq: "MCQ",
            'true-false': "T/F",
            short: "Short",
            long: "Essay",
            'fill-blank': "Fill"
        };
        return <Badge variant="outline">{labels[type] || type}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
                    <p className="text-muted-foreground">Create and manage questions for assessments</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questions.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">MCQ Questions</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {questions.filter(q => q.questionType === 'mcq').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Essay Questions</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {questions.filter(q => q.questionType === 'long').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjects Covered</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(questions.map(q => q.subject?._id).filter(Boolean)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search questions..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <NativeSelect
                                value={filterSubject}
                                onValueChange={setFilterSubject}
                                placeholder="All Subjects"
                                options={subjectOptions}
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <NativeSelect
                                value={filterDifficulty}
                                onValueChange={setFilterDifficulty}
                                placeholder="All Difficulties"
                                options={difficultyOptions}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Questions</CardTitle>
                    <CardDescription>
                        {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Questions Found</h3>
                            <p className="text-muted-foreground">Create your first question to build assessments</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Question</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead>Marks</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQuestions.map((question) => (
                                    <TableRow key={question._id}>
                                        <TableCell className="font-medium">
                                            <div className="max-w-md truncate">{question.questionText}</div>
                                        </TableCell>
                                        <TableCell>{getTypeBadge(question.questionType)}</TableCell>
                                        <TableCell>{question.subject?.name || "—"}</TableCell>
                                        <TableCell>{getDifficultyBadge(question.difficulty)}</TableCell>
                                        <TableCell>{question.marks}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditDialog(question)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(question._id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingQuestion ? "Edit Question" : "Create New Question"}
                        </DialogTitle>
                        <DialogDescription>
                            Add question details, options, and metadata
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Question Type & Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Question Type <span className="text-red-500">*</span></Label>
                                <NativeSelect
                                    value={formData.questionType}
                                    onValueChange={(val) => setFormData({ ...formData, questionType: val })}
                                    placeholder="Select type"
                                    options={questionTypeOptions}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <NativeSelect
                                    value={formData.difficulty}
                                    onValueChange={(val) => setFormData({ ...formData, difficulty: val })}
                                    placeholder="Select difficulty"
                                    options={difficultyOptions}
                                />
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2">
                            <Label>Question Text <span className="text-red-500">*</span></Label>
                            <Textarea
                                placeholder="Enter your question here..."
                                value={formData.questionText}
                                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* MCQ Options */}
                        {formData.questionType === 'mcq' && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Answer Options <span className="text-red-500">*</span></Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                                        <Plus className="h-4 w-4 mr-1" /> Add Option
                                    </Button>
                                </div>
                                {formData.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${option.isCorrect
                                                ? 'border-green-500 bg-green-500 text-white'
                                                : 'border-gray-300 hover:border-green-400'
                                                }`}
                                            onClick={() => handleOptionChange(index, 'isCorrect', true)}
                                        >
                                            {option.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                                        </div>
                                        <Input
                                            placeholder={`Option ${index + 1}`}
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                            className="flex-1"
                                        />
                                        {formData.options.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeOption(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <p className="text-xs text-muted-foreground">
                                    Click the circle to mark the correct answer
                                </p>
                            </div>
                        )}

                        {/* True/False */}
                        {formData.questionType === 'true-false' && (
                            <div className="space-y-2">
                                <Label>Correct Answer <span className="text-red-500">*</span></Label>
                                <NativeSelect
                                    value={formData.correctAnswer}
                                    onValueChange={(val) => setFormData({ ...formData, correctAnswer: val })}
                                    placeholder="Select correct answer"
                                    options={[
                                        { value: 'true', label: 'True' },
                                        { value: 'false', label: 'False' }
                                    ]}
                                />
                            </div>
                        )}

                        {/* Short/Long Answer */}
                        {(formData.questionType === 'short' || formData.questionType === 'long' || formData.questionType === 'fill-blank') && (
                            <div className="space-y-2">
                                <Label>Expected Answer / Keywords</Label>
                                <Textarea
                                    placeholder="Enter the expected answer or keywords for grading reference..."
                                    value={formData.correctAnswer}
                                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Explanation */}
                        <div className="space-y-2">
                            <Label>Explanation (shown after answering)</Label>
                            <Textarea
                                placeholder="Explain why this is the correct answer..."
                                value={formData.explanation}
                                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            />
                        </div>

                        {/* Marks & Subject */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Marks</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={formData.marks}
                                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Negative Marks</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={formData.negativeMark}
                                    onChange={(e) => setFormData({ ...formData, negativeMark: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <NativeSelect
                                    value={formData.subject}
                                    onValueChange={(val) => setFormData({ ...formData, subject: val })}
                                    placeholder="Select subject"
                                    options={subjectOptions}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Class Level</Label>
                                <NativeSelect
                                    value={formData.classLevel}
                                    onValueChange={(val) => setFormData({ ...formData, classLevel: val })}
                                    placeholder="Select class"
                                    options={classOptions}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label>Tags (comma-separated)</Label>
                            <Input
                                placeholder="e.g., algebra, equations, chapter-1"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingQuestion ? "Update Question" : "Create Question"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
