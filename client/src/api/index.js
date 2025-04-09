import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器添加token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  // 用户API
  async login(credentials) {
    const response = await api.post('/users/login', credentials)
    return response.data
  },
  
  // 文章API
  async getPosts() {
    const response = await api.get('/posts')
    return response.data
  }
}