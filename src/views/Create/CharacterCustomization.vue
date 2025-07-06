
<template>
  <div class="character-customization-container">
    <!-- 状态栏 -->
    <StatusBar />

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7-7 7 7 7"/>
        </svg>
      </button>
      <h1 class="title">角色定制</h1>
      <button class="complete-btn" @click="completeCustomization">完成</button>
    </div>

    <!-- 步骤进度 -->
    <div class="step-progress">
      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <span class="step-number">1</span>
          <span class="step-label">角色定制</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <span class="step-number">2</span>
          <span class="step-label">角色定制</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <span class="step-number">3</span>
          <span class="step-label">角色外观设计</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 3 }"></div>
        <div class="step" :class="{ active: currentStep >= 4 }">
          <span class="step-number">4</span>
          <span class="step-label">上传</span>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 第一步：角色定制 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">Hi!</h2>
        <p class="step-subtitle">角色的性别是？</p>

        <div class="character-options">
          <div class="character-card" @click="selectCharacter('male', 'gentleman')">
            <div class="character-avatar male-gentleman">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <!-- 男性绅士角色图标 -->
                <circle cx="30" cy="20" r="8" fill="#E3F2FD"/>
                <rect x="22" y="35" width="16" height="20" rx="2" fill="#1976D2"/>
                <circle cx="30" cy="16" r="6" fill="#FFB74D"/>
                <rect x="26" y="32" width="8" height="3" fill="#333"/>
              </svg>
            </div>
            <div class="character-info">
              <h3 class="character-title">天真侦探甜</h3>
              <p class="character-subtitle">绅士男子</p>
            </div>
          </div>

          <div class="character-card" @click="selectCharacter('female', 'lady')">
            <div class="character-avatar female-lady">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <!-- 女性淑女角色图标 -->
                <circle cx="30" cy="20" r="8" fill="#FCE4EC"/>
                <rect x="22" y="35" width="16" height="20" rx="2" fill="#E91E63"/>
                <circle cx="30" cy="16" r="6" fill="#FFB74D"/>
                <path d="M22 35 L38 35 L36 32 L24 32 Z" fill="#333"/>
              </svg>
            </div>
            <div class="character-info">
              <h3 class="character-title">聪慧谜团者</h3>
              <p class="character-subtitle">淑女女子</p>
            </div>
          </div>
        </div>

        <button class="next-btn" @click="nextStep" :disabled="!selectedCharacter.gender">
          下一步
        </button>
      </div>

      <!-- 第二步：角色定制 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">请选择你的角色</h2>
        <p class="step-subtitle">不同角色本只以特色切换</p>

        <div class="role-options">
          <div
            v-for="role in availableRoles"
            :key="role.id"
            class="role-card"
            :class="{ selected: selectedRole?.id === role.id }"
            @click="selectRole(role)"
          >
            <div class="role-icon">{{ role.icon }}</div>
            <div class="role-info">
              <h3 class="role-title">{{ role.title }}</h3>
              <p class="role-subtitle">{{ role.subtitle }}</p>
            </div>
          </div>
        </div>

        <div class="navigation-buttons">
          <button class="prev-btn" @click="prevStep">上一步</button>
          <button class="next-btn" @click="nextStep" :disabled="!selectedRole">
            下一步
          </button>
        </div>
      </div>

      <!-- 第三步：角色外观设计 -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">角色外观设计</h2>
        <p class="step-subtitle">妙笔生花，一课生成你的专属形象</p>

        <!-- 角色预览 -->
        <div class="character-preview">
          <div class="preview-container">
            <div class="character-model">
              <!-- 这里显示3D角色模型或2D形象 -->
              <div class="model-placeholder">
                <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
                  <!-- 角色形象占位图 -->
                  <circle cx="60" cy="40" r="25" :fill="characterDesign.skinColor"/>
                  <rect x="40" y="70" width="40" height="60" rx="5" :fill="characterDesign.clothingColor"/>
                  <rect x="45" y="130" width="30" height="20" rx="3" fill="#8D6E63"/>
                  <!-- 头发 -->
                  <path d="M35 30 Q60 20 85 30 L85 45 Q60 35 35 45 Z" :fill="characterDesign.hairColor"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="indicators">
            <div class="indicator active"></div>
            <div class="indicator"></div>
          </div>
        </div>

        <!-- 自定义选项 -->
        <div class="customization-options">
          <!-- 发型选择 -->
          <div class="option-group">
            <h4 class="option-title">发型</h4>
            <div class="option-grid">
              <div
                v-for="hair in hairStyles"
                :key="hair.id"
                class="option-item"
                :class="{ selected: characterDesign.hairStyle === hair.id }"
                @click="updateDesign('hairStyle', hair.id)"
              >
                <div class="option-icon" :style="{ backgroundColor: hair.color }">
                  {{ hair.icon }}
                </div>
              </div>
            </div>
          </div>

          <!-- 服装选择 -->
          <div class="option-group">
            <h4 class="option-title">服装</h4>
            <div class="option-grid">
              <div
                v-for="clothing in clothingOptions"
                :key="clothing.id"
                class="option-item"
                :class="{ selected: characterDesign.clothing === clothing.id }"
                @click="updateDesign('clothing', clothing.id)"
              >
                <div class="option-icon" :style="{ backgroundColor: clothing.color }">
                  {{ clothing.icon }}
                </div>
              </div>
            </div>
          </div>

          <!-- 配饰选择 -->
          <div class="option-group">
            <h4 class="option-title">配饰</h4>
            <div class="option-grid">
              <div
                v-for="accessory in accessories"
                :key="accessory.id"
                class="option-item"
                :class="{ selected: characterDesign.accessory === accessory.id }"
                @click="updateDesign('accessory', accessory.id)"
              >
                <div class="option-icon">{{ accessory.icon }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="navigation-buttons">
          <button class="prev-btn" @click="prevStep">上一步</button>
          <button class="next-btn" @click="nextStep">下一步</button>
        </div>
      </div>

      <!-- 第四步：上传 -->
      <div v-if="currentStep === 4" class="step-content">
        <h2 class="step-title">角色定制-上传</h2>

        <!-- 相机拍照区域 -->
        <div class="camera-section">
          <div class="camera-container">
            <div class="camera-viewfinder">
              <div class="viewfinder-overlay">
                <div class="scan-line"></div>
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
              </div>
              <div class="camera-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <p>点击拍照或上传照片</p>
              </div>
            </div>
          </div>

          <!-- 拍照按钮 -->
          <div class="camera-controls">
            <button class="camera-btn gallery" @click="selectFromGallery">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </button>
            <button class="camera-btn capture" @click="capturePhoto">
              <div class="capture-ring">
                <div class="capture-button"></div>
              </div>
            </button>
            <button class="camera-btn switch" @click="switchCamera">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"/>
                <polyline points="23 20 23 14 17 14"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"/>
                <path d="M3.51 15a9 9 0 0 0 14.85 3.36L23 14"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="upload-tips">
          <p class="tip-text">💡 建议正面拍摄，光线充足，背景简洁</p>
        </div>

        <div class="navigation-buttons">
          <button class="prev-btn" @click="prevStep">上一步</button>
          <button class="complete-btn" @click="completeCustomization">完成定制</button>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusBar from '@/components/StatusBar.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)

// 选择的角色
const selectedCharacter = ref({
  gender: '',
  type: ''
})

// 选择的职业角色
const selectedRole = ref(null)

// 可选职业角色
const availableRoles = ref([
  {
    id: 'detective',
    icon: '🔍',
    title: '天真侦探甜',
    subtitle: '敏锐观察力'
  },
  {
    id: 'scholar',
    icon: '📚',
    title: '博览群书者',
    subtitle: '学识渊博'
  },
  {
    id: 'adventurer',
    icon: '⚔️',
    title: '正义侠客',
    subtitle: '勇敢无畏'
  },
  {
    id: 'doctor',
    icon: '⚕️',
    title: '妙手文青',
    subtitle: '救死扶伤'
  }
])

// 角色设计选项
const characterDesign = ref({
  hairStyle: 'long',
  hairColor: '#8D6E63',
  clothing: 'formal',
  clothingColor: '#1976D2',
  accessory: 'glasses',
  skinColor: '#FFB74D'
})

// 发型选项
const hairStyles = ref([
  { id: 'short', icon: '👦', color: '#8D6E63' },
  { id: 'long', icon: '👧', color: '#6D4C41' },
  { id: 'curly', icon: '👨‍🦱', color: '#A1887F' },
  { id: 'straight', icon: '👩‍🦳', color: '#5D4037' }
])

// 服装选项
const clothingOptions = ref([
  { id: 'formal', icon: '👔', color: '#1976D2' },
  { id: 'casual', icon: '👕', color: '#388E3C' },
  { id: 'elegant', icon: '👗', color: '#E91E63' },
  { id: 'sporty', icon: '🏃‍♂️', color: '#FF9800' }
])

// 配饰选项
const accessories = ref([
  { id: 'glasses', icon: '👓' },
  { id: 'hat', icon: '🎩' },
  { id: 'necklace', icon: '📿' },
  { id: 'watch', icon: '⌚' },
  { id: 'none', icon: '🚫' }
])

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 页面方法
const goBack = () => {
  if (currentStep.value > 1) {
    prevStep()
  } else {
    router.go(-1)
  }
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectCharacter = (gender: string, type: string) => {
  selectedCharacter.value = { gender, type }
  showToast(`选择了${gender === 'male' ? '男性' : '女性'}角色`)
}

const selectRole = (role: any) => {
  selectedRole.value = role
  showToast(`选择了角色：${role.title}`)
}

const updateDesign = (property: string, value: any) => {
  characterDesign.value[property as keyof typeof characterDesign.value] = value
  showToast('角色外观已更新')
}

const selectFromGallery = () => {
  showToast('打开相册选择照片')
  // 这里实现相册选择逻辑
}

const capturePhoto = () => {
  showToast('正在拍照...')
  // 这里实现拍照逻辑
}

const switchCamera = () => {
  showToast('切换摄像头')
  // 这里实现摄像头切换逻辑
}

const completeCustomization = () => {
  showToast('角色定制完成！')
  // 这里可以跳转到游戏开始页面或首页
  setTimeout(() => {
    router.push('/home')
  }, 1500)
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
.character-customization-container {
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

.back-btn, .complete-btn {
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

.complete-btn {
  color: #2196F3;
  font-size: 14px;
  padding: 8px 12px;
}

.complete-btn:hover {
  background: #F0F8FF;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 步骤进度 */
.step-progress {
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #F0F0F0;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  overflow-x: auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 80px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step-number {
  width: 28px;
  height: 28px;
  background: #E0E0E0;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #2196F3;
  color: white;
}

.step.completed .step-number {
  background: #4CAF50;
  color: white;
}

.step-label {
  font-size: 10px;
  color: #666;
  text-align: center;
  white-space: nowrap;
}

.step.active .step-label {
  color: #2196F3;
  font-weight: 500;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #E0E0E0;
  margin: 0 8px;
  max-width: 40px;
  transition: background-color 0.3s ease;
}

.step-line.active {
  background: #2196F3;
}

/* 主要内容 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 80px;
}

.step-content {
  max-width: 400px;
  margin: 0 auto;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.step-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  text-align: center;
  line-height: 1.4;
}

/* 角色选择 */
.character-options, .role-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.character-card, .role-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.character-card:hover, .role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.role-card.selected {
  border-color: #2196F3;
  background: #F0F8FF;
}

.character-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
}

.role-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-info, .role-info {
  flex: 1;
}

.character-title, .role-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.character-subtitle, .role-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 角色外观设计 */
.character-preview {
  text-align: center;
  margin-bottom: 32px;
}

.preview-container {
  width: 160px;
  height: 200px;
  background: linear-gradient(145deg, #E3F2FD, #BBDEFB);
  border-radius: 16px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.character-model {
  width: 120px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-placeholder {
  opacity: 0.8;
}

.indicators {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E0E0E0;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background: #2196F3;
}

.customization-options {
  margin-bottom: 32px;
}

.option-group {
  margin-bottom: 24px;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 12px;
}

.option-item {
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.option-item.selected {
  border-color: #2196F3;
  background: #F0F8FF;
}

.option-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 10px;
}

/* 拍照上传 */
.camera-section {
  margin-bottom: 24px;
}

.camera-container {
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}

.camera-viewfinder {
  aspect-ratio: 4/3;
  position: relative;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewfinder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2196F3, transparent);
  animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #2196F3;
}

.corner.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
}

.camera-placeholder {
  text-align: center;
  color: #666;
}

.camera-placeholder svg {
  margin-bottom: 12px;
  opacity: 0.6;
}

.camera-placeholder p {
  margin: 0;
  font-size: 14px;
}

.camera-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 20px;
}

.camera-btn {
  background: white;
  border: 2px solid #E0E0E0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-btn:hover {
  transform: scale(1.1);
  border-color: #2196F3;
}

.camera-btn.gallery,
.camera-btn.switch {
  width: 48px;
  height: 48px;
}

.camera-btn.capture {
  width: 64px;
  height: 64px;
  border-color: white;
  background: transparent;
}

.capture-ring {
  width: 56px;
  height: 56px;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-button {
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.camera-btn.capture:active .capture-button {
  transform: scale(0.9);
}

.upload-tips {
  text-align: center;
  margin-bottom: 32px;
}

.tip-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.next-btn, .prev-btn, .complete-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-btn, .complete-btn {
  background: #2196F3;
  color: white;
}

.next-btn:hover, .complete-btn:hover {
  background: #1976D2;
  transform: translateY(-1px);
}

.next-btn:disabled {
  background: #CCC;
  cursor: not-allowed;
  transform: none;
}

.prev-btn {
  background: #F5F5F5;
  color: #666;
  border: 1px solid #E0E0E0;
}

.prev-btn:hover {
  background: #E0E0E0;
  transform: translateY(-1px);
}

.navigation-buttons .complete-btn {
  background: linear-gradient(135deg, #4CAF50, #45A049);
}

.navigation-buttons .complete-btn:hover {
  background: linear-gradient(135deg, #45A049, #388E3C);
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

  .step-progress {
    padding: 12px 16px;
  }

  .main-content {
    padding: 16px;
  }

  .step-title {
    font-size: 20px;
  }

  .step-subtitle {
    font-size: 14px;
  }

  .character-card, .role-card {
    padding: 16px;
  }

  .character-title, .role-title {
    font-size: 16px;
  }

  .option-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .option-icon {
    font-size: 20px;
  }

  .camera-controls {
    gap: 16px;
    padding: 16px;
  }

  .camera-btn.gallery,
  .camera-btn.switch {
    width: 44px;
    height: 44px;
  }

  .camera-btn.capture {
    width: 56px;
    height: 56px;
  }

  .capture-ring {
    width: 48px;
    height: 48px;
  }

  .capture-button {
    width: 36px;
    height: 36px;
  }

  .navigation-buttons {
    gap: 12px;
  }

  .next-btn, .prev-btn, .complete-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
}

/* 单按钮布局 */
.step-content:has(.next-btn:only-child) .navigation-buttons {
  justify-content: center;
}

.step-content:has(.next-btn:only-child) .next-btn {
  max-width: 200px;
}
</style>
