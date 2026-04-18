<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12">
    <div class="text-center">
      <div class="relative inline-block mb-8">
        <h1 class="text-9xl font-black text-gray-100 select-none">404</h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="i-carbon-error-filled w-20 h-20 text-blue-500 opacity-80"></div>
        </div>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-800 mb-4">页面不见了</h2>
      <p class="text-gray-500 mb-10 max-w-md mx-auto">
        抱歉，您访问的页面不存在或已被移除。请检查输入的地址是否正确。
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          @click="$router.push('/')" 
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
        >
          返回首页
        </button>
        <button 
          @click="$router.back()" 
          class="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all border-none cursor-pointer"
        >
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>
