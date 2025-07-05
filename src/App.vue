<template>
  <div id="app">
    <!-- 移动端视口容器 -->
    <div class="mobile-container">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

// 应用初始化
onMounted(() => {
  console.log('🚀 灵探蓝途应用已启动')
  
  // 设置视口高度CSS变量（解决移动端100vh问题）
  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  
  // 检测和设置安全区域
  const setSafeArea = () => {
    // 获取安全区域信息
    const computedStyle = getComputedStyle(document.documentElement)
    const safeAreaTop = computedStyle.getPropertyValue('--safe-area-inset-top') || 
                       getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0px'
    const safeAreaBottom = computedStyle.getPropertyValue('--safe-area-inset-bottom') || 
                          getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0px'
    
    // 设置状态栏高度
    const statusBarHeight = Math.max(44, parseInt(safeAreaTop) || 0)
    const bottomSafeHeight = Math.max(20, parseInt(safeAreaBottom) || 0)
    
    document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`)
    document.documentElement.style.setProperty('--bottom-safe-height', `${bottomSafeHeight}px`)
    
    // 检测设备类型
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const hasNotch = statusBarHeight > 44 // 刘海屏检测
    
    document.documentElement.setAttribute('data-platform', isIOS ? 'ios' : 'android')
    document.documentElement.setAttribute('data-notch', hasNotch ? 'true' : 'false')
    
    console.log('📱 设备信息:', {
      platform: isIOS ? 'iOS' : 'Android',
      hasNotch,
      statusBarHeight,
      bottomSafeHeight
    })
  }
  
  setVH()
  setSafeArea()
  
  window.addEventListener('resize', () => {
    setVH()
    setSafeArea()
  })
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      setVH()
      setSafeArea()
    }, 100)
  })
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  /* 禁止用户选择文本，提升移动端体验 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 允许输入框和可编辑内容选择文本 */
input, textarea, [contenteditable] {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

/* 全局安全区域适配 */
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-right: env(safe-area-inset-right);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
  
  /* 状态栏高度（不同设备的安全区域） */
  --status-bar-height: max(44px, env(safe-area-inset-top));
  --bottom-safe-height: max(20px, env(safe-area-inset-bottom));
}

#app {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100); /* 移动端视口高度修复 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 移动端容器 - 模拟手机屏幕 */
.mobile-container {
  width: 393px;
  height: 852px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  position: relative;
  border: 1px solid #e0e0e0;
}

/* 响应式：在小屏幕上填满整个视口 */
@media (max-width: 480px) {
  #app {
    padding: 0;
  }
  
  .mobile-container {
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
  
  /* 在真实设备上，移动端容器需要适配安全区域 */
  .mobile-container {
    padding-top: var(--safe-area-inset-top);
    padding-bottom: var(--safe-area-inset-bottom);
    padding-left: var(--safe-area-inset-left);
    padding-right: var(--safe-area-inset-right);
  }
}

/* 开发环境显示设备信息 */
@media (min-width: 481px) {
  .mobile-container::before {
    content: 'iPhone 14 Pro - 393×852';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    pointer-events: none;
  }
}

/* 全局页面容器基类 */
.page-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 状态栏组件样式 */
.status-bar {
  height: var(--status-bar-height);
  min-height: 44px; /* 确保最小高度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: inherit; /* 继承父容器背景 */
  position: relative;
  z-index: 100;
}

/* 底部安全区域适配 */
.bottom-navigation {
  padding-bottom: var(--bottom-safe-height);
}

/* 不同机型的状态栏适配 */
@media (max-width: 480px) {
  .status-bar {
    height: var(--status-bar-height);
    padding-top: calc(var(--safe-area-inset-top) - var(--status-bar-height) + 8px);
  }
}
</style>
