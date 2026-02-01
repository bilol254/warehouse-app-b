import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from './useApi'

interface User {
  id: number
  name: string
  username: string
  role: 'manager' | 'seller'
}

const user = ref<User | null>(null)
const token = ref<string>(localStorage.getItem('token') || '')

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))
    api.setToken(token.value)
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    api.setToken('')
    router.push('/login')
  }

  const loadUserFromStorage = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      api.setToken(savedToken)
    }
  }

  loadUserFromStorage()

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }
}
