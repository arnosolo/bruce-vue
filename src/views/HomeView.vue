<script setup lang="ts">
import { APP_NAME } from '../constants'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { USER_ROLE_CONFIG } from '../types/userRole';

const authStore = useAuthStore()
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
            <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">AI-Powered Operations</span>
          </div>
          
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            <span class="block">对话，即是</span>
            <span class="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-fill-transparent py-1">全能生产力</span>
          </h1>
          
          <p class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
            跳过繁琐的菜单与点击。在 {{ APP_NAME }} 中，只需一句简单的指令，AI 即可为您精准执行业务操作。
          </p>

          <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <RouterLink
              :to="authStore.isAuthenticated ? '/chat' : '/auth'"
              class="w-full sm:w-auto px-10 py-4 text-lg font-bold text-white bg-gray-900 hover:bg-blue-600 rounded-2xl shadow-2xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>立即开始对话</span>
              <span class="i-carbon-arrow-right text-xl"></span>
            </RouterLink>
            <RouterLink
              to="/about"
              class="w-full sm:w-auto px-10 py-4 text-lg font-bold text-gray-600 bg-white border-2 border-gray-100 hover:border-blue-200 hover:text-blue-600 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              了解工作原理
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
                      <span class="text-sm font-bold">{{ USER_ROLE_CONFIG.AI.text }}</span>
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
                        您好！我是您的智能助手。有什么我可以帮您的吗？
                      </div>
                    </div>
                    <div class="flex gap-3 justify-end">
                      <div class="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-xs text-white leading-relaxed shadow-sm">
                        把我的名字改成大黄
                      </div>
                      <div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 shadow-sm"></div>
                    </div>
                    <div class="flex gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                        <span class="i-carbon-bot text-xs"></span>
                      </div>
                      <div class="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-800 leading-relaxed border border-gray-100 shadow-sm">
                        好的，我已经将您的名字更改为大黄。
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

    <!-- Quick Features -->
    <div class="w-full flex justify-center">
      <div class="max-w-7xl w-full px-4 pb-24 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="group">
            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <span class="i-carbon-chat text-3xl"></span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">自然语言交互</h3>
            <p class="text-gray-500 leading-relaxed">告别复杂的 UI 路径，用最直觉的语言直接驱动后台功能。</p>
          </div>
          <div class="group">
            <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <span class="i-carbon-activity text-3xl"></span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">意图驱动引擎</h3>
            <p class="text-gray-500 leading-relaxed">智能解析用户真实意图，自动匹配最佳业务流程，响应快如闪电。</p>
          </div>
          <div class="group">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <span class="i-carbon-locked text-3xl"></span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">企业级私有化</h3>
            <p class="text-gray-600 leading-relaxed">严格的数据权限控制与加密机制，确保每一句对话的私密与安全。</p>
          </div>
        </div>
      </div>
    </div>
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
</style>
