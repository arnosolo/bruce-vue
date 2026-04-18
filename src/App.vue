<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { useCounterStore } from './stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div class="p-4 flex flex-col items-center gap-4">
    <h1 class="text-3xl font-bold text-blue-500">Hello UnoCSS!</h1>
    <div class="flex items-center gap-2">
      <button 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        @click="counter.increment"
      >
        Count: {{ counter.count }}
      </button>
      <span class="text-gray-500">Double: {{ counter.doubleCount }}</span>
    </div>
    <HelloWorld msg="Vite + Vue + UnoCSS + Pinia" />
  </div>
</template>
