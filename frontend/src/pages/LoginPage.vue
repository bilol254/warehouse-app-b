<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-8">
    <div class="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full sm:w-96">
      <h1 class="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-600">Ombor</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700">Foydalanuvchi nomi</label>
          <input
            v-model="username"
            type="text"
            class="input-field"
            placeholder="admin"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700">Parol</label>
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="admin123"
          />
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? 'Yuborilmoqda...' : 'Kirish' }}
        </button>
      </form>

      <div class="mt-6 p-4 bg-blue-50 rounded text-xs sm:text-sm text-gray-700">
        <p class="font-semibold mb-2">Test hisoblar:</p>
        <p class="break-words">Manager: admin / admin123</p>
        <p class="break-words">Seller: ali / seller123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const username = ref('admin')
const password = ref('admin123')
const loading = ref(false)
const router = useRouter()
const { login } = useAuth()
const { addToast } = useToast()

const handleSubmit = async () => {
  loading.value = true
  try {
    await login(username.value, password.value)
    addToast('Muvaffaqiyatli kirdi', 'success')
    router.push('/')
  } catch (error) {
    addToast('Login xatosi', 'error')
  } finally {
    loading.value = false
  }
}
</script>
