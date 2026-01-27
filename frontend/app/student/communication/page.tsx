"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import ConversationList from "@/components/communication/ConversationList";
import ChatWindow from "@/components/communication/ChatWindow";
import NewChatDialog from "@/components/communication/NewChatDialog";

export default function StudentCommunicationPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showConversationList, setShowConversationList] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);

    const { conversations, fetchConversations, isLoading, unreadCounts } = useChatStore();

    useEffect(() => {
        // Check if mobile
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

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-100">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        Messages
                    </h1>
                    <p className="text-slate-500 mt-2">Connect with your teachers and school.</p>
                </div>
                <Button onClick={handleNewChat} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" /> New Message
                </Button>
            </div>

            <div className="h-[calc(100vh-200px)] bg-white rounded-xl border border-slate-200 overflow-hidden flex">
                {/* Conversation List */}
                {(!isMobile || showConversationList) && (
                    <div className={`${isMobile ? "w-full" : "w-80"} border-r border-slate-200 flex flex-col`}>
                        <ConversationList
                            conversations={conversations}
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
                            <p className="text-slate-500">Select a conversation or create a new message to get started</p>
                        </div>
                    </div>
                )}
            </div>

            <NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} onConversationCreated={handleConversationCreated} />
        </div>
    );
}
