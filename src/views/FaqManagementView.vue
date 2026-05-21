<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { faqApi } from '../api/faq'
import type { Faq, CreateFaqRequest, Pagination } from '../types/faq'
import ConfirmModal from '../components/ConfirmModal.vue'

const faqs = ref<Faq[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')

// Pagination state
const pagination = ref<Pagination>({
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

function handlePageChange(newPage: number) {
  if (newPage < 1 || newPage > pagination.value.totalPages || newPage === pagination.value.page) return
  fetchFaqs(newPage)
}

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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">常见问题管理</h1>
        <p class="mt-1 text-sm text-gray-500">管理展示在客户端的常见问题与解答</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Search Bar -->
        <div class="relative flex-1 md:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 i-carbon-search text-gray-400"></span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索问题或答案..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <button 
          @click="openAddModal"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <span class="i-carbon-add text-xl"></span>
          <span>添加问题</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && faqs.length === 0" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
      <span class="i-carbon-error text-xl"></span>
      <span>{{ error }}</span>
      <button @click="fetchFaqs()" class="ml-auto underline">重试</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="faqs.length === 0" class="bg-white border border-dashed border-gray-300 rounded-2xl py-16 flex flex-col items-center justify-center text-gray-500">
      <span class="i-carbon-help text-5xl mb-4 opacity-20"></span>
      <p>{{ searchQuery ? '未找到匹配的问题' : '暂无常见问题' }}</p>
      <button v-if="!searchQuery" @click="openAddModal" class="mt-4 text-blue-600 hover:underline">立即添加</button>
      <button v-else @click="searchQuery = ''" class="mt-4 text-blue-600 hover:underline">清除搜索</button>
    </div>

    <!-- FAQ List -->
    <div v-else :class="{ 'opacity-50 transition-opacity': loading }">
      <div class="grid gap-4 mb-8">
        <div 
          v-for="faq in faqs" 
          :key="faq.id" 
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
        >
          <div class="flex justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded uppercase">
                  ID: {{ faq.id }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                {{ faq.question }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2 whitespace-pre-wrap">{{ faq.answer }}</p>
            </div>
            
            <div class="flex flex-col gap-2">
              <button 
                @click="openEditModal(faq)"
                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="编辑"
              >
                <span class="i-carbon-edit text-xl"></span>
              </button>
              <button 
                @click="confirmDelete(faq)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <span class="i-carbon-trash-can text-xl"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 pt-6">
        <div class="text-sm text-gray-500">
          共 <span class="font-medium text-gray-900">{{ pagination.total }}</span> 条记录，
          第 <span class="font-medium text-gray-900">{{ pagination.page }}</span> / {{ pagination.totalPages }} 页
        </div>
        <div class="flex gap-2">
          <button 
            @click="handlePageChange(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            上一页
          </button>
          <div class="flex gap-1">
            <button 
              v-for="p in pagination.totalPages" 
              :key="p"
              @click="handlePageChange(p)"
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                pagination.page === p 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ p }}
            </button>
          </div>
          <button 
            @click="handlePageChange(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一页
          </button>
        </div>
      </div>
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
            <button @click="showFormModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="i-carbon-close text-2xl"></span>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">问题</label>
              <input 
                v-model="formData.question"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="请输入常见问题的标题"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">回答</label>
              <textarea 
                v-model="formData.answer"
                rows="6"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="请输入详细的解答内容"
              ></textarea>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
            <button 
              @click="showFormModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              @click="handleSubmit"
              :disabled="isSubmitting || !formData.question || !formData.answer"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm font-medium flex items-center gap-2"
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
