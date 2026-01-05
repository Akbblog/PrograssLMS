import { create } from 'zustand'

interface User {
    _id: string
    name: string
    email: string
    role: string
}

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
    createConversation: (participantIds: string[], name?: string) => Promise<Conversation>
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
            const response = await fetch('/api/v1/conversations')
            const result = await response.json()
            if (result.status === 'success') {
                set({ conversations: result.data })
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    fetchMessages: async (conversationId: string, page = 1) => {
        try {
            const response = await fetch(`/api/v1/conversations/${conversationId}/messages?page=${page}`)
            const result = await response.json()
            if (result.status === 'success') {
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: page === 1
                            ? result.data
                            : [...result.data, ...(state.messages[conversationId] || [])]
                    }
                }))
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        }
    },

    sendMessage: async (conversationId: string, content: string, attachments?: File[]) => {
        try {
            const formData = new FormData()
            formData.append('content', content)
            if (attachments) {
                attachments.forEach((file, index) => {
                    formData.append(`attachments`, file)
                })
            }

            const response = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
                method: 'POST',
                body: formData
            })

            const result = await response.json()
            if (result.status === 'success') {
                // Add message to local state
                const newMessage = result.data
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: [...(state.messages[conversationId] || []), newMessage]
                    }
                }))
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    },

    markAsRead: async (conversationId: string) => {
        try {
            await fetch(`/api/v1/conversations/${conversationId}/read`, { method: 'POST' })
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
            await fetch(`/api/messages/${messageId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ forEveryone })
            })

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

    createConversation: async (participantIds: string[], name?: string) => {
        try {
            const response = await fetch('/api/v1/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participants: participantIds,
                    name,
                    type: participantIds.length > 2 ? 'group' : 'direct'
                })
            })

            const result = await response.json()
            if (result.status === 'success') {
                const newConversation = result.data
                set((state) => ({
                    conversations: [newConversation, ...state.conversations]
                }))
                return newConversation
            }
            throw new Error('Failed to create conversation')
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