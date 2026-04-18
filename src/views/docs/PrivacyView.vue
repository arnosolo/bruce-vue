<template>
  <div class="max-w-3xl mx-auto py-12 px-6">
    <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors border-none bg-transparent cursor-pointer">
      <div class="i-carbon-arrow-left"></div>
      返回
    </button>
    
    <article class="prose prose-slate lg:prose-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">隐私政策</h1>
      <p class="text-gray-600 mb-4">最后更新日期：2026年4月18日</p>
      
      <section class="space-y-6 text-gray-700 leading-relaxed">
        <h2 class="text-xl font-semibold text-gray-900">1. 数据收集</h2>
        <p>我们仅收集提供服务所必需的信息，包括但不限于电子邮箱、您的姓名（可选）以及在使用过程中产生的服务记录。</p>
        
        <h2 class="text-xl font-semibold text-gray-900">2. 数据使用</h2>
        <p>收集的信息主要用于优化 AI 回复质量、提供个性化支持以及确保您的账号安全。</p>
        
        <h2 class="text-xl font-semibold text-gray-900">3. 隐私保护</h2>
        <p>我们采用先进的加密技术保护您的个人隐私，绝不会在未经许可的情况下将您的数据泄露给任何第三方机构。</p>
      </section>
    </article>
  </div>
</template>
