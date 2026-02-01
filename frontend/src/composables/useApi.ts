import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
let authToken = localStorage.getItem('token') || ''

const instance = axios.create({
  baseURL: apiUrl,
})

instance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

export const api = {
  instance,
  setToken: (token: string) => {
    authToken = token
  },
  get: (url: string, config?: any) => instance.get(url, config),
  post: (url: string, data?: any, config?: any) => instance.post(url, data, config),
  put: (url: string, data?: any, config?: any) => instance.put(url, data, config),
  delete: (url: string, config?: any) => instance.delete(url, config),
}

export function useApi() {
  return { api }
}
