import { ref } from 'vue';
import { createVNode, render } from 'vue';
import Toast from '../components/Toast.vue';

const toasts = ref([]);

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    const container = document.createElement('div');
    const vnode = createVNode(Toast, {
      message,
      type,
      duration,
      onDestroy: () => {
        render(null, container);
        container.remove();
      }
    });
    render(vnode, container);
    document.body.appendChild(container);
  };

  return {
    showToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration)
  };
} 