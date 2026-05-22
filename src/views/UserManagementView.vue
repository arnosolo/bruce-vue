<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { userApi } from '../api/user'
import { UserRole, USER_ROLE_CONFIG, getUserRoleConfig } from '../types/userRole'
import type { User } from '../types/user'
import type { Pagination as PaginationType } from '../types/api'
import Pagination from '../components/Pagination.vue'

const users = ref<User[]>([])
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

// Role update state
const showRoleModal = ref(false)
const currentUser = ref<User | null>(null)
const selectedRole = ref<UserRole>(UserRole.Customer)
const isSubmitting = ref(false)

async function fetchUsers(page = pagination.value.page) {
  loading.value = true
  error.value = null
  try {
    const res = await userApi.getUsers({ 
      page, 
      limit: pagination.value.limit,
      search: searchQuery.value || undefined
    })
    if (res.success && res.data) {
      users.value = res.data.list
      pagination.value = res.data.pagination
    } else {
      error.value = res.message
    }
  } catch (err: any) {
    error.value = err.message || '获取用户列表失败'
  } finally {
    loading.value = false
  }
}

// Search with debounce
let searchTimer: any = null
watch(searchQuery, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchUsers(1)
  }, 500)
})

function openRoleModal(user: User) {
  currentUser.value = user
  selectedRole.value = user.role
  showRoleModal.value = true
}

async function handleRoleUpdate() {
  if (!currentUser.value) return
  isSubmitting.value = true
  try {
    const res = await userApi.updateRole(currentUser.value.id, { role: selectedRole.value })
    if (res.success) {
      showRoleModal.value = false
      await fetchUsers(pagination.value.page)
    } else {
      alert(res.message)
    }
  } catch (err: any) {
    alert(err.message || '更新角色失败')
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => fetchUsers(1))
</script>

<template>
  <div class="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">用户管理</h1>
        <p class="mt-1 text-sm text-gray-500">查看用户列表并管理用户权限角色</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search Bar -->
        <div class="relative flex-1 sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 i-carbon-search text-gray-400"></span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索用户名或邮箱..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            @keyup.enter="fetchUsers(1)"
          />
        </div>
        <button 
          @click="fetchUsers(1)"
          :disabled="loading"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-sm disabled:bg-blue-300"
        >
          <span v-if="loading" class="i-carbon-progress-bar-round animate-spin"></span>
          搜索
        </button>
      </div>
    </div>

    <!-- Table Card Container -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm w-full max-w-full">
      <!-- Loading State -->
      <div v-if="loading && users.length === 0" class="flex justify-center py-24">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-500 text-sm px-4 text-center">加载用户列表中...</p>
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
          @click="fetchUsers()" 
          class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-bold"
        >
          重试
        </button>
      </div>

      <!-- User List (Responsive) -->
      <template v-else>
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">用户</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">邮箱</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[120px]">角色</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[180px]">加入时间</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-[120px]">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100">
                      <img v-if="user.avatarUrl" :src="user.avatarUrl" class="w-full h-full object-cover" />
                      <span v-else class="text-sm font-bold text-blue-600">
                        {{ (user.name || user.email).charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900">{{ user.name || '未设置姓名' }}</div>
                      <div class="text-xs text-gray-400">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <template v-if="getUserRoleConfig(user.role)">
                    <span 
                      :class="[
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold',
                        getUserRoleConfig(user.role)?.colorClass
                      ]"
                    >
                      <span :class="getUserRoleConfig(user.role)?.icon"></span>
                      {{ getUserRoleConfig(user.role)?.text }}
                    </span>
                  </template>
                  <span v-else class="text-xs text-gray-400 italic">未知角色 ({{ user.role }})</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button 
                    @click="openRoleModal(user)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span class="i-carbon-user-role text-lg"></span>
                    修改角色
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden divide-y divide-gray-100">
          <div v-for="user in users" :key="user.id" class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100">
                  <img v-if="user.avatarUrl" :src="user.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-sm font-bold text-blue-600">
                    {{ (user.name || user.email).charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-900">{{ user.name || '未设置姓名' }}</div>
                  <div class="text-xs text-gray-400">ID: {{ user.id }}</div>
                </div>
              </div>
              <template v-if="getUserRoleConfig(user.role)">
                <span 
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold',
                    getUserRoleConfig(user.role)?.colorClass
                  ]"
                >
                  <span :class="getUserRoleConfig(user.role)?.icon"></span>
                  {{ getUserRoleConfig(user.role)?.text }}
                </span>
              </template>
            </div>
            
            <div class="grid grid-cols-1 gap-1 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-400">邮箱</span>
                <span class="text-gray-600">{{ user.email }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">加入时间</span>
                <span class="text-gray-500">{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>

            <div class="pt-2">
              <button 
                @click="openRoleModal(user)"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span class="i-carbon-user-role text-lg"></span>
                修改用户角色
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="users.length === 0" class="px-6 py-24 text-center text-gray-500">
          <div class="flex flex-col items-center">
            <span class="i-carbon-user-avatar text-5xl mb-4 opacity-10"></span>
            <p class="text-lg font-medium text-gray-400 px-6">{{ searchQuery ? '未找到匹配的用户' : '暂无用户数据' }}</p>
            <p class="text-sm text-gray-400 mt-1 px-6">尝试调整搜索关键词或重置筛选条件</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            :page="pagination.page"
            :total-pages="pagination.totalPages"
            :total="pagination.total"
            :loading="loading"
            @change="fetchUsers"
          />
        </div>
      </template>
    </div>

    <!-- Role Update Modal -->
    <Transition name="fade">
      <div v-if="showRoleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showRoleModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">修改用户角色</h2>
            <button @click="showRoleModal = false" class="text-gray-400 hover:text-gray-600">
              <span class="i-carbon-close text-2xl"></span>
            </button>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-100 shadow-sm">
                <img v-if="currentUser?.avatarUrl" :src="currentUser.avatarUrl" class="w-full h-full object-cover" />
                <span v-else>{{ (currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <div class="text-sm font-bold text-gray-900">{{ currentUser?.name || '未设置姓名' }}</div>
                <div class="text-xs text-gray-600">{{ currentUser?.email }}</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">选择新角色</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="(config, role) in USER_ROLE_CONFIG"
                  :key="role"
                  @click="selectedRole = role as UserRole"
                  :class="[
                    'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                    selectedRole === role 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-400'
                  ]"
                >
                  <span :class="[config.icon, 'text-2xl mb-1']"></span>
                  <span class="text-sm font-bold">{{ config.text }}</span>
                  <span class="text-[10px] opacity-60 uppercase">{{ role }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            <button 
              @click="showRoleModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button 
              @click="handleRoleUpdate"
              :disabled="isSubmitting || selectedRole === currentUser?.role"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm font-bold flex items-center gap-2"
            >
              <span v-if="isSubmitting" class="i-carbon-progress-bar-round animate-spin"></span>
              <span>确认修改</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

.i-carbon-user-role {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M22 26.59L19.41 24L18 25.41L22 29.41L30 21.41L28.59 20z'%3E%3C/path%3E%3Cpath fill='currentColor' d='M16 16c4.418 0 8-3.582 8-8s-3.582-8-8-8s-8 3.582-8 8s3.582 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6z'%3E%3C/path%3E%3Cpath fill='currentColor' d='M24.7 18.06A11.77 11.77 0 0 0 16 14a11.77 11.77 0 0 0-8.7 4.06C5.05 20.58 4 23.97 4 27.5V30h12v-2H6v-0.5c0-2.8 0.9-5.5 2.6-7.3a9.8 9.8 0 0 1 14.8 0c.2.2.4.4.6.7l1.7-1.1c-.2-.2-.5-.5-.7-.7z'%3E%3C/path%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--un-icon);
  mask-image: var(--un-icon);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
</style>
