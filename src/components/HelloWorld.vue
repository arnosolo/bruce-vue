<script setup lang="ts">
interface Props {
  count: number
}

interface Emits {
  (e: 'change', val: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClick() {
  emit('change', props.count + 1)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>
      {{ count }}
    </p>
    <button class="bg-gray-100 rounded-2 p-4" @click="handleClick">
      +1
    </button>
  </div>
</template>
