<template>
  <div class="script-card" :class="cardClass" @click="handleClick">
    <!-- 卡片图片 -->
    <div class="card-image">
      <img 
        v-if="data.image" 
        :src="data.image" 
        :alt="data.title"
        class="image"
      />
      <div v-else class="image-placeholder">
        <FontAwesomeIcon icon="image" class="placeholder-icon" />
      </div>
      
      <!-- 收藏按钮 -->
      <button 
        v-if="showFavorite"
        class="favorite-btn"
        :class="{ active: data.isFavorite }"
        @click.stop="toggleFavorite"
      >
        <FontAwesomeIcon :icon="data.isFavorite ? 'heart' : ['far', 'heart']" />
      </button>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content">
      <h3 class="card-title">{{ data.title }}</h3>
      <p v-if="data.subtitle" class="card-subtitle">{{ data.subtitle }}</p>
      
      <!-- 标签 -->
      <div v-if="data.tags && data.tags.length" class="card-tags">
        <span 
          v-for="tag in data.tags" 
          :key="tag"
          class="tag"
          :class="getTagClass(tag)"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- 评分和价格 -->
      <div class="card-meta">
        <div v-if="data.rating" class="rating">
          <FontAwesomeIcon icon="star" class="star-icon" />
          <span class="rating-text">{{ data.rating }}</span>
        </div>
        <div v-if="data.price" class="price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ data.price }}</span>
        </div>
      </div>
      
      <!-- 位置信息 -->
      <div v-if="data.location" class="location">
        <FontAwesomeIcon icon="map-marker-alt" class="location-icon" />
        <span class="location-text">{{ data.location }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ScriptCardData {
  id: string | number
  title: string
  subtitle?: string
  image?: string
  tags?: string[]
  rating?: number
  price?: number
  location?: string
  isFavorite?: boolean
  status?: 'hot' | 'new' | 'recommended'
}

interface Props {
  data: ScriptCardData
  size?: 'small' | 'medium' | 'large'
  layout?: 'vertical' | 'horizontal'
  showFavorite?: boolean
  clickable?: boolean
}

interface Emits {
  (e: 'click', data: ScriptCardData): void
  (e: 'favorite', data: ScriptCardData): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  layout: 'vertical',
  showFavorite: true,
  clickable: true
})

const emit = defineEmits<Emits>()

// 卡片样式类
const cardClass = computed(() => {
  return [
    `card-${props.size}`,
    `card-${props.layout}`,
    {
      'card-clickable': props.clickable,
      'card-hot': props.data.status === 'hot',
      'card-new': props.data.status === 'new',
      'card-recommended': props.data.status === 'recommended'
    }
  ]
})

// 标签样式
const getTagClass = (tag: string) => {
  const tagClassMap: Record<string, string> = {
    '推理': 'tag-mystery',
    '古风': 'tag-ancient',
    '团队': 'tag-team',
    '热门': 'tag-hot',
    '新品': 'tag-new',
    '限时': 'tag-limited'
  }
  return tagClassMap[tag] || 'tag-default'
}

// 点击事件
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.data)
  }
}

// 收藏切换
const toggleFavorite = () => {
  emit('favorite', props.data)
}
</script>

<style scoped>
.script-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 卡片尺寸 */
.card-small {
  max-width: 160px;
}

.card-medium {
  max-width: 280px;
}

.card-large {
  max-width: 320px;
}

/* 布局样式 */
.card-horizontal {
  display: flex;
  max-width: none;
}

.card-horizontal .card-image {
  width: 120px;
  flex-shrink: 0;
}

.card-horizontal .card-content {
  flex: 1;
  padding: 16px;
}

/* 状态标识 */
.card-hot::before {
  content: 'HOT';
  position: absolute;
  top: 8px;
  left: 8px;
  background: #FF4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  z-index: 2;
}

.card-new::before {
  content: 'NEW';
  position: absolute;
  top: 8px;
  left: 8px;
  background: #4CAF50;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  z-index: 2;
}

.card-recommended::before {
  content: '推荐';
  position: absolute;
  top: 8px;
  left: 8px;
  background: #2196F3;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  z-index: 2;
}

/* 图片区域 */
.card-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-clickable:hover .image {
  transform: scale(1.05);
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
  font-size: 32px;
}

/* 收藏按钮 */
.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.favorite-btn:hover {
  background: white;
  color: #FF4444;
  transform: scale(1.1);
}

.favorite-btn.active {
  color: #FF4444;
  background: white;
}

/* 内容区域 */
.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #F0F0F0;
  color: #666;
}

.tag-mystery { background: #E3F2FD; color: #1976D2; }
.tag-ancient { background: #FFF3E0; color: #F57C00; }
.tag-team { background: #E8F5E8; color: #388E3C; }
.tag-hot { background: #FFEBEE; color: #D32F2F; }
.tag-new { background: #E8F5E8; color: #4CAF50; }
.tag-limited { background: #FCE4EC; color: #C2185B; }

/* 元信息 */
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  color: #FFB400;
  font-size: 12px;
}

.rating-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.price {
  display: flex;
  align-items: baseline;
  color: #FF4444;
  font-weight: 600;
}

.price-symbol {
  font-size: 12px;
}

.price-value {
  font-size: 16px;
}

/* 位置信息 */
.location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

.location-icon {
  font-size: 10px;
}

/* 响应式适配 */
@media (max-width: 393px) {
  .card-medium {
    max-width: none;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .card-subtitle {
    font-size: 13px;
  }
}
</style>