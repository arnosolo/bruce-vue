import http from '../utils/http'
import type { BaseResponse } from '../types/api'
import type {
  Conversation,
  ConversationListResponse,
  MessageListResponse,
  SendMessageResponse
} from '../types/chat'

/**
 * 聊天相关的 API 调用
 */
export const chatApi = {
  /**
   * 获取会话列表
   */
  getConversations(params: { page?: number; limit?: number }): Promise<BaseResponse<ConversationListResponse>> {
    return http.get('/conversations', { params })
  },

  /**
   * 创建新会话
   */
  createConversation(title?: string): Promise<BaseResponse<Conversation>> {
    return http.post('/conversations', { title })
  },

  /**
   * 获取会话消息记录
   */
  getMessages(
    conversationId: number,
    params: { cursor?: number; limit?: number }
  ): Promise<BaseResponse<MessageListResponse>> {
    return http.get(`/conversations/${conversationId}/messages`, { params })
  },

  /**
   * 发送消息并获取 AI 回复
   */
  sendMessage(
    conversationId: number,
    content: string
  ): Promise<BaseResponse<SendMessageResponse>> {
    return http.post(`/conversations/${conversationId}/messages`, { content })
  }
}
