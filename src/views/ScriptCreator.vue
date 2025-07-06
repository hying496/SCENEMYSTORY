<template>
  <div class="script-creator-container">
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

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <FontAwesomeIcon icon="arrow-left" />
      </button>
      <h1 class="title">创建剧本</h1>
      <button class="help-btn" @click="showHelp">
        <FontAwesomeIcon icon="question-circle" />
      </button>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 创建流程指引 -->
      <div class="process-guide">
        <h2 class="guide-title">创建你的专属剧本杀旅行</h2>
        <p class="guide-subtitle">只需4步，轻松定制独特的旅行体验</p>

        <div class="process-steps">
          <div class="step-item" @click="goToExploringLabel">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">选择探索标签</h3>
              <p class="step-description">城市人文、自然风光、文化沉浸、户外冒险</p>
            </div>
            <div class="step-arrow">
              <FontAwesomeIcon icon="chevron-right" />
            </div>
          </div>

          <div class="step-item" @click="goToInterestLabel">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">选择兴趣标签</h3>
              <p class="step-description">海滨日光、公园徒步、首脑牧场、老城街区</p>
            </div>
            <div class="step-arrow">
              <FontAwesomeIcon icon="chevron-right" />
            </div>
          </div>

          <div class="step-item" @click="goToLocationMap">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">选择位置地图</h3>
              <p class="step-description">查看地图，选择具体的活动地点</p>
            </div>
            <div class="step-arrow">
              <FontAwesomeIcon icon="chevron-right" />
            </div>
          </div>

          <div class="step-item" @click="goToScriptCustomization">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="step-title">剧本定制</h3>
              <p class="step-description">个性化定制你的剧本杀体验</p>
            </div>
            <div class="step-arrow">
              <FontAwesomeIcon icon="chevron-right" />
            </div>
          </div>
        </div>
      </div>

      <!-- 快速创建 -->
      <div class="quick-create">
        <h3 class="section-title">快速创建</h3>
        <div class="quick-options">
          <div class="quick-option" @click="quickCreate('popular')">
            <div class="option-icon">
              <FontAwesomeIcon icon="fire" />
            </div>
            <div class="option-text">
              <div class="option-title">热门推荐</div>
              <div class="option-desc">基于热门景点快速生成</div>
            </div>
          </div>

          <div class="quick-option" @click="quickCreate('nearby')">
            <div class="option-icon">
              <FontAwesomeIcon icon="map-marker-alt" />
            </div>
            <div class="option-text">
              <div class="option-title">附近景点</div>
              <div class="option-desc">基于当前位置推荐</div>
            </div>
          </div>

          <div class="quick-option" @click="quickCreate('random')">
            <div class="option-icon">
              <FontAwesomeIcon icon="dice" />
            </div>
            <div class="option-text">
              <div class="option-title">随机探索</div>
              <div class="option-desc">让我们为你随机选择</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的草稿 -->
      <div class="my-drafts" v-if="drafts.length > 0">
        <h3 class="section-title">我的草稿</h3>
        <div class="draft-list">
          <div
            v-for="draft in drafts"
            :key="draft.id"
            class="draft-item"
            @click="continueDraft(draft)"
          >
            <div class="draft-info">
              <div class="draft-title">{{ draft.title }}</div>
              <div class="draft-time">{{ formatTime(draft.updatedAt) }}</div>
            </div>
            <div class="draft-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: draft.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ draft.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNavigation @navigate="handleNavigate" />

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

// 草稿数据
const drafts = ref([
  {
    id: 1,
    title: '广州古城探索之旅',
    progress: 75,
    updatedAt: Date.now() - 1000 * 60 * 30 // 30分钟前
  },
  {
    id: 2,
    title: '珠江夜游剧本',
    progress: 45,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2 // 2小时前
  }
])

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 页面方法
const goBack = () => {
  router.go(-1)
}

const showHelp = () => {
  showToast('创建帮助：按照步骤选择标签和地点，系统会为你生成专属剧本')
}

// 导航到各个子页面
const goToExploringLabel = () => {
  router.push('/create/exploring-label')
}

const goToInterestLabel = () => {
  router.push('/create/interest-label')
}

const goToLocationMap = () => {
  router.push('/create/location-map')
}

const goToScriptCustomization = () => {
  router.push('/create/script-customization')
}

const goToCharacterCustomization = () => {
  router.push('/create/character-customization')
}

// 快速创建
const quickCreate = (type: string) => {
  const typeNames = {
    popular: '热门推荐',
    nearby: '附近景点',
    random: '随机探索'
  }
  showToast(`${typeNames[type as keyof typeof typeNames]}功能即将推出`)
}

// 继续草稿
const continueDraft = (draft: any) => {
  showToast(`继续编辑：${draft.title}`)
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const handleNavigate = (route: string) => {
  console.log('导航到:', route)
}

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




</script>

<style scoped>
.script-creator-container {
  width: 100%;
  height: 100vh;
  background: #F8F9FA;
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
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
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

/* 头部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
}

.back-btn, .help-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.back-btn:hover, .help-btn:hover {
  background: #F5F5F5;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 主要内容 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 80px;
}

/* 流程指引 */
.process-guide {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.guide-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.guide-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  text-align: center;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item:hover {
  background: #E3F2FD;
  transform: translateX(4px);
}

.step-number {
  width: 32px;
  height: 32px;
  background: #2196F3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.step-description {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.step-arrow {
  color: #CCC;
  flex-shrink: 0;
  font-size: 14px;
}

/* 快速创建 */
.quick-create {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.quick-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-option:hover {
  background: #E8F5E8;
  transform: translateY(-2px);
}

.option-icon {
  font-size: 20px;
  width: 40px;
  text-align: center;
  color: #2196F3;
}

.option-text {
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 13px;
  color: #666;
}

/* 我的草稿 */
.my-drafts {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.draft-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.draft-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.draft-item:hover {
  background: #FFF3E0;
  transform: translateY(-2px);
}

.draft-info {
  flex: 1;
}

.draft-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.draft-time {
  font-size: 13px;
  color: #666;
}

.draft-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  width: 60px;
  height: 6px;
  background: #E0E0E0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 30px;
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

/* 响应式适配 */
@media (max-width: 393px) {
  .header {
    padding: 12px 16px;
  }

  .main-content {
    padding: 16px;
  }

  .process-guide {
    padding: 20px;
  }

  .quick-create, .my-drafts {
    padding: 16px;
  }

  .step-item, .quick-option, .draft-item {
    padding: 12px;
  }

  .guide-title {
    font-size: 18px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>
