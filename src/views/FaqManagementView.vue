<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { faqApi } from '../api/faq'
import type { Faq, CreateFaqRequest } from '../types/faq'
import type { Pagination as PaginationType } from '../types/api'
import ConfirmModal from '../components/ConfirmModal.vue'
import Pagination from '../components/Pagination.vue'

const faqs = ref<Faq[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')

// Pagination state
const pagination = ref<PaginationType>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})

// Modal state
const showFormModal = ref(false)
const showDeleteConfirm = ref(false)
const currentFaq = ref<Faq | null>(null)
const formData = reactive<CreateFaqRequest>({
  question: '',
  answer: ''
})
const isSubmitting = ref(false)

async function fetchFaqs(page = pagination.value.page) {
  loading.value = true
  error.value = null
  try {
    const res = await faqApi.getFaqs({ 
      page, 
      limit: pagination.value.limit,
      keyword: searchQuery.value || undefined
    })
    if (res.success && res.data) {
      faqs.value = res.data.list
      pagination.value = res.data.pagination
    } else {
      error.value = res.message
    }
  } catch (err: any) {
    error.value = err.message || '获取列表失败'
  } finally {
    loading.value = false
  }
}

// Search with debounce
let searchTimer: any = null
watch(searchQuery, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchFaqs(1)
  }, 500)
})

function openAddModal() {
  currentFaq.value = null
  formData.question = ''
  formData.answer = ''
  showFormModal.value = true
}

function openEditModal(faq: Faq) {
  currentFaq.value = faq
  formData.question = faq.question
  formData.answer = faq.answer
  showFormModal.value = true
}

function confirmDelete(faq: Faq) {
  currentFaq.value = faq
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!currentFaq.value) return
  isSubmitting.value = true
  try {
    const res = await faqApi.deleteFaq(currentFaq.value.id)
    if (res.success) {
      showDeleteConfirm.value = false
      // If current page is empty after delete and not first page, go back
      const targetPage = (faqs.value.length === 1 && pagination.value.page > 1) 
        ? pagination.value.page - 1 
        : pagination.value.page
      await fetchFaqs(targetPage)
    } else {
      alert(res.message)
    }
  } catch (err: any) {
    alert(err.message || '删除失败')
  } finally {
    isSubmitting.value = false
  }
}

async function handleSubmit() {
  if (!formData.question || !formData.answer) return
  isSubmitting.value = true
  try {
    let res
    if (currentFaq.value) {
      res = await faqApi.updateFaq(currentFaq.value.id, formData)
    } else {
      res = await faqApi.createFaq(formData)
    }
    
    if (res.success) {
      showFormModal.value = false
      await fetchFaqs(currentFaq.value ? pagination.value.page : 1)
    } else {
      alert(res.message)
    }
  } catch (err: any) {
    alert(err.message || '提交失败')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => fetchFaqs(1))
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">常见问题管理</h1>
        <p class="mt-1 text-sm text-gray-500">管理展示在客户端的常见问题与解答</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search Bar -->
        <div class="relative flex-1 sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 i-carbon-search text-gray-400"></span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索问题或答案..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            @keyup.enter="fetchFaqs(1)"
          />
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="fetchFaqs(1)"
            :disabled="loading"
            class="flex-1 sm:flex-none px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span v-if="loading" class="i-carbon-progress-bar-round animate-spin"></span>
            搜索
          </button>
          <button 
            @click="openAddModal"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap text-sm font-bold"
          >
            <span class="i-carbon-add text-xl"></span>
            <span>添加问题</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Container -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <!-- Loading State -->
      <div v-if="loading && faqs.length === 0" class="flex justify-center py-24">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-500 text-sm px-4 text-center">加载常见问题中...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 sm:p-12 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-4">
          <span class="i-carbon-error text-2xl"></span>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">获取数据失败</h3>
        <p class="text-gray-500 text-sm mb-6 px-4">{{ error }}</p>
        <button 
          @click="fetchFaqs()" 
          class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-bold"
        >
          重试
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="faqs.length === 0" class="px-6 py-24 text-center text-gray-500">
        <div class="flex flex-col items-center">
          <span class="i-carbon-help text-5xl mb-4 opacity-10"></span>
          <p class="text-lg font-medium text-gray-400 px-6">{{ searchQuery ? '未找到匹配的问题' : '暂无常见问题数据' }}</p>
          <p class="text-sm text-gray-400 mt-1 px-6">尝试调整搜索关键词或立即添加新问题</p>
          <button v-if="!searchQuery" @click="openAddModal" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold">
            立即添加
          </button>
        </div>
      </div>

      <!-- FAQ List -->
      <template v-else>
        <div class="divide-y divide-gray-100" :class="{ 'opacity-50 transition-opacity': loading }">
          <div 
            v-for="faq in faqs" 
            :key="faq.id" 
            class="p-6 hover:bg-gray-50/50 transition-colors group"
          >
            <div class="flex flex-col sm:flex-row justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-3">
                  <span class="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    ID: {{ faq.id }}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {{ faq.question }}
                </h3>
                <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{{ faq.answer }}</p>
              </div>
              
              <div class="flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 mt-2 sm:mt-0">
                <button 
                  @click="openEditModal(faq)"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span class="i-carbon-edit text-lg"></span>
                  <span class="sm:hidden lg:inline">编辑</span>
                </button>
                <button 
                  @click="confirmDelete(faq)"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span class="i-carbon-trash-can text-lg"></span>
                  <span class="sm:hidden lg:inline">删除</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            :page="pagination.page"
            :total-pages="pagination.totalPages"
            :total="pagination.total"
            :loading="loading"
            @change="fetchFaqs"
          />
        </div>
      </template>
    </div>

    <!-- Form Modal -->
    <Transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showFormModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">
              {{ currentFaq ? '编辑常见问题' : '添加常见问题' }}
            </h2>
            <button @click="showFormModal = false" class="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <span class="i-carbon-close text-2xl"></span>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto space-y-6">
            <div class="space-y-1.5">
              <label class="block text-sm font-bold text-gray-700">问题标题</label>
              <input 
                v-model="formData.question"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="例如：如何找回密码？"
              />
            </div>
            
            <div class="space-y-1.5">
              <label class="block text-sm font-bold text-gray-700">解答内容</label>
              <textarea 
                v-model="formData.answer"
                rows="8"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
                placeholder="请输入详细的解答内容，支持换行..."
              ></textarea>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            <button 
              @click="showFormModal = false"
              class="px-5 py-2 text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors font-bold text-sm"
            >
              取消
            </button>
            <button 
              @click="handleSubmit"
              :disabled="isSubmitting || !formData.question || !formData.answer"
              class="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm font-bold text-sm flex items-center gap-2"
            >
              <span v-if="isSubmitting" class="i-carbon-progress-bar-round animate-spin"></span>
              <span>{{ currentFaq ? '保存修改' : '立即创建' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <ConfirmModal
      :show="showDeleteConfirm"
      title="确认删除"
      :message="`您确定要删除问题 '${currentFaq?.question}' 吗？此操作不可撤销。`"
      confirm-text="删除"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
    </div>
  </div>
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
</style>
