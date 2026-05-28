/**
 * 会话信息
 */
export interface Conversation {
  /** 会话 ID */
  id: number
  /** 会话标题 */
  title: string | null
  /** 是否已由 AI 自动生成标题 */
  isTitleGenerated: boolean
  /** 用户 ID */
  userId: number
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 删除时间 (软删除) */
  deletedAt: string | null
}

/**
 * 消息类型
 */
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE'

/**
 * 消息信息
 */
export interface Message {
  /** 消息 ID */
  id: number
  /** 消息内容 (文本消息内容或附件说明) */
  content: string
  /** 角色 */
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  /** 消息类型 */
  type: MessageType
  /** 附件在 OSS 中的 Key */
  attachmentKey: string | null
  /** 附件的临时预览/下载链接 */
  url: string | null
  /** 所属会话 ID */
  conversationId: number
  /** 发送者 ID (AI 消息时可能为 null) */
  senderId: number | null
  /** 发送者信息 (可选) */
  sender?: {
    /** 发送者名称 */
    name: string | null
  } | null
  /** 发送时间 */
  createdAt: string
  /** 消息状态 (仅本地使用) */
  status?: 'sending' | 'error'
}

/**
 * 发送消息请求参数
 */
export interface SendMessageRequest {
  /** 消息文本内容 (图片消息可为空) */
  content: string
  /** 消息类型 */
  type?: MessageType
  /** 附件在 OSS 中的 Key (上传图片/文件后获得) */
  attachmentKey?: string
}

/**
 * 分页信息
 */
export interface Pagination {
  /** 总条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页限制数量 */
  limit: number
  /** 总页数 */
  totalPages: number
}

/**
 * 会话列表请求参数
 */
export interface ConversationListParams {
  page?: number
  limit?: number
}

/**
 * 消息列表请求参数
 */
export interface MessageListParams {
  cursor?: number
  limit?: number
}

/**
 * 总结标题响应
 */
export interface SummarizeTitleResponse {
  title: string
}

/**
 * 会话列表响应数据
 */
export interface ConversationListResponse {
  /** 会话列表 */
  list: Conversation[]
  /** 分页信息 */
  pagination: Pagination
}

/**
 * 消息列表响应数据 (游标分页)
 */
export interface MessageListResponse {
  /** 消息列表 */
  list: Message[]
  /** 下一页游标 (无下一页时为 null) */
  nextCursor: number | null
}

/**
 * 发送消息响应数据
 */
export interface SendMessageResponse {
  /** 用户发送的消息对象 */
  userMessage: Message
  /** AI 回复的消息对象 */
  aiMessage: Message
}

/**
 * 流式消息片段
 */
export interface StreamChunk {
  /** 消息内容片段 */
  content?: string
  /** 完整的消息对象 (通常在流结束或特定阶段返回) */
  message?: Message
  /** 是否结束标识 */
  done?: boolean
}
