"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Plus, Search, FileText, Download, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function TeacherMaterialsPage() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const materials = [
        { id: 1, name: "Calculus_Basics_Lec1.pdf", type: "PDF", size: "2.4 MB", date: "Oct 01, 2024", downloads: 45 },
        { id: 2, name: "World_History_Quiz_Prep.docx", type: "DOCX", size: "1.1 MB", date: "Yesterday", downloads: 12 },
        { id: 3, name: "Molecular_Biology_Diagrams.zip", type: "ZIP", size: "15.8 MB", date: "Sep 28, 2024", downloads: 88 },
        { id: 4, name: "Final_Revision_Schedule.xlsx", type: "XLSX", size: "0.5 MB", date: "Sep 25, 2024", downloads: 30 },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-indigo-700">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-100">
                            <BookOpen className="h-6 w-6 text-orange-600" />
                        </div>
                        Teaching Materials
                    </h1>
                    <p className="text-slate-500 mt-2">Upload and manage course resources, presentations, and documents.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-11 px-6 border-slate-200">New Folder</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl font-bold">
                        <Plus className="h-4 w-4 mr-2" /> Upload Files
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by filename or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 rounded-xl bg-slate-50/50 border-none shadow-none focus-visible:ring-indigo-500"
                    />
                </div>
                <Badge variant="outline" className="h-11 px-4 rounded-xl border-slate-100 bg-slate-50 text-slate-500">All Files (24)</Badge>
                <Badge variant="outline" className="h-11 px-4 rounded-xl border-slate-100 bg-slate-50 text-slate-500 underline underline-offset-4 decoration-indigo-400">PDFs</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {materials.map((file) => (
                    <Card key={file.id} className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all group overflow-hidden">
                        <CardHeader className="text-center p-8 bg-slate-50/50">
                            <div className="h-16 w-16 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform bg-gradient-to-br from-white to-slate-50 border border-slate-100">
                                <FileText className={`h-8 w-8 ${file.type === 'PDF' ? 'text-red-500' :
                                        file.type === 'ZIP' ? 'text-amber-500' :
                                            file.type === 'DOCX' ? 'text-blue-500' : 'text-green-500'
                                    }`} />
                            </div>
                            <p className="text-sm font-bold text-slate-900 mt-4 line-clamp-1">{file.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{file.type} • {file.size}</p>
                        </CardHeader>
                        <CardContent className="p-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                <Download className="h-3 w-3" /> {file.downloads}
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Share2 className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
                <CardContent className="p-12 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                        <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto">
                            <Download className="h-6 w-6 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-700">Storage Status</h3>
                        <p className="text-sm text-slate-400">You have used 1.2 GB of your 5 GB teaching materials storage quota.</p>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '24%' }} />
                        </div>
                        <Button variant="link" className="text-indigo-600 font-bold">Manage Storage</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
