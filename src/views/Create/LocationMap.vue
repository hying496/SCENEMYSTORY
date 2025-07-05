<template>
  <div class="location-map-container">
    <!-- 状态栏 -->
    <StatusBar />

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7-7 7 7 7"/>
        </svg>
      </button>
      <h1 class="title">位置地图</h1>
      <button class="search-btn" @click="showSearch">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section" v-if="searchVisible">
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input 
          type="text" 
          placeholder="搜索地点..."
          v-model="searchQuery"
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">×</button>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="map-section">
      <div class="map-container">
        <!-- 地图占位图 -->
        <div class="map-placeholder">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
            <!-- 地图背景 -->
            <rect width="200" height="120" fill="#E8F5E8"/>
            
            <!-- 道路 -->
            <path d="M0 60 Q50 40 100 60 T200 60" stroke="#DDD" stroke-width="8"/>
            <path d="M60 0 Q80 30 100 60 Q120 90 140 120" stroke="#DDD" stroke-width="6"/>
            
            <!-- 建筑物 -->
            <rect x="40" y="30" width="20" height="20" fill="#FF6B6B" rx="2"/>
            <rect x="80" y="45" width="15" height="15" fill="#4ECDC4" rx="2"/>
            <rect x="130" y="35" width="25" height="25" fill="#45B7D1" rx="2"/>
            <rect x="20" y="70" width="18" height="18" fill="#96CEB4" rx="2"/>
            <rect x="160" y="80" width="22" height="22" fill="#FECA57" rx="2"/>
            
            <!-- 地标点 -->
            <circle cx="100" cy="60" r="8" fill="#FF4444"/>
            <circle cx="100" cy="60" r="12" fill="none" stroke="#FF4444" stroke-width="2" opacity="0.5"/>
            
            <!-- 其他兴趣点 -->
            <circle cx="50" cy="40" r="4" fill="#2196F3"/>
            <circle cx="150" cy="47" r="4" fill="#4CAF50"/>
            <circle cx="70" cy="85" r="4" fill="#FF9800"/>
            <circle cx="170" cy="90" r="4" fill="#9C27B0"/>
          </svg>
          
          <!-- 地图控制按钮 -->
          <div class="map-controls">
            <button class="control-btn" @click="zoomIn">+</button>
            <button class="control-btn" @click="zoomOut">-</button>
            <button class="control-btn location-btn" @click="locateMe">📍</button>
          </div>
        </div>
      </div>
      
      <!-- 地图信息栏 -->
      <div class="map-info">
        <div class="current-location">
          <span class="location-icon">📍</span>
          <span class="location-text">当前位置：广州市天河区</span>
        </div>
        <div class="map-stats">
          <span class="stat-item">🎯 发现 {{ selectedLocations.length }} 个地点</span>
          <span class="stat-item">📏 范围 5km</span>
        </div>
      </div>
    </div>

    <!-- 地点列表 -->
    <div class="locations-section">
      <div class="section-header">
        <h3 class="section-title">附近地点</h3>
        <div class="filter-buttons">
          <button 
            v-for="filter in filters"
            :key="filter.key"
            :class="['filter-btn', { active: activeFilter === filter.key }]"
            @click="setFilter(filter.key)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <div class="locations-list">
        <div 
          v-for="location in filteredLocations"
          :key="location.id"
          :class="['location-item', { selected: selectedLocations.includes(location.id) }]"
          @click="toggleLocation(location)"
        >
          <div class="location-marker" :style="{ backgroundColor: location.color }">
            {{ location.icon }}
          </div>
          <div class="location-info">
            <h4 class="location-name">{{ location.name }}</h4>
            <p class="location-address">{{ location.address }}</p>
            <div class="location-meta">
              <span class="distance">{{ location.distance }}</span>
              <span class="category">{{ location.category }}</span>
              <span v-if="location.rating" class="rating">
                ⭐ {{ location.rating }}
              </span>
            </div>
          </div>
          <div class="location-actions">
            <div v-if="selectedLocations.includes(location.id)" class="selected-badge">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-actions">
      <div class="selected-info">
        已选择 {{ selectedLocations.length }} 个地点
      </div>
      <button 
        class="confirm-btn" 
        :disabled="selectedLocations.length === 0"
        @click="confirmSelection"
      >
        确认选择
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusBar from '@/components/StatusBar.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const router = useRouter()

// 响应式数据
const searchVisible = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedLocations = ref<number[]>([])

// 过滤器配置
const filters = ref([
  { key: 'all', label: '全部' },
  { key: 'scenic', label: '景点' },
  { key: 'culture', label: '文化' },
  { key: 'food', label: '美食' },
  { key: 'shopping', label: '购物' }
])

// 地点数据
const locations = ref([
  {
    id: 1,
    name: '广州塔',
    address: '广州市海珠区阅江西路222号',
    category: 'scenic',
    distance: '1.2km',
    rating: 4.8,
    icon: '🗼',
    color: '#FF4444'
  },
  {
    id: 2,
    name: '陈家祠',
    address: '广州市荔湾区中山七路恩龙里34号',
    category: 'culture',
    distance: '2.5km',
    rating: 4.6,
    icon: '🏛️',
    color: '#2196F3'
  },
  {
    id: 3,
    name: '上下九步行街',
    address: '广州市荔湾区上下九路',
    category: 'shopping',
    distance: '1.8km',
    rating: 4.4,
    icon: '🛍️',
    color: '#4CAF50'
  },
  {
    id: 4,
    name: '沙面岛',
    address: '广州市荔湾区沙面',
    category: 'scenic',
    distance: '2.1km',
    rating: 4.7,
    icon: '🏝️',
    color: '#FF9800'
  },
  {
    id: 5,
    name: '北京路步行街',
    address: '广州市越秀区北京路',
    category: 'shopping',
    distance: '1.5km',
    rating: 4.3,
    icon: '🚶‍♂️',
    color: '#9C27B0'
  },
  {
    id: 6,
    name: '荔枝湾涌',
    address: '广州市荔湾区荔湾路',
    category: 'scenic',
    distance: '2.3km',
    rating: 4.5,
    icon: '🌊',
    color: '#00BCD4'
  }
])

// 过滤后的地点
const filteredLocations = computed(() => {
  let filtered = locations.value

  // 按类别过滤
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(location => location.category === activeFilter.value)
  }

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 页面方法
const goBack = () => {
  router.go(-1)
}

const showSearch = () => {
  searchVisible.value = !searchVisible.value
}

const clearSearch = () => {
  searchQuery.value = ''
}

const setFilter = (filterKey: string) => {
  activeFilter.value = filterKey
}

const toggleLocation = (location: any) => {
  const index = selectedLocations.value.indexOf(location.id)
  if (index > -1) {
    selectedLocations.value.splice(index, 1)
    showToast(`取消选择：${location.name}`)
  } else {
    selectedLocations.value.push(location.id)
    showToast(`已选择：${location.name}`)
  }
}

const confirmSelection = () => {
  if (selectedLocations.value.length === 0) return
  
  const selectedNames = locations.value
    .filter(loc => selectedLocations.value.includes(loc.id))
    .map(loc => loc.name)
    .join('、')
  
  showToast(`确认选择了 ${selectedLocations.value.length} 个地点：${selectedNames}`)
  
  // 这里可以跳转到下一步或保存选择
  setTimeout(() => {
    router.push('/create/script-customization')
  }, 1500)
}

// 地图操作
const zoomIn = () => {
  showToast('放大地图')
}

const zoomOut = () => {
  showToast('缩小地图')
}

const locateMe = () => {
  showToast('定位到当前位置')
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
.location-map-container {
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

.back-btn, .search-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #333;
}

.back-btn:hover, .search-btn:hover {
  background: #F5F5F5;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 搜索栏 */
.search-section {
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 20px;
  padding: 8px 16px;
  gap: 8px;
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

.clear-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 地图区域 */
.map-section {
  background: white;
  border-bottom: 1px solid #F0F0F0;
}

.map-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: #F0F8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.map-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #DDD;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: #F5F5F5;
}

.location-btn {
  font-size: 14px;
}

.map-info {
  padding: 12px 20px;
  border-top: 1px solid #F0F0F0;
}

.current-location {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.location-icon {
  font-size: 14px;
}

.location-text {
  font-size: 14px;
  color: #333;
}

.map-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 12px;
  color: #666;
}

/* 地点列表 */
.locations-section {
  flex: 1;
  overflow-y: auto;
  background: white;
  margin-bottom: 140px; /* 为底部操作栏和导航留空间 */
}

.section-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid #F0F0F0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-btn {
  background: #F5F5F5;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #E0E0E0;
}

.filter-btn.active {
  background: #2196F3;
  color: white;
}

.locations-list {
  padding: 12px 20px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.location-item:hover {
  background: #E3F2FD;
  transform: translateY(-2px);
}

.location-item.selected {
  background: #E8F5E8;
  border: 2px solid #4CAF50;
}

.location-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.location-address {
  font-size: 13px;
  color: #666;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.location-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.distance {
  color: #2196F3;
  font-weight: 500;
}

.category {
  color: #666;
}

.rating {
  color: #FF9800;
}

.location-actions {
  flex-shrink: 0;
}

.selected-badge {
  width: 24px;
  height: 24px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  bottom: 80px; /* 在底部导航之上 */
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #F0F0F0;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  max-width: 393px;
  margin: 0 auto;
}

.selected-info {
  font-size: 14px;
  color: #666;
}

.confirm-btn {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #45A049;
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  background: #CCC;
  cursor: not-allowed;
  transform: none;
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
  max-width: 300px;
  text-align: center;
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
  
  .search-section {
    padding: 12px 16px;
  }
  
  .map-info {
    padding: 12px 16px;
  }
  
  .section-header {
    padding: 16px 16px 12px;
  }
  
  .locations-list {
    padding: 12px 16px;
  }
  
  .bottom-actions {
    padding: 12px 16px;
  }
  
  .location-item {
    padding: 10px;
  }
  
  .location-marker {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
</style>