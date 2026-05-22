<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { APP_NAME } from '../constants'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '../types/userRole'
import ConfirmModal from './ConfirmModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const navItems = computed(() => {
  const items = [
    { name: '首页', path: '/' },
    { name: '聊天', path: '/chat' }
  ]
  
  const role = authStore.user?.role
  
  if (role === UserRole.Admin || role === UserRole.Agent) {
    items.push({ name: '问题管理', path: '/faq-management' })
  }
  
  if (role === UserRole.Admin) {
    items.push({ name: '用户管理', path: '/user-management' })
  }
  
  items.push({ name: '关于', path: '/about' })
  return items
})

const showLogoutConfirm = ref(false)
const isMobileMenuOpen = ref(false)

function handleLogout() {
  showLogoutConfirm.value = true
  isMobileMenuOpen.value = false
}

function confirmLogout() {
  showLogoutConfirm.value = false
  authStore.logout()
  router.push('/auth')
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
    <nav class="flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 no-underline group" exact-active-class="none">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
          <span class="text-white font-bold text-xl">AI</span>
        </div>
        <span class="font-bold text-gray-900 text-lg tracking-tight">{{ APP_NAME }}</span>
      </RouterLink>
      
      <!-- Desktop Nav Items -->
      <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-1">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path" 
          v-slot="{ isActive }"
        >
          <span 
            :class="[
              'px-3 py-2 text-sm font-medium transition-colors rounded-md no-underline cursor-pointer',
              isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            ]"
          >
            {{ item.name }}
          </span>
        </RouterLink>
      </div>
      
      <!-- Desktop User Actions -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/profile" class="flex items-center gap-3 pr-4 border-r border-gray-200 no-underline hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" class="w-full h-full object-cover" />
              <span v-else class="text-xs font-bold text-gray-500">
                {{ (authStore.user?.name || authStore.user?.email || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="text-sm text-gray-600 font-medium">
              {{ authStore.user?.name || authStore.user?.email }}
            </span>
          </RouterLink>
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

      <!-- Mobile Menu Button -->
      <div class="flex md:hidden items-center gap-2">
        <button 
          v-if="authStore.isAuthenticated"
          @click="toggleMobileMenu" 
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span :class="isMobileMenuOpen ? 'i-carbon-close' : 'i-carbon-menu'" class="text-2xl"></span>
        </button>
        <RouterLink 
          v-else-if="$route.name !== 'auth'" 
          to="/auth" 
          class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg"
        >
          登录
        </RouterLink>
      </div>
    </nav>

    <!-- Mobile Navigation Drawer -->
    <div 
      v-if="isMobileMenuOpen && authStore.isAuthenticated" 
      class="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-xl animate-fade-in"
    >
      <div class="space-y-1 mb-6">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          @click="isMobileMenuOpen = false"
          v-slot="{ isActive }"
          class="block"
        >
          <div :class="[
            'px-4 py-3 rounded-xl text-base font-medium transition-all',
            isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          ]">
            {{ item.name }}
          </div>
        </RouterLink>
      </div>
      
      <div class="pt-4 border-t border-gray-100 flex flex-col gap-2">
        <RouterLink 
          to="/profile" 
          @click="isMobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
        >
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
            <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" class="w-full h-full object-cover" />
            <template v-else>
              {{ (authStore.user?.name || authStore.user?.email || 'U').charAt(0).toUpperCase() }}
            </template>
          </div>
          <div>
            <div class="text-sm font-bold text-gray-900">{{ authStore.user?.name || '用户' }}</div>
            <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
          </div>
        </RouterLink>
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-left font-medium"
        >
          <span class="i-carbon-logout text-xl"></span>
          退出登录
        </button>
      </div>
    </div>
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
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>
