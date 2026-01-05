import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Report from '@/views/Report.vue'
import FaceLogin from '@/views/FaceLogin.vue'
import Logout from '@/views/Logout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/admin/attendance-report/',
      name: 'report',
      component: Report,
      meta: { requiresAuth: true },
    },
    {
      path: '/logout',
      name: 'logot',
      component: Logout,
      meta: { requiresAuth: true },
    },
    {
      path: '/mark-attendance',
      name: 'markAttendance',
      component: FaceLogin,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem('admin_token') && localStorage.getItem('admin_refresh')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (isAuthenticated && to.path == '/') {
    next('/admin/attendance-report/')
  } else {
    next()
  }
})

export default router
