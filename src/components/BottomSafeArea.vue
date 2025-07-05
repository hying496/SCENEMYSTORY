<template>
  <div class="bottom-safe-area">
    <!-- 底部安全区域占位图片 -->
    <img 
      v-if="showIndicator"
      src="./images/bottom-indicator.png" 
      alt="Bottom Indicator" 
      class="bottom-indicator-image"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  showIndicator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showIndicator: true
})
</script>

<style scoped>
.bottom-safe-area {
  width: 100%;
  height: var(--bottom-safe-height, 20px);
  position: relative;
  background: inherit;
}

.bottom-indicator-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .bottom-safe-area {
    height: var(--bottom-safe-height, env(safe-area-inset-bottom, 20px));
  }
}
</style>