<script setup lang="ts">
import { useI18n } from '../i18n'

/**
 * 通用分页组件
 */
interface Props {
  page: number
  totalPages: number
  total: number
  loading?: boolean
}

interface Emits {
  (e: 'change', page: number): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()
const { t } = useI18n()

function handlePageChange(newPage: number) {
  if (
    props.loading ||
    newPage < 1 ||
    newPage > props.totalPages ||
    newPage === props.page
  ) {
    return
  }
  emit('change', newPage)
}

/**
 * 计算要显示的页码列表 (简单实现，显示当前页前后各 2 页)
 */
const getVisiblePages = () => {
  const delta = 2
  const range: number[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number | undefined

  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || (i >= props.page - delta && i <= props.page + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
    <!-- Total info -->
    <div class="text-sm text-gray-500">
      {{ t('pagination.summary', { total, page, totalPages }) }}
    </div>

    <!-- Page navigation -->
    <div class="flex items-center gap-1.5">
      <!-- Prev -->
      <button
        @click="handlePageChange(page - 1)"
        :disabled="page === 1 || loading"
        class="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-blue-200"
        :title="t('pagination.prev')"
      >
        <span class="i-carbon-chevron-left text-lg block"></span>
      </button>

      <!-- Page numbers -->
      <div class="hidden sm:flex items-center gap-1.5 mx-1">
        <template v-for="p in getVisiblePages()" :key="p">
          <span
            v-if="p === '...'"
            class="w-9 h-9 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
          <button
            v-else
            @click="handlePageChange(p as number)"
            :disabled="loading"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all',
              page === p
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-110 z-10'
                : 'text-gray-600 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600'
            ]"
          >
            {{ p }}
          </button>
        </template>
      </div>

      <!-- Next -->
      <button
        @click="handlePageChange(page + 1)"
        :disabled="page === totalPages || loading"
        class="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-blue-200"
        :title="t('pagination.next')"
      >
        <span class="i-carbon-chevron-right text-lg block"></span>
      </button>
    </div>
  </div>
</template>
