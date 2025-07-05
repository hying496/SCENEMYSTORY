<template>
  <div class="home-container">
    <!-- 状态栏 -->
    <StatusBar background-color="white" text-color="#333" />

    <!-- 顶部导航栏 - 吸顶固定 -->
    <HomeTabNavigation 
      v-model="currentTab"
      @change="handleTabChange"
    />

    <!-- 滚动内容区域 -->
    <div class="scroll-content">
      <!-- 头部区域 -->
      <div class="header">
        <div class="user-info">
          <div class="avatar">{{ userInfo.username?.charAt(0) || '探' }}</div>
          <div class="greeting">
            <p class="welcome-text">欢迎回来</p>
            <p class="username">{{ userInfo.username || '探险家' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="notification-btn" @click="showToast('暂无新消息')">
            <FontAwesomeIcon icon="bell" />
          </button>
          <button class="profile-btn" @click="$router.push('/profile')">
            <FontAwesomeIcon icon="cog" />
          </button>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-section">
        <div class="search-bar">
          <FontAwesomeIcon icon="search" class="search-icon" />
          <input 
            type="text" 
            placeholder="搜索剧本杀主题旅行..."
            class="search-input"
            v-model="searchQuery"
          />
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="main-content">
        <!-- 根据当前标签显示不同内容 -->
        <div v-if="currentTab === 'today'" class="tab-content">
          <!-- 今日发现 -->
          <div class="featured-section">
            <h3 class="section-title">今日推荐</h3>
            <ScriptCard 
              :data="featuredScript"
              size="large"
              @click="handleCardClick"
              @favorite="handleFavorite"
            />
          </div>

          <!-- 功能菜单 -->
          <div class="menu-section">
            <h3 class="section-title">探索更多</h3>
            <div class="menu-grid">
              <div class="menu-item" @click="showToast('即将推出')">
                <div class="menu-icon">
                  <FontAwesomeIcon icon="theater-masks" />
                </div>
                <span class="menu-text">剧本杀</span>
              </div>
              <div class="menu-item" @click="showToast('即将推出')">
                <div class="menu-icon">
                  <FontAwesomeIcon icon="map" />
                </div>
                <span class="menu-text">旅行规划</span>
              </div>
              <div class="menu-item" @click="showToast('即将推出')">
                <div class="menu-icon">
                  <FontAwesomeIcon icon="users" />
                </div>
                <span class="menu-text">组队</span>
              </div>
              <div class="menu-item" @click="showToast('即将推出')">
                <div class="menu-icon">
                  <FontAwesomeIcon icon="calendar" />
                </div>
                <span class="menu-text">活动</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'ongoing'" class="tab-content">
          <!-- 进行中 -->
          <div class="ongoing-section">
            <h3 class="section-title">进行中的活动</h3>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <FontAwesomeIcon icon="play-circle" />
                </div>
                <div class="activity-info">
                  <h4 class="activity-title">民国上海风云</h4>
                  <p class="activity-date">开始时间: 2024年1月20日</p>
                  <p class="activity-progress">进度: 第2章/共5章</p>
                </div>
                <div class="activity-status ongoing">进行中</div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <FontAwesomeIcon icon="clock" />
                </div>
                <div class="activity-info">
                  <h4 class="activity-title">西湖断桥谜案</h4>
                  <p class="activity-date">预约时间: 2024年1月25日</p>
                  <p class="activity-progress">状态: 等待开始</p>
                </div>
                <div class="activity-status waiting">待开始</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'recommended'" class="tab-content">
          <!-- 热门推荐 -->
          <div class="recommended-section">
            <h3 class="section-title">热门推荐</h3>
            <div class="script-grid">
              <ScriptCard 
                v-for="script in recommendedScripts"
                :key="script.id"
                :data="script"
                size="medium"
                @click="handleCardClick"
                @favorite="handleFavorite"
              />
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'finished'" class="tab-content">
          <!-- 已结束 -->
          <div class="finished-section">
            <h3 class="section-title">已完成的活动</h3>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <FontAwesomeIcon icon="check-circle" />
                </div>
                <div class="activity-info">
                  <h4 class="activity-title">江南水乡谜案</h4>
                  <p class="activity-date">完成时间: 2024年1月15日</p>
                  <p class="activity-rating">
                    <FontAwesomeIcon icon="star" class="star-icon" />
                    评分: 4.8分
                  </p>
                </div>
                <div class="activity-status completed">已完成</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNavigation 
      :has-notification="true"
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
import BottomNavigation from '@/components/BottomNavigation.vue'
import StatusBar from '@/components/StatusBar.vue'
import ScriptCard from '@/components/ScriptCard.vue'
import HomeTabNavigation from '@/components/HomeTabNavigation.vue'

const searchQuery = ref('')
const currentTab = ref('today')

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 获取用户信息
const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : { username: '探险家' }
}

const userInfo = getUserInfo()

// 示例数据
const featuredScript = ref({
  id: 1,
  title: '古堡谜案',
  subtitle: '沉浸式推理体验，解锁神秘古堡的秘密',
  image: '/images/script-1.jpg',
  tags: ['推理', '古风', '团队'],
  rating: 4.8,
  price: 158,
  location: '广州白云区',
  isFavorite: false,
  status: 'hot'
})

// 热门推荐数据
const recommendedScripts = ref([
  {
    id: 2,
    title: '民国风云录',
    subtitle: '重回民国，体验那个时代的风云变幻',
    image: '/images/script-2.jpg',
    tags: ['历史', '推理', '情感'],
    rating: 4.6,
    price: 138,
    location: '广州天河区',
    isFavorite: true,
    status: 'recommended'
  },
  {
    id: 3,
    title: '江南烟雨',
    subtitle: '江南水乡的诗意与神秘',
    image: '/images/script-3.jpg',
    tags: ['古风', '情感', '探险'],
    rating: 4.7,
    price: 168,
    location: '广州越秀区',
    isFavorite: false,
    status: 'new'
  },
  {
    id: 4,
    title: '科幻未来城',
    subtitle: '穿越到2088年的未来世界',
    image: '/images/script-4.jpg',
    tags: ['科幻', '冒险', '团队'],
    rating: 4.5,
    price: 188,
    location: '广州黄埔区',
    isFavorite: false
  }
])

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

// 处理标签切换
const handleTabChange = (tabKey: string) => {
  console.log('切换到标签:', tabKey)
  showToast(`切换到: ${getTabName(tabKey)}`)
}

// 获取标签名称
const getTabName = (key: string) => {
  const tabNames: Record<string, string> = {
    today: '今日发现',
    ongoing: '进行中',
    recommended: '热门推荐',
    finished: '已结束'
  }
  return tabNames[key] || key
}

// 处理导航
const handleNavigate = (route: string) => {
  console.log('导航到:', route)
}

// 处理卡片点击
const handleCardClick = (data: any) => {
  showToast(`选择了: ${data.title}`)
}

// 处理收藏
const handleFavorite = (data: any) => {
  data.isFavorite = !data.isFavorite
  showToast(data.isFavorite ? '已收藏' : '已取消收藏')
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: #F8FBFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 滚动内容区域 */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  background: #F8FBFF;
}

/* 头部区域 - 现在在滚动区域内 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #F8FBFF;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #E3F2FD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.greeting {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.welcome-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.username {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.notification-btn, .profile-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #F5F5F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* 搜索栏 */
.search-section {
  padding: 0 20px 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 24px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 8px;
}

.search-icon {
  font-size: 16px;
  color: #999;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

/* 主要内容 */
.main-content {
  padding: 0 20px 16px;
  margin-bottom: 80px; /* 为底部导航留出空间 */
}

/* 推荐卡片 */
.featured-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-image {
  font-size: 48px;
  line-height: 1;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 14px;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.card-tags {
  display: flex;
  gap: 8px;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 功能菜单 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;
}

.menu-item:hover {
  transform: translateY(-2px);
}

.menu-icon {
  font-size: 24px;
}

.menu-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 最近活动 */
.recent-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #F0F8FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-info {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.activity-date {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.activity-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #E8F5E8;
  color: #4CAF50;
  font-weight: 500;
}

/* 标签内容区域 */
.tab-content {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 剧本网格 */
.script-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .script-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* 活动进度信息 */
.activity-progress {
  font-size: 12px;
  color: #2196F3;
  margin: 0;
  font-weight: 500;
}

.activity-rating {
  font-size: 12px;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  color: #FFB400;
  font-size: 10px;
}

/* 状态样式优化 */
.activity-status.waiting {
  background: #FFF3E0;
  color: #F57C00;
}

.activity-status.ongoing {
  background: #E3F2FD;
  color: #1976D2;
}

.activity-status.completed {
  background: #E8F5E8;
  color: #388E3C;
}

/* 响应式优化 */
@media (max-width: 393px) {
  .script-grid {
    margin-top: 12px;
  }
  
  .activity-progress,
  .activity-rating {
    font-size: 11px;
  }
}
</style>