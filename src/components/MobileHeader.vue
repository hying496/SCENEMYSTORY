<template>
  <div class="mobile-header">
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

    <!-- 头部装饰和logo -->
    <div class="header-section">
      <div class="star-icon">⭐</div>
      <div class="person-icon">👤</div>
      <h1 class="app-title">
        <span class="title-explore">灵</span>
        <span class="title-blue">探</span>
        <span class="title-blue">蓝</span>
        <span class="title-explore">途</span>
      </h1>
      <p class="subtitle">——剧本杀的方式打开旅行——</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这个组件不需要任何props或逻辑，纯展示组件
</script>

<style scoped>
.mobile-header {
  background: linear-gradient(180deg, #D6EFFF 0%, #E8F4FD 100%);
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

/* 头部区域 */
.header-section {
  text-align: center;
  margin-top: 30px;
  position: relative;
  padding-bottom: 60px;
}

.star-icon {
  position: absolute;
  left: 60px;
  top: 10px;
  font-size: 24px;
}

.person-icon {
  position: absolute;
  right: 60px;
  top: 10px;
  font-size: 24px;
}

.app-title {
  font-size: 48px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.title-explore {
  color: #666;
}

.title-blue {
  color: #2196F3;
}

.subtitle {
  color: #888;
  font-size: 14px;
  margin: 0;
}
</style>