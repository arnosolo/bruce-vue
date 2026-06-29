<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '../i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-9xl font-black text-blue-100">404</h1>
      <p class="text-2xl font-bold text-gray-900 mt-4">{{ t('notFound.title') }}</p>
      <p class="text-gray-500 mt-2 mb-8">{{ t('notFound.description') }}</p>
      <RouterLink
        to="/"
        class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
      >
        {{ t('notFound.home') }}
      </RouterLink>
    </div>
  </div>
</template>
