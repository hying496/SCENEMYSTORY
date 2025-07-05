<template>
  <div class="not-found-container">
    <MobileHeader />
    
    <div class="content">
      <div class="error-icon">🧭</div>
      <h2 class="error-title">页面走丢了</h2>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      
      <div class="actions">
        <button class="back-btn" @click="goBack">
          ← 返回上页
        </button>
        <button class="home-btn" @click="goHome">
          🏠 回到首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MobileHeader from '@/components/MobileHeader.vue'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/home')
  }
}

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped>
.not-found-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #D6EFFF 0%, #E8F4FD 100%);
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.error-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 280px;
}

.back-btn, .home-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.back-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.home-btn {
  background: #72C8FF;
  color: white;
}

.home-btn:hover {
  background: #5BB5FF;
  transform: translateY(-1px);
}
</style>