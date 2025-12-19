"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Send, Search, User, MoreVertical, Paperclip, Smile } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function StudentCommunicationPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Simulate loading contacts
        setTimeout(() => {
            const mockContacts = [
                { id: 1, name: "Dr. Sarah Wilson", role: "Mathematics Teacher", lastMsg: "Don't forget the calculus quiz tomorrow.", time: "10:30 AM", avatar: "SW", unread: 2 },
                { id: 2, name: "Mr. James Bond", role: "History Teacher", lastMsg: "Your essay on the Cold War was excellent.", time: "Yesterday", avatar: "JB", unread: 0 },
                { id: 3, name: "School Administration", role: "Office", lastMsg: "Term fees payment is due next week.", time: "2 days ago", avatar: "SA", unread: 0 },
            ];
            setMessages(mockContacts);
            setActiveChat(mockContacts[0]);
            setLoading(false);
        }, 800);
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        toast.info("Messaging feature is in development mode.");
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-100">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        Communication Hub
                    </h1>
                    <p className="text-slate-500">Connect with your teachers and school administration.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">New Message</Button>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Contacts List */}
                <Card className="w-80 border-none shadow-xl shadow-slate-200/50 flex flex-col">
                    <div className="p-4 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search messages..." className="pl-9 h-9 rounded-lg border-slate-200" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {messages.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => setActiveChat(contact)}
                                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${activeChat?.id === contact.id ? "bg-indigo-50" : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                                    {contact.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-sm text-slate-900 truncate">{contact.name}</p>
                                        <span className="text-[10px] text-slate-400">{contact.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{contact.lastMsg}</p>
                                </div>
                                {contact.unread > 0 && (
                                    <div className="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                                        {contact.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 border-none shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                                        {activeChat.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{activeChat.name}</p>
                                        <p className="text-xs text-slate-500">{activeChat.role} • Online</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                                <div className="flex justify-center">
                                    <Badge variant="outline" className="bg-white/80 border-slate-200 text-slate-400 font-medium">Yesterday</Badge>
                                </div>

                                <div className="flex gap-3 max-w-[80%]">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0 mt-1" />
                                    <div className="p-4 rounded-2xl rounded-tl-none bg-white shadow-sm border border-slate-100">
                                        <p className="text-sm text-slate-800 leading-relaxed">
                                            Hi everyone, I've noticed some confusion about the grading criteria for the last history project. I'll be holding a 30-minute review session tomorrow after lunch.
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">02:15 PM</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 shrink-0 mt-1" />
                                    <div className="p-4 rounded-2xl rounded-tr-none bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                                        <p className="text-sm leading-relaxed font-medium">
                                            Thank you Mr. James! Will it be in the same classroom?
                                        </p>
                                        <p className="text-[10px] text-indigo-200 mt-2 font-bold uppercase tracking-wider">Read • 04:30 PM</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 max-w-[80%]">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0 mt-1" />
                                    <div className="p-4 rounded-2xl rounded-tl-none bg-white shadow-sm border border-slate-100">
                                        <p className="text-sm text-slate-800 leading-relaxed">
                                            Yes, Grade 10-A classroom. See you there!
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">05:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white border-t border-slate-50">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-indigo-500 pr-20"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Paperclip className="h-4 w-4" />
                                            </button>
                                            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Smile className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <Button type="submit" className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 p-0">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <div className="p-6 rounded-full bg-slate-50">
                                <MessageSquare className="h-12 w-12 text-slate-200" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-slate-700">Select a conversation</h3>
                                <p className="text-sm text-slate-400">Choose a contact from the left to start messaging.</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
