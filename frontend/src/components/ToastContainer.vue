<template>
  <div v-if="toasts.length > 0" class="fixed bottom-4 right-4 space-y-2 z-50">
    <transition-group name="list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'toast',
          toast.type === 'success' && 'toast-success',
          toast.type === 'error' && 'toast-error',
          toast.type === 'info' && 'toast-info',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
