"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import MessageInput from "./MessageInput"
import { useChatStore } from "@/store/chatStore"

interface ChatWindowProps {
    conversationId: string
    onBack?: () => void
}

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const {
        messages,
        activeConversationId,
        fetchMessages,
        markAsRead,
        replyingTo,
        setReplyingTo
    } = useChatStore()

    const conversationMessages = messages[conversationId] || []

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [conversationMessages])

    // Fetch messages when conversation changes
    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId)
            markAsRead(conversationId)
        }
    }, [conversationId, fetchMessages, markAsRead])

    // Group messages by date
    const groupedMessages = conversationMessages.reduce((groups, message) => {
        const date = format(new Date(message.createdAt), 'yyyy-MM-dd')
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(message)
        return groups
    }, {} as Record<string, typeof conversationMessages>)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return "Today"
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday"
        } else {
            return format(date, 'MMMM d, yyyy')
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <ChatHeader conversationId={conversationId} onBack={onBack} />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date}>
                            {/* Date separator */}
                            <div className="flex items-center justify-center my-4">
                                <div className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                                    {formatDate(date)}
                                </div>
                            </div>

                            {/* Messages for this date */}
                            <div className="space-y-2">
                                {dateMessages.map((message, index) => {
                                    const prevMessage = dateMessages[index - 1]
                                    const nextMessage = dateMessages[index + 1]

                                    // Group messages from same sender within 5 minutes
                                    const isGrouped =
                                        prevMessage &&
                                        prevMessage.senderId === message.senderId &&
                                        new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 5 * 60 * 1000

                                    const showAvatar = !isGrouped

                                    return (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            showAvatar={showAvatar}
                                            isGrouped={isGrouped}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicators would go here */}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Message Input */}
            <MessageInput
                conversationId={conversationId}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
            />
        </div>
    )
}