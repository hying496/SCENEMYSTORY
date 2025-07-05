<template>
  <div class="home-container">
    <!-- 状态栏 -->
    <StatusBar background-color="white" text-color="#333" />

    <!-- 顶部导航栏 - 吸顶固定 -->
    <TabNavigation 
      v-model="currentTab"
      :tabs="homeTabs"
      title="Home"
      title-icon="🏠"
      :show-header="false"
      @change="handleTabChange"
    />

    <!-- 滚动内容区域 -->
    <div class="scroll-content">
      <!-- 头部区域 -->
      <div class="header">
        <div class="user-info">
          <div class="avatar-container">
            <img src="../assets/image/avatar.svg" alt="探险家头像" class="avatar-image" />
          </div>
          <div class="greeting">
            <h2 class="username">{{ userInfo.username || '鲤工仔' }}</h2>
            <p class="welcome-text">早上好！</p>
            <p class="weather-text">今日有雨，勿忘雨伞~</p>
          </div>
        </div>
        <div class="weather-info">
          <div class="location">
            <span class="location-icon">📍</span>
            <span class="city-name">广州</span>
          </div>
          <div class="weather-status">
            <span class="weather-icon">☁️</span>
            <span class="temperature">28°C</span>
          </div>
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

          <!-- 进行中 -->
          <div class="ongoing-section">
            <h3 class="section-title">进行中</h3>
            <div class="activity-card clickable" @click="goToOngoingGame">
              <div class="card-image">
                <img src="../assets/image/shamian-activity.svg" alt="沙面岛" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">沙面岛</span>
                </div>
                <h3 class="activity-title">沙面风云</h3>
                <div class="activity-progress">
                  <div class="progress-info">
                    <span class="progress-text">目前进度 3/10</span>
                    <span class="progress-percentage">30%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 已结束 -->
          <div class="finished-section">
            <h3 class="section-title">已结束</h3>
            
            <div class="activity-card clickable" @click="viewFinishedActivity('wenderoad')">
              <div class="card-image">
                <img src="../assets/image/wende-activity.svg" alt="文德路南" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">文德路南</span>
                </div>
                <h3 class="activity-title">文德流光</h3>
                <div class="activity-meta">
                  <span class="completion-date">剧情任务 12/12</span>
                </div>
              </div>
            </div>

            <div class="activity-card clickable" @click="viewFinishedActivity('shamian')">
              <div class="card-image">
                <img src="../assets/image/shamian-activity.svg" alt="沙面岛" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">沙面岛</span>
                </div>
                <h3 class="activity-title">洋楼子弹</h3>
                <div class="activity-meta">
                  <span class="completion-date">剧情任务 11/11</span>
                </div>
              </div>
            </div>

            <div class="activity-card clickable" @click="viewFinishedActivity('xiaohe')">
              <div class="card-image">
                <img src="../assets/image/pantang-activity.svg" alt="泮塘五约" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">泮塘五约</span>
                </div>
                <h3 class="activity-title">水巷寻踪</h3>
                <div class="activity-meta">
                  <span class="completion-date">剧情任务 13/13</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'ongoing'" class="tab-content">
          <!-- 进行中 -->
          <div class="ongoing-section">
            <div class="activity-card featured">
              <div class="card-image">
                <img src="../assets/images/shamian-activity.svg" alt="沙面岛" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">沙面岛</span>
                </div>
                <h3 class="activity-title">沙面风云</h3>
                <div class="activity-progress">
                  <div class="progress-info">
                    <span class="progress-text">目前进度 3/10</span>
                    <span class="progress-percentage">30%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门推荐 -->
          <div class="recommended-section">
            <h3 class="section-title">热门推荐</h3>
            <div class="activity-card">
              <div class="card-image">
                <img src="../assets/image/xinhe-activity.svg" alt="新河浦" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">新河浦</span>
                </div>
                <h3 class="activity-title">洋楼谜语</h3>
                <div class="activity-meta">
                  <span class="participant-count">参与人数 999</span>
                  <div class="activity-tags">
                    <span class="tag">古洋楼花小楼</span>
                    <span class="tag">穿民国服装</span>
                  </div>
                </div>
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
            <h3 class="section-title">已结束</h3>
            
            <div class="activity-card">
              <div class="card-image">
                <img src="../assets/images/wende-activity.svg" alt="文德路南" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">文德路南</span>
                </div>
                <h3 class="activity-title">文德流光</h3>
                <div class="activity-meta">
                  <span class="completion-date">剧情任务 12/12</span>
                </div>
              </div>
            </div>

            <div class="activity-card">
              <div class="card-image">
                <img src="../assets/images/shamian-activity.svg" alt="沙面岛" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">沙面岛</span>
                </div>
                <h3 class="activity-title">洋楼子弹</h3>
                <div class="activity-meta">
                  <span class="completion-date">剧情任务 11/11</span>
                </div>
              </div>
            </div>

            <div class="activity-card">
              <div class="card-image">
                <img src="../assets/images/pantang-activity.svg" alt="泮塘五约" class="activity-image" />
              </div>
              <div class="card-content">
                <div class="location-badge">
                  <span class="location-icon">📍</span>
                  <span class="location-name">泮塘五约</span>
                </div>
                <h3 class="activity-title">水巷寻踪</h3>
                <div class="activity-meta">
                  <span class="completion-date">剧情任务 13/13</span>
                </div>
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
import StatusBar from '@/components/StatusBar.vue'
import ScriptCard from '@/components/ScriptCard.vue'
import TabNavigation from '@/components/TabNavigation.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const searchQuery = ref('')
const currentTab = ref('today')

// 首页标签配置
const homeTabs = ref([
  { key: 'today', label: '今日发现' },
  { key: 'ongoing', label: '进行中', badge: 2 },
  { key: 'recommended', label: '热门推荐' },
  { key: 'finished', label: '已结束' }
])

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 获取用户信息
const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : { username: '鲤工仔' }
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

// 跳转到正在进行的游戏页面
const goToOngoingGame = () => {
  showToast('正在进入沙面风云游戏...')
  // 这里可以跳转到游戏页面
  // router.push('/game/shamian-fengyun')
  setTimeout(() => {
    showToast('游戏页面开发中，敬请期待！')
  }, 1500)
}

// 查看已结束活动详情
const viewFinishedActivity = (activityId: string) => {
  const activityNames: Record<string, string> = {
    wenderoad: '文德流光',
    shamian: '洋楼子弹',
    xiaohe: '水巷寻踪'
  }
  
  showToast(`查看${activityNames[activityId]}详情`)
  // 这里可以跳转到活动详情页面
  // router.push(`/activity/${activityId}`)
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

/* 头部区域 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #F8FBFF;
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.greeting {
  flex: 1;
  min-width: 0;
}

.username {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.welcome-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 2px 0;
}

.weather-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(33, 150, 243, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.location-icon {
  font-size: 12px;
  color: #2196F3;
}

.city-name {
  font-size: 12px;
  color: #2196F3;
  font-weight: 500;
}

.weather-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.weather-icon {
  font-size: 16px;
}

.temperature {
  font-size: 24px;
  font-weight: 600;
  color: #2196F3;
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

/* 活动卡片样式 */
.ongoing-section, .finished-section {
  margin-bottom: 24px;
}

.recommended-section {
  margin-top: 20px;
}

.activity-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.activity-card.clickable {
  cursor: pointer;
}

.activity-card.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.activity-card.featured {
  margin-bottom: 24px;
}

.card-image {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.location-badge .location-icon {
  font-size: 10px;
}

.activity-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.activity-progress {
  margin-top: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

.progress-percentage {
  font-size: 14px;
  color: #2196F3;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2196F3, #21CBF3);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.activity-meta {
  margin-top: 12px;
}

.participant-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.completion-date {
  font-size: 14px;
  color: #4CAF50;
  font-weight: 500;
}

.activity-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #F0F0F0;
  color: #666;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
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

/* 响应式优化 */
@media (max-width: 393px) {
  .header {
    padding: 16px;
  }
  
  .main-content {
    padding: 0 16px 16px;
  }
  
  .avatar-image {
    width: 50px;
    height: 50px;
  }
  
  .username {
    font-size: 18px;
  }
  
  .temperature {
    font-size: 20px;
  }
  
  .activity-card {
    margin-bottom: 12px;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .activity-title {
    font-size: 16px;
  }
}
</style>