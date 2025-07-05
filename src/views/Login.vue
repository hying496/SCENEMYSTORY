<template>
  <div class="login-container">
    <!-- 移动端头部 -->
    <MobileHeader />

    <!-- 表单卡片 -->
    <FormCard title="登录">
      <form @submit.prevent="handleLogin">
        <!-- 账号输入 -->
        <FormInput
          v-model="loginForm.account"
          label="账号"
          placeholder="请输入账号"
        />

        <!-- 密码输入 -->
        <FormInput
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
        />

        <!-- 手机验证码登录 -->
        <div class="phone-login">
          <button 
            type="button" 
            class="phone-login-btn" 
            @click="showToast('切换到手机验证码登录')"
          >
            📱 手机验证码登录
          </button>
        </div>

        <!-- 忘记密码和注册链接 -->
        <div class="action-links">
          <button 
            type="button" 
            class="link-btn" 
            @click="showToast('忘记密码功能')"
          >
            忘记密码
          </button>
          <button 
            type="button" 
            class="link-btn" 
            @click="goToRegister"
          >
            没有账号？注册
          </button>
        </div>

        <!-- 登录按钮 -->
        <PrimaryButton
          text="立即登录"
          type="submit"
          :disabled="!canLogin"
          :loading="isLoading"
          @click="handleLogin"
        />
      </form>

      <!-- 底部其他登录方式 -->
      <BottomActions
        switch-text="没有账号？注册"
        @wechat-login="handleWechatLogin"
        @switch-mode="goToRegister"
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
const loginForm = ref({
  account: '',
  password: ''
})

const isLoading = ref(false)

// 简单的提示消息
const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

// 计算属性
const canLogin = computed(() => {
  return loginForm.value.account.trim() && loginForm.value.password.trim()
})

// 模拟登录
const handleLogin = async () => {
  if (!canLogin.value) return
  
  isLoading.value = true
  showToast('登录中...', 'loading')
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟登录成功
    showToast('登录成功！', 'success')
    
    // 保存登录状态到本地存储
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userInfo', JSON.stringify({
      username: loginForm.value.account,
      loginTime: Date.now()
    }))
    
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (error) {
    showToast('登录失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
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
.login-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #D6EFFF 0%, #E8F4FD 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.phone-login {
  margin-top: 8px;
}

.phone-login-btn {
  background: none;
  border: none;
  color: #2196F3;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.phone-login-btn:hover {
  background-color: #f8f9fa;
}

.action-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.link-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 15px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.link-btn:hover {
  color: #2196F3;
  background-color: #f8f9fa;
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

