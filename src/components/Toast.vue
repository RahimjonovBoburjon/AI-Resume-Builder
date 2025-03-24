<template>
  <Transition name="toast">
    <div v-if="show" class="fixed top-4 right-4 z-50">
      <div :class="[
        'rounded-lg px-6 py-4 shadow-lg text-white flex items-center space-x-2',
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      ]">
        <span v-if="type === 'error'" class="text-xl">⚠️</span>
        <span v-else class="text-xl">✓</span>
        <span>{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const show = ref(true);

onMounted(() => {
  setTimeout(() => {
    show.value = false;
  }, props.duration);
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 