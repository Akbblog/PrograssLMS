"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Search,
    Plus,
    Hash,
    MessageCircle,
    Bell,
    MoreVertical,
    Pin,
    VolumeX,
    Archive
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Participant {
    userId: string
    userType: 'admin' | 'teacher' | 'student' | 'parent'
    role: 'admin' | 'member'
    joinedAt: string
    lastReadAt: string | null
    user?: any
}

interface LastMessage {
    content: string
    senderId: string
    sentAt: string
    type: 'text' | 'image' | 'file' | 'audio' | 'system'
}

interface Conversation {
    id: string
    schoolId: string
    type: 'direct' | 'group'
    name?: string
    avatar?: string
    participants: Participant[]
    lastMessage: LastMessage
    settings: {
        mutedBy: string[]
        pinnedBy: string[]
    }
    createdAt: string
    updatedAt: string
}

interface ConversationListProps {
    conversations: Conversation[]
    activeConversationId: string | null
    unreadCounts: Record<string, number>
    onConversationSelect: (conversationId: string) => void
    onNewChat: () => void
    searchTerm: string
    onSearchChange: (term: string) => void
}

export default function ConversationList({
    conversations,
    activeConversationId,
    unreadCounts,
    onConversationSelect,
    onNewChat,
    searchTerm,
    onSearchChange
}: ConversationListProps) {
    const [activeTab, setActiveTab] = useState<"all" | "unread" | "groups" | "archived">("all")

    const safeConversations = Array.isArray(conversations) ? conversations : []

    const filteredConversations = safeConversations.filter(conv => {
        // Search filter
        const matchesSearch = !searchTerm ||
            conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())

        // Tab filter
        let matchesTab = true
        switch (activeTab) {
            case "unread":
                matchesTab = (unreadCounts[conv.id] || 0) > 0
                break
            case "groups":
                matchesTab = conv.type === "group"
                break
            case "archived":
                matchesTab = false // TODO: implement archived status
                break
            default:
                matchesTab = true
        }

        return matchesSearch && matchesTab
    })

    // Sort conversations: pinned first, then by last message timestamp
    const sortedConversations = filteredConversations.sort((a, b) => {
        // TODO: implement pinned logic
        const aTime = new Date(a.lastMessage?.sentAt || a.updatedAt).getTime()
        const bTime = new Date(b.lastMessage?.sentAt || b.updatedAt).getTime()
        return bTime - aTime
    })

    const formatLastMessageTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: false })
        } catch {
            return ""
        }
    }

    const getConversationDisplayName = (conv: Conversation) => {
        if (conv.name && conv.name.trim().length) return conv.name

        // If participants include hydrated user objects, prefer the other participant for direct chats
        try {
            if (conv.type === 'direct' && Array.isArray(conv.participants)) {
                const other = conv.participants.find((p: any) => {
                    const uid = p?.user?._id || p?.user?.id || p?.user
                    // If uid equals conv.id (unlikely) skip; we don't have currentUser here so pick first non-null
                    return uid
                })
                if (other) return other.user?.name || other.user?.email || 'Direct Message'
            }
        } catch (e) {
            // ignore
        }

        // Group fallback: show participant names or member count
        const names = (conv.participants || [])
            .map((p: any) => p?.user?.name || p?.user?.email || null)
            .filter(Boolean)
        if (names.length > 0) return names.slice(0, 2).join(', ') + (names.length > 2 ? ` +${names.length - 2}` : '')

        return 'Conversation'
    }

    const getConversationAvatar = (conv: Conversation) => {
        if (conv.avatar) {
            return <AvatarImage src={conv.avatar} alt={conv.name || "Conversation"} />
        }
        return (
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {conv.type === "group" ? "#" : getConversationDisplayName(conv).charAt(0)}
            </AvatarFallback>
        )
    }

    return (
        <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
                    <Button
                        size="sm"
                        onClick={onNewChat}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                        <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
                        <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {sortedConversations.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        sortedConversations.map((conv) => {
                            const unreadCount = unreadCounts[conv.id] || 0
                            const isActive = activeConversationId === conv.id

                            return (
                                <div
                                    key={conv.id}
                                    className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                                        isActive ? "bg-blue-50 border border-blue-200" : ""
                                    }`}
                                    onClick={() => onConversationSelect(conv.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <Avatar className="w-12 h-12">
                                                {getConversationAvatar(conv)}
                                            </Avatar>
                                            {/* Online indicator for direct messages */}
                                            {conv.type === "direct" && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`text-sm font-medium truncate ${
                                                    unreadCount > 0 ? "text-slate-900" : "text-slate-700"
                                                }`}>
                                                    {getConversationDisplayName(conv)}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    {conv.lastMessage?.sentAt && (
                                                        <span className="text-xs text-slate-500">
                                                            {formatLastMessageTime(conv.lastMessage.sentAt)}
                                                        </span>
                                                    )}
                                                    {/* Menu */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MoreVertical className="w-3 h-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Pin className="w-4 h-4 mr-2" />
                                                                Pin conversation
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <VolumeX className="w-4 h-4 mr-2" />
                                                                Mute notifications
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Archive className="w-4 h-4 mr-2" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-slate-500 truncate flex-1 mr-2">
                                                    {conv.lastMessage?.content || "No messages yet"}
                                                </p>
                                                {unreadCount > 0 && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="h-5 min-w-[20px] text-xs flex items-center justify-center"
                                                    >
                                                        {unreadCount > 99 ? "99+" : unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}