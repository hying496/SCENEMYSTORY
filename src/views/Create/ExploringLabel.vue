<template>
  <div class="exploring-label-container">
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
      <h1 class="title">探索兴趣</h1>
      <span class="location-info">文德路南</span>
    </div>

    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div class="step-info">
        <FontAwesomeIcon icon="compass" class="step-icon" />
        <span class="step-text">探索标签</span>
      </div>
      <div class="step-progress">已选{{selectedCategories.length}}/4</div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 城市人文 -->
      <div class="category-card" @click="toggleSelection('urban')">
        <div class="card-image">
          <img src="../assets/sceneimages/urban-scene.svg" alt="城市人文" class="category-image" />
          <div v-if="selectedCategories.includes('urban')" class="selected-overlay">
            <FontAwesomeIcon icon="check-circle" class="check-icon" />
          </div>
        </div>
        <div class="card-content">
          <h3 class="category-title">城市人文</h3>
          <div class="category-tags">
            <span class="tag">领略旧址接触</span>
            <span class="tag">麻石铁道漫步</span>
            <span class="tag">老练门牌考据</span>
          </div>
        </div>
      </div>

      <!-- 自然风光 -->
      <div class="category-card" @click="toggleSelection('nature')">
        <div class="card-image">
          <img src="../assets/sceneimages/nature-scene.svg" alt="自然风光" class="category-image" />
          <div v-if="selectedCategories.includes('nature')" class="selected-overlay">
            <FontAwesomeIcon icon="check-circle" class="check-icon" />
          </div>
        </div>
        <div class="card-content">
          <h3 class="category-title">自然风光</h3>
          <div class="category-tags">
            <span class="tag">公园徒步</span>
            <span class="tag">自然牧场</span>
            <span class="tag">滨海深活</span>
          </div>
        </div>
      </div>

      <!-- 文化沉浸 -->
      <div class="category-card" @click="toggleSelection('culture')">
        <div class="card-image">
          <img src="../assets/sceneimages/culture-scene.svg" alt="文化沉浸" class="category-image" />
          <div v-if="selectedCategories.includes('culture')" class="selected-overlay">
            <FontAwesomeIcon icon="check-circle" class="check-icon" />
          </div>
        </div>
        <div class="card-content">
          <h3 class="category-title">文化沉浸</h3>
          <div class="category-tags">
            <span class="tag">复古手作</span>
            <span class="tag">文创市集</span>
            <span class="tag">民俗体验</span>
          </div>
        </div>
      </div>

      <!-- 户外冒险 -->
      <div class="category-card" @click="toggleSelection('outdoor')">
        <div class="card-image">
          <img src="../assets/sceneimages/outdoor-scene.svg" alt="户外冒险" class="category-image" />
          <div v-if="selectedCategories.includes('outdoor')" class="selected-overlay">
            <FontAwesomeIcon icon="check-circle" class="check-icon" />
          </div>
        </div>
        <div class="card-content">
          <h3 class="category-title">户外冒险</h3>
          <div class="category-tags">
            <span class="tag">林间穿行</span>
            <span class="tag">骑行漫游</span>
            <span class="tag">江边垂钓</span>
          </div>
        </div>
      </div>

      <!-- 影视潮流 -->
      <div class="category-card" @click="toggleSelection('entertainment')">
        <div class="card-image">
          <img src="../assets/sceneimages/entertainment-scene.svg" alt="影视潮流" class="category-image" />
          <div v-if="selectedCategories.includes('entertainment')" class="selected-overlay">
            <FontAwesomeIcon icon="check-circle" class="check-icon" />
          </div>
        </div>
        <div class="card-content">
          <h3 class="category-title">影视潮流</h3>
          <div class="category-tags">
            <span class="tag">看COS</span>
            <span class="tag">剧本寻宝</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示和按钮 -->
    <div class="bottom-section">
      <div class="next-step-hint">
        <FontAwesomeIcon icon="info-circle" class="hint-icon" />
        <span>下一步：选择兴趣标签，定制专属体验</span>
      </div>
      <div class="selection-hint">
        最少选择2个 最多选择4个
      </div>
      <div class="progress-dots">
        <div class="dot active"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <button
        class="next-btn"
        :class="{ active: canProceed }"
        :disabled="!canProceed"
        @click="goToNext"
      >
        下一步 - 兴趣标签
      </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { StepManager } from '@/utils/stepManager'

const router = useRouter()

// 选中的分类
const selectedCategories = ref<string[]>([])

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 计算是否可以进入下一步（最少2个，最多4个）
const canProceed = computed(() => {
  return selectedCategories.value.length >= 2 && selectedCategories.value.length <= 4
})

// 切换选择状态
const toggleSelection = (category: string) => {
  const index = selectedCategories.value.indexOf(category)

  if (index > -1) {
    // 取消选择
    selectedCategories.value.splice(index, 1)
    showToast(`取消选择：${getCategoryName(category)}`)
  } else {
    // 添加选择
    if (selectedCategories.value.length >= 4) {
      showToast('最多只能选择4个标签')
      return
    }
    selectedCategories.value.push(category)
    showToast(`选择了：${getCategoryName(category)}`)
  }
}

// 获取分类名称
const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    urban: '城市人文',
    nature: '自然风光',
    culture: '文化沉浸',
    outdoor: '户外冒险',
    entertainment: '影视潮流'
  }
  return names[category] || category
}

// 页面方法
const goBack = () => {
  router.go(-1)
}

const skipToNext = () => {
  // 移除跳过功能，现在只是显示当前景点信息
  // router.push('/create/interest-label')
}

const goToNext = () => {
  if (!canProceed.value) {
    showToast('请至少选择2个标签，最多选择4个')
    return
  }

  // 使用步骤管理器保存数据
  const success = StepManager.saveStepData(1, selectedCategories.value)
  if (!success) {
    showToast('保存失败，请重试')
    return
  }

  showToast('探索标签选择完成，进入下一步')
  setTimeout(() => {
    router.push('/create/interest-label')
  }, 1000)
}

// 页面加载时恢复之前的选择
onMounted(() => {
  const savedData = StepManager.getStepData(1)
  if (savedData && Array.isArray(savedData)) {
    selectedCategories.value = savedData
  }
})

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
.exploring-label-container {
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
}

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: #F5F5F5;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.location-info {
  color: #666;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #F8F9FA;
  border: 1px solid #E0E0E0;
  cursor: default;
  user-select: none;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
}

.step-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-icon {
  color: #2196F3;
  font-size: 16px;
}

.step-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.step-progress {
  font-size: 14px;
  color: #666;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  margin-bottom: 120px; /* 为底部区域留空间 */
}

/* 分类卡片 */
.category-card {
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(33, 150, 243, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.check-icon {
  color: white;
  font-size: 32px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card-content {
  padding: 16px;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #F0F0F0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 底部区域 */
.bottom-section {
  position: fixed;
  bottom: 80px; /* 在底部导航之上 */
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #F0F0F0;
  padding: 16px 20px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  max-width: 393px;
  margin: 0 auto;
}

.next-step-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #E8F5E8;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #2E7D32;
}

.hint-icon {
  font-size: 14px;
  color: #4CAF50;
}

.selection-hint {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E0E0E0;
  transition: background-color 0.3s;
}

.dot.active {
  background: #2196F3;
}

.next-btn {
  width: 100%;
  background: #CCC;
  color: white;
  border: none;
  border-radius: 24px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  cursor: not-allowed;
  transition: all 0.3s ease;
}

.next-btn.active {
  background: #2196F3;
  cursor: pointer;
}

.next-btn.active:hover {
  background: #1976D2;
  transform: translateY(-1px);
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

  .step-indicator {
    padding: 12px 16px;
  }

  .content {
    padding: 12px 16px;
  }

  .bottom-section {
    padding: 12px 16px;
  }

  .card-content {
    padding: 12px;
  }
}
</style>
