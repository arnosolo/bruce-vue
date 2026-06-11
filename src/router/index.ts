import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
import { PATH_ROLE_MAP, PUBLIC_PATH_PREFIXES, PUBLIC_PATHS } from './config.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
  const { isAuthenticated, user } = useAuthStore()
  const userRole = user?.role ?? ''
  const currentPath = to.path

  // 判断是否公开页面
  const is404 = to.matched.some(record => record.path === '/:pathMatch(.*)*')
  const isExactPublic = PUBLIC_PATHS.has(currentPath)
  const isPrefixPublic = PUBLIC_PATH_PREFIXES.some(prefix => currentPath.startsWith(prefix))
  const isPublic = isExactPublic || isPrefixPublic || is404

  // 公开页面直接放行
  if (isPublic) {
    return next()
  }

  // 未登录拦截
  if (!isAuthenticated) {
    return next({ path: '/auth' })
  }

  // 角色权限校验
  const allowRoles = PATH_ROLE_MAP[currentPath]
  if (allowRoles && !allowRoles.includes(userRole)) {
    return next({ path: '/' })
  }

  next()
})

export default router
