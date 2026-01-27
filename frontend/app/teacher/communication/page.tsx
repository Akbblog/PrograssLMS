"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Plus } from "lucide-react";
import ConversationList from "@/components/communication/ConversationList";
import ChatWindow from "@/components/communication/ChatWindow";
import NewChatDialog from "@/components/communication/NewChatDialog";

export default function TeacherCommunicationPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showConversationList, setShowConversationList] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("direct");

    const { conversations, fetchConversations, isLoading, unreadCounts } = useChatStore();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        // Fetch conversations
        fetchConversations();

        return () => window.removeEventListener("resize", checkMobile);
    }, [fetchConversations]);

    const handleSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        if (isMobile) {
            setShowConversationList(false);
        }
    };

    const handleBackToList = () => {
        setShowConversationList(true);
        setSelectedConversationId(null);
    };

    const handleNewChat = () => {
        setIsNewChatOpen(true);
    };

    const handleConversationCreated = (conversation: any) => {
        setSelectedConversationId(conversation.id);
        if (isMobile) {
            setShowConversationList(false);
        }
    };

    // Filter conversations by type
    const filteredConversations = conversations.filter((conv) => {
        if (activeTab === "direct") return conv.type === "direct";
        if (activeTab === "group") return conv.type === "group";
        return true;
    });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-100">
                            <MessageSquare className="h-6 w-6 text-green-600" />
                        </div>
                        Communication
                    </h1>
                    <p className="text-slate-500 mt-2">Manage direct messages and group conversations with students.</p>
                </div>
                <Button onClick={handleNewChat} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" /> New Message
                </Button>
            </div>

            <div className="space-y-6">
                {/* Tabs for conversation type */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-100 p-1 rounded-xl h-12 w-full max-w-md">
                        <TabsTrigger value="direct" className="rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" /> Direct Messages
                        </TabsTrigger>
                        <TabsTrigger value="group" className="rounded-lg h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1">
                            <Users className="h-4 w-4 mr-2" /> Group Chats
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="direct" className="h-[calc(100vh-250px)] bg-white rounded-xl border border-slate-200 overflow-hidden flex mt-4">
                        {/* Conversation List */}
                        {(!isMobile || showConversationList) && (
                            <div className={`${isMobile ? "w-full" : "w-80"} border-r border-slate-200 flex flex-col`}>
                                <ConversationList
                                    conversations={filteredConversations}
                                    activeConversationId={selectedConversationId}
                                    unreadCounts={unreadCounts}
                                    onConversationSelect={handleSelectConversation}
                                    onNewChat={handleNewChat}
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                />
                            </div>
                        )}

                        {/* Chat Area */}
                        {selectedConversationId && (!isMobile || !showConversationList) && (
                            <div className="flex-1 flex flex-col">
                                <ChatWindow conversationId={selectedConversationId} onBack={handleBackToList} />
                            </div>
                        )}

                        {/* Empty State */}
                        {!selectedConversationId && !isMobile && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div className="p-4 rounded-full bg-slate-100 inline-block">
                                        <MessageSquare className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No conversation selected</h3>
                                    <p className="text-slate-500">Select a conversation or start a new message</p>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="group" className="h-[calc(100vh-250px)] bg-white rounded-xl border border-slate-200 overflow-hidden flex mt-4">
                        {/* Conversation List */}
                        {(!isMobile || showConversationList) && (
                            <div className={`${isMobile ? "w-full" : "w-80"} border-r border-slate-200 flex flex-col`}>
                                <ConversationList
                                    conversations={filteredConversations}
                                    activeConversationId={selectedConversationId}
                                    unreadCounts={unreadCounts}
                                    onConversationSelect={handleSelectConversation}
                                    onNewChat={handleNewChat}
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                />
                            </div>
                        )}

                        {/* Chat Area */}
                        {selectedConversationId && (!isMobile || !showConversationList) && (
                            <div className="flex-1 flex flex-col">
                                <ChatWindow conversationId={selectedConversationId} onBack={handleBackToList} />
                            </div>
                        )}

                        {/* Empty State */}
                        {!selectedConversationId && !isMobile && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div className="p-4 rounded-full bg-slate-100 inline-block">
                                        <Users className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No group selected</h3>
                                    <p className="text-slate-500">Select a group chat or create a new one</p>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} onConversationCreated={handleConversationCreated} />
        </div>
    );
}
