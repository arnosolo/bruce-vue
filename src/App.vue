<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const route = useRoute()

// 只有不在聊天页面时才显示页脚
const showFooter = computed(() => route.name !== 'chat')

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUserProfile()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />
    <main class="flex-1 flex flex-col min-w-0">
      <RouterView />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<style scoped>
</style>
