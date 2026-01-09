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

import { useEffect, useState } from "react"
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { communicationAPI } from '@/lib/api/endpoints'

interface ChatHeaderProps {
    conversationId: string
    onBack?: () => void
}

export default function ChatHeader({ conversationId, onBack }: ChatHeaderProps) {
    const currentUser = useAuthStore((s) => s.user)
    const conversations = useChatStore((s) => s.conversations)

    const [conversation, setConversation] = useState<any | null>(() =>
        conversations.find((c: any) => (c.id || c._id) === conversationId) || null
    )

    useEffect(() => {
        let mounted = true

        // If we already have conversation from store, ensure state is set
        const fromStore = conversations.find((c: any) => (c.id || c._id) === conversationId)
        if (fromStore) {
            setConversation(fromStore)
            return
        }

        // Otherwise fetch conversation metadata
        const fetchConversation = async () => {
            try {
                const res: any = await communicationAPI.getConversation(conversationId)
                // Backend returns { conversation, messages }
                const conv = res?.data?.conversation || res?.data || res
                if (!mounted) return
                if (conv) {
                    const normalized = {
                        ...conv,
                        id: conv._id ?? conv.id,
                        type: conv.type === 'private' ? 'direct' : conv.type,
                    }
                    setConversation(normalized)
                }
            } catch (err) {
                console.error('Failed to load conversation header:', err)
            }
        }

        fetchConversation()

        return () => { mounted = false }
    }, [conversationId, conversations])

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

                {/* Avatar and Info */}
                <Avatar className="w-10 h-10">
                    {conversation?.avatar ? (
                        <AvatarImage src={conversation.avatar} alt={conversation.name || 'Conversation'} />
                    ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {(() => {
                                // fallback letter: prefer conversation name, otherwise other participant
                                if (conversation?.name && conversation.name.length) return conversation.name.charAt(0)
                                const other = conversation?.participants?.find((p: any) => p?.user?._id !== currentUser?._id)
                                return other?.user?.name?.charAt(0) || other?.user?.email?.charAt(0) || '?'
                            })()}
                        </AvatarFallback>
                    )}
                </Avatar>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                        {(() => {
                            if (!conversation) return 'Conversation'
                            if (conversation.name && conversation.name.trim().length) return conversation.name
                            if (conversation.type === 'direct') {
                                // Pick the other participant
                                const other = conversation.participants?.find((p: any) => p?.user?._id !== currentUser?._id)
                                return other?.user?.name || other?.user?.email || 'Direct Message'
                            }
                            // Group fallback: show participant names or member count
                            const names = (conversation.participants || []).map((p: any) => p?.user?.name).filter(Boolean)
                            if (names.length > 0) return names.slice(0, 2).join(', ') + (names.length > 2 ? ` +${names.length - 2}` : '')
                            return `${conversation.participants?.length || 0} members`
                        })()}
                    </h3>
                    <div className="flex items-center gap-2">
                        {conversation?.type === 'direct' ? (
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${conversation?.isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                                <span className="text-xs text-slate-500">
                                    {conversation?.isOnline ? 'Online' : `Last seen ${conversation?.lastSeen || 'unknown'}`}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-500">
                                {conversation?.participants?.length || 0} members
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