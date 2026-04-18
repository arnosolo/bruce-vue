<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import ConfirmModal from './components/ConfirmModal.vue'

const authStore = useAuthStore()
const router = useRouter()

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
  <header class="p-4 border-b">
    <nav class="flex gap-4 justify-between items-center max-w-4xl mx-auto">
      <div class="flex gap-4">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/" class="text-blue-500 hover:underline">Home</RouterLink>
          <RouterLink to="/about" class="text-blue-500 hover:underline">About</RouterLink>
        </template>
        <template v-else>
          <span class="font-bold">AI Customer Service</span>
        </template>
      </div>
      
      <div>
        <button 
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          class="text-sm text-red-500 hover:underline"
        >
          Logout ({{ authStore.user?.name || authStore.user?.email }})
        </button>
        <RouterLink 
          v-else-if="$route.name !== 'auth'" 
          to="/auth" 
          class="text-blue-500 hover:underline"
        >
          Login
        </RouterLink>
      </div>
    </nav>
  </header>

  <main class="p-4 max-w-4xl mx-auto">
    <RouterView />
  </main>

  <ConfirmModal
    :show="showLogoutConfirm"
    title="退出登录"
    message="您确定要退出当前账号吗？"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm = false"
  />
</template>

<style scoped>
.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
