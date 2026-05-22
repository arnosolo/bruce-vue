<script setup lang="ts">
import { APP_NAME, APP_VERSION, SOURCE_CODE_URL } from '../constants'

const features = [
  {
    title: '对话即操作',
    description: '无需寻找复杂的菜单，直接告诉 AI 你的需求。从查询信息到修改设置，一切操作都在对话中完成。',
    icon: 'i-carbon-chat'
  },
  {
    title: '意图精准识别',
    description: '深度理解自然语言，精准捕获用户意图。将繁琐的多步点击简化为一句简单的指令。',
    icon: 'i-carbon-send-alt'
  },
  {
    title: '零学习成本',
    description: '摆脱传统图形界面的束缚，用最自然的交流方式使用系统。让每一位用户都能像操作专家一样高效。',
    icon: 'i-carbon-user-favorite'
  },
  {
    title: '全场景覆盖',
    description: '无论是业务咨询、故障排查还是后台管理，AI 都能成为你最得力的交互入口。',
    icon: 'i-carbon-grid'
  }
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
    <!-- Hero Section -->
    <div class="text-center mb-16 lg:mb-24">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-200 mb-8">
        <span class="i-carbon-flash text-4xl"></span>
      </div>
      <h1 class="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
        重塑 <span class="text-blue-600 text-gradient">人机交互体验</span>
      </h1>
      <p class="max-w-3xl mx-auto text-lg lg:text-xl text-gray-500 leading-relaxed">
        我们打破了传统图形界面 (GUI) 的条条框框。在 {{ APP_NAME }} 中，<b>对话不仅是交流，更是行动。</b> 通过自然语言指令，用户可以直接驱动复杂业务逻辑，实现“言出法随”的高效服务。
      </p>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
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

    <!-- System Info & Note -->
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">服务宗旨</h2>
          <p class="text-gray-600 leading-relaxed">
            我们不仅仅是在构建一个聊天工具，而是在打造一个能够真正理解用户需求、提供有价值帮助的智能伙伴。通过不断的模型迭代与知识库积累，让每一次沟通都变得更高效。
          </p>
        </div>
      </div>

      <div class="relative">
        <div class="absolute -inset-4 bg-blue-100/50 rounded-3xl blur-2xl"></div>
        <div class="relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between mb-8">
            <h3 class="font-bold text-gray-900">系统信息</h3>
            <span class="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase tracking-widest">Running</span>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-gray-50">
              <span class="text-sm text-gray-500">当前版本</span>
              <span class="text-sm font-mono font-bold text-gray-900">{{ APP_VERSION }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-50">
              <span class="text-sm text-gray-500">开源许可</span>
              <span class="text-sm font-bold text-gray-900">MIT License</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-sm text-gray-500">最后更新</span>
              <span class="text-sm font-bold text-gray-900">2026-05-22</span>
            </div>
          </div>

          <a 
            :href="SOURCE_CODE_URL"
            target="_blank"
            class="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <span class="i-carbon-logo-github text-lg"></span>
            查看源代码
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
