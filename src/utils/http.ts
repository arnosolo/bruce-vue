import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '../router'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Inject Token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Global Error Handling
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Axios returns the data directly if success
    return response.data
  },
  (error) => {
    const authStore = useAuthStore()
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized: Clear auth and redirect to login
          authStore.logout()
          if (router.currentRoute.value.name !== 'auth') {
            router.push('/auth')
          }
          break
        case 403:
          console.error('Permission denied')
          break
        case 500:
          console.error('Server error')
          break
      }
      return Promise.reject(error.response.data)
    }
    
    if (error.request) {
      console.error('No response from server')
    } else {
      console.error('Request configuration error', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http
