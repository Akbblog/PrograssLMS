"use client"

import { useState, useEffect } from "react"
import { useChatStore } from "@/store/chatStore"
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import ConversationList from "@/components/communication/ConversationList"
import ChatWindow from "@/components/communication/ChatWindow"
import NewChatDialog from "@/components/communication/NewChatDialog"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare } from "lucide-react"

export default function CommunicationPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showConversationList, setShowConversationList] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isNewChatOpen, setIsNewChatOpen] = useState(false)

    const { conversations, fetchConversations, unreadCounts } = useChatStore()

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        // Fetch conversations
        fetchConversations()

        return () => window.removeEventListener('resize', checkMobile)
    }, [fetchConversations])

    const handleSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId)
        if (isMobile) {
            setShowConversationList(false)
        }
    }

    const handleBackToList = () => {
        setShowConversationList(true)
        setSelectedConversationId(null)
    }

    const handleNewChat = () => {
        setIsNewChatOpen(true)
    }

    const handleConversationCreated = (conversation: any) => {
        setSelectedConversationId(conversation.id)
        if (isMobile) {
            setShowConversationList(false)
        }
    }

    return (
        <AdminPageLayout
            title="Communication"
            description="Manage conversations and messaging with students, teachers, and staff"
        >
            <div className="h-[calc(100vh-12rem)] bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="flex h-full">
                    {/* Conversation List */}
                    {(!isMobile || showConversationList) && (
                        <div className={`${isMobile ? 'w-full' : 'w-80'} border-r border-slate-200 flex flex-col`}>
                            <div className="p-4 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Messages</h2>
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={handleNewChat}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Chat
                                    </Button>
                                </div>
                            </div>
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

                    {/* Chat Window */}
                    {(!isMobile || !showConversationList) && selectedConversationId && (
                        <div className={`${isMobile ? 'w-full' : 'flex-1'} flex flex-col`}>
                            <ChatWindow
                                conversationId={selectedConversationId}
                                onBack={isMobile ? handleBackToList : undefined}
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {(!isMobile || showConversationList) && !selectedConversationId && (
                        <div className={`${isMobile ? 'hidden' : 'flex-1'} flex items-center justify-center bg-slate-50`}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-600 mb-2">
                                    Select a conversation
                                </h3>
                                <p className="text-slate-500">
                                    Choose a conversation from the list to start messaging
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Chat Dialog */}
            <NewChatDialog
                open={isNewChatOpen}
                onOpenChange={setIsNewChatOpen}
                onConversationCreated={handleConversationCreated}
            />
        </AdminPageLayout>
    )
}
