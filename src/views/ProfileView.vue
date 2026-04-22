<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'
import type { User } from '../types/user'

const authStore = useAuthStore()
const loading = ref(true)
const profile = ref<User | null>(null)
const error = ref('')

const isEditing = ref(false)
const saving = ref(false)
const editForm = reactive({
  name: ''
})

async function fetchProfile() {
  try {
    loading.value = true
    error.value = ''
    const response = await authApi.getProfile()
    if (response.success) {
      profile.value = response.data
      syncStore(response.data)
    }
  } catch (err: any) {
    error.value = err.message || '获取个人资料失败'
  } finally {
    loading.value = false
  }
}

function syncStore(userData: User) {
  // Update the store if the data has changed
  if (authStore.user && (authStore.user.name !== userData.name || authStore.user.email !== userData.email)) {
    authStore.user = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }
}

function startEdit() {
  if (profile.value) {
    editForm.name = profile.value.name || ''
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
  error.value = ''
}

async function handleSave() {
  if (!profile.value) return
  
  try {
    saving.value = true
    error.value = ''
    const response = await authApi.updateProfile({ name: editForm.name })
    if (response.success) {
      profile.value = response.data
      syncStore(response.data)
      isEditing.value = false
    }
  } catch (err: any) {
    error.value = err.message || '保存失败，请稍后再试'
  } finally {
    saving.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">个人中心</h1>
      <p class="text-gray-500 mt-1">管理您的账户信息和偏好设置</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error && !isEditing" class="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
      <button @click="fetchProfile" class="ml-auto underline hover:text-red-700">重试</button>
    </div>

    <div v-else-if="profile" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- 头部背景 -->
      <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div class="px-8 pb-8">
        <!-- 头像 -->
        <div class="relative flex justify-between items-end -mt-12 mb-6">
          <div class="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
            <div class="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center">
              <span class="text-3xl font-bold text-blue-600">
                {{ (profile.name || profile.email).charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <template v-if="!isEditing">
              <button 
                @click="startEdit"
                class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                编辑资料
              </button>
            </template>
            <template v-else>
              <button 
                @click="cancelEdit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button 
                @click="handleSave"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? '保存中...' : '保存修改' }}
              </button>
            </template>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="space-y-6">
          <div v-if="error && isEditing" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="space-y-4">
            <div v-if="isEditing" class="space-y-2">
              <label class="text-sm font-medium text-gray-700">姓名</label>
              <input 
                v-model="editForm.name"
                type="text"
                class="block w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="请输入您的姓名"
              >
            </div>
            <div v-else>
              <h2 class="text-xl font-bold text-gray-900">{{ profile.name || '未设置姓名' }}</h2>
              <p class="text-gray-500 text-sm">{{ profile.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">用户 ID</label>
              <p class="text-gray-900 font-mono">#{{ profile.id }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">邮箱地址</label>
              <p class="text-gray-900">{{ profile.email }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">注册时间</label>
              <p class="text-gray-900">{{ formatDate(profile.createdAt) }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">最后更新</label>
              <p class="text-gray-900">{{ formatDate(profile.updatedAt) }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">账户状态</label>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <p class="text-gray-900 text-sm">已激活</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
