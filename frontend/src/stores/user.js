import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)

  //   refresh access token
  const tokenRefresher = async (token = refreshToken.value) => {
    try {
      const { data } = await api.post(
        '/auth/new-token',
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
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('email_verified')
          router.push('/login')
        }
        return
      }
      return console.log(error)
    }
  }
  //   register user
  const registerUser = async (formData = {}) => {
    if (Object.keys(formData).length == 0) {
      throw new Error('Object must not be empty')
    }
    try {
      const { data } = await api.post('/auth/', formData)

      // set tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)

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
  //   log in
  const logIn = async (formData = {}) => {
    if (Object.keys(formData).length == 0) {
      throw new Error('Object must not be empty')
    }

    try {
      const { data } = await api.post('/auth/login', formData)

      // set tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)

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
  //   sendCode
  const sendCode = async (token = accessToken.value) => {
    try {
      const { data } = await api.post(
        '/auth/email-pin',
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
          return sendCode(newToken)
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
  //   verify code
  const verifyCode = async (pin, token = accessToken.value) => {
    try {
      const { data } = await api.post(
        '/auth/verify-pin',
        { pin },
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
          return verifyCode(newToken)
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
      const { data } = await api.get('/auth/me', {
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
  //   register users face
  const registerFace = async (embeddings, token = accessToken.value) => {
    try {
      const { data } = await api.post(
        '/face/',
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
          return registerFace(newToken)
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
        '/auth/logout',
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
    registerUser,
    logIn,
    sendCode,
    getMe,
    verifyCode,
    logout,
    registerFace,
  }
})
