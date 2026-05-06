<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'
import { systemApi } from '../api/system'
import { compressImage } from '../utils/image'
import ConfirmModal from '../components/ConfirmModal.vue'
import type { User } from '../types/user'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const profile = ref<User | null>(null)
const error = ref('')

const isEditing = ref(false)
const saving = ref(false)
const editForm = reactive({
  name: ''
})

const fileInput = ref<HTMLInputElement | null>(null)
const isUploadingAvatar = ref(false)

const isChangingPassword = ref(false)
const passwordSaving = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showDeleteConfirm = ref(false)
const deleting = ref(false)
const deleteCountdown = ref(0)
let timer: any = null

function startDeleteCountdown() {
  deleteCountdown.value = 5
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    deleteCountdown.value--
    if (deleteCountdown.value <= 0) {
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function openDeleteConfirm() {
  showDeleteConfirm.value = true
  startDeleteCountdown()
}

async function fetchProfile() {
  try {
    loading.value = true
    error.value = ''
    const response = await authApi.getProfile()
    if (response.success && response.data) {
      profile.value = response.data
      authStore.setUser(response.data)
    }
  } catch (err: any) {
    error.value = err.message || '获取个人资料失败'
  } finally {
    loading.value = false
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

function startChangePassword() {
  isChangingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = ''
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

function cancelChangePassword() {
  isChangingPassword.value = false
  passwordError.value = ''
}

async function handlePasswordSave() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return
  }
  
  if (passwordForm.newPassword.length < 8) {
    passwordError.value = '新密码长度至少为8位'
    return
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!passwordRegex.test(passwordForm.newPassword)) {
    passwordError.value = '新密码需包含大写字母、小写字母和数字'
    return
  }

  try {
    passwordSaving.value = true
    passwordError.value = ''
    passwordSuccess.value = ''
    const response = await authApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    if (response.success) {
      passwordSuccess.value = '密码修改成功'
      setTimeout(() => {
        isChangingPassword.value = false
        passwordSuccess.value = ''
      }, 2000)
    }
  } catch (err: any) {
    passwordError.value = err.message || '修改密码失败，请检查旧密码是否正确'
  } finally {
    passwordSaving.value = false
  }
}

async function handleSave() {
  if (!profile.value) return
  
  try {
    saving.value = true
    error.value = ''
    const response = await authApi.updateProfile({ name: editForm.name })
    if (response.success && response.data) {
      profile.value = response.data
      authStore.setUser(response.data)
      isEditing.value = false
    }
  } catch (err: any) {
    error.value = err.message || '保存失败，请稍后再试'
  } finally {
    saving.value = false
  }
}

function triggerAvatarUpload() {
  fileInput.value?.click()
}

async function handleAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 限制文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    error.value = '仅支持 JPG/PNG 格式的图片'
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  try {
    isUploadingAvatar.value = true
    error.value = ''

    // 1. 压缩图片 (最大 400x400，头像不需要太大)
    const compressedBlob = await compressImage(file, 400, 400, 0.7)
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg'
    })

    // 2. 上传到 OSS
    const uploadRes = await systemApi.uploadAvatar(compressedFile)
    if (!uploadRes.success || !uploadRes.data) {
      throw new Error(uploadRes.message || '头像上传失败')
    }

    // 3. 更新用户信息中的头像 Key
    const updateRes = await authApi.updateProfile({ avatarKey: uploadRes.data.key })
    if (updateRes.success && updateRes.data) {
      profile.value = updateRes.data
      authStore.setUser(updateRes.data)
    } else {
      throw new Error(updateRes.message || '更新头像信息失败')
    }
  } catch (err: any) {
    error.value = err.message || '更新头像失败'
    console.error('Avatar upload error:', err)
  } finally {
    isUploadingAvatar.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleDeleteAccount() {
  try {
    deleting.value = true
    const response = await authApi.deleteAccount()
    if (response.success) {
      authStore.logout()
      router.push('/login')
    }
  } catch (err: any) {
    alert(err.message || '注销失败，请稍后再试')
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
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

onUnmounted(() => {
  if (timer) clearInterval(timer)
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
          <div class="relative group">
            <div class="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
              <div class="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-3xl font-bold text-blue-600">
                  {{ (profile.name || profile.email).charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <!-- 上传按钮 -->
            <button 
              @click="triggerAvatarUpload"
              :disabled="isUploadingAvatar"
              class="absolute inset-1 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1"
            >
              <div v-if="isUploadingAvatar" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <template v-else>
                <span class="i-carbon-camera text-xl"></span>
                <span class="text-[10px] font-medium">更换头像</span>
              </template>
            </button>
            <input 
              ref="fileInput"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              class="hidden"
              @change="handleAvatarChange"
            />
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

    <!-- 安全设置 -->
    <div v-if="profile && !loading" class="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">安全设置</h3>
              <p class="text-sm text-gray-500">保护您的账户安全</p>
            </div>
          </div>
          <button 
            v-if="!isChangingPassword"
            @click="startChangePassword"
            class="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            修改密码
          </button>
        </div>

        <div v-if="isChangingPassword" class="space-y-4 max-w-md">
          <div v-if="passwordError" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ passwordError }}
          </div>
          <div v-if="passwordSuccess" class="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ passwordSuccess }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">当前密码</label>
            <input 
              v-model="passwordForm.oldPassword"
              type="password"
              class="block w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="请输入当前密码"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">新密码</label>
            <input 
              v-model="passwordForm.newPassword"
              type="password"
              class="block w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="请输入新密码（至少8位）"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">确认新密码</label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password"
              class="block w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="请再次输入新密码"
            >
          </div>

          <div class="flex gap-2 pt-2">
            <button 
              @click="cancelChangePassword"
              :disabled="passwordSaving"
              class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button 
              @click="handlePasswordSave"
              :disabled="passwordSaving"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="passwordSaving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ passwordSaving ? '修改中...' : '确认修改' }}
            </button>
          </div>
        </div>
        
        <div v-else class="flex items-center gap-2 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          定期修改密码可以提高账户安全性
        </div>
      </div>
    </div>

    <!-- 危险区域 -->
    <div v-if="profile && !loading" class="mt-6 bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">危险区域</h3>
              <p class="text-sm text-gray-500">这些操作不可逆，请谨慎操作</p>
            </div>
          </div>
          <button 
            @click="openDeleteConfirm"
            class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            注销账号
          </button>
        </div>
      </div>
    </div>

    <!-- 注销确认弹窗 -->
    <ConfirmModal
      :show="showDeleteConfirm"
      title="确认注销账号？"
      message="一旦注销，您的所有数据将被永久删除。请注意：注销后，相同的电子邮箱地址将无法再次注册此平台。"
      :confirm-text="deleteCountdown > 0 ? `确认注销 (${deleteCountdown}s)` : '确认注销'"
      :confirm-disabled="deleteCountdown > 0 || deleting"
      cancel-text="取消"
      @confirm="handleDeleteAccount"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
