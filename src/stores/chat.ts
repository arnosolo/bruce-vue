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
    setCurrentConversation
  }
})
