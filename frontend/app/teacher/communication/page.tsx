"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare, Send, Search, Users, Shield, Plus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function TeacherCommunicationPage() {
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Message sent (Simulation)");
        setNewMessage("");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-100">
                            <MessageSquare className="h-6 w-6 text-orange-600" />
                        </div>
                        Teacher Communication
                    </h1>
                    <p className="text-slate-500 mt-2">Manage broadcast announcements and direct messages with students/parents.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl font-bold">
                    <Plus className="h-4 w-4 mr-2" /> New Announcement
                </Button>
            </div>

            <Tabs defaultValue="announcements" className="w-full space-y-6">
                <TabsList className="bg-slate-100 p-1 rounded-xl h-12 w-full max-w-md">
                    <TabsTrigger value="announcements" className="rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1">
                        <Users className="h-4 w-4 mr-2" /> Announcements
                    </TabsTrigger>
                    <TabsTrigger value="direct" className="rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" /> Direct Messages
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="announcements" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Upcoming Math Quiz", target: "Grade 10-A", date: "Today, 09:00 AM", status: "sent", views: 24 },
                            { title: "Project Submission Deadline", target: "Physics Group", date: "Yesterday", status: "sent", views: 42 },
                            { title: "Parent-Teacher Meeting", target: "All Parents", date: "Oct 12, 2024", status: "scheduled", views: 0 },
                        ].map((m, i) => (
                            <Card key={i} className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow overflow-hidden group">
                                <CardHeader className="border-b border-slate-50 relative">
                                    <div className="flex justify-between items-start">
                                        <Badge className={m.status === 'sent' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                                            {m.status.toUpperCase()}
                                        </Badge>
                                        <button className="text-slate-300 hover:text-slate-600">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <CardTitle className="text-base mt-4 line-clamp-1">{m.title}</CardTitle>
                                    <CardDescription>{m.target}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-medium">{m.date}</span>
                                    <span className="flex items-center gap-1 text-slate-500 font-bold">
                                        <Icon name="lucide:eye" className="h-3.5 w-3.5" /> {m.views} views
                                    </span>
                                </CardContent>
                                <div className="h-1 w-full bg-slate-100">
                                    <div className="h-full bg-indigo-500 transition-all group-hover:w-full" style={{ width: m.status === 'sent' ? '100%' : '0%' }} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="direct" className="h-[500px] flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="text-center space-y-3">
                        <div className="p-4 rounded-full bg-white shadow-sm inline-block">
                            <Shield className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-700">Protected Channel</h3>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto">
                            Direct messages with students and parents are end-to-end encrypted and logged for school safety.
                        </p>
                        <Button variant="outline" className="rounded-xl border-slate-200">Open Inbox</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
