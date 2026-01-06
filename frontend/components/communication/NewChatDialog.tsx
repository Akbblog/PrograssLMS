"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Users, MessageSquare } from "lucide-react"
import { adminAPI } from "@/lib/api/endpoints"
import { useChatStore } from "@/store/chatStore"
import { toast } from "sonner"

const newChatSchema = z.object({
    type: z.enum(["direct", "group"]),
    name: z.string().optional(),
    description: z.string().optional(),
    participants: z.array(z.string()).min(1, "Select at least one participant"),
})

type NewChatForm = z.infer<typeof newChatSchema>

interface User {
    _id: string
    name: string
    email: string
    role: string
    avatar?: string
}

interface NewChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConversationCreated?: (conversation: any) => void
}

export default function NewChatDialog({
    open,
    onOpenChange,
    onConversationCreated
}: NewChatDialogProps) {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [chatType, setChatType] = useState<"direct" | "group">("direct")

    const { createConversation } = useChatStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<NewChatForm>({
        resolver: zodResolver(newChatSchema),
        defaultValues: {
            type: "direct",
            participants: [],
        },
    })

    // Fetch users when dialog opens
    useEffect(() => {
        if (open) {
            fetchUsers()
        } else {
            // Reset form when dialog closes
            reset()
            setSelectedUsers([])
            setSearchTerm("")
            setChatType("direct")
        }
    }, [open, reset])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const [adminsRes, teachersRes, studentsRes] = await Promise.all([
                adminAPI.getAdmins(),
                adminAPI.getTeachers(),
                adminAPI.getStudents(),
            ])

            const admins = (adminsRes.data?.admins || []).map((admin: any) => ({
                ...admin,
                role: "admin"
            }))
            const teachers = (teachersRes.data?.teachers || []).map((teacher: any) => ({
                ...teacher,
                role: "teacher"
            }))
            const students = (studentsRes.data?.students || []).map((student: any) => ({
                ...student,
                role: "student"
            }))

            setUsers([...admins, ...teachers, ...students])
        } catch (error) {
            console.error("Failed to fetch users:", error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev => {
            const newSelected = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]

            // For direct messages, limit to 1 participant
            if (chatType === "direct" && newSelected.length > 1) {
                return [newSelected[newSelected.length - 1]]
            }

            setValue("participants", newSelected)
            return newSelected
        })
    }

    const handleTypeChange = (type: "direct" | "group") => {
        setChatType(type)
        setValue("type", type)

        // Reset participants if switching to direct and multiple selected
        if (type === "direct" && selectedUsers.length > 1) {
            setSelectedUsers([selectedUsers[0]])
            setValue("participants", [selectedUsers[0]])
        }
    }

    const onSubmit = async (data: NewChatForm) => {
        try {
            setLoading(true)

            // For direct messages, use the first participant
            const participantIds = data.type === "direct"
                ? [data.participants[0]]
                : data.participants

            const conversation = await createConversation(
                participantIds,
                data.name || undefined
            )

            toast.success(
                data.type === "direct"
                    ? "Direct message created successfully"
                    : "Group created successfully"
            )

            onConversationCreated?.(conversation)
            onOpenChange(false)
        } catch (error: any) {
            console.error("Failed to create conversation:", error)
            toast.error(error.response?.data?.message || "Failed to create conversation")
        } finally {
            setLoading(false)
        }
    }

    const getUserRoleColor = (role: string) => {
        switch (role) {
            case "admin": return "bg-red-100 text-red-800"
            case "teacher": return "bg-blue-100 text-blue-800"
            case "student": return "bg-green-100 text-green-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Start New Conversation</DialogTitle>
                    <DialogDescription>
                        Create a direct message or group chat
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs value={chatType} onValueChange={(value) => handleTypeChange(value as "direct" | "group")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="direct" className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Direct Message
                            </TabsTrigger>
                            <TabsTrigger value="group" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Group Chat
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="direct" className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Send a private message to one person
                            </div>
                        </TabsContent>

                        <TabsContent value="group" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Group Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter group name"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the purpose of this group"
                                    rows={2}
                                    {...register("description")}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* User Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Select Participants</Label>
                            {selectedUsers.length > 0 && (
                                <Badge variant="secondary">
                                    {selectedUsers.length} selected
                                </Badge>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* User List */}
                        <ScrollArea className="h-64 border rounded-md">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : (
                                <div className="p-4 space-y-2">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                            onClick={() => handleUserToggle(user._id)}
                                        >
                                            <Checkbox
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => handleUserToggle(user._id)}
                                            />
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={`text-xs ${getUserRoleColor(user.role)}`}
                                            >
                                                {user.role}
                                            </Badge>
                                        </div>
                                    ))}
                                    {filteredUsers.length === 0 && !loading && (
                                        <div className="text-center text-muted-foreground py-8">
                                            No users found
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {errors.participants && (
                            <p className="text-sm text-red-600">{errors.participants.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || selectedUsers.length === 0}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {chatType === "direct" ? "Start Chat" : "Create Group"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}