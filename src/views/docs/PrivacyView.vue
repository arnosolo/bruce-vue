<script setup lang="ts">
import { useI18n } from '../../i18n'

const { t } = useI18n()
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="max-w-3xl w-full py-12 px-6">
    <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors border-none bg-transparent cursor-pointer">
      <div class="i-carbon-arrow-left"></div>
      {{ t('common.back') }}
    </button>
    
    <article class="prose prose-slate lg:prose-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">{{ t('docs.privacyTitle') }}</h1>
      <p class="text-gray-600 mb-4">{{ t('docs.privacyUpdated') }}</p>
      
      <section class="space-y-6 text-gray-700 leading-relaxed">
        <h2 class="text-xl font-semibold text-gray-900">{{ t('docs.privacySection1') }}</h2>
        <p>{{ t('docs.privacyP1') }}</p>
        
        <h2 class="text-xl font-semibold text-gray-900">{{ t('docs.privacySection2') }}</h2>
        <p>{{ t('docs.privacyP2') }}</p>
        
        <h2 class="text-xl font-semibold text-gray-900">{{ t('docs.privacySection3') }}</h2>
        <p>{{ t('docs.privacyP3') }}</p>
      </section>
    </article>
    </div>
  </div>
</template>
