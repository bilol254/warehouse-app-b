<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0">
        <h1 class="text-xl sm:text-2xl font-bold text-blue-600">Ombor</h1>
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <span class="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            {{ user?.name }} <br class="sm:hidden" />({{ user?.role === 'manager' ? 'Menejer' : 'Sotuvchi' }})
          </span>
          <router-link
            to="/sales"
            class="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Sotish
          </router-link>
          <router-link
            to="/inventory"
            class="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Ombor
          </router-link>
          <router-link
            v-if="user?.role === 'manager'"
            to="/kirim"
            class="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Kirim
          </router-link>
          <router-link
            to="/cashout"
            class="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Xarajatlar
          </router-link>
          <router-link
            to="/debts"
            class="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Nasiya
          </router-link>
          <router-link
            v-if="user?.role === 'manager'"
            to="/reports"
            class="btn btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Hisobotlar
          </router-link>
          <button @click="handleLogout" class="btn btn-secondary w-full sm:w-auto text-xs sm:text-sm">
            Chiqish
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
}
</script>
