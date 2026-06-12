<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'
import { systemApi } from '../api/system'
import { SystemStatus, SYSTEM_STATUS_CONFIG } from '../types/system'

const router = useRouter()
const authStore = useAuthStore()

// 服务器状态
const serverStatus = ref<SystemStatus>(SystemStatus.Checking)

// 状态控制：'login' | 'register'
const mode = ref<'login' | 'register'>('login')

// 表单数据
const form = ref({
  email: '',
  password: '',
  name: ''
})

const loading = ref(false)
const error = ref('')

// 获取服务器状态
async function checkServer() {
  try {
    const res = await systemApi.getHealth()
    serverStatus.value = res.success ? SystemStatus.Online : SystemStatus.Offline
  } catch (err) {
    serverStatus.value = SystemStatus.Offline
  }
}

onMounted(() => {
  checkServer()
})

// 切换模式
function toggleMode(target: 'login' | 'register') {
  mode.value = target
  error.value = ''
}

// 提交表单
async function handleSubmit() {
  if (!form.value.email || !form.value.password) {
    error.value = '请输入邮箱和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    let result
    if (mode.value === 'login') {
      result = await authApi.login({
        email: form.value.email,
        password: form.value.password
      })
    } else {
      result = await authApi.register({
        email: form.value.email,
        password: form.value.password,
        name: form.value.name
      })
    }

    if (result.success && result.data) {
      if (result.data.token) {
        authStore.setAuth(result.data.token, result.data.user)
        router.push('/')
      } else if (mode.value === 'register') {
        // 如果注册成功但没返回 token，切换到登录
        toggleMode('login')
        error.value = '注册成功，请登录'
      }
    } else {
      error.value = result.message || (mode.value === 'login' ? '登录失败' : '注册失败')
    }
  } catch (err: any) {
    error.value = err.message || '网络错误，请稍后再试'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const title = computed(() => mode.value === 'login' ? '欢迎回来' : '创建账号')
const submitText = computed(() => {
  if (loading.value) return mode.value === 'login' ? '登录中...' : '注册中...'
  return mode.value === 'login' ? '登录' : '立即注册'
})
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh]">
    <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300">
      <!-- 头部切换 Tab -->
      <div class="flex mb-8 bg-gray-100 p-1 rounded-lg">
        <button 
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 border-none outline-none cursor-pointer"
          :class="mode === 'login' ? 'bg-white shadow-sm text-blue-600' : 'bg-transparent text-gray-500 hover:text-gray-700'"
          @click="toggleMode('login')"
        >
          登录
        </button>
        <button 
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 border-none outline-none cursor-pointer"
          :class="mode === 'register' ? 'bg-white shadow-sm text-green-600' : 'bg-transparent text-gray-500 hover:text-gray-700'"
          @click="toggleMode('register')"
        >
          注册
        </button>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">{{ title }}</h2>
        <p class="text-gray-500 mt-2 text-sm">
          {{ mode === 'login' ? '请输入您的凭据以访问您的帐户' : '只需几秒钟即可开启您的智能服务之旅' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 姓名字段（仅注册显示） -->
        <div v-if="mode === 'register'" class="transition-all duration-300">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名 (可选)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <div class="i-carbon-user w-5 h-5"></div>
            </span>
            <input 
              id="name"
              v-model="form.name" 
              type="text" 
              placeholder="张三"
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
          </div>
        </div>

        <!-- 邮箱字段 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <div class="i-carbon-email w-5 h-5"></div>
            </span>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              required
              placeholder="name@example.com"
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
          </div>
        </div>
        
        <!-- 密码字段 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <div class="i-carbon-password w-5 h-5"></div>
            </span>
            <input 
              id="password"
              v-model="form.password" 
              type="password" 
              required
              placeholder="••••••••"
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <div class="i-carbon-error w-4 h-4"></div>
          {{ error }}
        </div>

        <!-- 提交按钮 -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="mode === 'login' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'"
        >
          {{ submitText }}
        </button>
      </form>
      
      <div class="mt-8 flex flex-col items-center gap-4">
        <p class="text-center text-xs text-gray-400">
          登录即表示您同意我们的 <router-link to="/docs/terms" class="text-gray-600 underline">服务条款</router-link> 和 <router-link to="/docs/privacy" class="text-gray-600 underline">隐私政策</router-link>
        </p>
        
        <!-- 服务器状态显示 -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
          <div 
            class="w-2 h-2 rounded-full transition-colors animate-pulse"
            :style="{ backgroundColor: SYSTEM_STATUS_CONFIG[serverStatus]?.bgColor }"
          ></div>
          <span class="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {{ SYSTEM_STATUS_CONFIG[serverStatus].text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以在此处添加更精细的过渡动画 */
</style>
