<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../i18n'

interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmDisabled: false
})

const emit = defineEmits(['confirm', 'cancel'])
const { t } = useI18n()
const titleText = computed(() => props.title || t('common.confirm'))
const confirmLabel = computed(() => props.confirmText || t('common.confirm'))
const cancelLabel = computed(() => props.cancelText || t('common.cancel'))
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('cancel')"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ titleText }}</h3>
          <p class="text-gray-600">{{ message }}</p>
        </div>
        
        <div class="flex">
          <button 
            @click="emit('cancel')"
            class="flex-1 px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors font-medium border-r border-none"
          >
            {{ cancelLabel }}
          </button>
          <button 
            @click="!confirmDisabled && emit('confirm')"
            :disabled="confirmDisabled"
            class="flex-1 px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors font-bold border-none disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .relative {
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
