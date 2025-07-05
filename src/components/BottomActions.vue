<template>
  <div class="bottom-actions">
    <button 
      type="button" 
      class="wechat-login" 
      @click="$emit('wechatLogin')"
    >
      💬 立即登录
    </button>
    <button 
      type="button" 
      class="switch-link" 
      @click="$emit('switchMode')"
    >
      {{ switchText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  switchText: string // "注册账号" 或 "登录账号"
}

interface Emits {
  (e: 'wechatLogin'): void
  (e: 'switchMode'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.bottom-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #F0F0F0;
}

.wechat-login, .switch-link {
  background: none;
  border: none;
  color: #666;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.wechat-login:hover, .switch-link:hover {
  color: #2196F3;
  background-color: #f8f9fa;
}

.wechat-login:active, .switch-link:active {
  transform: scale(0.98);
}
</style>