"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Phone,
    Video,
    Search,
    MoreVertical,
    VolumeX,
    UserX,
    MessageSquare,
    Trash2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
    conversationId: string
    onBack?: () => void
}

export default function ChatHeader({ conversationId, onBack }: ChatHeaderProps) {
    // This would come from the chat store or API
    const conversation = {
        id: conversationId,
        name: "Sample Conversation",
        type: "group" as "direct" | "group",
        avatar: null,
        participants: [],
        isOnline: true,
        lastSeen: "2 hours ago"
    }

    const handleMute = () => {
        // TODO: implement mute functionality
        console.log("Mute conversation")
    }

    const handleBlock = () => {
        // TODO: implement block functionality
        console.log("Block user")
    }

    const handleClearChat = () => {
        // TODO: implement clear chat functionality
        console.log("Clear chat")
    }

    const handleDeleteChat = () => {
        // TODO: implement delete chat functionality
        console.log("Delete chat")
    }

    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Back button for mobile */}
                {onBack && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="lg:hidden"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                )}

                {/* Avatar */}
                <Avatar className="w-10 h-10">
                    {conversation.avatar ? (
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {conversation.name.charAt(0)}
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                        {conversation.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        {conversation.type === "direct" ? (
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${conversation.isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                                <span className="text-xs text-slate-500">
                                    {conversation.isOnline ? "Online" : `Last seen ${conversation.lastSeen}`}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-500">
                                {conversation.participants.length} members
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                {/* Voice Call */}
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Phone className="w-4 h-4" />
                </Button>

                {/* Video Call */}
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Video className="w-4 h-4" />
                </Button>

                {/* Search in chat */}
                <Button variant="ghost" size="sm">
                    <Search className="w-4 h-4" />
                </Button>

                {/* More menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleMute}>
                            <VolumeX className="w-4 h-4 mr-2" />
                            Mute notifications
                        </DropdownMenuItem>
                        {conversation.type === "direct" && (
                            <DropdownMenuItem onClick={handleBlock}>
                                <UserX className="w-4 h-4 mr-2" />
                                Block user
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleClearChat}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Clear chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDeleteChat}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete chat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}