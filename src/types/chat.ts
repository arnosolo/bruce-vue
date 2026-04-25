export interface Conversation {
  id: number
  title: string | null
  userId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Message {
  id: number
  content: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  conversationId: number
  senderId: number | null
  createdAt: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ConversationListResponse {
  list: Conversation[]
  pagination: Pagination
}

export interface MessageListResponse {
  list: Message[]
  nextCursor: number | null
}

export interface SendMessageResponse {
  userMessage: Message
  aiMessage: Message
}
