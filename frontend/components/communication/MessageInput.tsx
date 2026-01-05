"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Send,
    Paperclip,
    Smile,
    Mic,
    X,
    Image as ImageIcon,
    File,
    Camera
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from "@/store/chatStore"

interface Message {
    id: string
    conversationId: string
    senderId: string
    senderType: 'admin' | 'teacher' | 'student' | 'parent'
    type: 'text' | 'image' | 'file' | 'audio' | 'system'
    content: string
    attachments: any[]
    replyTo?: string
    reactions: any[]
    status: any
    deletedFor: string[]
    deletedForEveryone: boolean
    editedAt?: string
    createdAt: string
}

interface MessageInputProps {
    conversationId: string
    replyingTo: Message | null
    onCancelReply: () => void
}

export default function MessageInput({
    conversationId,
    replyingTo,
    onCancelReply
}: MessageInputProps) {
    const [message, setMessage] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { sendMessage } = useChatStore()

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [message])

    // Typing indicator
    useEffect(() => {
        if (message.trim() && !isTyping) {
            setIsTyping(true)
            // TODO: emit typing start event
        } else if (!message.trim() && isTyping) {
            setIsTyping(false)
            // TODO: emit typing stop event
        }

        const timeout = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false)
                // TODO: emit typing stop event
            }
        }, 3000)

        return () => clearTimeout(timeout)
    }, [message, isTyping])

    const handleSend = async () => {
        if (!message.trim() && selectedFiles.length === 0) return

        try {
            await sendMessage(conversationId, message, selectedFiles)
            setMessage("")
            setSelectedFiles([])
            onCancelReply()
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        const maxSize = 10 * 1024 * 1024 // 10MB
        const validFiles = Array.from(files).filter(file => {
            if (file.size > maxSize) {
                alert(`${file.name} is too large. Max size is 10MB`)
                return false
            }
            return true
        })

        setSelectedFiles(prev => [...prev, ...validFiles])
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
        return <File className="w-4 h-4" />
    }

    return (
        <div className="border-t border-slate-200 bg-white p-4">
            {/* Reply preview */}
            {replyingTo && (
                <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-600">Replying to</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancelReply}
                            className="h-6 w-6 p-0"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="flex items-start gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-600 truncate">
                                {replyingTo.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* File attachments preview */}
            {selectedFiles.length > 0 && (
                <div className="mb-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            {getFileIcon(file)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input area */}
            <div className="flex items-end gap-2">
                {/* Attachment menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                        >
                            <Paperclip className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Photo/Video
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                            <File className="w-4 h-4 mr-2" />
                            Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Camera className="w-4 h-4 mr-2" />
                            Camera
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Emoji button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                >
                    <Smile className="w-4 h-4" />
                </Button>

                {/* Text input */}
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="min-h-[40px] max-h-[120px] resize-none pr-12"
                        rows={1}
                    />
                </div>

                {/* Send button or voice record button */}
                {message.trim() || selectedFiles.length > 0 ? (
                    <Button
                        onClick={handleSend}
                        size="sm"
                        className="flex-shrink-0 bg-blue-500 hover:bg-blue-600"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex-shrink-0 ${isRecording ? "text-red-500" : ""}`}
                        onClick={() => setIsRecording(!isRecording)}
                    >
                        <Mic className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,application/*,text/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
            />

            {/* Recording indicator */}
            {isRecording && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-700">Recording... Tap to stop</span>
                    </div>
                </div>
            )}
        </div>
    )
}