<template>
  <div class="form-card">
    <div class="welcome-section">
      <h2 class="welcome-en">Welcome</h2>
      <h2 class="welcome-cn">{{ title }}</h2>
    </div>

    <div class="form-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string // "登录" 或 "注册"
}

defineProps<Props>()
</script>

<style scoped>
.form-card {
  background: white;
  border-radius: 32px 32px 0 0;
  padding: 40px 32px 32px;
  height: calc(100vh - 200px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-en {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 400;
}

.welcome-cn {
  font-size: 32px;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>