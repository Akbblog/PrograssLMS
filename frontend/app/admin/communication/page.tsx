"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import {
    MessageSquare,
    Plus,
    Send,
    Search,
    Users,
    Hash,
    Bell,
    MoreVertical,
    Loader2,
    RefreshCw,
    Trash2,
    UserPlus,
    X,
    Paperclip,
    Image as ImageIcon,
    File,
    Download,
    Smile,
    MessageCircle,
    Settings2,
    CheckCheck,
    Clock,
} from "lucide-react"
import { communicationAPI, adminAPI } from "@/lib/api/endpoints"
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import PageToolbar from '@/components/admin/PageToolbar'

interface Participant {
    user: {
        _id: string
        name: string
        email: string
    }
    userModel: string
    role: string
    canSendMessages: boolean
}

interface Attachment {
    url: string
    type: string
    name: string
    size: number
    mimeType: string
}

interface Conversation {
    _id: string
    name: string
    description: string
    type: "group" | "private" | "announcement"
    groupType?: string
    participants: Participant[]
    lastMessage?: {
        content: string
        sender: string
        sentAt: string
    }
    isActive: boolean
    createdAt: string
}

interface Message {
    _id: string
    sender: {
        _id: string
        name: string
        email: string
    }
    senderModel: string
    content: string
    messageType: string
    attachments?: Attachment[]
    isDeleted: boolean
    createdAt: string
}

interface Teacher {
    _id: string
    name: string
    email: string
}

export default function CommunicationPage() {
    const user = useAuthStore((state) => state.user)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [sending, setSending] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [activeTab, setActiveTab] = useState<"channels" | "direct">("channels")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false)
    const [isDMDialogOpen, setIsDMDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState(0)
    const [showMobileSidebar, setShowMobileSidebar] = useState(false)
    const [newConversation, setNewConversation] = useState({
        name: "",
        description: "",
        type: "group" as "group" | "announcement"
    })

    useEffect(() => {
        fetchConversations()
        fetchTeachers()
    }, [])

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation._id)
        }
    }, [activeConversation?._id])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchConversations = async () => {
        try {
            const res: any = await communicationAPI.getConversations()
            setConversations(res.data || [])
            if (!activeConversation && res.data?.length > 0) {
                setActiveConversation(res.data[0])
            }
        } catch (error) {
            console.error("Failed to load conversations:", error)
            toast.error("Failed to load conversations")
        } finally {
            setLoading(false)
        }
    }

    const fetchTeachers = async () => {
        try {
            const res: any = await adminAPI.getTeachers()
            setTeachers(res.data || [])
        } catch (error) {
            console.error("Failed to load teachers:", error)
        }
    }

    const fetchMessages = async (conversationId: string) => {
        setLoadingMessages(true)
        try {
            const res: any = await communicationAPI.getConversation(conversationId)
            setMessages(res.data?.messages || [])
            await communicationAPI.markAsRead(conversationId)
        } catch (error) {
            console.error("Failed to load messages:", error)
        } finally {
            setLoadingMessages(false)
        }
    }

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && selectedFiles.length === 0) || !activeConversation) return

        setSending(true)
        try {
            // For now, send text message. File upload would require a file upload endpoint
            const messageData: any = {
                content: newMessage || (selectedFiles.length > 0 ? `Shared ${selectedFiles.length} file(s)` : ""),
                messageType: selectedFiles.length > 0 ? "file" : "text",
            }

            // TODO: Implement file upload to get URLs then add attachments
            // if (selectedFiles.length > 0) {
            //     messageData.attachments = await uploadFiles(selectedFiles)
            // }

            await communicationAPI.sendMessage(activeConversation._id, messageData)
            setNewMessage("")
            setSelectedFiles([])
            fetchMessages(activeConversation._id)
            fetchConversations() // Refresh to update last message
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send message")
        } finally {
            setSending(false)
        }
    }

    const handleCreateConversation = async () => {
        if (!newConversation.name.trim()) {
            toast.error("Please enter a channel name")
            return
        }

        try {
            const res: any = await communicationAPI.createConversation({
                name: newConversation.name,
                description: newConversation.description,
                type: newConversation.type,
            })
            toast.success("Channel created successfully")
            setIsCreateDialogOpen(false)
            setNewConversation({ name: "", description: "", type: "group" })
            fetchConversations()
            if (res.data) {
                setActiveConversation(res.data)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create channel")
        }
    }

    const handleStartDM = async (teacherId: string, teacherName: string) => {
        try {
            const res: any = await communicationAPI.createConversation({
                name: `DM with ${teacherName}`,
                type: "private",
                participants: [{
                    user: teacherId,
                    userModel: "Teacher",
                    role: "member",
                    canSendMessages: true,
                }]
            })
            toast.success(`Started conversation with ${teacherName}`)
            setIsDMDialogOpen(false)
            fetchConversations()
            if (res.data) {
                setActiveConversation(res.data)
                setActiveTab("direct")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to start conversation")
        }
    }

    const handleDeleteConversation = async (conversationId: string) => {
        if (!confirm("Are you sure you want to delete this channel? All messages will be permanently deleted.")) {
            return
        }

        try {
            await communicationAPI.deleteConversation(conversationId)
            toast.success("Channel deleted")
            fetchConversations()
            if (activeConversation?._id === conversationId) {
                setActiveConversation(null)
                setMessages([])
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete channel")
        }
    }

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await communicationAPI.deleteMessage(messageId)
            toast.success("Message deleted")
            if (activeConversation) {
                fetchMessages(activeConversation._id)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete message")
        }
    }

    const handleAddMembers = async () => {
        if (!activeConversation || selectedTeachers.length === 0) {
            toast.error("Please select at least one teacher")
            return
        }

        try {
            const participants = selectedTeachers.map(teacherId => ({
                user: teacherId,
                userModel: "Teacher",
                role: "member",
                canSendMessages: true,
            }))
            await communicationAPI.addParticipants(activeConversation._id, participants)
            toast.success("Members added successfully")
            setIsMembersDialogOpen(false)
            setSelectedTeachers([])
            fetchConversations()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add members")
        }
    }

    const handleRemoveMember = async (participantId: string) => {
        if (!activeConversation) return
        if (!confirm("Remove this member from the channel?")) return

        try {
            await communicationAPI.removeParticipant(activeConversation._id, participantId)
            toast.success("Member removed")
            fetchConversations()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to remove member")
        }
    }

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const maxSize = 10 * 1024 * 1024 // 10MB
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large. Max size is 10MB`)
                return false
            }
            return true
        })
        setSelectedFiles(prev => [...prev, ...validFiles])
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const toggleTeacherSelection = (teacherId: string) => {
        setSelectedTeachers(prev =>
            prev.includes(teacherId)
                ? prev.filter(id => id !== teacherId)
                : [...prev, teacherId]
        )
    }

    const getConversationIcon = (type: string, groupType?: string) => {
        if (type === "private") return <MessageCircle className="w-4 h-4" />
        if (groupType === "all_staff" || type === "announcement") return <Bell className="w-4 h-4" />
        return <Hash className="w-4 h-4" />
    }

    const getConversationColor = (type: string, groupType?: string) => {
        if (type === "private") return "bg-emerald-100 text-emerald-600"
        if (groupType === "all_staff" || type === "announcement") return "bg-amber-100 text-amber-600"
        return "bg-indigo-100 text-indigo-600"
    }

    const getAvatarColor = (name: string) => {
        const colors = [
            "from-indigo-500 to-purple-600",
            "from-emerald-500 to-teal-600",
            "from-amber-500 to-orange-600",
            "from-rose-500 to-pink-600",
            "from-blue-500 to-cyan-600",
        ]
        const index = name?.charCodeAt(0) % colors.length || 0
        return colors[index]
    }

    const filteredConversations = conversations.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTab = activeTab === "direct" ? c.type === "private" : c.type !== "private"
        return matchesSearch && matchesTab
    })

    const availableTeachers = teachers.filter(teacher =>
        !activeConversation?.participants?.some(p => p.user?._id === teacher._id)
    )

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m`
        if (diffHours < 24) return `${diffHours}h`
        if (diffDays < 7) return `${diffDays}d`
        return date.toLocaleDateString()
    }

    const formatMessageTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (mimeType: string) => {
        if (mimeType?.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
        return <File className="w-4 h-4" />
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 animate-pulse"></div>
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-slate-500">Loading conversations...</p>
                </div>
            </div>
        )
    }

    return (
        <AdminPageLayout
            title="Communication"
            description="Manage messages and announcements"
            actions={<div className="flex items-center gap-2"><Button onClick={() => setIsCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700"><Plus className="mr-2 h-4 w-4" /> New Channel</Button></div>}
            stats={(
                <>
                    <SummaryStatCard title="Channels" value={conversations.filter(c => c.type !== 'private').length} icon={<Hash className="h-4 w-4 text-white" />} variant="blue" />
                    <SummaryStatCard title="Directs" value={conversations.filter(c => c.type === 'private').length} icon={<MessageCircle className="h-4 w-4 text-white" />} variant="purple" />
                    <SummaryStatCard title="Teachers" value={teachers.length} icon={<Users className="h-4 w-4 text-white" />} variant="green" />
                    <SummaryStatCard title="Unread" value={conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)} icon={<Bell className="h-4 w-4 text-white" />} variant="orange" />
                </>
            )}
        >
        <TooltipProvider>
            <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex-col lg:flex-row">
                {/* Sidebar - Mobile hidden by default, toggle with button */}
                <div className={`w-full lg:w-80 bg-white/80 backdrop-blur-xl border-b lg:border-r border-slate-200/60 flex flex-col shadow-sm transition-all duration-300 ${
                    showMobileSidebar ? 'block' : 'hidden lg:flex'
                }`}>
                    {/* Header */}
                    <div className="p-3 sm:p-4 border-b border-slate-200/60">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Messages</h2>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={fetchConversations}
                                    className="hover:bg-indigo-50 p-1.5 h-auto"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="hover:bg-indigo-50 p-1.5 h-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowMobileSidebar(false)}
                                    className="lg:hidden hover:bg-indigo-50 p-1.5 h-auto"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "channels" | "direct")} className="mb-2 sm:mb-3">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 h-8">
                                <TabsTrigger value="channels" className="text-xs data-[state=active]:bg-white">
                                    <Hash className="w-3 h-3 mr-1" />
                                    Channels
                                </TabsTrigger>
                                <TabsTrigger value="direct" className="text-xs data-[state=active]:bg-white">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Direct
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-8 h-8 text-sm bg-slate-50/80 border-slate-200/60 focus:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* New DM Button */}
                        {activeTab === "direct" && (
                            <Button
                                variant="outline"
                                className="w-full mt-2 border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-xs py-1.5 h-auto"
                                onClick={() => setIsDMDialogOpen(true)}
                            >
                                <Plus className="w-3 h-3 mr-1.5" />
                                New DM
                            </Button>
                        )}
                    </div>

                    {/* Conversation List */}
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            {filteredConversations.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 opacity-50" />
                                    </div>
                                    <p className="text-xs font-medium">No {activeTab === "direct" ? "conversations" : "channels"}</p>
                                    <p className="text-xs mt-0.5 text-slate-400">
                                        {activeTab === "direct" ? "Start a DM" : "Create a channel"}
                                    </p>
                                </div>
                            ) : (
                                filteredConversations.map(conversation => (
                                    <button
                                        key={conversation._id}
                                        onClick={() => {
                                            setActiveConversation(conversation)
                                            setShowMobileSidebar(false)
                                        }}
                                        className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-all duration-200 mb-0.5 group text-xs sm:text-sm ${activeConversation?._id === conversation._id
                                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm border border-indigo-100'
                                                : 'hover:bg-slate-50/80'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0 ${getConversationColor(conversation.type, conversation.groupType)}`}>
                                            {getConversationIcon(conversation.type, conversation.groupType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className={`font-semibold truncate text-xs sm:text-sm ${activeConversation?._id === conversation._id ? 'text-indigo-700' : 'text-slate-800'
                                                    }`}>
                                                    {conversation.name}
                                                </span>
                                                {conversation.lastMessage && (
                                                    <span className="text-[9px] text-slate-400 flex-shrink-0">
                                                        {formatTime(conversation.lastMessage.sentAt)}
                                                    </span>
                                                )}
                                            </div>
                                            {conversation.lastMessage ? (
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {conversation.lastMessage.content}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {conversation.participants?.length || 0} members
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>

                    {/* User Profile */}
                    <div className="p-2 sm:p-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-indigo-50/30">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Avatar className="h-8 h-8 sm:h-10 sm:w-10 ring-2 ring-white shadow-sm">
                                    <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(user?.name || "")} text-white font-semibold text-xs`}>
                                        {user?.name?.charAt(0) || "A"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="flex-1 min-w-0 hidden sm:block">
                                <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{user?.name || "Admin"}</p>
                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-14 sm:h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-3 sm:px-6 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowMobileSidebar(true)}
                                        className="lg:hidden hover:bg-indigo-50 p-1.5 h-auto"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                    <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 ${getConversationColor(activeConversation.type, activeConversation.groupType)}`}>
                                        {getConversationIcon(activeConversation.type, activeConversation.groupType)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">{activeConversation.name}</h3>
                                        <p className="text-xs text-slate-500 truncate">
                                            {activeConversation.participants?.length || 0} members
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {activeConversation.type !== "private" && (
                                        <Button variant="ghost" size="sm" onClick={() => setIsMembersDialogOpen(true)} className="hover:bg-indigo-50 p-1.5 h-auto hidden sm:flex">
                                            <UserPlus className="w-4 h-4 text-indigo-600" />
                                        </Button>
                                    )}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="hover:bg-slate-100 p-1.5 h-auto">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            {activeConversation.type !== "private" && (
                                                <DropdownMenuItem onClick={() => setIsMembersDialogOpen(true)}>
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Manage Members
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() => handleDeleteConversation(activeConversation._id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-3 sm:p-6">
                                <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
                                    {loadingMessages ? (
                                        <div className="flex justify-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                                <span className="text-xs sm:text-sm text-slate-500">Loading...</span>
                                            </div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-12 sm:py-16">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
                                            </div>
                                            <h3 className="text-sm sm:text-lg font-semibold text-slate-700">No messages yet</h3>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Be the first to send a message!</p>
                                        </div>
                                    ) : (
                                        messages.map((message, index) => {
                                            const isOwnMessage = message.sender?._id === user?._id
                                            const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id

                                            return (
                                                <div
                                                    key={message._id}
                                                    className={`flex items-start gap-2 sm:gap-3 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${isOwnMessage ? 'flex-row-reverse' : ''
                                                        } ${message.isDeleted ? 'opacity-50' : ''}`}
                                                >
                                                    {showAvatar ? (
                                                        <Avatar className="h-7 w-7 sm:h-9 sm:w-9 ring-2 ring-white shadow-sm flex-shrink-0">
                                                            <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(message.sender?.name || "")} text-white text-xs font-semibold`}>
                                                                {message.sender?.name?.charAt(0) || "?"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ) : (
                                                        <div className="w-7 sm:w-9 flex-shrink-0" />
                                                    )}
                                                    <div className={`flex-1 max-w-[75%] sm:max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                                                        {showAvatar && (
                                                            <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                                                                <span className="font-semibold text-sm text-slate-900">
                                                                    {message.sender?.name || "Unknown"}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {formatMessageTime(message.createdAt)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className={`relative inline-block ${isOwnMessage ? 'text-left' : ''}`}>
                                                            <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isOwnMessage
                                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                                    : 'bg-white border border-slate-200/60'
                                                                }`}>
                                                                {message.isDeleted ? (
                                                                    <span className="italic text-slate-400 text-sm">Message deleted</span>
                                                                ) : (
                                                                    <>
                                                                        <p className={`text-sm leading-relaxed ${isOwnMessage ? 'text-white' : 'text-slate-700'}`}>
                                                                            {message.content}
                                                                        </p>
                                                                        {/* Attachments */}
                                                                        {message.attachments && message.attachments.length > 0 && (
                                                                            <div className="mt-2 space-y-2">
                                                                                {message.attachments.map((att, i) => (
                                                                                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isOwnMessage ? 'bg-white/20' : 'bg-slate-50'}`}>
                                                                                        {getFileIcon(att.mimeType)}
                                                                                        <span className="text-xs flex-1 truncate">{att.name}</span>
                                                                                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                                                                                            <Download className="w-4 h-4" />
                                                                                        </a>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                            {!message.isDeleted && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className={`absolute -top-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ${isOwnMessage ? '-left-8' : '-right-8'}`}
                                                                    onClick={() => handleDeleteMessage(message._id)}
                                                                >
                                                                    <Trash2 className="w-3 h-3 text-red-500" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
                            <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60">
                                <div className="max-w-4xl mx-auto">
                                    {/* Selected Files Preview */}
                                    {selectedFiles.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
                                                    {file.type.startsWith('image/') ? (
                                                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                                                    ) : (
                                                        <File className="w-4 h-4 text-slate-500" />
                                                    )}
                                                    <span className="text-sm text-slate-700 max-w-[120px] truncate">{file.name}</span>
                                                    <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                                                    <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-end gap-3">
                                        <div className="flex-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100/50 transition-all">
                                            <Textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder={`Message ${activeConversation.type === "private" ? activeConversation.name : "#" + activeConversation.name}...`}
                                                className="min-h-[48px] max-h-32 bg-transparent border-0 resize-none focus-visible:ring-0 text-sm"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handleSendMessage()
                                                    }
                                                }}
                                            />
                                            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200/60">
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        multiple
                                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                                        className="hidden"
                                                    />
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-slate-200/80"
                                                                onClick={() => fileInputRef.current?.click()}
                                                            >
                                                                <Paperclip className="w-4 h-4 text-slate-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Attach file</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-200/80">
                                                                <Smile className="w-4 h-4 text-slate-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Add emoji</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
                                                    size="sm"
                                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                                                >
                                                    {sending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                    <MessageSquare className="w-12 h-12 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700">Select a conversation</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                                    Choose a channel or direct message from the sidebar to start chatting
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Channel Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <Hash className="w-4 h-4 text-indigo-600" />
                                </div>
                                Create Channel
                            </DialogTitle>
                            <DialogDescription>
                                Create a new channel for team discussions
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Channel Name *</Label>
                                <Input
                                    value={newConversation.name}
                                    onChange={(e) => setNewConversation({ ...newConversation, name: e.target.value })}
                                    placeholder="e.g., science-department"
                                    className="focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={newConversation.description}
                                    onChange={(e) => setNewConversation({ ...newConversation, description: e.target.value })}
                                    placeholder="What is this channel about?"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={newConversation.type}
                                    onValueChange={(v: "group" | "announcement") => setNewConversation({ ...newConversation, type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="group">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" />
                                                Group Chat
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="announcement">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4" />
                                                Announcements
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateConversation} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                                Create Channel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Direct Message Dialog */}
                <Dialog open={isDMDialogOpen} onOpenChange={setIsDMDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                                </div>
                                New Direct Message
                            </DialogTitle>
                            <DialogDescription>
                                Start a private conversation with a teacher
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[300px] mt-4">
                            <div className="space-y-1">
                                {teachers.map(teacher => (
                                    <button
                                        key={teacher._id}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                                        onClick={() => handleStartDM(teacher._id, teacher.name)}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(teacher.name)} text-white font-semibold`}>
                                                {teacher.name?.charAt(0) || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-slate-900">{teacher.name}</p>
                                            <p className="text-xs text-slate-500">{teacher.email}</p>
                                        </div>
                                        <MessageCircle className="w-4 h-4 text-slate-400" />
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                {/* Members Dialog */}
                <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Manage Members</DialogTitle>
                            <DialogDescription>
                                Add or remove members from this channel
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs uppercase text-slate-500 font-semibold">Current Members ({activeConversation?.participants?.length || 0})</Label>
                                <ScrollArea className="h-32 mt-2 border rounded-xl">
                                    <div className="p-2">
                                        {activeConversation?.participants?.map(participant => (
                                            <div key={participant.user?._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(participant.user?.name || "")} text-white text-xs`}>
                                                            {participant.user?.name?.charAt(0) || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{participant.user?.name || "Unknown"}</p>
                                                        <p className="text-xs text-slate-500 capitalize">{participant.role}</p>
                                                    </div>
                                                </div>
                                                {participant.role !== "owner" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                                        onClick={() => handleRemoveMember(participant.user?._id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div>
                                <Label className="text-xs uppercase text-slate-500 font-semibold">Add Teachers</Label>
                                <ScrollArea className="h-48 mt-2 border rounded-xl">
                                    <div className="p-2">
                                        {availableTeachers.length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-6">All teachers are already members</p>
                                        ) : (
                                            availableTeachers.map(teacher => (
                                                <div
                                                    key={teacher._id}
                                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedTeachers.includes(teacher._id) ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
                                                        }`}
                                                    onClick={() => toggleTeacherSelection(teacher._id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedTeachers.includes(teacher._id)}
                                                        onCheckedChange={() => toggleTeacherSelection(teacher._id)}
                                                    />
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(teacher.name)} text-white text-xs`}>
                                                            {teacher.name?.charAt(0) || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{teacher.name}</p>
                                                        <p className="text-xs text-slate-500">{teacher.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => {
                                setIsMembersDialogOpen(false)
                                setSelectedTeachers([])
                            }}>
                                Close
                            </Button>
                            <Button
                                onClick={handleAddMembers}
                                disabled={selectedTeachers.length === 0}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add {selectedTeachers.length > 0 ? `${selectedTeachers.length} ` : ''}Member{selectedTeachers.length !== 1 ? 's' : ''}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
        </AdminPageLayout>
    )
}
