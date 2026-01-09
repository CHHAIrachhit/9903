import axios from 'axios'
import { useAuthStore } from '@/store/auth'



const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // example: https://api.example.com
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// Add token to all requests
http.interceptors.request.use((config) => {
  const auth = useAuthStore()

  // Check if data is FormData
  if (config.data instanceof FormData) {
    // Remove Content-Type header to let browser set it with boundary
    if (config.headers) {
      delete config.headers['Content-Type']
    }
    // Append token to FormData
    if (auth.token) {
      config.data.append('token', auth.token)
    }
  } else {
    // For regular objects, merge token
    if (auth.token) {
      config.data = {
        ...config.data,
        token: auth.token
      }
    }
  }
  return config
})

// Handle errors globally
http.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default http
