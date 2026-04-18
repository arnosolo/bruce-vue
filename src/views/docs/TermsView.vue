<template>
  <div class="max-w-3xl mx-auto py-12 px-6">
    <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors border-none bg-transparent cursor-pointer">
      <div class="i-carbon-arrow-left"></div>
      返回
    </button>
    
    <article class="prose prose-slate lg:prose-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">服务条款</h1>
      <p class="text-gray-600 mb-4">最后更新日期：2026年4月18日</p>
      
      <section class="space-y-6 text-gray-700 leading-relaxed">
        <h2 class="text-xl font-semibold text-gray-900">1. 服务说明</h2>
        <p>本 AI 客户服务系统致力于为您提供智能、高效的自动化服务支持。通过使用本服务，您同意遵守以下各项条款。</p>
        
        <h2 class="text-xl font-semibold text-gray-900">2. 用户责任</h2>
        <p>用户在使用本系统时，必须遵守当地相关法律法规，不得利用本系统生成、传播违法、违规或侵犯他人权益的内容。</p>
        
        <h2 class="text-xl font-semibold text-gray-900">3. 账号安全</h2>
        <p>您有责任妥善保管您的登录凭据，并对您账号下发生的所有活动负责。</p>
      </section>
    </article>
  </div>
</template>
