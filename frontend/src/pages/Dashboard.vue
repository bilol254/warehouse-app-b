<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card">
        <p class="text-gray-600">Bugun sotildi</p>
        <p class="text-2xl font-bold">{{ stats.sales_count }} ta</p>
      </div>
      <div class="card">
        <p class="text-gray-600">Jami daromad</p>
        <p class="text-2xl font-bold">{{ stats.total_revenue.toLocaleString() }} so'm</p>
      </div>
      <div v-if="user?.role === 'manager'" class="card">
        <p class="text-gray-600">Foyda</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.total_profit.toLocaleString() }} so'm</p>
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-bold mb-4">Eng ko'p sotilgan mahsulotlar</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Mahsulot</th>
            <th>Miqdor</th>
            <th>Daromad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in stats.top_products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.qty_sold }}</td>
            <td>{{ product.revenue.toLocaleString() }} so'm</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { api } from '../composables/useApi'

const { user } = useAuth()
const stats = ref({
  sales_count: 0,
  total_revenue: 0,
  total_profit: 0,
  top_products: [] as any[],
})

onMounted(async () => {
  try {
    const response = await api.get('/reports/dashboard')
    stats.value = response.data
  } catch (error) {
    console.error('Error loading dashboard:', error)
  }
})
</script>
