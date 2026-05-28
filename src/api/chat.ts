import http from '../utils/http'
import { useAuthStore } from '../stores/auth'
import type { BaseResponse } from '../types/api'
import type {
  Conversation,
  ConversationListResponse,
  MessageListResponse,
  SendMessageResponse,
  SendMessageRequest,
  StreamChunk,
  ConversationListParams,
  MessageListParams,
  SummarizeTitleResponse
} from '../types/chat'

/**
 * 聊天相关的 API 调用
 */
export const chatApi = {
  /**
   * 获取会话列表
   */
  getConversations(params: ConversationListParams): Promise<BaseResponse<ConversationListResponse>> {
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
    params: MessageListParams
  ): Promise<BaseResponse<MessageListResponse>> {
    return http.get(`/conversations/${conversationId}/messages`, { params })
  },

  /**
   * 发送消息并获取 AI 回复
   */
  sendMessage(
    conversationId: number,
    params: SendMessageRequest
  ): Promise<BaseResponse<SendMessageResponse>> {
    return http.post(`/conversations/${conversationId}/messages`, params)
  },

  /**
   * 自动总结会话标题
   */
  summarizeTitle(conversationId: number): Promise<BaseResponse<SummarizeTitleResponse>> {
    return http.post(`/conversations/${conversationId}/summarize-title`)
  },

  /**
   * 流式发送消息并获取 AI 回复 (SSE)
   */
  async streamMessage(
    conversationId: number,
    content: string,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    const authStore = useAuthStore()
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Streaming request failed')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunkText = decoder.decode(value, { stream: true })
      const lines = chunkText.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            onChunk({ done: true })
            break
          }
          try {
            const parsed: StreamChunk = JSON.parse(data)
            onChunk(parsed)
          } catch (e) {
            console.error('Failed to parse SSE data', e)
          }
        }
      }
    }
  }
}
