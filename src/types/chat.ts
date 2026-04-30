export interface Conversation {
  id: number
  title: string | null
  /** 是否已由 AI 自动生成标题 */
  isTitleGenerated: boolean
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
  /** 发送者信息 (可选) */
  sender?: {
    name: string | null
  } | null
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
  /** 更新后的会话标题 (仅在标题自动总结后返回) */
  newTitle?: string | null
}

export interface StreamChunk {
  /** 消息内容片段 */
  content?: string
  /** 完整的消息对象 (通常在流结束或特定阶段返回) */
  message?: Message
  /** 更新后的会话标题 (可选) */
  newTitle?: string | null
  /** 是否结束标识 */
  done?: boolean
}
