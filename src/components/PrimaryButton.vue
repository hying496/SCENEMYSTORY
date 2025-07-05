<template>
  <button 
    :type="type"
    :disabled="disabled || loading"
    class="primary-btn"
    :class="{ 'loading': loading }"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <span v-else class="btn-content">
      <span>{{ text }}</span>
      <span v-if="showArrow" class="arrow">→</span>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text: string
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  showArrow?: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  loading: false,
  showArrow: true
})

const emit = defineEmits<Emits>()

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.primary-btn {
  background: #72C8FF;
  color: white;
  border: none;
  border-radius: 24px;
  height: 48px;
  font-size: 18px;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.primary-btn:hover:not(:disabled) {
  background: #5BB5FF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(114, 200, 255, 0.3);
}

.primary-btn:active:not(:disabled) {
  transform: translateY(0);
}

.primary-btn:disabled {
  background: #CCC;
  cursor: not-allowed;
  transform: none;
}

.primary-btn.loading {
  background: #5BB5FF;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.arrow {
  font-size: 20px;
  transform: translateX(4px);
  transition: transform 0.2s ease;
}

.primary-btn:hover .arrow {
  transform: translateX(8px);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>