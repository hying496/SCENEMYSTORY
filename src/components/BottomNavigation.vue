<template>
  <div class="bottom-navigation">
    <div class="nav-container">
      <!-- 首页 -->
      <div 
        :class="['nav-item', { active: activeTab === 'home' }]"
        @click="handleNavigate('home')"
      >
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>
        <span class="nav-text">首页</span>
      </div>

      <!-- 中间创建按钮 -->
      <div class="center-section">
        <div 
          :class="['create-button', { active: activeTab === 'create' }]"
          @click="handleNavigate('create')"
        >
          <div class="create-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 我的 -->
      <div 
        :class="['nav-item', { active: activeTab === 'profile' }]"
        @click="handleNavigate('profile')"
      >
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <div v-if="hasNotification" class="notification-dot"></div>
        </div>
        <span class="nav-text">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  hasNotification?: boolean
}

interface Emits {
  (e: 'navigate', route: string): void
}

const props = withDefaults(defineProps<Props>(), {
  hasNotification: false
})

const emit = defineEmits<Emits>()

const router = useRouter()
const route = useRoute()

// 当前激活的tab
const activeTab = computed(() => {
  const routeName = route.name as string
  if (routeName === 'Home') return 'home'
  if (routeName === 'Profile') return 'profile'
  if (routeName === 'Create' || routeName?.startsWith('Create')) return 'create'
  return 'home'
})

// 处理导航
const handleNavigate = (name: string) => {
  emit('navigate', name)
  
  switch (name) {
    case 'home':
      router.push('/home')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'create':
      router.push('/create')
      break
  }
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #F0F0F0;
  z-index: 1000;
  /* 适配iPhone底部安全区域 */
  padding-bottom: var(--bottom-safe-height, 20px);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 12px;
  max-width: 393px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 12px;
  min-width: 60px;
  position: relative;
}

.nav-item:hover {
  background: #F8F9FA;
}

.nav-item.active {
  color: #2196F3;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s ease;
  position: relative;
}

.nav-item.active .nav-icon {
  color: #2196F3;
}

.nav-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  transition: color 0.2s ease;
  font-weight: 500;
}

.nav-item.active .nav-text {
  color: #2196F3;
  font-weight: 600;
}

/* 中间按钮区域 */
.center-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 120px;
}

/* 创建剧本按钮样式 */
.create-button {
  width: 56px;
  height: 56px;
  background: #888;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.create-button:hover {
  background: #666;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.create-button:active {
  transform: translateY(0);
}

.create-button.active {
  background: #2196F3;
}

.create-icon {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 通知小红点 */
.notification-dot {
  position: absolute;
  top: 4px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #FF4444;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式适配 */
@media (max-width: 393px) {
  .nav-container {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .nav-item {
    min-width: 50px;
    padding: 6px 8px;
  }
  
  .nav-text {
    font-size: 11px;
  }
  
  .create-button {
    width: 52px;
    height: 52px;
  }
}
</style>