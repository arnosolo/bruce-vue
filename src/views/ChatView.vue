<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { systemApi } from '../api/system'
import { renderMarkdown } from '../utils/markdown'

const chatStore = useChatStore()
const authStore = useAuthStore()
const router = useRouter()

const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const isSidebarOpen = ref(false) // 移动端侧边栏状态
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  await chatStore.fetchConversations()
  if (chatStore.conversations.length > 0) {
    chatStore.setCurrentConversation(chatStore.conversations[0].id)
  }
})

watch(() => chatStore.messages.length, scrollToBottom)

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || chatStore.isSending) return
  const content = newMessage.value
  newMessage.value = ''
  await chatStore.sendMessage(content)
}

const handleImageUpload = () => {
  fileInput.value?.click()
}

const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 限制文件大小，例如 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  isUploading.value = true
  try {
    // 调用后端聊天附件上传接口
    const res = await systemApi.uploadChatFile(file)
    if (!res.success || !res.data) {

      throw new Error(res.message || '上传失败')
    }

    // 发送图片消息
    await chatStore.sendMessage('', 'IMAGE', res.data.key)
  } catch (error) {
    console.error('Image upload failed:', error)
    alert(error instanceof Error ? error.message : '图片上传失败')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const handleNewChat = async () => {
  await chatStore.createConversation('新会话')
  if (window.innerWidth < 768) isSidebarOpen.value = false
}

const selectConversation = (id: number) => {
  chatStore.setCurrentConversation(id)
  if (window.innerWidth < 768) isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  
  const isToday = date.toDateString() === now.toDateString()
  const isThisYear = date.getFullYear() === now.getFullYear()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  if (isToday) {
    return `${hours}:${minutes}`
  }
  
  if (isThisYear) {
    return `${month}-${day} ${hours}:${minutes}`
  }
  
  return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`
}
</script>

<template>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 relative">
    <!-- Sidebar / Drawer -->
    <div
      :class="[
        'absolute inset-y-0 left-0 z-30 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col',
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      ]"
    >
      <div class="p-4 border-b flex items-center justify-between">
        <h2 class="font-bold text-gray-700">对话记录</h2>
        <button @click="toggleSidebar" class="md:hidden p-2 text-gray-500">
          <span class="i-carbon-close text-xl"></span>
        </button>
      </div>
      <div class="p-4">
        <button
          @click="handleNewChat"
          class="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span class="i-carbon-add"></span>
          开启新对话
        </button>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="conv in chatStore.conversations"
          :key="conv.id"
          @click="selectConversation(conv.id)"
          :class="[
            'p-4 cursor-pointer hover:bg-gray-50 transition border-b',
            chatStore.currentConversationId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
          ]"
        >
          <div class="font-medium truncate text-sm">{{ conv.title || '无标题会话' }}</div>
          <div class="text-[10px] text-gray-400 mt-1">{{ formatMessageTime(conv.createdAt) }}</div>
        </div>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="absolute inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
    ></div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Chat Header (Mobile Only) -->
      <div class="md:hidden flex items-center p-3 bg-white border-b gap-3">
        <button @click="toggleSidebar" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <span class="i-carbon-menu text-xl"></span>
        </button>
        <div class="flex-1 font-bold truncate text-sm">
          {{ chatStore.conversations.find(c => c.id === chatStore.currentConversationId)?.title || '聊天' }}
        </div>
      </div>

      <template v-if="chatStore.currentConversationId">
        <!-- Messages -->
        <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div
            v-for="msg in chatStore.messages"
            :key="msg.id"
            :class="['flex flex-col', msg.role === 'USER' ? 'items-end' : 'items-start']"
          >
            <div class="flex items-center gap-2 mb-1 px-1">
              <span class="text-[11px] font-medium text-gray-500">
                {{ msg.role === 'USER' ? (authStore.user?.name || '你') : 'AI 助手' }}
              </span>
              <span class="text-[10px] text-gray-400">
                {{ formatMessageTime(msg.createdAt) }}
              </span>
            </div>
            <div class="max-w-[85%] md:max-w-[70%]">
              <div
                :class="[
                  'rounded-2xl shadow-sm overflow-hidden w-full relative group',
                  msg.type === 'IMAGE' ? 'p-0' : 'p-3 md:p-4',
                  msg.role === 'USER' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none',
                  msg.status === 'error' ? 'ring-2 ring-red-400' : ''
                ]"
              >
                <template v-if="msg.type === 'IMAGE'">
                  <img :src="msg.url || ''" alt="image message" class="max-w-full block cursor-zoom-in hover:opacity-90 transition-opacity" />
                </template>
                <div 
                  v-else 
                  class="markdown-body prose prose-sm max-w-none text-inherit"
                  :class="[msg.role === 'USER' ? 'prose-invert' : '']"
                  v-html="renderMarkdown(msg.content)"
                ></div>
              </div>

              <!-- Status Indicators (Below bubble) -->
              <div v-if="msg.role === 'USER' && (msg.status === 'sending' || msg.status === 'error')" class="mt-1.5 flex items-center justify-end px-1">
                <span v-if="msg.status === 'sending'" class="i-carbon-progress-bar-round animate-spin text-blue-500 text-lg"></span>
                <button 
                  v-if="msg.status === 'error'"
                  @click="chatStore.retryMessage(msg)"
                  class="flex items-center gap-1.5 text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors py-1"
                >
                  <span class="i-carbon-renew text-sm"></span>
                  <span>发送失败，点击重试</span>
                </button>
              </div>
            </div>
          </div>
          <div v-if="chatStore.isSending" class="flex flex-col items-start">
            <div class="flex items-center gap-2 mb-1 px-1">
              <span class="text-[11px] font-medium text-gray-500">AI 助手</span>
              <span class="text-[10px] text-gray-400">正在输入...</span>
            </div>
            <div class="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 md:p-4 bg-white border-t pb-safe">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange"
          />
          <div class="flex gap-2 md:gap-3 items-end max-w-4xl mx-auto">
            <button
              @click="handleImageUpload"
              :disabled="chatStore.isSending || isUploading"
              class="w-12 h-12 flex-shrink-0 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-50"
              title="发送图片"
            >
              <span v-if="isUploading" class="i-carbon-progress-bar-round animate-spin text-xl"></span>
              <span v-else class="i-carbon-image text-xl"></span>
            </button>
            <textarea
              v-model="newMessage"
              @keydown.enter.prevent="handleSendMessage"
              placeholder="有任何问题尽管问我..."
              class="flex-1 p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all text-sm md:text-base bg-gray-50 focus:bg-white"
              rows="1"
              style="min-height: 48px; max-height: 120px;"
            ></textarea>
            <button
              @click="handleSendMessage"
              :disabled="!newMessage.trim() || chatStore.isSending || isUploading"
              class="w-12 h-12 flex-shrink-0 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 transition-all flex items-center justify-center shadow-lg shadow-blue-100 disabled:shadow-none"
            >
              <span class="i-carbon-send text-xl"></span>
            </button>
          </div>
          <div class="hidden md:block text-[10px] text-gray-400 mt-2 text-center">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
          <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <span class="i-carbon-chat text-4xl text-blue-500"></span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">欢迎来到智能对话</h3>
          <p class="text-sm max-w-xs">选择一个历史会话，或点击下方按钮开始新的探索。</p>
          <button @click="handleNewChat" class="mt-6 md:hidden px-6 py-3 bg-blue-600 text-white rounded-xl">
            开始新对话
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.pb-safe {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

/* 隐藏滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: transparent;
}
.overflow-y-auto:hover::-webkit-scrollbar-thumb {
  background: #e5e7eb;
}

/* Markdown 样式微调 */
:deep(.markdown-body) {
  word-break: break-word;
}
:deep(.markdown-body p) {
  margin: 0;
}
:deep(.markdown-body p + p) {
  margin-top: 0.5em;
}
:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-left: 1.25em;
  margin: 0.5em 0;
}
:deep(.markdown-body li) {
  margin: 0.25em 0;
}
:deep(.markdown-body pre) {
  background: rgba(0,0,0,0.05);
  padding: 0.75em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 0.5em 0;
}
:deep(.markdown-body code) {
  background: rgba(0,0,0,0.05);
  padding: 0.2em 0.4em;
  border-radius: 0.3em;
  font-size: 0.9em;
}
</style>
