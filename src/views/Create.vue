<template>
  <div class="create-script-container">
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
        <div class="wifi-icon">📶</div>
        <div class="battery-icon">🔋</div>
      </div>
    </div>

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7-7 7 7 7"/>
        </svg>
      </button>
      <h1 class="title">景点选择</h1>
      <button class="create-btn" @click="goToScriptCreator">创建剧本</button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="location-selector">
        <div class="current-location">
          <span class="location-icon">📍</span>
          <span class="location-text">广州</span>
        </div>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="搜索城市/景点/历史记录"
            v-model="searchQuery"
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div class="hot-search">
      <div class="section-header">
        <h3 class="section-title">热门搜索</h3>
        <span class="more-link" @click="showMore">更多 ></span>
      </div>
      <div class="hot-items">
        <div class="hot-item" @click="selectLocation('白云山')">
          <div class="item-image-placeholder">🏔️</div>
          <span class="item-name">白云山 <span class="item-subtitle">(城市绿肺)</span></span>
        </div>
        <div class="hot-item" @click="selectLocation('上下九')">
          <span class="item-name">上下九 <span class="item-subtitle">(骑楼美食街)</span></span>
          <div class="item-image-placeholder">🏮</div>
        </div>
        <div class="hot-item" @click="selectLocation('圣心大教堂')">
          <div class="item-image-placeholder">⛪</div>
          <span class="item-name">圣心大教堂 <span class="item-subtitle">(石室圣心)</span></span>
        </div>
      </div>
    </div>

    <!-- 景点列表 -->
    <div class="attractions-list">
      <div class="list-header">
        <h3 class="list-title">景点列表</h3>
        <div class="filter-buttons">
          <select class="filter-select" v-model="selectedProvince">
            <option value="">省份</option>
            <option value="guangdong">广东</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
          </select>
          <select class="filter-select" v-model="selectedCity">
            <option value="">城市</option>
            <option value="guangzhou">广州</option>
            <option value="shenzhen">深圳</option>
            <option value="zhuhai">珠海</option>
          </select>
        </div>
      </div>

      <!-- 字母索引 -->
      <div class="alphabet-index">
        <div 
          v-for="letter in alphabet" 
          :key="letter"
          :class="['alphabet-item', { active: currentLetter === letter }]"
          @click="scrollToLetter(letter)"
        >
          {{ letter }}
        </div>
      </div>

      <!-- 景点列表内容 -->
      <div class="list-content" ref="listContent" @scroll="handleScroll">
        <div v-for="group in groupedAttractions" :key="group.letter" class="letter-group">
          <div class="letter-header" :id="`letter-${group.letter}`">{{ group.letter }}</div>
          <div 
            v-for="attraction in group.items" 
            :key="attraction.id"
            class="attraction-item"
            @click="selectAttraction(attraction)"
          >
            <div class="attraction-name">{{ attraction.name }}</div>
            <div class="attraction-location">{{ attraction.location }}</div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedProvince = ref('')
const selectedCity = ref('')
const currentLetter = ref('B')
const listContent = ref<HTMLElement>()

// 景点数据
const attractions = ref([
  { id: 1, name: '白云山', location: '广州市白云区', letter: 'B' },
  { id: 2, name: '北京路步行街', location: '广州市越秀区', letter: 'B' },
  { id: 3, name: '陈家祠', location: '广州市荔湾区', letter: 'C' },
  { id: 4, name: '洋埠头约', location: '广州市海珠区', letter: 'Y' },
  { id: 5, name: '沙面岛', location: '广州市荔湾区', letter: 'S' },
  { id: 6, name: '圣心大教堂', location: '广州市越秀区', letter: 'S' },
  { id: 7, name: '文德路商圈', location: '广州市越秀区', letter: 'W' },
  { id: 8, name: '新河浦', location: '广州市越秀区', letter: 'X' },
  { id: 9, name: '耀华大街', location: '广州市越秀区', letter: 'Y' },
  { id: 10, name: '越秀公园', location: '广州市越秀区', letter: 'Y' },
  { id: 11, name: '中山纪念堂', location: '广州市越秀区', letter: 'Z' },
  { id: 12, name: '珠江', location: '广州市', letter: 'Z' }
])

// 字母表
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 按字母分组的景点
const groupedAttractions = computed(() => {
  const groups: { [key: string]: any[] } = {}
  
  attractions.value.forEach(attraction => {
    const letter = attraction.letter
    if (!groups[letter]) {
      groups[letter] = []
    }
    groups[letter].push(attraction)
  })
  
  return Object.keys(groups)
    .sort()
    .map(letter => ({
      letter,
      items: groups[letter]
    }))
})

// 页面方法
const goBack = () => {
  router.go(-1)
}

const goToScriptCreator = () => {
  router.push('/script-creator')
}

const selectLocation = (location: string) => {
  showToast(`选择了景点: ${location}`)
}

const selectAttraction = (attraction: any) => {
  showToast(`选择了景点: ${attraction.name}`)
}

const showMore = () => {
  showToast('查看更多热门搜索')
}

const scrollToLetter = (letter: string) => {
  currentLetter.value = letter
  const element = document.getElementById(`letter-${letter}`)
  if (element && listContent.value) {
    const offsetTop = element.offsetTop - listContent.value.offsetTop
    listContent.value.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  // 滚动时更新当前字母
  // 这里可以添加逻辑来检测当前显示的字母
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

onMounted(() => {
  console.log('创建剧本页面已加载')
})
</script>

<style scoped>
.create-script-container {
  width: 100%;
  height: 100%;
  background: #F8F9FA;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
}

.back-btn, .help-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #333;
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
  font-size: 24px;
  width: 40px;
  text-align: center;
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