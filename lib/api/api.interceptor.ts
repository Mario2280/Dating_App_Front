import axios from "axios"

export const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const instance = axios.create({
  baseURL,
  timeout: 10000,
})

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const telegramUser = localStorage.getItem("telegram_user")
    if (telegramUser) {
      const user = JSON.parse(telegramUser)
      config.headers.Authorization = `Bearer ${user.hash}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("telegram_user")
      localStorage.removeItem("profile_data")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)
