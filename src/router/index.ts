// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// 页面组件懒加载
const Splash = () => import('@/views/Splash.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Home = () => import('@/views/Home.vue')
const Profile = () => import('@/views/Profile.vue')
const Create = () => import('@/views/Create.vue')
const ScriptCreator = () => import('@/views/ScriptCreator.vue')
const game = () => import('@/views/game.vue')

// Create子页面
const CreateExploringLabel = () => import('@/views/Create/ExploringLabel.vue')
const CreateInterestLabel = () => import('@/views/Create/InterestLabel.vue')
const CreateLocationMap = () => import('@/views/Create/LocationMap.vue')
const CreateScriptCustomization = () => import('@/views/Create/ScriptCustomization.vue')
const CreateCharacterCustomization = () => import('@/views/Create/CharacterCustomization.vue')


// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/splash'
  },
  {
    path: '/splash',
    name: 'Splash',
    component: Splash,
    meta: {
      title: '灵探蓝途',
      hideFromHistory: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - 灵探蓝途'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册 - 灵探蓝途'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页 - 灵探蓝途'
    }
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
    meta: {
      title: '景点选择 - 灵探蓝途'
    }
  },
  {
    path: '/script-creator',
    name: 'ScriptCreator',
    component: ScriptCreator,
    meta: {
      title: '创建剧本 - 灵探蓝途'
    }
  },
  // Create子页面路由
  {
    path: '/create/exploring-label',
    name: 'CreateExploringLabel',
    component: CreateExploringLabel,
    meta: {
      title: '探索标签 - 灵探蓝途'
    }
  },
  {
    path: '/create/interest-label',
    name: 'CreateInterestLabel',
    component: CreateInterestLabel,
    meta: {
      title: '兴趣标签 - 灵探蓝途'
    }
  },
  {
    path: '/create/location-map',
    name: 'CreateLocationMap',
    component: CreateLocationMap,
    meta: {
      title: '位置地图 - 灵探蓝途'
    }
  },
  {
    path: '/create/script-customization',
    name: 'CreateScriptCustomization',
    component: CreateScriptCustomization,
    meta: {
      title: '剧本定制 - 灵探蓝途'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '个人中心 - 灵探蓝途'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: game,
    meta: {
      title: '游戏 - 灵探蓝途'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面不存在 - 灵探蓝途'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '灵探蓝途'

  // 开发环境路由日志
  if (import.meta.env.DEV) {
    console.log(`🧭 路由切换: ${from.path} → ${to.path}`)
    console.log(`📱 当前登录状态: ${localStorage.getItem('isLoggedIn')}`)
    console.log(`🎯 目标页面: ${to.name}`)
  }

  // 检查登录状态
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const publicRoutes = ['Splash', 'Login', 'Register']
  const requiresAuth = !publicRoutes.includes(to.name as string)

  // 如果是首次访问根路径，跳转到启动页
  if (to.path === '/') {
    console.log('🚀 首次访问根路径，跳转到启动页')
    next('/splash')
    return
  }

  // 如果用户已登录，访问登录/注册页面时重定向到首页
  if (isLoggedIn && ['Login', 'Register'].includes(to.name as string)) {
    console.log('✅ 已登录用户访问登录页，重定向到首页')
    next('/home')
    return
  }

  // 如果页面需要登录但用户未登录，重定向到登录页
  if (requiresAuth && !isLoggedIn) {
    console.log('🔒 需要登录，重定向到登录页')
    next('/login')
    return
  }

  // 防止用户手动返回到启动页（除非是登出后的访问）
  if (to.name === 'Splash' && from.name && from.name !== 'Splash' && isLoggedIn) {
    console.log('🚫 已登录用户访问启动页，重定向到首页')
    next('/home')
    return
  }

  console.log('✅ 路由正常通过')
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换完成后的处理
  if (import.meta.env.DEV) {
    console.log(`✅ 路由切换完成: ${to.name}`)
  }
})

export default router
