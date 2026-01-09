"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogBody,
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
import { unwrapArray } from "@/lib/utils"
import { toast } from "sonner"

const newChatSchema = z
    .object({
        type: z.enum(["direct", "group"]),
        name: z.string().trim().optional(),
        description: z.string().trim().optional(),
        participants: z.array(z.string()),
    })
    .superRefine((val, ctx) => {
        if (val.type === "direct") {
            if (val.participants.length !== 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["participants"],
                    message: "Select exactly one participant for a direct message",
                })
            }
        }

        if (val.type === "group") {
            if (!val.name || val.name.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["name"],
                    message: "Group name is required",
                })
            }
            if (val.participants.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["participants"],
                    message: "Select at least two participants for a group chat",
                })
            }
        }
    })

type NewChatForm = z.infer<typeof newChatSchema>

interface User {
    _id: string
    name: string
    email: string
    role: "admin" | "teacher" | "student"
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

            const normalizeUser = (item: unknown, role: User["role"]): User | null => {
                if (!item || typeof item !== "object") return null
                const record = item as Record<string, unknown>
                const idValue = record._id ?? record.id
                const nameValue = record.name
                const emailValue = record.email

                const _id = typeof idValue === "string" ? idValue : ""
                const name = typeof nameValue === "string" ? nameValue : ""
                const email = typeof emailValue === "string" ? emailValue : ""
                const avatar = typeof record.avatar === "string" ? record.avatar : undefined

                if (!_id || !name || !email) return null
                return { _id, name, email, role, avatar }
            }

            const admins = unwrapArray<unknown>(adminsRes)
                .map((item) => normalizeUser(item, "admin"))
                .filter((u): u is User => Boolean(u))
            const teachers = unwrapArray<unknown>(teachersRes)
                .map((item) => normalizeUser(item, "teacher"))
                .filter((u): u is User => Boolean(u))
            const students = unwrapArray<unknown>(studentsRes)
                .map((item) => normalizeUser(item, "student"))
                .filter((u): u is User => Boolean(u))

            setUsers([...admins, ...teachers, ...students])
        } catch (error) {
            console.error("Failed to fetch users:", error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const name = user.name || ""
        const email = user.email || ""
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev => {
            let nextSelected = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]

            // For direct messages, keep only the most recently selected
            if (chatType === "direct" && nextSelected.length > 1) {
                nextSelected = [userId]
            }

            setValue("participants", nextSelected, { shouldValidate: true })
            return nextSelected
        })
    }

    const handleTypeChange = (type: "direct" | "group") => {
        setChatType(type)
        setValue("type", type, { shouldValidate: true })

        // Reset participants if switching to direct and multiple selected
        if (type === "direct" && selectedUsers.length > 1) {
            setSelectedUsers([selectedUsers[0]])
            setValue("participants", [selectedUsers[0]], { shouldValidate: true })
        }
    }

    const toUserModel = (role: User["role"]): "Admin" | "Teacher" | "Student" => {
        switch (role) {
            case "admin":
                return "Admin"
            case "teacher":
                return "Teacher"
            case "student":
                return "Student"
            default:
                return "Teacher"
        }
    }

    const onSubmit = async (data: NewChatForm) => {
        try {
            setLoading(true)

            const selectedParticipants = data.participants
                .map((id) => {
                    const user = users.find((u) => u._id === id)
                    return {
                        user: id,
                        userModel: toUserModel(user?.role || "teacher"),
                    }
                })

            const conversation = await createConversation(
                selectedParticipants,
                {
                    type: data.type,
                    name: data.type === "group" ? data.name?.trim() : undefined,
                    description: data.type === "group" ? data.description?.trim() : undefined,
                }
            )

            toast.success(
                data.type === "direct"
                    ? "Direct message created successfully"
                    : "Group created successfully"
            )

            onConversationCreated?.(conversation)
            onOpenChange(false)
        } catch (error: unknown) {
            console.error("Failed to create conversation:", error)
            const message =
                typeof error === "object" && error && "message" in error
                    ? String((error as { message?: unknown }).message || "Failed to create conversation")
                    : "Failed to create conversation"
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <DialogTitle>Start New Conversation</DialogTitle>
                            <DialogDescription>
                                Create a direct message or group chat
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogBody>
                        <div className="space-y-6">
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
                                        <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                            Group Name <span className="text-destructive ml-1">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter group name"
                                            {...register("name")}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-foreground">Description (Optional)</Label>
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
                                <div className="flex items-center justify-between gap-3">
                                    <Label className="text-sm font-medium text-foreground">Select Participants</Label>
                                    {selectedUsers.length > 0 && (
                                        <Badge variant="secondary">{selectedUsers.length} selected</Badge>
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
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox
                                                            checked={selectedUsers.includes(user._id)}
                                                            onCheckedChange={() => handleUserToggle(user._id)}
                                                        />
                                                    </div>
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs capitalize">
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
                                    <p className="text-sm text-destructive">{errors.participants.message}</p>
                                )}
                            </div>
                        </div>
                    </DialogBody>

                    <DialogFooter className="gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="min-w-[120px]"
                            disabled={loading || selectedUsers.length === 0}
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {chatType === "direct" ? "Start Chat" : "Create Group"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}