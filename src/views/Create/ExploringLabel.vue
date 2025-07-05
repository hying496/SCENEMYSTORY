<template>
  <div class="exploring-label-container">
    <!-- 状态栏 -->
    <StatusBar />

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7-7 7 7 7"/>
        </svg>
      </button>
      <h1 class="title">探索标签</h1>
      <button class="create-btn" @click="createScript">创建剧本</button>
    </div>

    <!-- 标签导航 -->
    <TabNavigation 
      v-model="activeTab"
      :tabs="tabs"
      @change="handleTabChange"
    />

    <!-- 内容区域 -->
    <div class="content">
      <!-- 城市人文 -->
      <div v-if="activeTab === 'urban'" class="tab-content">
        <CardList 
          :items="urbanItems"
          @click="handleItemClick"
        />
      </div>

      <!-- 自然风光 -->
      <div v-if="activeTab === 'nature'" class="tab-content">
        <CardList 
          :items="natureItems"
          @click="handleItemClick"
        />
      </div>

      <!-- 文化沉浸 -->
      <div v-if="activeTab === 'culture'" class="tab-content">
        <CardList 
          :items="cultureItems"
          @click="handleItemClick"
        />
      </div>

      <!-- 户外冒险 -->
      <div v-if="activeTab === 'outdoor'" class="tab-content">
        <CardList 
          :items="outdoorItems"
          @click="handleItemClick"
        />
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
import StatusBar from '@/components/StatusBar.vue'
import TabNavigation from '@/components/TabNavigation.vue'
import CardList from '@/components/CardList.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const router = useRouter()

// 当前激活的标签
const activeTab = ref('urban')

// 标签配置
const tabs = ref([
  { key: 'urban', label: '城市人文' },
  { key: 'nature', label: '自然风光' },
  { key: 'culture', label: '文化沉浸' },
  { key: 'outdoor', label: '户外冒险' }
])

// 城市人文数据
const urbanItems = ref([
  {
    id: 1,
    title: '老城区漫步',
    subtitle: '穿梭在历史悠久的街道，感受城市变迁',
    image: '/images/urban-1.jpg',
    tags: ['历史', '建筑', '人文'],
    rating: 4.8,
    price: 128,
    location: '广州越秀区'
  },
  {
    id: 2,
    title: '骑楼建筑群',
    subtitle: '岭南特色建筑的完美体现',
    image: '/images/urban-2.jpg',
    tags: ['建筑', '文化', '摄影'],
    rating: 4.6,
    price: 98,
    location: '广州荔湾区'
  },
  {
    id: 3,
    title: '现代都市探索',
    subtitle: '感受城市的现代化脉搏',
    image: '/images/urban-3.jpg',
    tags: ['现代', '都市', '购物'],
    rating: 4.5,
    price: 158,
    location: '广州天河区'
  }
])

// 自然风光数据
const natureItems = ref([
  {
    id: 4,
    title: '白云山登山',
    subtitle: '城市绿肺，登高望远看广州全貌',
    image: '/images/nature-1.jpg',
    tags: ['登山', '自然', '健身'],
    rating: 4.9,
    price: 68,
    location: '广州白云区'
  },
  {
    id: 5,
    title: '珠江夜游',
    subtitle: '夜晚的珠江，灯火辉煌如画卷',
    image: '/images/nature-2.jpg',
    tags: ['水上', '夜景', '浪漫'],
    rating: 4.7,
    price: 188,
    location: '广州海珠区'
  },
  {
    id: 6,
    title: '湿地公园观鸟',
    subtitle: '与大自然亲密接触，观察候鸟迁徙',
    image: '/images/nature-3.jpg',
    tags: ['生态', '观鸟', '教育'],
    rating: 4.4,
    price: 88,
    location: '广州南沙区'
  }
])

// 文化沉浸数据
const cultureItems = ref([
  {
    id: 7,
    title: '粤剧体验',
    subtitle: '传统戏曲艺术的魅力，亲身体验粤剧文化',
    image: '/images/culture-1.jpg',
    tags: ['戏曲', '传统', '体验'],
    rating: 4.8,
    price: 168,
    location: '广州荔湾区'
  },
  {
    id: 8,
    title: '茶楼文化',
    subtitle: '一盅两件，感受正宗的广式茶文化',
    image: '/images/culture-2.jpg',
    tags: ['茶文化', '美食', '社交'],
    rating: 4.6,
    price: 128,
    location: '广州越秀区'
  },
  {
    id: 9,
    title: '书院古韵',
    subtitle: '走进古代学府，感受书香门第的文化底蕴',
    image: '/images/culture-3.jpg',
    tags: ['古建筑', '教育', '历史'],
    rating: 4.5,
    price: 98,
    location: '广州番禺区'
  }
])

// 户外冒险数据
const outdoorItems = ref([
  {
    id: 10,
    title: '溯溪探险',
    subtitle: '挑战自我，在山涧中寻找刺激与乐趣',
    image: '/images/outdoor-1.jpg',
    tags: ['溯溪', '冒险', '团队'],
    rating: 4.7,
    price: 268,
    location: '广州从化区'
  },
  {
    id: 11,
    title: '野外露营',
    subtitle: '远离城市喧嚣，在星空下享受宁静',
    image: '/images/outdoor-2.jpg',
    tags: ['露营', '星空', '野外'],
    rating: 4.6,
    price: 198,
    location: '广州增城区'
  },
  {
    id: 12,
    title: '攀岩挑战',
    subtitle: '征服岩壁，突破自我极限',
    image: '/images/outdoor-3.jpg',
    tags: ['攀岩', '极限', '挑战'],
    rating: 4.8,
    price: 298,
    location: '广州花都区'
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

const createScript = () => {
  showToast('创建剧本功能即将推出')
}

const handleTabChange = (tabKey: string) => {
  console.log('切换到标签:', tabKey)
}

const handleItemClick = (item: any) => {
  showToast(`选择了: ${item.title}`)
  // 这里可以跳转到详情页或处理选择逻辑
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
.exploring-label-container {
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

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #333;
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

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  margin-bottom: 80px; /* 为底部导航留空间 */
}

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
  
  .content {
    padding: 12px 16px;
  }
}
</style>