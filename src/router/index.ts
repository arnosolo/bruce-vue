import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/faq-management',
      name: 'faq-management',
      component: () => import('../views/FaqManagementView.vue')
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: () => import('../views/UserManagementView.vue')
    },
    {
      path: '/docs/terms',
      name: 'terms',
      component: () => import('../views/docs/TermsView.vue')
    },
    {
      path: '/docs/privacy',
      name: 'privacy',
      component: () => import('../views/docs/PrivacyView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  
  // 判断是否为公共页面：auth 页，404 页，或者以 /docs/ 开头的页面
  const isPublicPage = to.name === 'auth' || to.name === 'not-found' || to.path.startsWith('/docs/')
  
  if (!isPublicPage && !authStore.isAuthenticated) {
    // 如果不是公共页面且未登录，重定向到认证页
    next({ name: 'auth' })
  } else if (authStore.isAuthenticated && to.name === 'auth') {
    // 如果已登录但访问的是认证页，重定向到首页
    next({ name: 'home' })
  } else if (authStore.isAuthenticated && to.name === 'user-management' && authStore.user?.role !== 'ADMIN') {
    // 只有管理员能访问用户管理
    next({ name: 'home' })
  } else if (authStore.isAuthenticated && to.name === 'faq-management' && !['ADMIN', 'AGENT'].includes(authStore.user?.role || '')) {
    // 只有管理员和客服能访问常见问题管理
    next({ name: 'home' })
  } else {
    // 其他情况放行
    next()
  }
})

export default router
