<template>
  <div class="profile-container">
    <!-- 状态栏 -->
    <div class="status-bar">
      <span class="time">12:00</span>
      <div class="status-icons">
        <div class="signal-bars">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        <div class="wifi-icon"><FontAwesomeIcon icon="wifi" /></div>
        <div class="battery-icon"><FontAwesomeIcon icon="battery-full" /></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-avatar">
          <div class="avatar">
            <FontAwesomeIcon icon="user" />
          </div>
          <div class="avatar-badge">
            <FontAwesomeIcon icon="camera" />
          </div>
        </div>
        <div class="user-info">
          <h2 class="username">探险家</h2>
          <p class="user-id">ID: 12345678</p>
        </div>
        <button class="edit-btn">编辑</button>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-section">
        <div class="menu-item" @click="showToast('我的订单')">
          <div class="menu-icon">
            <FontAwesomeIcon icon="clipboard" />
          </div>
          <span class="menu-text">我的订单</span>
          <span class="arrow">
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
        <div class="menu-item" @click="showToast('我的收藏')">
          <div class="menu-icon">
            <FontAwesomeIcon icon="heart" />
          </div>
          <span class="menu-text">我的收藏</span>
          <span class="arrow">
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
        <div class="menu-item" @click="showToast('设置')">
          <div class="menu-icon">
            <FontAwesomeIcon icon="cog" />
          </div>
          <span class="menu-text">设置</span>
          <span class="arrow">
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
      </div>

      <!-- 退出登录 -->
      <div class="logout-section">
        <button class="logout-btn" @click="handleLogout">
          退出登录
        </button>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNavigation 
      @navigate="handleNavigate"
    />

    <!-- 提示消息 -->
    <div v-if="toast.show" class="toast">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 显示提示消息
const showToast = (message: string) => {
  toast.value = {
    show: true,
    message
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

// 处理导航
const handleNavigate = (route: string) => {
  console.log('导航到:', route)
}

// 处理退出登录
const handleLogout = () => {
  showToast('正在退出登录...')
  
  // 清除登录状态
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userInfo')
  
  setTimeout(() => {
    router.push('/splash')
  }, 1000)
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 状态栏样式 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  background: white;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signal-bars {
  display: flex;
  align-items: end;
  gap: 2px;
}

.bar {
  width: 3px;
  background: #333;
  border-radius: 1px;
}

.bar:nth-child(1) { height: 4px; }
.bar:nth-child(2) { height: 6px; }
.bar:nth-child(3) { height: 8px; }
.bar:nth-child(4) { height: 10px; }

/* 主要内容 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  margin-bottom: 100px; /* 为底部导航留出空间 */
}

/* 用户信息卡片 */
.user-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  position: relative;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #E3F2FD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #2196F3;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: #2196F3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: white;
  border: 2px solid white;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.user-id {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.edit-btn {
  background: #F5F5F5;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #E0E0E0;
}

/* 菜单区域 */
.menu-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #F5F5F5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #F8F9FA;
}

.menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  color: #666;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.arrow {
  font-size: 12px;
  color: #999;
}

/* 退出登录区域 */
.logout-section {
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  background: #FF4444;
  color: white;
  border: none;
  border-radius: 12px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #FF3333;
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
}

/* 提示消息 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
}
</style>