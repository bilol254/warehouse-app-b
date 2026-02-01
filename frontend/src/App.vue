<template>
  <div>
    <Layout v-if="user">
      <router-view />
    </Layout>
    <div v-else class="min-h-screen flex items-center justify-center bg-gray-100">
      <router-view />
    </div>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Layout from './components/Layout.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useAuth } from './composables/useAuth'

const { user } = useAuth()
</script>

<style>
@import './index.css';
</style>
