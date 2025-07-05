<template>
  <div class="interest-label-container">
    <!-- 状态栏 -->
    <StatusBar />

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7-7 7 7 7"/>
        </svg>
      </button>
      <h1 class="title">兴趣标签</h1>
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
      <!-- 海滨日光 -->
      <div v-if="activeTab === 'seaside'" class="tab-content">
        <div class="interest-grid">
          <div 
            v-for="item in seasideInterests"
            :key="item.id"
            class="interest-card"
            @click="handleInterestClick(item)"
          >
            <div class="interest-icon">{{ item.icon }}</div>
            <div class="interest-name">{{ item.name }}</div>
            <div class="interest-description">{{ item.description }}</div>
          </div>
        </div>
      </div>

      <!-- 公园徒步 -->
      <div v-if="activeTab === 'hiking'" class="tab-content">
        <div class="interest-grid">
          <div 
            v-for="item in hikingInterests"
            :key="item.id"
            class="interest-card"
            @click="handleInterestClick(item)"
          >
            <div class="interest-icon">{{ item.icon }}</div>
            <div class="interest-name">{{ item.name }}</div>
            <div class="interest-description">{{ item.description }}</div>
          </div>
        </div>
      </div>

      <!-- 首脑牧场 -->
      <div v-if="activeTab === 'ranch'" class="tab-content">
        <div class="interest-grid">
          <div 
            v-for="item in ranchInterests"
            :key="item.id"
            class="interest-card"
            @click="handleInterestClick(item)"
          >
            <div class="interest-icon">{{ item.icon }}</div>
            <div class="interest-name">{{ item.name }}</div>
            <div class="interest-description">{{ item.description }}</div>
          </div>
        </div>
      </div>

      <!-- 老城街区 -->
      <div v-if="activeTab === 'oldtown'" class="tab-content">
        <div class="interest-grid">
          <div 
            v-for="item in oldtownInterests"
            :key="item.id"
            class="interest-card"
            @click="handleInterestClick(item)"
          >
            <div class="interest-icon">{{ item.icon }}</div>
            <div class="interest-name">{{ item.name }}</div>
            <div class="interest-description">{{ item.description }}</div>
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
import StatusBar from '@/components/StatusBar.vue'
import TabNavigation from '@/components/TabNavigation.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const router = useRouter()

// 当前激活的标签
const activeTab = ref('seaside')

// 标签配置
const tabs = ref([
  { key: 'seaside', label: '海滨日光' },
  { key: 'hiking', label: '公园徒步' },
  { key: 'ranch', label: '首脑牧场' },
  { key: 'oldtown', label: '老城街区' }
])

// 海滨日光兴趣
const seasideInterests = ref([
  {
    id: 1,
    icon: '🏖️',
    name: '沙滩漫步',
    description: '感受海风拂面，聆听海浪声音'
  },
  {
    id: 2,
    icon: '🏄‍♂️',
    name: '冲浪体验',
    description: '挑战海浪，享受速度与激情'
  },
  {
    id: 3,
    icon: '🐚',
    name: '贝壳收集',
    description: '寻找独特的海洋珍宝'
  },
  {
    id: 4,
    icon: '🌅',
    name: '日出观赏',
    description: '迎接第一缕阳光的美好'
  },
  {
    id: 5,
    icon: '🚤',
    name: '快艇出海',
    description: '乘风破浪，探索海上风光'
  },
  {
    id: 6,
    icon: '🏊‍♀️',
    name: '海水游泳',
    description: '在清澈的海水中畅游'
  }
])

// 公园徒步兴趣
const hikingInterests = ref([
  {
    id: 7,
    icon: '🥾',
    name: '山径徒步',
    description: '踏上蜿蜒山路，享受自然之美'
  },
  {
    id: 8,
    icon: '🦋',
    name: '昆虫观察',
    description: '发现微小世界的奇妙生物'
  },
  {
    id: 9,
    icon: '🌸',
    name: '花草识别',
    description: '学习认识各种植物花卉'
  },
  {
    id: 10,
    icon: '📸',
    name: '风景摄影',
    description: '用镜头记录美好瞬间'
  },
  {
    id: 11,
    icon: '🧘‍♀️',
    name: '瑜伽冥想',
    description: '在自然中找到内心平静'
  },
  {
    id: 12,
    icon: '🏃‍♂️',
    name: '晨跑健身',
    description: '在清晨的公园里挥洒汗水'
  }
])

// 首脑牧场兴趣
const ranchInterests = ref([
  {
    id: 13,
    icon: '🐄',
    name: '奶牛互动',
    description: '与温顺的奶牛亲密接触'
  },
  {
    id: 14,
    icon: '🥛',
    name: '挤奶体验',
    description: '学习传统的挤奶技艺'
  },
  {
    id: 15,
    icon: '🐑',
    name: '羊群牧放',
    description: '体验牧羊人的田园生活'
  },
  {
    id: 16,
    icon: '🌾',
    name: '农作物采摘',
    description: '亲手收获新鲜的农产品'
  },
  {
    id: 17,
    icon: '🚜',
    name: '农机体验',
    description: '操作现代化农业机械'
  },
  {
    id: 18,
    icon: '🧀',
    name: '奶酪制作',
    description: '学习传统奶酪制作工艺'
  }
])

// 老城街区兴趣
const oldtownInterests = ref([
  {
    id: 19,
    icon: '🏛️',
    name: '古建探索',
    description: '感受历史建筑的魅力'
  },
  {
    id: 20,
    icon: '🎭',
    name: '街头艺术',
    description: '欣赏充满创意的街头表演'
  },
  {
    id: 21,
    icon: '🍜',
    name: '美食寻觅',
    description: '品尝地道的传统小吃'
  },
  {
    id: 22,
    icon: '🛍️',
    name: '古董淘宝',
    description: '在古玩市场寻找珍奇物品'
  },
  {
    id: 23,
    icon: '☕',
    name: '咖啡馆坐坐',
    description: '在温馨咖啡馆享受悠闲时光'
  },
  {
    id: 24,
    icon: '📚',
    name: '书店漫游',
    description: '在古老书店中寻找好书'
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

const handleInterestClick = (interest: any) => {
  showToast(`选择了兴趣: ${interest.name}`)
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
.interest-label-container {
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
  margin-bottom: 80px;
}

.tab-content {
  animation: fadeInUp 0.3s ease-out;
}

/* 兴趣网格 */
.interest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.interest-card {
  background: white;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.interest-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.interest-icon {
  font-size: 32px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.interest-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.interest-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
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
  
  .interest-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .interest-card {
    padding: 16px 12px;
  }
  
  .interest-icon {
    font-size: 28px;
    margin-bottom: 8px;
    height: 32px;
  }
  
  .interest-name {
    font-size: 14px;
  }
  
  .interest-description {
    font-size: 11px;
  }
}
</style>