<script setup lang="ts">
import { APP_NAME } from '../constants'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <main class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-white to-blue-50/30">
    <div class="max-w-7xl mx-auto px-4 pt-12 pb-16 sm:px-6 lg:px-8 md:pt-20">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl tracking-tight leading-tight">
          <span class="block">下一代</span>
          <span class="block text-blue-600 mt-1 md:mt-2">AI 智能客服系统</span>
        </h1>
        <p class="mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-xl text-gray-500 leading-relaxed px-4">
          基于最新大语言模型，为您的业务提供 7x24 小时全天候智能支持。
          {{ APP_NAME }} 助力企业提升效率，降低成本。
        </p>
        <div class="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center gap-4 px-6">
          <RouterLink
            :to="authStore.isAuthenticated ? '/chat' : '/auth'"
            class="px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95 text-center"
          >
            开始对话
          </RouterLink>
          <RouterLink
            to="/about"
            class="px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-50 hover:border-blue-100 rounded-2xl transition-all text-center"
          >
            了解更多
          </RouterLink>
        </div>
      </div>

      <!-- Feature Grid -->
      <div class="mt-20 md:mt-24 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3">
        <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <span class="i-carbon-flash text-blue-600 text-2xl"></span>
          </div>
          <h3 class="text-lg md:text-xl font-bold text-gray-900">极速响应</h3>
          <p class="mt-3 md:mt-4 text-gray-500 text-sm md:text-base">毫秒级流式响应，像与真人对话一样流畅自然。</p>
        </div>
        <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <span class="i-carbon-chip text-indigo-600 text-2xl"></span>
          </div>
          <h3 class="text-lg md:text-xl font-bold text-gray-900">深度理解</h3>
          <p class="mt-3 md:mt-4 text-gray-500 text-sm md:text-base">理解复杂的业务逻辑，提供精准的问题解决方案。</p>
        </div>
        <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <span class="i-carbon-security text-emerald-600 text-2xl"></span>
          </div>
          <h3 class="text-lg md:text-xl font-bold text-gray-900">安全可靠</h3>
          <p class="mt-3 md:mt-4 text-gray-500 text-sm md:text-base">企业级加密与数据保护，确保您的对话信息安全。</p>
        </div>
      </div>
    </div>
  </main>
</template>
