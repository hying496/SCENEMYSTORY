<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input 
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        class="form-input"
      />
      <button 
        v-if="type === 'password'"
        type="button"
        class="password-toggle"
        @click="togglePassword"
      >
        {{ showPassword ? '🙈' : '👁️' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'password' | 'email' | 'tel'
  label?: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<Emits>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 8px;
  transition: border-color 0.3s ease;
}

.input-wrapper:focus-within {
  border-bottom-color: #2196F3;
}

.form-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px 0;
  background: transparent;
  color: #333;
}

.form-input::placeholder {
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background-color: #f5f5f5;
}
</style>