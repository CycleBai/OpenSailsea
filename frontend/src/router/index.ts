import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/auth/userLogin',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/searchPost/:keyword',
      name: 'postSearch',
      component: () => import('../views/PostSearch.vue')
    },
    {
      path: '/post/create',
      name: 'createPost',
      component: () => import('../views/NewPost.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 构建登录重定向 URL
    const nextUrl = encodeURIComponent(to.fullPath)
    next(`/auth/userLogin?redirect=${nextUrl}&code=401`) // 将重定向 URL 传递给登录页面
  } else {
    next() // 允许访问
  }
})

export default router
