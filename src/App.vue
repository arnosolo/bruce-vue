<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />

  <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <RouterView />
  </main>
</template>

<style>
/* Global styles or transitions if needed */
</style>
