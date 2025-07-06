<template>
  <div class="character-customization-container">
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
      <h1 class="title">角色定制</h1>
      <button class="complete-btn" @click="completeCustomization" v-if="currentStep === 4">完成</button>
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

    <!-- 主要内容 - 添加底部安全间距 -->
    <div class="main-content">
      <!-- 第一步：性别选择 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">Hi!</h2>
        <p class="step-subtitle">角色的性别是？</p>

        <div class="character-options">
          <div class="character-card"
               :class="{ selected: selectedCharacter.gender === 'male' }"
               @click="selectCharacter('male', 'gentleman')">
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

          <div class="character-card"
               :class="{ selected: selectedCharacter.gender === 'female' }"
               @click="selectCharacter('female', 'lady')">
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

      <!-- 第二步：角色职业选择 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">请选择你的角色</h2>
        <p class="step-subtitle">不同角色本质以特色切换</p>

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

      <!-- 第三步：角色外观设计（相机拍照） -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">角色外观设计</h2>
        <p class="step-subtitle">妙笔生花，一课生成你的专属形象</p>

        <!-- 相机拍照区域 -->
        <div class="camera-section">
          <div class="camera-container">
            <div class="camera-viewfinder" :class="{ 'camera-active': cameraActive }">
              <div class="viewfinder-overlay">
                <div class="scan-line" v-if="cameraActive"></div>
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
              </div>

              <!-- 相机未启动时的占位 -->
              <div class="camera-placeholder" v-if="!cameraActive && !capturedPhoto">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <p>点击拍照或上传照片</p>
              </div>

              <!-- 相机视频流 -->
              <video ref="videoElement" v-if="cameraActive" autoplay playsinline class="camera-video"></video>

              <!-- 拍摄的照片预览 -->
              <img v-if="capturedPhoto" :src="capturedPhoto" alt="拍摄的照片" class="captured-photo" />
            </div>
          </div>

          <!-- 拍照控制 -->
          <div class="camera-controls">
            <button class="camera-btn gallery" @click="selectFromGallery">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </button>

            <!-- 启动相机按钮 -->
            <button class="camera-btn capture" @click="toggleCamera" v-if="!cameraActive && !capturedPhoto">
              <div class="capture-ring">
                <div class="capture-button"></div>
              </div>
            </button>

            <!-- 拍照按钮 -->
            <button class="camera-btn capture" @click="capturePhoto" v-else-if="cameraActive">
              <div class="capture-ring active">
                <div class="capture-button"></div>
              </div>
            </button>

            <!-- 重拍按钮 -->
            <button class="camera-btn retake" @click="retakePhoto" v-if="capturedPhoto">
              重拍
            </button>

            <button class="camera-btn switch" @click="switchCamera" v-if="cameraActive">
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
          <button class="next-btn" @click="nextStep" :disabled="!capturedPhoto && !uploadedImage">
            下一步
          </button>
        </div>
      </div>

      <!-- 第四步：上传完成 -->
      <div v-if="currentStep === 4" class="step-content">
        <h2 class="step-title">角色定制-上传</h2>

        <!-- 照片预览区域 -->
        <div class="final-preview">
          <div class="preview-header">
            <h3>您的角色形象</h3>
          </div>

          <div class="photo-preview">
            <img v-if="capturedPhoto" :src="capturedPhoto" alt="角色照片" class="final-photo" />
            <img v-else-if="uploadedImage" :src="uploadedImage" alt="角色照片" class="final-photo" />
            <div v-else class="no-photo">
              <p>暂无照片</p>
              <button @click="goBackToCamera" class="retry-btn">重新拍摄</button>
            </div>
          </div>

          <!-- 角色信息摘要 -->
          <div class="character-summary">
            <div class="summary-item">
              <span class="label">性别:</span>
              <span class="value">{{ selectedCharacter.gender === 'male' ? '男性' : '女性' }}</span>
            </div>
            <div class="summary-item" v-if="selectedRole">
              <span class="label">角色:</span>
              <span class="value">{{ selectedRole.title }}</span>
            </div>
          </div>
        </div>

        <div class="navigation-buttons">
          <button class="prev-btn" @click="prevStep">上一步</button>
          <button class="complete-btn" @click="completeCustomization">
            完成定制
          </button>
        </div>
      </div>
    </div>

    <!-- 底部导航 - 每一步都有 -->
    <BottomNavigation @navigate="handleNavigate" />

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileUpload"
      style="display: none"
    />

    <!-- 提示消息 -->
    <div v-if="toast.show" class="toast">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
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

// 相机和照片相关
const uploadedImage = ref('')
const capturedPhoto = ref('')
const cameraActive = ref(false)
const fileInput = ref<HTMLInputElement>()
const videoElement = ref<HTMLVideoElement>()
const mediaStream = ref<MediaStream>()
const currentFacingMode = ref<'user' | 'environment'>('user') // 前后摄像头

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
    // 如果从当前步骤返回且相机开启，停止相机
    if (cameraActive.value) {
      stopCamera()
    }
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

// 相机相关功能
const toggleCamera = async () => {
  if (!cameraActive.value) {
    await startCamera()
  } else {
    stopCamera()
  }
}

const startCamera = async () => {
  try {
    // 请求相机权限
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: currentFacingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })

    mediaStream.value = stream

    await nextTick()
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      cameraActive.value = true
      showToast('相机已开启')
    }
  } catch (error) {
    console.error('Camera access error:', error)
    showToast('无法访问相机，请检查权限设置')
  }
}

const stopCamera = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = undefined
  }
  cameraActive.value = false
}

const capturePhoto = () => {
  if (videoElement.value) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight

    if (context) {
      // 如果是前置摄像头，镜像处理
      if (currentFacingMode.value === 'user') {
        context.translate(canvas.width, 0)
        context.scale(-1, 1)
      }

      context.drawImage(videoElement.value, 0, 0)
      capturedPhoto.value = canvas.toDataURL('image/jpeg', 0.8)
      stopCamera()
      showToast('照片拍摄成功！')
    }
  }
}

const retakePhoto = () => {
  capturedPhoto.value = ''
  startCamera()
}

const switchCamera = async () => {
  if (cameraActive.value) {
    stopCamera()
    currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user'
    await new Promise(resolve => setTimeout(resolve, 500))
    await startCamera()
    showToast(`已切换到${currentFacingMode.value === 'user' ? '前置' : '后置'}摄像头`)
  }
}

// 文件上传相关
const selectFromGallery = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string
      // 如果有上传的图片，清除拍摄的照片
      capturedPhoto.value = ''
      showToast('照片上传成功')
    }
    reader.readAsDataURL(file)
  }
}

const goBackToCamera = () => {
  currentStep.value = 3
  capturedPhoto.value = ''
  uploadedImage.value = ''
}

const completeCustomization = () => {
  // 保存所有定制数据
  const customizationData = {
    character: selectedCharacter.value,
    role: selectedRole.value,
    photo: capturedPhoto.value || uploadedImage.value,
    completedAt: Date.now()
  }

  // 保存到本地存储
  localStorage.setItem('characterCustomization', JSON.stringify(customizationData))

  showToast('角色定制完成！正在进入游戏...')

  // 清理相机资源
  if (mediaStream.value) {
    stopCamera()
  }

  setTimeout(() => {
    router.push('/game')
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

// 组件销毁时清理相机资源
onUnmounted(() => {
  if (mediaStream.value) {
    stopCamera()
  }
})

// 监听页面离开，清理资源
window.addEventListener('beforeunload', () => {
  if (mediaStream.value) {
    stopCamera()
  }
})
</script>

<style scoped>
.character-customization-container {
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
  flex-shrink: 0;
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

/* 主要内容 - 重要：为底部导航预留空间 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 120px 20px; /* 底部增加120px空间给导航栏 */
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

.character-card.selected, .role-card.selected {
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

/* 相机区域 */
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
  transition: all 0.3s ease;
}

.camera-viewfinder.camera-active {
  background: #000;
}

.viewfinder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
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

.camera-video, .captured-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-size: 14px;
  color: #333;
  font-weight: 500;
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

.camera-btn.retake {
  width: 80px;
  height: 48px;
  border-radius: 24px;
  background: #FF6B6B;
  color: white;
  border-color: #FF6B6B;
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

.capture-ring.active {
  border-color: #FF4444;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.capture-button {
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.capture-ring.active .capture-button {
  background: #FF4444;
}

.camera-btn.capture:active .capture-button {
  transform: scale(0.9);
}

/* 最终预览区域 */
.final-preview {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-header {
  text-align: center;
  margin-bottom: 20px;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.photo-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.final-photo {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.no-photo {
  text-align: center;
  padding: 40px;
  color: #666;
}

.retry-btn {
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 12px;
}

.character-summary {
  border-top: 1px solid #F0F0F0;
  padding-top: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
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
  margin-bottom: 20px;
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

/* 单按钮布局 */
.step-content:has(.next-btn:only-child) .navigation-buttons {
  justify-content: center;
}

.step-content:has(.next-btn:only-child) .next-btn {
  max-width: 200px;
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
  z-index: 2000;
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
    padding: 16px 16px 120px 16px;
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

  .step {
    min-width: 70px;
  }

  .step-line {
    max-width: 30px;
  }

  .final-photo {
    max-width: 160px;
    max-height: 160px;
  }
}

/* 确保内容不被底部导航遮挡 */
@media (max-height: 640px) {
  .main-content {
    padding-bottom: 140px;
  }
}

/* 相机权限提示 */
.camera-permission-denied {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.camera-permission-denied h3 {
  color: #FF6B6B;
  margin-bottom: 12px;
}

.camera-permission-denied p {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.permission-help-btn {
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>
