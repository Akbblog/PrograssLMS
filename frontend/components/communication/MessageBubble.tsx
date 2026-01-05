"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Check,
    CheckCheck,
    Clock,
    Download,
    File,
    Image as ImageIcon,
    MoreVertical,
    Reply,
    Forward,
    Copy,
    Star,
    Trash2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/store/chatStore"

interface Attachment {
    type: 'image' | 'file' | 'audio'
    url: string
    name: string
    size: number
    mimeType: string
    thumbnail?: string
}

interface MessageReaction {
    emoji: string
    userId: string
    createdAt: string
}

interface Message {
    id: string
    conversationId: string
    senderId: string
    senderType: 'admin' | 'teacher' | 'student' | 'parent'
    type: 'text' | 'image' | 'file' | 'audio' | 'system'
    content: string
    attachments: Attachment[]
    replyTo?: string
    reactions: MessageReaction[]
    status: {
        sent: boolean
        deliveredTo: string[]
        readBy: string[]
    }
    deletedFor: string[]
    deletedForEveryone: boolean
    editedAt?: string
    createdAt: string
}

interface MessageBubbleProps {
    message: Message
    showAvatar: boolean
    isGrouped: boolean
}

export default function MessageBubble({ message, showAvatar, isGrouped }: MessageBubbleProps) {
    const [showMenu, setShowMenu] = useState(false)
    const { setReplyingTo, deleteMessage, addReaction } = useChatStore()

    // Mock sender data - this would come from API
    const sender = {
        name: "John Doe",
        avatar: null
    }

    const isOutgoing = message.senderType === 'admin' // Assuming current user is admin
    const isRead = message.status.readBy.length > 0

    const formatTime = (dateString: string) => {
        return format(new Date(dateString), 'HH:mm')
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleReply = () => {
        setReplyingTo(message)
    }

    const handleDelete = () => {
        // TODO: implement delete confirmation
        deleteMessage(message.id, false)
    }

    const handleAddReaction = (emoji: string) => {
        addReaction(message.id, emoji)
    }

    const renderMessageContent = () => {
        switch (message.type) {
            case 'text':
                return (
                    <div className="whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                )

            case 'image':
                return (
                    <div className="space-y-2">
                        {message.attachments.map((attachment, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="max-w-64 max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                />
                                {message.content && (
                                    <p className="text-sm mt-1">{message.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )

            case 'file':
                return (
                    <div className="space-y-2">
                        {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
                                <File className="w-8 h-8 text-slate-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs text-slate-500">{formatFileSize(attachment.size)}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {message.content && (
                            <p className="text-sm">{message.content}</p>
                        )}
                    </div>
                )

            case 'audio':
                return (
                    <div className="space-y-2">
                        {/* TODO: implement audio player */}
                        <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Audio message</p>
                                <p className="text-xs text-slate-500">0:30</p>
                            </div>
                        </div>
                        {message.content && (
                            <p className="text-sm">{message.content}</p>
                        )}
                    </div>
                )

            default:
                return (
                    <div className="whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                )
        }
    }

    const renderStatusIcon = () => {
        if (!isOutgoing) return null

        if (!message.status.sent) {
            return <Clock className="w-3 h-3 text-slate-400" />
        } else if (!isRead) {
            return <Check className="w-3 h-3 text-slate-400" />
        } else {
            return <CheckCheck className="w-3 h-3 text-blue-500" />
        }
    }

    return (
        <div className={`flex gap-3 group ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar for incoming messages */}
            {!isOutgoing && showAvatar && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                    {sender.avatar ? (
                        <AvatarImage src={sender.avatar} alt={sender.name} />
                    ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {sender.name.charAt(0)}
                        </AvatarFallback>
                    )}
                </Avatar>
            )}

            {/* Message bubble */}
            <div className={`flex flex-col max-w-[70%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
                {/* Sender name for group chats */}
                {!isOutgoing && !isGrouped && (
                    <span className="text-xs text-slate-500 mb-1 px-3">
                        {sender.name}
                    </span>
                )}

                {/* Message content */}
                <div
                    className={`relative px-4 py-2 rounded-2xl shadow-sm ${
                        isOutgoing
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    {renderMessageContent()}

                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
                                >
                                    {reaction.emoji}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Menu button */}
                    <div className={`absolute top-0 ${
                        isOutgoing ? '-left-8' : '-right-8'
                    } opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-slate-100"
                                >
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isOutgoing ? "end" : "start"}>
                                <DropdownMenuItem onClick={handleReply}>
                                    <Reply className="w-4 h-4 mr-2" />
                                    Reply
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddReaction('👍')}>
                                    👍 Like
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddReaction('❤️')}>
                                    ❤️ Love
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddReaction('😂')}>
                                    😂 Laugh
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Forward className="w-4 h-4 mr-2" />
                                    Forward
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Star className="w-4 h-4 mr-2" />
                                    Star
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Timestamp and status */}
                <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
                    isOutgoing ? 'justify-end' : 'justify-start'
                }`}>
                    <span>{formatTime(message.createdAt)}</span>
                    {renderStatusIcon()}
                </div>
            </div>
        </div>
    )
}