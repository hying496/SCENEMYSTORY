<template>
  <van-tabbar 
    :active="activeTab" 
    @change="handleTabChange"
    :safe-area-inset-bottom="true"
    class="custom-tabbar"
  >
    <!-- 首页 -->
    <van-tabbar-item name="home" to="/home">
      <template #icon="{ active }">
        <FontAwesomeIcon 
          :icon="active ? 'home' : ['far', 'home']" 
          class="tab-icon"
        />
      </template>
      首页
    </van-tabbar-item>

    <!-- 创建剧本按钮 -->
    <van-tabbar-item name="create" to="/create" class="create-tab">
      <template #icon>
        <div class="create-button">
          <FontAwesomeIcon icon="plus" class="create-icon" />
        </div>
      </template>
    </van-tabbar-item>

    <!-- 我的 -->
    <van-tabbar-item name="profile" to="/profile" :badge="hasNotification ? 1 : null">
      <template #icon="{ active }">
        <FontAwesomeIcon 
          :icon="active ? 'user' : ['far', 'user']" 
          class="tab-icon"
        />
      </template>
      我的
    </van-tabbar-item>
  </van-tabbar>
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
  if (routeName === 'Create') return 'create'
  return 'home'
})

// 处理tab切换
const handleTabChange = (name: string | number) => {
  emit('navigate', name as string)
  
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
.custom-tabbar {
  --van-tabbar-background: #fff;
  --van-tabbar-item-text-color: #666;
  --van-tabbar-item-active-color: #2196F3;
  --van-tabbar-item-active-background: transparent;
}

.tab-icon {
  font-size: 20px;
  transition: all 0.3s ease;
}

/* 创建按钮特殊样式 */
.create-tab {
  position: relative;
}

.create-button {
  width: 48px;
  height: 48px;
  background: #888;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
}

.create-button:hover {
  background: #666;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.create-button:active {
  transform: translateY(0);
}

.create-icon {
  color: white;
  font-size: 20px;
}

/* Vant tabbar自定义样式 */
:deep(.van-tabbar-item) {
  transition: all 0.3s ease;
}

:deep(.van-tabbar-item:hover) {
  background: rgba(33, 150, 243, 0.05);
}

:deep(.van-tabbar-item--active) {
  background: rgba(33, 150, 243, 0.08);
}

/* 响应式适配 */
@media (max-width: 393px) {
  .create-button {
    width: 44px;
    height: 44px;
  }
  
  .create-icon {
    font-size: 18px;
  }
  
  .tab-icon {
    font-size: 18px;
  }
}
</style>

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
}

/* 适配不同状态的布局 */
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 20px 12px;
  max-width: 393px;
  margin: 0 auto;
}
</style>