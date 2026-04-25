<script setup lang="ts">
import { APP_NAME } from '../constants'
</script>

<template>
  <div class="max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">关于 {{ APP_NAME }}</h1>
      <p class="text-gray-600 leading-relaxed mb-4">
        这是一个基于 Vue 3 + TypeScript + TailwindCSS/UnoCSS 构建的 AI 智能客服前端系统。
      </p>
      <p class="text-gray-600 leading-relaxed">
        我们致力于提供最流畅的 AI 交互体验，帮助企业快速构建自己的智能服务门户。
      </p>
    </div>
  </div>
</template>
