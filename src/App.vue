<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="p-4 border-b">
    <nav class="flex gap-4 justify-center">
      <RouterLink to="/" class="text-blue-500 hover:underline">Home</RouterLink>
      <RouterLink to="/about" class="text-blue-500 hover:underline">About</RouterLink>
    </nav>
  </header>

  <main class="p-4">
    <RouterView />
  </main>
</template>

<style scoped>
.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
