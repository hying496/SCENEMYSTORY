<template>
  <div class="splash-container">
    <!-- 海报图片轮播 -->
    <div class="poster-carousel">
      <div 
        v-for="(poster, index) in posters" 
        :key="index"
        class="poster-slide"
        :class="{ active: currentPosterIndex === index }"
      >
        <!-- 🎯 这里放海报图片 -->
        <img 
          :src="poster.image" 
          :alt="poster.alt" 
          class="poster-image" 
        />
        
        <!-- 底部内容区域 -->
        <div class="poster-content">
          <!-- Logo和标题 -->
          <div class="logo-section">
            <h1 class="app-title">灵探蓝途</h1>
            <p class="app-subtitle">{{ poster.subtitle }}</p>
          </div>
          
          <!-- 进度指示器 -->
          <div class="progress-indicators">
            <div 
              v-for="(dot, dotIndex) in posters" 
              :key="dotIndex"
              class="progress-dot"
              :class="{ active: currentPosterIndex === dotIndex }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 跳过按钮 -->
    <button class="skip-button" @click="skipToLogin">
      跳过 {{ remainingTime }}s
    </button>

    <!-- 开始使用按钮（最后一张图时显示） -->
    <div 
      v-if="currentPosterIndex === posters.length - 1"
      class="start-section"
    >
      <button class="start-button" @click="goToLogin">
        开始使用
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 🎯 海报数据 - 替换这里的图片路径
const posters = ref([
  {
    // 📸 替换为你的第一张海报图片路径
    image: '/images/main.png', // 或者使用 import 导入的图片
    alt: '实景穿越',
    subtitle: '——与一场美好事件的相遇'
  },
  {
    // 📸 替换为你的第一张海报图片路径
    image: '/images/splash1.png', // 或者使用 import 导入的图片
    alt: '实景穿越',
    subtitle: '——与一场美好事件的相遇'
  },
  {
    // 📸 替换为你的第二张海报图片路径  
    image: '/images/splash2.png',
    alt: '景点为题，IP为笔',
    subtitle: '我写你的专属剧本'
  },
  {
    // 📸 替换为你的第三张海报图片路径
    image: '/images/splash3.png', 
    alt: '推开这扇门',
    subtitle: '成为故事主角'
  }
])

// 当前海报索引
const currentPosterIndex = ref(0)
// 剩余时间
const remainingTime = ref(2)
// 定时器 - 使用 number 类型兼容浏览器环境
let slideTimer: number | null = null
let countdownTimer: number | null = null

// 初始化
onMounted(() => {
  startSlideshow()
})

// 清理定时器
onUnmounted(() => {
  clearTimers()
})

// 开始幻灯片播放
const startSlideshow = () => {
  startCountdown()
  
  slideTimer = window.setInterval(() => {
    nextSlide()
  }, 2000)
}

// 开始倒计时
const startCountdown = () => {
  countdownTimer = window.setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      remainingTime.value = 2
    }
  }, 1000)
}

// 下一张海报
const nextSlide = () => {
  if (currentPosterIndex.value < posters.value.length - 1) {
    currentPosterIndex.value++
    remainingTime.value = 2
  } else {
    // 最后一张图片时停留，等待用户点击
    clearTimers()
  }
}

// 跳过到登录页
const skipToLogin = () => {
  clearTimers()
  goToLogin()
}

// 跳转到登录页
const goToLogin = () => {
  clearTimers()
  router.push('/login')
}

// 清理定时器
const clearTimers = () => {
  if (slideTimer) {
    window.clearInterval(slideTimer)
    slideTimer = null
  }
  if (countdownTimer) {
    window.clearInterval(countdownTimer)
    countdownTimer = null
  }
}
</script>

<style scoped>
.splash-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #F8FBFF;
}

.poster-carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.poster-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.poster-slide.active {
  opacity: 1;
  z-index: 2;
}

/* 🎯 海报图片样式 - 你的图片会在这里显示 */
.poster-image {
  width: 100%;
  height: 70%; /* 图片占用70%的高度 */
  object-fit: cover;
  object-position: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 如果图片加载失败，会显示渐变背景 */
}

/* 底部内容区域 */
.poster-content {
  height: 30%;
  background: white;
  padding: 32px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/* Logo和标题区域 */
.logo-section {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.app-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 8px 0;
  background: linear-gradient(45deg, #2196F3, #21CBF3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.app-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  opacity: 0.8;
}

/* 进度指示器 */
.progress-indicators {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E0E0E0;
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: #2196F3;
  transform: scale(1.2);
}

/* 跳过按钮 */
.skip-button {
  position: absolute;
  top: 50px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skip-button:hover {
  background: white;
  color: #333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 开始使用按钮区域 */
.start-section {
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: 0 20px;
  z-index: 10;
}

.start-button {
  width: 100%;
  background: #4F7DF8;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(79, 125, 248, 0.3);
}

.start-button:hover {
  background: #3D6AE8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 125, 248, 0.4);
}

.start-button:active {
  transform: translateY(0);
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.poster-content {
  animation: slideInUp 0.8s ease-out;
}

.start-section {
  animation: slideInUp 0.8s ease-out 0.2s both;
}

/* 响应式适配 */
@media (max-width: 393px) {
  .poster-content {
    padding: 24px 16px 16px;
  }
  
  .app-title {
    font-size: 28px;
  }
  
  .app-subtitle {
    font-size: 14px;
  }
  
  .skip-button {
    top: 44px;
    right: 16px;
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .start-section {
    bottom: 60px;
    padding: 0 16px;
  }
  
  .start-button {
    padding: 14px;
    font-size: 16px;
  }
}

/* 确保图片在不同设备上都能正确显示 */
@media (max-height: 640px) {
  .poster-image {
    height: 65%;
  }
  
  .poster-content {
    height: 35%;
  }
}
</style>