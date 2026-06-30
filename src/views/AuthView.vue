<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../i18n'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'
import { systemApi } from '../api/system'
import { SystemStatus, SYSTEM_STATUS_CONFIG, getSystemStatusText } from '../types/system'
import { AuthMode, type AuthMode as AuthModeType } from '../types/auth'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// 服务器状态
const serverStatus = ref<SystemStatus>(SystemStatus.Checking)

// 状态控制，默认优先验证码登录
const mode = ref<AuthModeType>(AuthMode.CodeLogin)

// 表单数据
const form = ref({
  email: '',
  password: '',
  name: '',
  code: ''
})

const loading = ref(false)
const sendingCode = ref(false)
const codeSent = ref(false)
const resending = ref(false)
const error = ref('')
const successMessage = ref('')
const countdown = ref(0)
let timer: any = null

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
function toggleMode(target: AuthModeType) {
  mode.value = target
  error.value = ''
  successMessage.value = ''
  codeSent.value = false
  form.value.code = ''
}

// 开始倒计时
function startCountdown() {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 发送登录验证码
async function handleSendCode() {
  if (!form.value.email) {
    error.value = t('auth.enterEmailToGetCode')
    return
  }

  sendingCode.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const result = await authApi.sendLoginCode({ email: form.value.email })
    if (result.success) {
      codeSent.value = true
      successMessage.value = t('auth.codeSent')
      startCountdown()
    } else {
      error.value = result.message || t('auth.sendFailed')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || t('auth.sendLater')
  } finally {
    sendingCode.value = false
  }
}

// 提交表单
async function handleSubmit() {
  if (mode.value === AuthMode.Verify) {
    return handleVerify()
  }

  if (mode.value === AuthMode.CodeLogin) {
    return handleCodeLogin()
  }

  if (!form.value.email || !form.value.password) {
    error.value = t('auth.missingCredentials')
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    if (mode.value === AuthMode.Login) {
      const result = await authApi.login({
        email: form.value.email,
        password: form.value.password
      })
      if (result.success && result.data) {
        authStore.setAuth(result.data.token, result.data.user)
        router.push('/')
      } else {
        error.value = result.message || t('auth.loginFailed')
        if (error.value.includes('未验证')) {
          mode.value = AuthMode.Verify
          successMessage.value = t('auth.verifyBeforeLogin')
        }
      }
    } else {
      const result = await authApi.register({
        email: form.value.email,
        password: form.value.password,
        name: form.value.name
      })
      if (result.success) {
        mode.value = AuthMode.Verify
        successMessage.value = t('auth.registerSuccess')
        startCountdown()
      } else {
        error.value = result.message || t('auth.registerFailed')
      }
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || t('auth.networkError')
    if (error.value.includes('未验证') && mode.value === AuthMode.Login) {
      mode.value = AuthMode.Verify
      successMessage.value = t('auth.verifyBeforeLogin')
    }
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 验证码登录
async function handleCodeLogin() {
  if (!form.value.code || form.value.code.length !== 6) {
    error.value = t('auth.invalidCode')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await authApi.loginByCode({
      email: form.value.email,
      code: form.value.code
    })
    if (result.success && result.data) {
      authStore.setAuth(result.data.token, result.data.user)
      router.push('/')
    } else {
      error.value = result.message || t('auth.codeLoginFailed')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || t('auth.codeLoginFailed')
  } finally {
    loading.value = false
  }
}

// 验证验证码
async function handleVerify() {
  if (!form.value.code || form.value.code.length !== 6) {
    error.value = t('auth.invalidCode')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await authApi.verifyEmail({
      email: form.value.email,
      code: form.value.code
    })
    if (result.success) {
      successMessage.value = t('auth.verifySuccess')
      mode.value = AuthMode.Login
      form.value.code = ''
    } else {
      error.value = result.message || t('auth.verifyFailed')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || t('auth.codeExpired')
  } finally {
    loading.value = false
  }
}

// 重发验证码
async function handleResendCode() {
  if (countdown.value > 0 || resending.value) return

  resending.value = true
  error.value = ''
  
  try {
    const result = await authApi.resendCode({ email: form.value.email })
    if (result.success) {
      successMessage.value = t('auth.resendSuccess')
      startCountdown()
    } else {
      error.value = result.message || t('auth.sendFailed')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || t('auth.sendLater')
  } finally {
    resending.value = false
  }
}

const title = computed(() => {
  if (mode.value === AuthMode.Login) return t('auth.loginTitle')
  if (mode.value === AuthMode.Register) return t('auth.registerTitle')
  if (mode.value === AuthMode.CodeLogin) return t('auth.codeLoginTitle')
  return t('auth.verifyTitle')
})

const submitText = computed(() => {
  if (loading.value) {
    if (mode.value === AuthMode.Login) return t('auth.loginLoading')
    if (mode.value === AuthMode.Register) return t('auth.registerLoading')
    if (mode.value === AuthMode.CodeLogin) return t('auth.codeLoginLoading')
    return t('auth.verifyLoading')
  }
  if (mode.value === AuthMode.Login) return t('nav.login')
  if (mode.value === AuthMode.Register) return t('auth.registerSubmit')
  if (mode.value === AuthMode.CodeLogin) return t('auth.codeLoginSubmit')
  return t('auth.verifySubmit')
})
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh]">
    <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300">
      <!-- 头部切换 Tab -->
      <div v-if="mode !== AuthMode.Verify" class="flex mb-8 bg-gray-100 p-1 rounded-lg">
        <button 
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 border-none outline-none cursor-pointer"
          :class="mode === AuthMode.CodeLogin ? 'bg-white shadow-sm text-purple-600' : 'bg-transparent text-gray-500 hover:text-gray-700'"
          @click="toggleMode(AuthMode.CodeLogin)"
        >
          {{ t('auth.codeLoginTab') }}
        </button>
        <button 
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 border-none outline-none cursor-pointer"
          :class="mode === AuthMode.Login ? 'bg-white shadow-sm text-blue-600' : 'bg-transparent text-gray-500 hover:text-gray-700'"
          @click="toggleMode(AuthMode.Login)"
        >
          {{ t('auth.loginTab') }}
        </button>
        <button 
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 border-none outline-none cursor-pointer"
          :class="mode === AuthMode.Register ? 'bg-white shadow-sm text-green-600' : 'bg-transparent text-gray-500 hover:text-gray-700'"
          @click="toggleMode(AuthMode.Register)"
        >
          {{ t('auth.registerTab') }}
        </button>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">{{ title }}</h2>
        <p class="text-gray-500 mt-2 text-sm">
          <template v-if="mode === AuthMode.Login">{{ t('auth.loginSubtitle') }}</template>
          <template v-else-if="mode === AuthMode.Register">{{ t('auth.registerSubtitle') }}</template>
          <template v-else-if="mode === AuthMode.CodeLogin">{{ t('auth.codeLoginSubtitle') }}</template>
          <template v-else>{{ t('auth.verifySubtitle', { email: form.email }) }}</template>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 验证码模式（邮箱验证） -->
        <div v-if="mode === AuthMode.Verify" class="space-y-4">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.codeLabel') }}</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <div class="i-carbon-security w-5 h-5"></div>
              </span>
              <input 
                id="code"
                v-model="form.code" 
                type="text" 
                maxlength="6"
                required
                placeholder="123456"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
              >
            </div>
          </div>
          
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">{{ t('auth.noEmail') }}</span>
            <button 
              type="button" 
              class="text-blue-600 font-medium hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer border-none bg-transparent"
              :disabled="countdown > 0 || resending"
              @click="handleResendCode"
            >
              {{ countdown > 0 ? t('auth.resendIn', { seconds: countdown }) : (resending ? t('auth.sending') : t('auth.resendCode')) }}
            </button>
          </div>
        </div>

        <!-- 验证码登录模式 -->
        <div v-else-if="mode === AuthMode.CodeLogin" class="space-y-4">
          <!-- 邮箱 -->
          <div>
            <label for="codeLoginEmail" class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.emailLabel') }}</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <div class="i-carbon-email w-5 h-5"></div>
              </span>
              <input 
                id="codeLoginEmail"
                v-model="form.email" 
                type="email" 
                required
                placeholder="name@example.com"
                class="block w-full pl-10 pr-24 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
              <button 
                type="button"
                class="absolute inset-y-0 right-0 px-3 py-1.5 m-1 rounded-md text-sm font-medium text-white transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                :class="countdown > 0 ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'"
                :disabled="sendingCode || countdown > 0 || !form.email"
                @click="handleSendCode"
              >
                {{ sendingCode ? t('auth.sending') : (countdown > 0 ? t('auth.resendIn', { seconds: countdown }) : t('auth.sendCode')) }}
              </button>
            </div>
          </div>

          <!-- 验证码输入 -->
          <div v-if="codeSent">
            <label for="codeLoginCode" class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.codeLabel') }}</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <div class="i-carbon-security w-5 h-5"></div>
              </span>
              <input 
                id="codeLoginCode"
                v-model="form.code" 
                type="text" 
                maxlength="6"
                required
                placeholder="123456"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
              >
            </div>
          </div>

          <!-- 切换到密码登录 -->
          <div class="text-center pt-1">
            <button 
              type="button" 
              class="text-sm text-blue-600 hover:text-blue-700 font-medium border-none bg-transparent cursor-pointer transition-colors"
              @click="toggleMode(AuthMode.Login)"
            >
              {{ t('auth.usePasswordLogin') }}
            </button>
          </div>
        </div>

        <template v-else>
          <!-- 姓名字段（仅注册显示） -->
          <div v-if="mode === AuthMode.Register" class="transition-all duration-300">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.nameLabel') }}</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <div class="i-carbon-user w-5 h-5"></div>
              </span>
              <input 
                id="name"
                v-model="form.name" 
                type="text" 
                :placeholder="t('auth.namePlaceholder')"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
            </div>
          </div>

          <!-- 邮箱字段 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.emailLabel') }}</label>
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
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.passwordLabel') }}</label>
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

          <!-- 切换到验证码登录（仅登录模式显示） -->
          <div v-if="mode === AuthMode.Login" class="text-right">
            <button 
              type="button" 
              class="text-sm text-purple-600 hover:text-purple-700 font-medium border-none bg-transparent cursor-pointer transition-colors"
              @click="toggleMode(AuthMode.CodeLogin)"
            >
              {{ t('auth.useCodeLogin') }}
            </button>
          </div>
        </template>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
          <div class="i-carbon-checkmark-filled w-4 h-4"></div>
          {{ successMessage }}
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <div class="i-carbon-error w-4 h-4"></div>
          {{ error }}
        </div>

        <!-- 提交按钮 -->
        <button 
          type="submit" 
          :disabled="loading || (mode === AuthMode.CodeLogin && !codeSent)"
          class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': mode === AuthMode.Login,
            'bg-green-600 hover:bg-green-700 focus:ring-green-500': mode === AuthMode.Register,
            'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500': mode === AuthMode.Verify,
            'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500': mode === AuthMode.CodeLogin
          }"
        >
          {{ submitText }}
        </button>

        <!-- 底部操作 (仅验证模式) -->
        <div v-if="mode === AuthMode.Verify" class="flex flex-col gap-3 pt-2">
          <button 
            type="button" 
            class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium border-none bg-transparent cursor-pointer transition-colors"
            @click="toggleMode(AuthMode.Login)"
          >
            {{ t('auth.backToLogin') }}
          </button>
          <button 
            type="button" 
            class="w-full text-center text-sm text-gray-500 hover:text-gray-700 border-none bg-transparent cursor-pointer transition-colors"
            @click="toggleMode(AuthMode.Register)"
          >
            {{ t('auth.registerAgain') }}
          </button>
        </div>
      </form>
      
      <div class="mt-8 flex flex-col items-center gap-4">
        <p class="text-center text-xs text-gray-400">
          {{ t('auth.agreementPrefix') }}
          <router-link to="/docs/terms" class="text-gray-600 underline">{{ t('footer.terms') }}</router-link>
          {{ t('auth.agreementAnd') }}
          <router-link to="/docs/privacy" class="text-gray-600 underline">{{ t('footer.privacy') }}</router-link>
        </p>
        
        <!-- 服务器状态显示 -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
          <div 
            class="w-2 h-2 rounded-full transition-colors animate-pulse"
            :style="{ backgroundColor: SYSTEM_STATUS_CONFIG[serverStatus]?.bgColor }"
          ></div>
          <span class="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {{ getSystemStatusText(serverStatus) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以在此处添加更精细的过渡动画 */
</style>
