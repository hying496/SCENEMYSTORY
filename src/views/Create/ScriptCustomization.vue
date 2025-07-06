<template>
  <div class="script-customization-container">
    <!-- 状态栏 -->
    <StatusBar />

    <!-- 头部导航 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7-7 7 7 7"/>
        </svg>
      </button>
      <h1 class="title">剧本定制</h1>
      <button class="preview-btn" @click="previewScript">预览</button>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 剧本基础信息 -->
      <div class="script-info-section">
        <h3 class="section-title">剧本基础信息</h3>
        <div class="info-form">
          <div class="form-group">
            <label class="form-label">剧本名称</label>
            <input
              type="text"
              v-model="scriptInfo.name"
              placeholder="为你的剧本起个名字"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">剧本描述</label>
            <textarea
              v-model="scriptInfo.description"
              placeholder="简单描述一下你的剧本故事背景..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">游戏时长</label>
              <select v-model="scriptInfo.duration" class="form-select">
                <option value="1-2">1-2小时</option>
                <option value="2-3">2-3小时</option>
                <option value="3-4">3-4小时</option>
                <option value="4+">4小时以上</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">参与人数</label>
              <select v-model="scriptInfo.playerCount" class="form-select">
                <option value="2-3">2-3人</option>
                <option value="4-6">4-6人</option>
                <option value="6-8">6-8人</option>
                <option value="8+">8人以上</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 剧本类型选择 -->
      <div class="script-type-section">
        <h3 class="section-title">剧本类型</h3>
        <div class="type-grid">
          <div
            v-for="type in scriptTypes"
            :key="type.key"
            :class="['type-card', { selected: selectedTypes.includes(type.key) }]"
            @click="toggleType(type.key)"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-name">{{ type.name }}</div>
            <div class="type-description">{{ type.description }}</div>
          </div>
        </div>
      </div>

      <!-- 难度等级 -->
      <div class="difficulty-section">
        <h3 class="section-title">难度等级</h3>
        <div class="difficulty-options">
          <div
            v-for="level in difficultyLevels"
            :key="level.key"
            :class="['difficulty-option', { selected: scriptInfo.difficulty === level.key }]"
            @click="scriptInfo.difficulty = level.key"
          >
            <div class="difficulty-stars">
              <span
                v-for="i in 5"
                :key="i"
                :class="['star', { filled: i <= level.stars }]"
              >
                ⭐
              </span>
            </div>
            <div class="difficulty-info">
              <div class="difficulty-name">{{ level.name }}</div>
              <div class="difficulty-desc">{{ level.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 特殊要求 -->
      <div class="requirements-section">
        <h3 class="section-title">特殊要求</h3>
        <div class="requirements-list">
          <label
            v-for="requirement in specialRequirements"
            :key="requirement.key"
            class="requirement-item"
          >
            <input
              type="checkbox"
              :value="requirement.key"
              v-model="selectedRequirements"
              class="requirement-checkbox"
            />
            <span class="requirement-text">{{ requirement.name }}</span>
            <span class="requirement-desc">{{ requirement.description }}</span>
          </label>
        </div>
      </div>

      <!-- 自定义设置 -->
      <div class="custom-settings-section">
        <h3 class="section-title">个性化设置</h3>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">音效配乐</div>
              <div class="setting-desc">添加背景音乐和音效</div>
            </div>
            <label class="setting-toggle">
              <input type="checkbox" v-model="customSettings.soundEffects" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">AR增强现实</div>
              <div class="setting-desc">使用AR技术增强体验</div>
            </div>
            <label class="setting-toggle">
              <input type="checkbox" v-model="customSettings.arMode" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">实时提示</div>
              <div class="setting-desc">获得游戏过程中的智能提示</div>
            </div>
            <label class="setting-toggle">
              <input type="checkbox" v-model="customSettings.realTimeHints" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- 生成按钮 -->
      <div class="generate-section">
        <button
          class="generate-btn"
          :disabled="!canGenerate"
          @click="generateScript"
        >
          <span v-if="!isGenerating">🎭 生成专属剧本</span>
          <span v-else class="generating">
            <span class="spinner"></span>
            正在生成中...
          </span>
        </button>
        <p class="generate-note">
          基于你的选择，我们将为你生成独一无二的剧本杀体验
        </p>
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

// 剧本基础信息
const scriptInfo = ref({
  name: '',
  description: '',
  duration: '2-3',
  playerCount: '4-6',
  difficulty: 'medium'
})

// 剧本类型
const scriptTypes = ref([
  {
    key: 'mystery',
    name: '推理悬疑',
    icon: '🔍',
    description: '烧脑推理，寻找真相'
  },
  {
    key: 'horror',
    name: '恐怖惊悚',
    icon: '👻',
    description: '紧张刺激，挑战胆量'
  },
  {
    key: 'adventure',
    name: '冒险探索',
    icon: '🗺️',
    description: '探索未知，寻找宝藏'
  },
  {
    key: 'romance',
    name: '爱情情感',
    icon: '💕',
    description: '浪漫故事，情感体验'
  },
  {
    key: 'history',
    name: '历史穿越',
    icon: '🏛️',
    description: '穿越时空，体验历史'
  },
  {
    key: 'fantasy',
    name: '奇幻魔法',
    icon: '🔮',
    description: '魔法世界，奇幻冒险'
  }
])

// 难度等级
const difficultyLevels = ref([
  {
    key: 'easy',
    name: '简单',
    stars: 2,
    description: '适合新手，轻松有趣'
  },
  {
    key: 'medium',
    name: '中等',
    stars: 3,
    description: '有一定挑战，平衡有趣'
  },
  {
    key: 'hard',
    name: '困难',
    stars: 4,
    description: '高难度推理，烧脑刺激'
  },
  {
    key: 'expert',
    name: '专家',
    stars: 5,
    description: '极限挑战，考验智慧'
  }
])

// 特殊要求
const specialRequirements = ref([
  {
    key: 'teamwork',
    name: '团队合作',
    description: '需要玩家之间密切配合'
  },
  {
    key: 'physical',
    name: '体感互动',
    description: '包含肢体动作和互动'
  },
  {
    key: 'props',
    name: '道具丰富',
    description: '使用各种实体道具'
  },
  {
    key: 'outdoor',
    name: '户外活动',
    description: '部分环节在户外进行'
  },
  {
    key: 'photo',
    name: '拍照记录',
    description: '记录游戏过程和精彩瞬间'
  }
])

// 选中的类型和要求
const selectedTypes = ref<string[]>(['mystery'])
const selectedRequirements = ref<string[]>([])

// 个性化设置
const customSettings = ref({
  soundEffects: true,
  arMode: false,
  realTimeHints: true
})

// 生成状态
const isGenerating = ref(false)

// 简单的提示消息
const toast = ref({
  show: false,
  message: ''
})

// 计算属性
const canGenerate = computed(() => {
  return scriptInfo.value.name.trim() &&
         scriptInfo.value.description.trim() &&
         selectedTypes.value.length > 0
})

// 页面方法
const goBack = () => {
  router.go(-1)
}

const previewScript = () => {
  if (!canGenerate.value) {
    showToast('请完善剧本信息后再预览')
    return
  }
  showToast('预览功能即将推出')
}

const toggleType = (typeKey: string) => {
  const index = selectedTypes.value.indexOf(typeKey)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(typeKey)
  }
}

const generateScript = async () => {
  if (!canGenerate.value) return

  isGenerating.value = true
  showToast('开始生成专属剧本...')

  try {
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 保存生成的剧本数据
    const generatedScriptData = {
      scriptInfo: scriptInfo.value,
      selectedTypes: selectedTypes.value,
      selectedRequirements: selectedRequirements.value,
      customSettings: customSettings.value,
      generatedAt: Date.now()
    }

    localStorage.setItem('generatedScript', JSON.stringify(generatedScriptData))

    showToast('剧本生成成功！请选择下一步操作')
    isGenerated.value = true

  } catch (error) {
    showToast('生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// 预览剧本 - 跳转到游戏页面
const previewGeneratedScript = () => {
  showToast('正在进入剧本预览...')
  setTimeout(() => {
    router.push('/script-preview')
  }, 1000)
}

// 进入角色定制
const goToCharacterCustomization = () => {
  showToast('正在进入角色定制...')
  setTimeout(() => {
    router.push('/create/character-customization')
  }, 1000)
}

// 重新生成剧本
const regenerateScript = () => {
  isGenerated.value = false
  showToast('可以重新调整设置后再次生成')
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
.script-customization-container {
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

.back-btn, .preview-btn {
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

.preview-btn {
  color: #2196F3;
  font-size: 14px;
  padding: 8px 12px;
}

.preview-btn:hover {
  background: #F0F8FF;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 主要内容 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  margin-bottom: 80px;
}

/* 通用样式 */
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

/* 剧本基础信息 */
.script-info-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input, .form-textarea, .form-select {
  padding: 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #2196F3;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 剧本类型 */
.script-type-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.type-card {
  background: #F8F9FA;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-card:hover {
  background: #E3F2FD;
  transform: translateY(-2px);
}

.type-card.selected {
  background: #E8F5E8;
  border-color: #4CAF50;
}

.type-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.type-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.type-description {
  font-size: 11px;
  color: #666;
  line-height: 1.3;
}

/* 难度等级 */
.difficulty-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.difficulty-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F8F9FA;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-option:hover {
  background: #E3F2FD;
}

.difficulty-option.selected {
  background: #FFF3E0;
  border-color: #FF9800;
}

.difficulty-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 16px;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.star.filled {
  opacity: 1;
}

.difficulty-info {
  flex: 1;
}

.difficulty-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.difficulty-desc {
  font-size: 13px;
  color: #666;
}

/* 特殊要求 */
.requirements-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.requirement-item:hover {
  background: #E3F2FD;
}

.requirement-checkbox {
  margin-top: 2px;
}

.requirement-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
  min-width: 80px;
}

.requirement-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 个性化设置 */
.custom-settings-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 12px;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: #666;
}

.setting-toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.setting-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #CCC;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #2196F3;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* 生成按钮 */
.generate-section {
  text-align: center;
  margin-top: 32px;
}

.generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  margin-bottom: 12px;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.generate-btn:disabled {
  background: #CCC;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.generating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.generate-note {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
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

  .main-content {
    padding: 12px 16px;
  }

  .script-info-section,
  .script-type-section,
  .difficulty-section,
  .requirements-section,
  .custom-settings-section {
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .type-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }

  .type-card {
    padding: 12px;
  }

  .type-icon {
    font-size: 20px;
  }

  .difficulty-option {
    padding: 12px;
  }

  .setting-item {
    padding: 12px;
  }

  .generate-btn {
    font-size: 16px;
    padding: 14px 20px;
  }
}
</style>
