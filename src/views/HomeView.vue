<script setup lang="ts">
import { computed } from 'vue'
import { APP_VERSION, SOURCE_CODE_URL } from '../constants'
import { RouterLink } from 'vue-router'
import { useI18n } from '../i18n'
import { useAuthStore } from '../stores/auth'
import { UserRole, getUserRoleLabel } from '../types/userRole';

const authStore = useAuthStore()
const { t } = useI18n()

const features = computed(() => [
  {
    title: t('home.feature1Title'),
    description: t('home.feature1Description'),
    icon: 'i-carbon-chat'
  },
  {
    title: t('home.feature2Title'),
    description: t('home.feature2Description'),
    icon: 'i-carbon-send-alt'
  },
  {
    title: t('home.feature3Title'),
    description: t('home.feature3Description'),
    icon: 'i-carbon-user-favorite'
  },
  {
    title: t('home.feature4Title'),
    description: t('home.feature4Description'),
    icon: 'i-carbon-grid'
  }
])
</script>

<template>
  <main class="min-h-[calc(100vh-64px)] bg-white overflow-hidden">
    <!-- Hero Section -->
    <div class="relative pt-12 pb-20 lg:pt-24 lg:pb-32 flex flex-col items-center">
      <!-- Background Decoration -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div class="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div class="max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in">
            <span class="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">{{ t('home.badge') }}</span>
          </div>
          
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            <span class="block">{{ t('home.heroLine1') }}</span>
            <span class="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-fill-transparent py-1">{{ t('home.heroLine2') }}</span>
          </h1>
          
          <p class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
            {{ t('home.heroDescription', { appName: t('app.name') }) }}
          </p>

          <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <RouterLink
              :to="authStore.isAuthenticated ? '/chat' : '/auth'"
              class="w-full sm:w-auto px-10 py-4 text-lg font-bold text-white bg-gray-900 hover:bg-blue-600 rounded-2xl shadow-2xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>{{ t('home.cta') }}</span>
              <span class="i-carbon-arrow-right text-xl"></span>
            </RouterLink>
          </div>
        </div>

        <!-- Mockup / Preview -->
        <div class="mt-20 relative animate-fade-in-up">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-20"></div>
          <div class="relative bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden aspect-[16/9] lg:aspect-[21/9] flex">
            <!-- Simulated Sidebar -->
            <div class="w-16 lg:w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-4 hidden sm:flex">
              <div class="flex items-center gap-3 px-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-blue-600"></div>
                <div class="h-4 w-24 bg-gray-200 rounded hidden lg:block"></div>
              </div>
              <div v-for="i in 5" :key="i" class="flex items-center gap-3 px-2">
                <div class="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0"></div>
                <div class="h-3 w-full bg-gray-100 rounded hidden lg:block"></div>
              </div>
            </div>

            <!-- Simulated Main Content -->
            <div class="flex-1 p-6 lg:p-10 bg-white relative overflow-hidden">
              <div class="flex flex-col gap-8">
                <!-- Header -->
                <div class="flex justify-between items-end">
                  <div class="space-y-2">
                    <div class="h-6 w-32 bg-gray-200 rounded"></div>
                    <div class="h-4 w-48 bg-gray-100 rounded"></div>
                  </div>
                  <div class="h-10 w-32 bg-gray-100 rounded-xl"></div>
                </div>

                <!-- Stat Cards -->
                <div class="grid grid-cols-3 gap-6">
                  <div v-for="i in 3" :key="i" class="p-6 border border-gray-100 rounded-2xl space-y-4">
                    <div class="w-10 h-10 rounded-xl bg-gray-50"></div>
                    <div class="h-4 w-20 bg-gray-200 rounded"></div>
                    <div class="h-8 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>

                <!-- Big Chart Placeholder -->
                <div class="flex-1 min-h-[200px] bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex items-end p-8 gap-4">
                  <div v-for="i in 12" :key="i" 
                    class="flex-1 bg-blue-100 rounded-t-lg transition-all"
                    :style="{ height: `${Math.random() * 60 + 20}%` }"
                  ></div>
                </div>
              </div>

              <!-- AI Interaction Overlay (The Highlight) -->
              <div class="absolute inset-0 bg-blue-900/5 backdrop-blur-[2px] flex items-center justify-center p-6">
                <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden animate-float">
                  <div class="p-4 bg-blue-600 text-white flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="i-carbon-bot text-xl"></span>
                      <span class="text-sm font-bold">{{ getUserRoleLabel(UserRole.AI) }}</span>
                    </div>
                    <div class="flex gap-1">
                      <div class="w-2 h-2 rounded-full bg-white/40"></div>
                      <div class="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>
                  </div>
                  <div class="p-6 space-y-4 bg-gray-50">
                    <div class="flex gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                        <span class="i-carbon-bot text-xs"></span>
                      </div>
                      <div class="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-800 leading-relaxed border border-gray-100 shadow-sm">
                        {{ t('home.demoBotGreeting') }}
                      </div>
                    </div>
                    <div class="flex gap-3 justify-end">
                      <div class="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-xs text-white leading-relaxed shadow-sm">
                        {{ t('home.demoUserMessage') }}
                      </div>
                      <div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 shadow-sm"></div>
                    </div>
                    <div class="flex gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                        <span class="i-carbon-bot text-xs"></span>
                      </div>
                      <div class="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-800 leading-relaxed border border-gray-100 shadow-sm">
                        {{ t('home.demoBotReply') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Features Section -->
    <section id="features" class="w-full flex justify-center bg-gray-50/50 py-24">
      <div class="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-black text-gray-900 mb-4 text-gradient">{{ t('home.featuresTitle') }}</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">{{ t('home.featuresSubtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span :class="[feature.icon, 'text-2xl']"></span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- System Info & About Section -->
    <section id="about" class="w-full flex justify-center py-24">
      <div class="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div class="flex lg:justify-center items-center gap-16">
          <div class="relative flex-1 lg:max-w-xl">
            <div class="absolute -inset-4 bg-blue-100/50 rounded-3xl blur-2xl"></div>
            <div class="relative bg-white border border-gray-100 rounded-3xl p-10 shadow-sm overflow-hidden">
              <div class="flex items-center justify-between mb-8">
                <h3 class="font-bold text-gray-900 text-xl">{{ t('footer.systemInfo') }}</h3>
              </div>
              
              <div class="space-y-6">
                <div class="flex justify-between items-center py-4 border-b border-gray-50">
                  <span class="text-gray-500">{{ t('footer.version') }}</span>
                  <span class="font-mono font-bold text-gray-900">{{ APP_VERSION }}</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-50">
                  <span class="text-gray-500">{{ t('home.license') }}</span>
                  <span class="font-bold text-gray-900">MIT License</span>
                </div>
              </div>

              <a 
                :href="SOURCE_CODE_URL"
                target="_blank"
                class="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
              >
                <span class="i-carbon-logo-github text-2xl"></span>
                <span>{{ t('home.viewSource') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.text-fill-transparent {
  -webkit-text-fill-color: transparent;
}

.text-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
