import axios from 'axios'
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors.js'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(requestInterceptor, errorInterceptor)
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor)

export default apiClient
