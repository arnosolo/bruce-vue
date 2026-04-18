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
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // 不需要登录即可访问的公共页面
  const publicPages = ['auth']
  // 判断当前页面是否需要鉴权
  const authRequired = !publicPages.includes(to.name as string)

  if (authRequired && !authStore.isAuthenticated) {
    // 如果需要鉴权但未登录，重定向到认证页
    next({ name: 'auth' })
  } else if (authStore.isAuthenticated && publicPages.includes(to.name as string)) {
    // 如果已登录但访问的是认证页，重定向到首页
    next({ name: 'home' })
  } else {
    // 其他情况放行
    next()
  }
})

export default router
