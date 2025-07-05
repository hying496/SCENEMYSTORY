<template>
  <div class="status-bar-placeholder">
    <!-- 直接使用PNG图片占位 -->
    <img 
      src="./images/status-bar.png" 
      alt="Status Bar" 
      class="status-bar-image"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
})
</script>

<style scoped>
.status-bar-placeholder {
  width: 100%;
  height: var(--status-bar-height, 44px);
  position: relative;
  z-index: 1000;
}

.status-bar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 不同主题的状态栏图片 */
.status-bar-placeholder[data-theme="dark"] .status-bar-image {
  filter: invert(1);
}

/* 响应式适配 */
@media (max-width: 480px) {
  .status-bar-placeholder {
    height: var(--status-bar-height, env(safe-area-inset-top, 44px));
  }
}
</style>