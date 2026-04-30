import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatApi } from '../api/chat'
import type { Conversation, Message } from '../types/chat'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<number | null>(null)
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const isSending = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })

  async function fetchConversations(page = 1) {
    isLoading.value = true
    try {
      const res = await chatApi.getConversations({ page, limit: pagination.value.limit })
      if (res.success && res.data) {
        conversations.value = res.data.list
        pagination.value = res.data.pagination
      }
    } finally {
      isLoading.value = false
    }
  }

  async function createConversation(title?: string) {
    const res = await chatApi.createConversation(title)
    if (res.success && res.data) {
      conversations.value.unshift(res.data)
      currentConversationId.value = res.data.id
      messages.value = []
      return res.data
    }
  }

  async function fetchMessages(conversationId: number, cursor?: number) {
    isLoading.value = true
    try {
      const res = await chatApi.getMessages(conversationId, { cursor })
      if (res.success && res.data) {
        if (cursor) {
          messages.value = [...res.data.list, ...messages.value]
        } else {
          messages.value = res.data.list
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(content: string) {
    if (!currentConversationId.value) return
    
    // 1. 乐观更新：立即显示用户消息
    const tempId = Date.now()
    const tempUserMessage: Message = {
      id: tempId,
      content,
      role: 'USER',
      conversationId: currentConversationId.value,
      senderId: null, // 临时消息
      createdAt: new Date().toISOString()
    }
    messages.value.push(tempUserMessage)
    
    isSending.value = true
    try {
      const res = await chatApi.sendMessage(currentConversationId.value, content)
      if (res.success && res.data) {
        // 2. 替换临时消息并添加 AI 回复
        const index = messages.value.findIndex(m => m.id === tempId)
        if (index !== -1) {
          messages.value[index] = res.data.userMessage
        }
        messages.value.push(res.data.aiMessage)

        // 3. 如果返回了新标题，同步更新会话列表中的标题
        if (res.data.newTitle) {
          const conversation = conversations.value.find(c => c.id === currentConversationId.value)
          if (conversation) {
            conversation.title = res.data.newTitle
            conversation.isTitleGenerated = true
          }
        }
      }
    } catch (error) {
      // 3. 错误处理：如果发送失败，可以标记该消息或将其移除
      const index = messages.value.findIndex(m => m.id === tempId)
      if (index !== -1) {
        messages.value.splice(index, 1)
      }
      console.error('Failed to send message:', error)
    } finally {
      isSending.value = false
    }
  }

  async function sendStreamingMessage(content: string) {
    if (!currentConversationId.value) return

    const conversationId = currentConversationId.value
    
    // 1. 乐观更新：用户消息
    const tempId = Date.now()
    const tempUserMessage: Message = {
      id: tempId,
      content,
      role: 'USER',
      conversationId,
      senderId: null,
      createdAt: new Date().toISOString()
    }
    messages.value.push(tempUserMessage)

    // 2. 预占 AI 消息位
    const aiTempId = tempId + 1
    const aiMessage: Message = {
      id: aiTempId,
      content: '',
      role: 'ASSISTANT',
      conversationId,
      senderId: null,
      createdAt: new Date().toISOString()
    }
    messages.value.push(aiMessage)

    isSending.value = true
    try {
      await chatApi.streamMessage(
        conversationId,
        content,
        (chunk) => {
          // 处理流式内容
          if (chunk.content) {
            const index = messages.value.findIndex(m => m.id === aiTempId)
            if (index !== -1) {
              messages.value[index].content += chunk.content
            }
          }

          // 处理标题更新
          if (chunk.newTitle) {
            const conv = conversations.value.find(c => c.id === conversationId)
            if (conv) {
              conv.title = chunk.newTitle
              conv.isTitleGenerated = true
            }
          }

          // 处理最终消息对象替换 (带数据库 ID 和发送者信息)
          if (chunk.message) {
            const index = messages.value.findIndex(m => m.id === aiTempId)
            if (index !== -1) {
              messages.value[index] = chunk.message
            }
          }
        }
      )
    } catch (error) {
      console.error('Streaming error:', error)
      // 移除预占消息
      const userIdx = messages.value.findIndex(m => m.id === tempId)
      if (userIdx !== -1) messages.value.splice(userIdx, 1)
      const aiIdx = messages.value.findIndex(m => m.id === aiTempId)
      if (aiIdx !== -1) messages.value.splice(aiIdx, 1)
    } finally {
      isSending.value = false
    }
  }

  function setCurrentConversation(id: number | null) {
    currentConversationId.value = id
    if (id) {
      fetchMessages(id)
    } else {
      messages.value = []
    }
  }

  return {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    isSending,
    pagination,
    fetchConversations,
    createConversation,
    fetchMessages,
    sendMessage,
    sendStreamingMessage,
    setCurrentConversation
  }
})
