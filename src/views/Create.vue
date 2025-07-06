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
        <div class="wifi-icon"><FontAwesomeIcon icon="wifi" /></div>
        <div class="battery-icon"><FontAwesomeIcon icon="battery-full" /></div>
      </div>
    </div>

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <FontAwesomeIcon icon="arrow-left" />
      </button>
      <h1 class="title">景点选择</h1>
      <button class="create-btn" @click="goToScriptCreator">创建剧本</button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="location-selector">
        <div class="current-location">
          <FontAwesomeIcon icon="map-marker-alt" class="location-icon" />
          <span class="location-text">广州</span>
        </div>
        <div class="search-bar">
          <FontAwesomeIcon icon="search" class="search-icon" />
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
        <span class="more-link" @click="showMore">更多 <FontAwesomeIcon icon="chevron-right" /></span>
      </div>
      <div class="hot-items">
        <div class="hot-item" @click="selectLocation('白云山')">
          <div class="item-image-placeholder">
            <FontAwesomeIcon icon="mountain" />
          </div>
          <span class="item-name">白云山 <span class="item-subtitle">(城市绿肺)</span></span>
        </div>
        <div class="hot-item" @click="selectLocation('上下九')">
          <span class="item-name">上下九 <span class="item-subtitle">(骑楼美食街)</span></span>
          <div class="item-image-placeholder">
            <FontAwesomeIcon icon="store" />
          </div>
        </div>
        <div class="hot-item" @click="selectLocation('圣心大教堂')">
          <div class="item-image-placeholder">
            <FontAwesomeIcon icon="church" />
          </div>
          <span class="item-name">圣心大教堂 <span class="item-subtitle">(石室圣心)</span></span>
        </div>
        <div class="hot-item clickable" @click="goToExploringLabel('文德路南')">
          <div class="item-image-placeholder wende-style">
            <FontAwesomeIcon icon="building" />
          </div>
          <span class="item-name">文德路南 <span class="item-subtitle">(历史文化街区)</span></span>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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

// 新增：跳转到探索标签页面
const goToExploringLabel = (locationName?: string) => {
  if (locationName) {
    showToast(`正在为您打开${locationName}的探索之旅...`)
    setTimeout(() => {
      router.push('/create/exploring-label')
    }, 1000)
  } else {
    router.push('/create/exploring-label')
  }
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

.create-btn {
  background: none;
  border: none;
  color: #2196F3;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
}

.create-btn:hover {
  background: #F0F8FF;
}

/* 搜索区域 */
.search-section {
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
}

.location-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-location {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #E3F2FD;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #2196F3;
  white-space: nowrap;
}

.location-icon {
  font-size: 12px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 20px;
  padding: 8px 16px;
  flex: 1;
  gap: 8px;
}

.search-icon {
  font-size: 14px;
  color: #999;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
}

.search-input::placeholder {
  color: #999;
}

/* 热门搜索 */
.hot-search {
  background: white;
  padding: 16px 20px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.more-link {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-link:hover {
  color: #2196F3;
}

.hot-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.hot-item:hover {
  background: #E3F2FD;
}

.item-image-placeholder {
  width: 50px;
  height: 40px;
  border-radius: 8px;
  background: #F0F8FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #2196F3;
  flex-shrink: 0;
}

.item-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  flex: 1;
  text-align: center;
}

.item-subtitle {
  font-size: 13px;
  color: #666;
  font-weight: normal;
}

/* 景点列表 */
.attractions-list {
  background: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-bottom: 80px; /* 为底部导航留空间 */
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #2196F3;
  margin: 0;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-select {
  background: #F5F5F5;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  outline: none;
}

.filter-select:focus {
  background: #E3F2FD;
  color: #2196F3;
}

/* 字母索引 */
.alphabet-index {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(10px);
}

.alphabet-item {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.alphabet-item:hover,
.alphabet-item.active {
  background: #2196F3;
  color: white;
  transform: scale(1.2);
}

/* 列表内容 */
.list-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.letter-group {
  position: relative;
}

.letter-header {
  background: #E3F2FD;
  color: #2196F3;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 20px;
  position: sticky;
  top: 0;
  z-index: 5;
}

.attraction-item {
  padding: 12px 20px;
  border-bottom: 1px solid #F5F5F5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.attraction-item:hover {
  background: #F8F9FA;
}

.attraction-item:last-child {
  border-bottom: none;
}

.attraction-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.attraction-location {
  font-size: 13px;
  color: #666;
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

/* 文德路南特殊样式 */
.wende-style {
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  color: #E65100;
}

.hot-item.clickable {
  position: relative;
  transform: scale(1);
  transition: all 0.3s ease;
}

.hot-item.clickable:hover {
  background: #E8F5E8;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

.hot-item.clickable::after {
  content: '开始探索';
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: #4CAF50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hot-item.clickable:hover::after {
  opacity: 1;
}
/* 响应式适配 */
@media (max-width: 393px) {
  .header {
    padding: 12px 16px;
  }
  
  .search-section {
    padding: 12px 16px;
  }
  
  .hot-search {
    padding: 12px 16px;
  }
  
  .list-header {
    padding: 12px 16px;
  }
  
  .attraction-item {
    padding: 12px 16px;
  }
  
  .letter-header {
    padding: 8px 16px;
  }
  
  .item-image-placeholder {
    width: 40px;
    height: 35px;
    font-size: 16px;
  }
}
</style>