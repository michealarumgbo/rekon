import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref(localStorage.getItem('admin_token') || null)
  const refreshToken = ref(localStorage.getItem('admin_refresh') || null)

  //   refresh access token
  const tokenRefresher = async (token = refreshToken.value) => {
    try {
      const { data } = await api.post(
        '/admin/new-token',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      localStorage.setItem('access_token', data.access_token)
      accessToken.value = data.access_token

      return data.access_token
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        if (data?.error) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_refresh')
          localStorage.removeItem('email_verified')
          router.push('/login')
        }
        return
      }
      return console.log(error)
    }
  }
  //   log in
  const logIn = async (formData = {}) => {
    if (Object.keys(formData).length == 0) {
      throw new Error('Object must not be empty')
    }

    try {
      const { data } = await api.post('/admin/login', formData)

      // set tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token

      localStorage.setItem('admin_token', data.access_token)
      localStorage.setItem('admin_refresh', data.refresh_token)

      if (data.user && data.user.email_verified_at) {
        localStorage.setItem('email_verified', 'true')
      }

      // return data
      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        // console.log(data)
        return data
      }
      console.log(error)
      return { error }
    }
  }
  // get users attendance
  const getAttendance = async (token = accessToken.value) => {
    try {
      const { data } = await api.get('/admin/attendance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return data
    } catch (error) {
      if (error?.response) {
        const res = error.response
        const { data } = error.response
        // console.log(data)
        if (res?.status == 401) {
          // console.log('refresh')
          const newToken = await tokenRefresher()
          return getAttendance(newToken)
        }
        if (data?.error == 'User no longer exists') {
          await tokenRefresher()
        }
        return data
      }
      console.log(error)
      return { error }
    }
  }
  //   getMe
  const getMe = async (token = accessToken.value) => {
    try {
      const { data } = await api.get('/admin/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return data
    } catch (error) {
      if (error?.response) {
        const res = error.response
        const { data } = error.response
        // console.log(data)
        if (res?.status == 401) {
          // console.log('refresh')
          const newToken = await tokenRefresher()
          return getMe(newToken)
        }
        if (data?.error == 'User no longer exists') {
          await tokenRefresher()
        }
        return data
      }
      console.log(error)
      return { error }
    }
  }
  //   verify users face
  const verifyFace = async (embeddings, token = accessToken.value) => {
    try {
      const { data } = await api.post(
        '/face/verify-user',
        { embeddings },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return data
    } catch (error) {
      if (error?.response) {
        const res = error.response
        const { data } = error.response
        // console.log(data)
        if (res?.status == 401) {
          const newToken = await tokenRefresher()
          return verifyFace(newToken)
        }
        if (data?.error == 'User no longer exists') {
          await tokenRefresher()
        }
        return data
      }
      console.log(error)
      return { error }
    }
  }
  //   logout
  const logout = async (token = accessToken.value) => {
    try {
      const { data } = await api.post(
        '/admin/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return data
    } catch (error) {
      if (error?.response) {
        const res = error.response
        const { data } = error.response
        // console.log(data)
        if (res?.status == 401) {
          // console.log('refresh')
          const newToken = await tokenRefresher()
          return logout(newToken)
        }
        return data
      }
      console.log(error)
      return { error }
    }
  }
  return {
    accessToken,
    refreshToken,
    tokenRefresher,
    logIn,
    getMe,
    logout,
    verifyFace,
    getAttendance,
  }
})
