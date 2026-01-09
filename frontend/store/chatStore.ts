import { create } from 'zustand'
import { communicationAPI } from '@/lib/api/endpoints'
import { unwrapArray } from '@/lib/utils'

interface Participant {
    userId: string
    userType: 'admin' | 'teacher' | 'student' | 'parent'
    role: 'admin' | 'member'
    joinedAt: string
    lastReadAt: string | null
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

interface ChatState {
    conversations: Conversation[]
    activeConversationId: string | null
    messages: Record<string, Message[]>
    typingUsers: Record<string, string[]>
    onlineUsers: Set<string>
    unreadCounts: Record<string, number>
    isLoading: boolean
    replyingTo: Message | null

    // Actions
    fetchConversations: () => Promise<void>
    fetchMessages: (conversationId: string, page?: number) => Promise<void>
    sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>
    markAsRead: (conversationId: string) => Promise<void>
    setActiveConversation: (id: string | null) => void
    setReplyingTo: (message: Message | null) => void
    deleteMessage: (messageId: string, forEveryone?: boolean) => Promise<void>
    addReaction: (messageId: string, emoji: string) => Promise<void>
    createConversation: (
        participants: Array<{ user: string; userModel: 'Admin' | 'Teacher' | 'Student' | 'Parent' }>,
        options: { type: 'direct' | 'group'; name?: string; description?: string }
    ) => Promise<Conversation>
    handleNewMessage: (message: Message) => void
    handleTyping: (conversationId: string, userId: string) => void
    updateTypingUsers: (conversationId: string, users: string[]) => void
    setOnlineUsers: (users: string[]) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeConversationId: null,
    messages: {},
    typingUsers: {},
    onlineUsers: new Set(),
    unreadCounts: {},
    isLoading: false,
    replyingTo: null,

    fetchConversations: async () => {
        try {
            set({ isLoading: true })
            const response = await communicationAPI.getConversations()
            const rawConversations = unwrapArray<any>(response?.data, 'conversations')

            // Map backend response (_id -> id, type mapping, etc.)
            const conversations = rawConversations.map((conv: any) => ({
                ...conv,
                id: conv?._id ?? conv?.id,
                type: conv?.type === 'private' ? 'direct' : conv?.type,
                lastMessage: conv?.lastMessage ? {
                    ...conv.lastMessage,
                    senderId: conv.lastMessage.sender,
                    sentAt: conv.lastMessage.createdAt
                } : undefined
            }))

            set({ conversations: Array.isArray(conversations) ? conversations : [] })
        } catch (error) {
            console.error('Failed to fetch conversations:', error)
            set({ conversations: [] })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchMessages: async (conversationId: string, page = 1) => {
        try {
            const response = await communicationAPI.getConversation(conversationId)
            // Backend returns { conversation, messages }
            const rawMessages = unwrapArray<any>(response?.data, 'messages')
            const messages = rawMessages.map((msg: any) => ({
                ...msg,
                id: msg?._id ?? msg?.id,
                senderId: msg?.sender,
                senderType: msg?.senderModel,
                type: msg?.messageType,
                createdAt: msg?.createdAt
            }))
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: page === 1
                        ? messages
                        : [...messages, ...(state.messages[conversationId] || [])]
                }
            }))
        } catch (error) {
            console.error('Failed to fetch messages:', error)
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: page === 1 ? [] : (state.messages[conversationId] || [])
                }
            }))
        }
    },

    sendMessage: async (conversationId: string, content: string, attachments?: File[]) => {
        try {
            let data: any = { content, messageType: 'text' }

            if (attachments && attachments.length > 0) {
                const formData = new FormData()
                formData.append('content', content)
                formData.append('messageType', 'text')
                attachments.forEach((file, index) => {
                    formData.append('attachments', file)
                })
                data = formData
            }

            const response = await communicationAPI.sendMessage(conversationId, data)

            // Add message to local state
            const newMessage = {
                ...response.data,
                id: response.data._id,
                senderId: response.data.sender,
                senderType: response.data.senderModel,
                type: response.data.messageType,
                createdAt: response.data.createdAt
            }

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: [...(state.messages[conversationId] || []), newMessage]
                }
            }))
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    },

    markAsRead: async (conversationId: string) => {
        try {
            await communicationAPI.markAsRead(conversationId)
            set((state) => ({
                unreadCounts: {
                    ...state.unreadCounts,
                    [conversationId]: 0
                }
            }))
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    },

    setActiveConversation: (id: string | null) => {
        set({ activeConversationId: id })
        if (id) {
            get().markAsRead(id)
        }
    },

    setReplyingTo: (message: Message | null) => {
        set({ replyingTo: message })
    },

    deleteMessage: async (messageId: string, forEveryone = false) => {
        try {
            await communicationAPI.deleteMessage(messageId)

            // Update local state
            set((state) => {
                const updatedMessages = { ...state.messages }
                Object.keys(updatedMessages).forEach(convId => {
                    updatedMessages[convId] = updatedMessages[convId].filter(msg => msg.id !== messageId)
                })
                return { messages: updatedMessages }
            })
        } catch (error) {
            console.error('Failed to delete message:', error)
        }
    },

    addReaction: async (messageId: string, emoji: string) => {
        try {
            const response = await fetch(`/api/messages/${messageId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emoji })
            })

            if (response.ok) {
                // Update local state would be handled by socket event
            }
        } catch (error) {
            console.error('Failed to add reaction:', error)
        }
    },

    createConversation: async (
        participants: Array<{ user: string; userModel: 'Admin' | 'Teacher' | 'Student' | 'Parent' }>,
        options: { type: 'direct' | 'group'; name?: string; description?: string }
    ) => {
        try {
            const payload = {
                type: options.type === 'direct' ? 'private' : 'group',
                name: options.name || undefined,
                description: options.description || undefined,
                participants
            }

            const response = await communicationAPI.createConversation(payload)
            const newConversation = {
                ...response.data,
                id: response.data._id,
                type: response.data.type === 'private' ? 'direct' : response.data.type,
                lastMessage: response.data.lastMessage ? {
                    ...response.data.lastMessage,
                    senderId: response.data.lastMessage.sender,
                    sentAt: response.data.lastMessage.createdAt
                } : undefined
            }

            set((state) => ({
                conversations: [newConversation, ...state.conversations]
            }))
            return newConversation
        } catch (error) {
            console.error('Failed to create conversation:', error)
            throw error
        }
    },

    handleNewMessage: (message: Message) => {
        set((state) => {
            const conversationId = message.conversationId
            const currentMessages = state.messages[conversationId] || []
            const updatedMessages = [...currentMessages, message]

            // Update conversation's last message
            const updatedConversations = state.conversations.map(conv =>
                conv.id === conversationId
                    ? {
                        ...conv,
                        lastMessage: {
                            content: message.content,
                            senderId: message.senderId,
                            sentAt: message.createdAt,
                            type: message.type
                        },
                        updatedAt: message.createdAt
                    }
                    : conv
            )

            // Update unread count if not active conversation
            const newUnreadCounts = { ...state.unreadCounts }
            if (state.activeConversationId !== conversationId) {
                newUnreadCounts[conversationId] = (newUnreadCounts[conversationId] || 0) + 1
            }

            return {
                messages: {
                    ...state.messages,
                    [conversationId]: updatedMessages
                },
                conversations: updatedConversations,
                unreadCounts: newUnreadCounts
            }
        })
    },

    handleTyping: (conversationId: string, userId: string) => {
        // This would be handled by socket events
        console.log('User typing:', userId, 'in conversation:', conversationId)
    },

    updateTypingUsers: (conversationId: string, users: string[]) => {
        set((state) => ({
            typingUsers: {
                ...state.typingUsers,
                [conversationId]: users
            }
        }))
    },

    setOnlineUsers: (users: string[]) => {
        set({ onlineUsers: new Set(users) })
    }
}))