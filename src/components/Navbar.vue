<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { APP_NAME } from '../constants'
import { useAuthStore } from '../stores/auth'
import ConfirmModal from './ConfirmModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const navItems = [
  { name: '首页', path: '/' },
  { name: '关于', path: '/about' }
]

const showLogoutConfirm = ref(false)

function handleLogout() {
  showLogoutConfirm.value = true
}

function confirmLogout() {
  showLogoutConfirm.value = false
  authStore.logout()
  router.push('/auth')
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
    <nav class="flex h-16 items-center justify-between max-w-5xl mx-auto px-4 sm:px-6">
      <div class="flex items-center gap-8">
        <RouterLink to="/" class="flex items-center gap-2 no-underline group" exact-active-class="none">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <span class="text-white font-bold text-xl">AI</span>
          </div>
          <span class="font-bold text-gray-900 text-lg tracking-tight">{{ APP_NAME }}</span>
        </RouterLink>
        
        <div v-if="authStore.isAuthenticated" class="flex items-center gap-1">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.path" 
            :to="item.path" 
            v-slot="{ isActive }"
          >
            <span 
              :class="[
                'px-3 py-2 text-sm font-medium transition-colors rounded-md no-underline cursor-pointer',
                isActive ? 'text-blue-600 bg-gray-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              ]"
            >
              {{ item.name }}
            </span>
          </RouterLink>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <template v-if="authStore.isAuthenticated">
          <div class="flex items-center gap-3 pr-4 border-r border-gray-200">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span class="text-xs font-bold text-gray-500">
                {{ (authStore.user?.name || authStore.user?.email || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="hidden sm:inline text-sm text-gray-600 font-medium">
              {{ authStore.user?.name || authStore.user?.email }}
            </span>
          </div>
          <button 
            @click="handleLogout"
            class="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            退出
          </button>
        </template>
        <RouterLink 
          v-else-if="$route.name !== 'auth'" 
          to="/auth" 
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-sm"
        >
          登录
        </RouterLink>
      </div>
    </nav>
  </header>

  <ConfirmModal
    :show="showLogoutConfirm"
    title="退出登录"
    message="您确定要退出当前账号吗？"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm = false"
  />
</template>

<style scoped>
/* 使用 v-slot 动态控制样式，不再需要 .router-link-active */
</style>
