<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<template>
  <el-watermark
    :font="theme.themeModel === THEME.DARK ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div class="login-container flex justify-center items-center w-full h-screen relative" @keyup.enter="handleCheck">
      <canvas id="particles-canvas" class="particles-bg absolute top-0 left-0 z-0 pointer-events-none"></canvas>
      <el-card
        class="login-form-card border-none min-w-[300px] max-w-[500px] p-8 bg-white shadow-md rounded-lg animate-fadeIn z-1"
      >
        <div class="login-header flex justify-center items-center mb-8">
          <h1 class="m-0 text-2xl font-semibold text-center text-gray-800">{{ title }}</h1>
        </div>
        <!-- 自定义按钮切换 -->
        <div class="tab-buttons flex justify-center mb-5">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="[
              'tab-button m-2 p-2.5 border-none text-center bg-gray-200 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium w-42.5 shadow-sm relative',
              { 'bg-blue-500 text-white shadow-md': activeTab === tab.name },
            ]"
            @click="handleSwitchTab(tab)"
          >
            {{ tab.label }}
          </div>
        </div>
        <div v-show="activeTab === 'userPassword'">
          <user-password-login ref="userPasswordLoginRef" />
        </div>
        <div v-show="activeTab === 'phone'">
          <phone-login ref="phoneLoginRef" />
        </div>
        <div v-show="activeTab === 'email'">
          <email-login ref="emailLoginRef" />
        </div>
        <qr-code-login v-if="false" ref="qrCodeLoginRef" />
        <el-form-item>
          <el-button
            @keyup.enter="handleCheck"
            :loading="loading"
            size="large"
            class="login-btn w-full bg-blue-500 border-blue-500 text-white transition-all duration-300 relative rounded-md overflow-hidden shadow-lg mt-8 py-4 text-xl cursor-pointer"
            type="primary"
            @click="handleCheck"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="third-party-login mt-5 text-center">
          <span class="block mb-2.5 text-gray-600">第三方登录</span>
          <div class="social-btn-list my-2.5 flex justify-center">
            <svg-button
              @svg-btn-click="handleWeiboLogin"
              class="w-7.5 h-7.5"
              width="1.2rem"
              height="1.2rem"
              icon="weibo"
              :circle="true"
            />
            <svg-button
              @svg-btn-click="handleDingdingLogin"
              class="w-7.5 h-7.5"
              width="1.2rem"
              height="1.2rem"
              icon="ding"
              :circle="true"
            />
          </div>
        </div>
        <Verify
          mode="pop"
          @success="handleLogin"
          :captchaType="captchaType"
          :imgSize="{ width: '400px', height: '200px' }"
          ref="verify"
        ></Verify>
      </el-card>
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useColumnStore from '@/store/modules/column'
import useSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { THEME } from '@/utils/common.ts'
import { useI18n } from 'vue-i18n'
import Verify from '@/components/anj-plus/Verify.vue'
import UserPasswordLogin from './components/UserPasswordLogin.vue'
import EmailLogin from './components/EmailLogin.vue'
import PhoneLogin from './components/PhoneLogin.vue'
import QrCodeLogin from './components/QrCodeLogin.vue'
import SvgButton from '@/components/SvgButton/index.vue'

const { t } = useI18n()
let settingStore = useSettingStore()
let columnStore = useColumnStore()
let { theme, settings } = storeToRefs(settingStore)
let $router = useRouter()
let $route = useRoute()
let loading = ref(false)
let userStore = useUserStore()
const verify = ref()
const captchaType = ref('clickWord')

// 定义标签信息
const tabs = [
  { name: 'userPassword', label: '用户登录' },
  { name: 'phone', label: '手机号登录' },
  { name: 'email', label: '邮箱登录' },
]
// 存储当前激活的标签
const activeTab = ref('userPassword')

// 存储不同登录组件的引用
const userPasswordLoginRef = ref()
const emailLoginRef = ref()
const phoneLoginRef = ref()
const qrCodeLoginRef = ref()

/**
 * 初始化
 */
onMounted(() => {
  changeDark()
  changeThemeColor()
  initParticles()
  userStore.logout()
})

/**
 * 切换日间/夜间模式
 */
const changeDark = () => {
  let html = document.documentElement
  if (theme.value.themeModel !== THEME.DARK) {
    html.classList.remove(THEME.DARK)
    return
  }
  html.classList.add(THEME.DARK)
}

/**
 * 改变主题颜色
 */
const changeThemeColor = () => {
  document.documentElement.style.setProperty('--el-color-primary', theme.value.themeColor)
}

/**
 * 标题动态获取计算属性
 */
const title = computed(() => {
  return settings.value.title
})

/**
 * 切换Tab
 */
const handleSwitchTab = async (tab: any) => {
  activeTab.value = tab.name
  if (tab.name === 'email') {
    emailLoginRef.value.init()
  } else if (tab.name === 'phone') {
    phoneLoginRef.value.init()
  }
}

/**
 * 处理检查操作
 */
const handleCheck = async () => {
  let currLoginFormRef
  if (activeTab.value === 'userPassword') {
    currLoginFormRef = userPasswordLoginRef
  } else if (activeTab.value === 'email') {
    currLoginFormRef = emailLoginRef
  } else if (activeTab.value === 'phone') {
    currLoginFormRef = phoneLoginRef
  }

  if (currLoginFormRef) {
    await currLoginFormRef.value.loginFormRef.validate()
    handleOnShow('blockPuzzle')
    // handleOnShow('clickWord')
  }
}

/**
 * 显示验证码
 */
const handleOnShow = (type: any) => {
  captchaType.value = type
  verify.value?.show()
}

const handleLoginResponse = async (loginFormData: any, data: any, func: any) => {
  if (!loginFormData) {
    return
  }
  loginFormData.captchaVerification = data.captchaVerification
  loading.value = true
  try {
    await func()
    let redirect: string = $route.query.redirect as string
    ElNotification({
      type: 'success',
      message: t('login.common.loginSuccess'),
      title: `Hi, ${loadGreetings()}`,
    })
    await columnStore.fetchRolesMenuColumns()
    await $router.push({
      path: redirect || '/',
    })
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

/**
 * 登录请求
 */
const handleLogin = async (data: any) => {
  if (activeTab.value === 'userPassword') {
    let loginFormData = userPasswordLoginRef.value?.loginFormData
    await handleLoginResponse(loginFormData, data, () => userStore.userLogin(loginFormData))
  } else if (activeTab.value === 'email') {
    let loginFormData = emailLoginRef.value?.loginFormData
    await handleLoginResponse(loginFormData, data, () => userStore.emailLogin(loginFormData))
  } else if (activeTab.value === 'phone') {
    let loginFormData = phoneLoginRef.value?.loginFormData
    await handleLoginResponse(loginFormData, data, () => userStore.phoneLogin(loginFormData))
  }
}

// 粒子动画初始化函数
const initParticles = () => {
  const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement
  let ctx = canvas.getContext('2d')
  function updateCanvasSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)

  const particles: any[] = []
  const particleCount = 100

  class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 3 + 1
      this.speedX = Math.random() * 3 - 1.5
      this.speedY = Math.random() * 3 - 1.5
    }
    update() {
      this.x += this.speedX
      this.y += this.speedY
      if (this.x < 0) this.x = canvas.width
      if (this.x > canvas.width) this.x = 0
      if (this.y < 0) this.y = canvas.height
      if (this.y > canvas.height) this.y = 0
    }
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 168, 232, 0.5)'
      ctx.fill()
    }
  }

  function createParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()
    }
    requestAnimationFrame(animateParticles)
  }

  createParticles()
  animateParticles()
}

const handleWeiboLogin = () => {
  // 处理微博登录逻辑，例如调用后端接口
  ElNotification({
    type: 'info',
    message: '微博登录功能暂未实现',
    title: '提示',
  })
}

const handleDingdingLogin = () => {
  // 处理钉钉登录逻辑，例如调用后端接口
  ElNotification({
    type: 'info',
    message: '微信登录功能暂未实现',
    title: '提示',
  })
}
</script>

<style lang="scss" scoped>
/* 保留一些无法用 UnoCSS 替代的样式，如动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
