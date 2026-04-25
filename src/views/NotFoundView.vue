<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-9xl font-black text-blue-100">404</h1>
      <p class="text-2xl font-bold text-gray-900 mt-4">页面未找到</p>
      <p class="text-gray-500 mt-2 mb-8">抱歉，您访问的页面不存在或已被移除。</p>
      <RouterLink
        to="/"
        class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
      >
        返回首页
      </RouterLink>
    </div>
  </div>
</template>
