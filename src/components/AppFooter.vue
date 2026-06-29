<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { APP_VERSION, SOURCE_CODE_URL, ICP_FILING_NUMBER } from '../constants'
import { RouterLink } from 'vue-router'
import { systemApi } from '../api/system'
import { useI18n } from '../i18n'
import { SystemStatus, SYSTEM_STATUS_CONFIG, getSystemStatusText } from '../types/system'
import app_icon from '../assets/app-icon-256.jpg'

const currentYear = new Date().getFullYear()
const { t } = useI18n()

// 服务器状态
const serverStatus = ref<SystemStatus>(SystemStatus.Checking)

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
</script>

<template>
  <footer class="bg-white border-t border-gray-100 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <!-- Brand & Description -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <img :src="app_icon" alt="App icon" class="w-8 h-8 rounded-lg">
            <span class="font-bold text-gray-900 text-lg tracking-tight">{{ t('app.name') }}</span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed max-w-xs">
            {{ t('footer.description') }}
          </p>
        </div>

        <!-- Links -->
        <div class="grid grid-cols-2 gap-8 md:col-span-1">
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">{{ t('footer.product') }}</h4>
            <ul class="space-y-3 list-none p-0">
              <li>
                <RouterLink to="/" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">{{ t('nav.home') }}</RouterLink>
              </li>
              <li>
                <RouterLink to="/chat" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">{{ t('footer.startChat') }}</RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">{{ t('footer.legal') }}</h4>
            <ul class="space-y-3 list-none p-0">
              <li>
                <RouterLink to="/docs/terms" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">{{ t('footer.terms') }}</RouterLink>
              </li>
              <li>
                <RouterLink to="/docs/privacy" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">{{ t('footer.privacy') }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Info & Source -->
        <div class="space-y-4 md:text-right">
          <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">{{ t('footer.systemInfo') }}</h4>
          <div class="flex flex-col md:items-end gap-3">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>{{ t('footer.version') }}</span>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-900 font-mono font-bold rounded text-[10px]">{{ APP_VERSION }}</span>
            </div>
            <a 
              :href="SOURCE_CODE_URL"
              target="_blank"
              class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <span class="i-carbon-logo-github text-lg"></span>
              <span>{{ t('footer.source') }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p class="text-xs text-gray-400">
            {{ t('footer.rights', { year: currentYear, appName: t('app.name') }) }}
          </p>
          <span class="text-xs text-gray-400">
            {{ ICP_FILING_NUMBER }}
          </span>
        </div>
        <div class="flex items-center gap-6">
          <span 
            class="flex items-center gap-1.5 text-xs font-medium"
            :style="{ color: SYSTEM_STATUS_CONFIG[serverStatus]?.textColor }"
          > 
            <span
              class="w-1.5 h-1.5 rounded-full transition-colors animate-pulse"
              :style="{ backgroundColor: SYSTEM_STATUS_CONFIG[serverStatus]?.bgColor }"
            ></span>
            {{ getSystemStatusText(serverStatus) }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
