<template>
  <div class="home-tab-navigation">
    <div class="tab-header">
      <h2 class="page-title">
        <FontAwesomeIcon icon="home" class="title-icon" />
        Home
      </h2>
    </div>
    
    <div class="tab-container">
      <div class="tab-list">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          <span class="tab-text">{{ tab.label }}</span>
          <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
        </button>
      </div>
      
      <!-- 活动指示器 -->
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Tab {
  key: string
  label: string
  badge?: number | string
}

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'today'
})

const emit = defineEmits<Emits>()

// 导航标签配置
const tabs = ref<Tab[]>([
  { key: 'today', label: '今日发现' },
  { key: 'ongoing', label: '进行中', badge: 2 },
  { key: 'recommended', label: '热门推荐' },
  { key: 'finished', label: '已结束' }
])

// 当前激活的标签
const activeTab = ref(props.modelValue)

// 指示器样式
const indicatorStyle = ref({})

// 切换标签
const switchTab = (tabKey: string) => {
  if (activeTab.value === tabKey) return
  
  activeTab.value = tabKey
  emit('update:modelValue', tabKey)
  emit('change', tabKey)
  
  // 更新指示器位置
  updateIndicator()
}

// 更新指示器位置
const updateIndicator = async () => {
  await nextTick()
  
  const activeIndex = tabs.value.findIndex(tab => tab.key === activeTab.value)
  const tabWidth = 100 / tabs.value.length
  
  indicatorStyle.value = {
    transform: `translateX(${activeIndex * 100}%)`,
    width: `${tabWidth}%`
  }
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    activeTab.value = newValue
    updateIndicator()
  }
})

// 初始化指示器位置
nextTick(() => {
  updateIndicator()
})
</script>

<style scoped>
.home-tab-navigation {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 99;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-header {
  display: none; /* 隐藏标题，只保留标签 */
}

.tab-container {
  position: relative;
  background: white;
}

.tab-list {
  display: flex;
  width: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-size: 15px;
  color: #666;
}

.tab-item:hover {
  background: rgba(33, 150, 243, 0.05);
}

.tab-item.active {
  color: #2196F3;
  font-weight: 600;
}

.tab-text {
  white-space: nowrap;
}

.tab-badge {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #FF4444;
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.tab-item.active .tab-badge {
  background: #2196F3;
}

/* 活动指示器 */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #2196F3;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 25%;
}

/* 响应式适配 */
@media (max-width: 393px) {
  .tab-header {
    padding: 12px 16px 8px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .title-icon {
    font-size: 18px;
  }
  
  .tab-item {
    padding: 12px 4px;
    font-size: 14px;
  }
  
  .tab-text {
    font-size: 13px;
  }
}

/* 适配小屏幕的文字 */
@media (max-width: 320px) {
  .tab-text {
    font-size: 12px;
  }
  
  .tab-item {
    padding: 12px 2px;
  }
}
</style>