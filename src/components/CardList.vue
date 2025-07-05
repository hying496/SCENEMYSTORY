<template>
  <div class="card-list">
    <div 
      v-for="item in items" 
      :key="item.id"
      :class="['card-item', { clickable: clickable }]"
      @click="handleClick(item)"
    >
      <!-- 左侧图片或图标 -->
      <div class="item-image">
        <img 
          v-if="item.image" 
          :src="item.image" 
          :alt="item.title"
          class="image"
        />
        <div v-else class="image-placeholder">
          <component :is="item.icon || defaultIcon" class="placeholder-icon" />
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="item-content">
        <h3 class="item-title">{{ item.title }}</h3>
        <p v-if="item.subtitle" class="item-subtitle">{{ item.subtitle }}</p>
        
        <!-- 标签 -->
        <div v-if="item.tags && item.tags.length" class="item-tags">
          <span 
            v-for="tag in item.tags" 
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- 元信息 -->
        <div v-if="showMeta" class="item-meta">
          <div v-if="item.rating" class="rating">
            <span class="star">⭐</span>
            <span class="rating-text">{{ item.rating }}</span>
          </div>
          <div v-if="item.price" class="price">
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ item.price }}</span>
          </div>
          <div v-if="item.location" class="location">
            <span class="location-icon">📍</span>
            <span class="location-text">{{ item.location }}</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧箭头或操作按钮 -->
      <div v-if="showArrow" class="item-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CardItem {
  id: string | number
  title: string
  subtitle?: string
  image?: string
  icon?: string
  tags?: string[]
  rating?: number
  price?: number
  location?: string
  [key: string]: any
}

interface Props {
  items: CardItem[]
  clickable?: boolean
  showArrow?: boolean
  showMeta?: boolean
  defaultIcon?: string
}

interface Emits {
  (e: 'click', item: CardItem): void
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  showArrow: true,
  showMeta: true,
  defaultIcon: '📷'
})

const emit = defineEmits<Emits>()

const handleClick = (item: CardItem) => {
  if (props.clickable) {
    emit('click', item)
  }
}
</script>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card-item.clickable {
  cursor: pointer;
}

.card-item.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 图片区域 */
.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #CCC;
}

.placeholder-icon {
  font-size: 24px;
}

/* 内容区域 */
.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签 */
.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tag {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  background: #F0F0F0;
  color: #666;
}

/* 元信息 */
.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #333;
}

.star {
  font-size: 10px;
}

.price {
  display: flex;
  align-items: baseline;
  color: #FF4444;
  font-weight: 600;
}

.price-symbol {
  font-size: 10px;
}

.price-value {
  font-size: 12px;
}

.location {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #999;
}

.location-icon {
  font-size: 8px;
}

/* 箭头 */
.item-arrow {
  flex-shrink: 0;
  color: #CCC;
  display: flex;
  align-items: center;
}

/* 响应式适配 */
@media (max-width: 393px) {
  .card-item {
    padding: 12px;
    gap: 10px;
  }
  
  .item-image {
    width: 60px;
    height: 45px;
  }
  
  .item-title {
    font-size: 15px;
  }
  
  .item-subtitle {
    font-size: 13px;
  }
  
  .item-meta {
    gap: 8px;
    font-size: 11px;
  }
}
</style>