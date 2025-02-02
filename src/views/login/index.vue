<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<template>
  <el-watermark
    :font="theme.themeModel === THEME.DARK ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div class="login-container" @keyup.enter="handleCheck">
      <canvas id="particles-canvas" class="particles-bg"></canvas>
      <el-card class="login-form-card">
        <div class="login-header">
          <h1>{{ title }}</h1>
        </div>
        <!-- 自定义按钮切换 -->
        <div class="tab-buttons">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-button', { active: activeTab === tab.name }]"
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
            class="login-btn"
            type="primary"
            @click="handleCheck"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="third-party-login">
          <span>第三方登录</span>
          <div class="social-btn-list">
            <svg-button
              @svg-btn-click="handleWeiboLogin"
              :style="{ width: '30px', height: '30px' }"
              width="1.2rem"
              height="1.2rem"
              icon="weibo"
              :circle="true"
            />
            <svg-button
              @svg-btn-click="handleDingdingLogin"
              :style="{ width: '30px', height: '30px' }"
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
    await columnStore.getRolesMenuColumns()
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
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: relative;

  .qr-code-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 50%;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #00a8e8;
      border-color: #00a8e8;

      img {
        filter: brightness(0) invert(1);
      }
    }

    img {
      width: 16px;
      height: 16px;
    }
  }

  .login-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }

  .login-form-card {
    border: none;
    width: 30%;
    padding: 40px;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    animation: fadeIn 1s ease;
    z-index: 1;

    h1 {
      margin-bottom: 0;
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      color: #333;
    }

    .login-btn {
      width: 100%;
      background-color: #00a8e8;
      border-color: #00a8e8;
      color: white;
      transition: all 0.3s ease;
      position: relative;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      margin-top: 30px;
      padding: 15px 0;
      font-size: 18px;
      cursor: pointer;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.1);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
        z-index: -1;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      }

      &:hover:before {
        transform: scaleX(1);
      }

      &.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s ease-in-out infinite;
      }
    }
  }

  .particles-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none; // 让鼠标事件穿透
  }

  :deep(.el-input-group__append, .el-input-group__prepend) {
    width: 100px;
  }

  :deep(.el-tabs__item) {
    color: #666;
    transition: color 0.3s ease;

    &:hover {
      color: #00a8e8;
    }
  }

  :deep(.el-tabs__item.is-active) {
    color: #00a8e8;
    border-bottom-color: #00a8e8;
  }

  :deep(.el-tabs__item.is-top) {
    width: 120px;
  }

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

  .third-party-login {
    margin-top: 20px;
    text-align: center;

    span {
      display: block;
      margin-bottom: 10px;
      color: #666;
    }

    .social-btn-list {
      margin: 10px 0;
      display: flex;
      justify-content: center;
    }
  }

  // 自定义的 tab 按钮样式
  .tab-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .tab-button {
    margin: 0 8px;
    padding: 10px 20px;
    border: none;
    text-align: center;
    background-color: #eeeeee;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.8rem;
    font-weight: 500;
    width: 170px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;

    &.active {
      background-color: #00a8e8;
      color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #00a8e8;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      background-color: #00a8e8;
      color: white;
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
