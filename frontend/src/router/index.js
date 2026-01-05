import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue.vue'
import AccountManagement from '@/views/AccountManagement.vue'
import Login from '@/views/Login.vue'
import EmailVerification from '@/views/EmailVerification.vue'
import FaceReg from '@/views/FaceReg.vue'
import Logout from '@/views/Logout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: { requiresAuth: true },
    },
    {
      path: '/verify-email',
      name: 'verifyEmail',
      component: EmailVerification,
      meta: { requiresAuth: true },
    },
    {
      path: '/face-reg',
      name: 'faceReg',
      component: FaceReg,
      meta: { requiresAuth: true },
    },
    {
      path: '/user/manage-account/',
      name: 'manageAcount',
      component: AccountManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem('access_token') && localStorage.getItem('refresh_token')
  const emailVerified = localStorage.getItem('email_verified')
  const guestPages = ['/login', '/', '/verify-email']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // redirect to login
  } else if (isAuthenticated && !emailVerified && to.path !== '/verify-email') {
    return next('/verify-email')
  } else if (isAuthenticated && emailVerified && guestPages.includes(to.path)) {
    return next('/user/manage-account/')
  } else {
    next() // proceed
  }
})

export default router
