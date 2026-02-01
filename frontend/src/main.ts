import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useAuth } from './composables/useAuth'
import './index.css'

// Pages
import LoginPage from './pages/LoginPage.vue'
import Dashboard from './pages/Dashboard.vue'
import InventoryPage from './pages/InventoryPage.vue'
import SalesPage from './pages/SalesPage.vue'
import ReceiptPage from './pages/ReceiptPage.vue'
import HistoryPage from './pages/HistoryPage.vue'
import UsersPage from './pages/UsersPage.vue'
import PricingPage from './pages/PricingPage.vue'
import ReportsPage from './pages/ReportsPage.vue'
import KirimPage from './pages/KirimPage.vue'
import CashOutPage from './pages/CashOutPage.vue'
import DebtsPage from './pages/DebtsPage.vue'

const routes = [
  { path: '/login', component: LoginPage, meta: { requiresAuth: false } },
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/inventory', component: InventoryPage, meta: { requiresAuth: true } },
  { path: '/sales', component: SalesPage, meta: { requiresAuth: true } },
  { path: '/receipt', component: ReceiptPage, meta: { requiresAuth: true } },
  { path: '/history', component: HistoryPage, meta: { requiresAuth: true } },
  { path: '/users', component: UsersPage, meta: { requiresAuth: true, requiresManager: true } },
  { path: '/pricing', component: PricingPage, meta: { requiresAuth: true, requiresManager: true } },
  { path: '/reports', component: ReportsPage, meta: { requiresAuth: true, requiresManager: true } },
  { path: '/kirim', component: KirimPage, meta: { requiresAuth: true, requiresManager: true } },
  { path: '/cashout', component: CashOutPage, meta: { requiresAuth: true } },
  { path: '/debts', component: DebtsPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, user } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.meta.requiresManager && user.value?.role !== 'manager') {
    next('/')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
