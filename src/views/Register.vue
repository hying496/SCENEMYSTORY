<template>
  <div class="register-container">
    <!-- 移动端头部 -->
    <MobileHeader />

    <!-- 表单卡片 -->
    <FormCard title="注册">
      <form @submit.prevent="handleRegister">
        <!-- 用户名输入 -->
        <FormInput
          v-model="registerForm.username"
          placeholder="请输入用户名"
        />

        <!-- 密码输入 -->
        <FormInput
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码"
        />

        <!-- 性别选择 -->
        <div class="gender-group">
          <label class="input-label">性别</label>
          <div class="gender-options">
            <label class="gender-option">
              <input 
                type="radio" 
                name="gender" 
                value="male" 
                v-model="registerForm.gender"
              />
              <span class="radio-custom"></span>
              <span>男</span>
            </label>
            <label class="gender-option">
              <input 
                type="radio" 
                name="gender" 
                value="female" 
                v-model="registerForm.gender"
              />
              <span class="radio-custom"></span>
              <span>女</span>
            </label>
            <label class="gender-option">
              <input 
                type="radio" 
                name="gender" 
                value="other" 
                v-model="registerForm.gender"
              />
              <span class="radio-custom"></span>
              <span>其他</span>
            </label>
          </div>
        </div>

        <!-- 注册按钮 -->
        <PrimaryButton
          text="立即注册"
          type="submit"
          :disabled="!canRegister"
          :loading="isLoading"
          @click="handleRegister"
        />
      </form>

      <!-- 底部其他登录方式 -->
      <BottomActions
        switch-text="已有账号？登录"
        @wechat-login="handleWechatLogin"
        @switch-mode="goToLogin"
      />
    </FormCard>

    <!-- 简单的提示消息 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MobileHeader from '@/components/MobileHeader.vue'
import FormCard from '@/components/FormCard.vue'
import FormInput from '@/components/FormInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import BottomActions from '@/components/BottomActions.vue'

const router = useRouter()

// 表单数据
const registerForm = ref({
  username: '',
  password: '',
  gender: ''
})

const isLoading = ref(false)

// 简单的提示消息
const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

// 计算属性
const canRegister = computed(() => {
  return registerForm.value.username.trim() && 
         registerForm.value.password.trim() && 
         registerForm.value.gender
})

// 性别映射表
const genderMap: Record<string, string> = {
  male: 'm',
  female: 'f',
  other: 'o'
}

// 注册函数，调用后端接口
const handleRegister = async () => {
  if (!canRegister.value) return

  isLoading.value = true
  showToast('注册中...', 'loading')

  try {
    // 转换 gender 为单字符
    const genderChar = genderMap[registerForm.value.gender] || null

    const payload = {
      username: registerForm.value.username.trim(),
      password: registerForm.value.password,
      gender: genderChar,
      hobbies: [],   // 目前无输入，传空数组
      star_id: []    // 目前无输入，传空数组
    }

    const res = await fetch('http://114.215.192.26:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.detail || '注册失败')
    }

    const data = await res.json()

    showToast('注册成功！正在登录...', 'success')

    // 保存登录状态
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userInfo', JSON.stringify({
      username: data.username,
      user_id: data.user_id,
      gender: data.gender,
      registerTime: Date.now(),
      loginTime: Date.now()
    }))

    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (error: any) {
    showToast(error.message || '注册失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 微信登录
const handleWechatLogin = () => {
  showToast('微信登录功能即将推出', 'info')
}

// 显示提示消息
const showToast = (message: string, type: string = 'info') => {
  toast.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #D6EFFF 0%, #E8F4FD 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 性别选择样式 */
.gender-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.gender-options {
  display: flex;
  gap: 24px;
  padding: 12px 0;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
}

.gender-option input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.gender-option input[type="radio"]:checked + .radio-custom {
  border-color: #2196F3;
  background-color: #2196F3;
}

.gender-option input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.gender-option:hover .radio-custom {
  border-color: #2196F3;
}

/* 简单的提示消息 */
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

.toast.success {
  background: rgba(76, 175, 80, 0.9);
}

.toast.loading {
  background: rgba(33, 150, 243, 0.9);
}

.toast.error {
  background: rgba(244, 67, 54, 0.9);
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
}
</style>
