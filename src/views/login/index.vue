<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<template>
  <el-watermark
    :font="theme.themeModel === THEME.DARK ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div class="login_container" @keyup.enter="handleCheck">
      <canvas id="particles-canvas" class="particles-bg"></canvas>
      <el-card class="login-form-card">
        <h1>{{ title }}</h1>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="用户登录" name="userPassword">
            <user-password-login ref="userPasswordLoginRef" />
          </el-tab-pane>
          <el-tab-pane label="邮箱登录" name="email">
            <email-login ref="emailLoginRef" />
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phone">
            <phone-login ref="phoneLoginRef" />
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button
            @keyup.enter="handleCheck"
            :loading="loading"
            size="large"
            class="login_btn"
            type="primary"
            @click="handleCheck"
          >
            登录
          </el-button>
        </el-form-item>
      </el-card>
      <Verify
        mode="pop"
        @success="handleLogin"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        ref="verify"
      ></Verify>
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

// 存储当前激活的 tab 名称
const activeTab = ref('userPassword')

// 存储不同登录组件的引用
const userPasswordLoginRef = ref()
const emailLoginRef = ref()
const phoneLoginRef = ref()

/**
 * 初始化
 */
onMounted(() => {
  changeDark()
  changeThemeColor()
  userStore.logout()
  initParticles()
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
 * 处理检查操作
 */
const handleCheck = async () => {
  let loginFormRef
  if (activeTab.value === 'userPassword') {
    loginFormRef = userPasswordLoginRef
  } else if (activeTab.value === 'email') {
    loginFormRef = emailLoginRef
  } else if (activeTab.value === 'phone') {
    loginFormRef = phoneLoginRef
  }

  if (loginFormRef) {
    await loginFormRef.value.loginFormRef.validate()
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

/**
 * 登录请求
 */
const handleLogin = async (data: any) => {
  let loginFormData
  if (activeTab.value === 'userPassword') {
    loginFormData = userPasswordLoginRef.value?.loginFormData
  } else if (activeTab.value === 'email') {
    loginFormData = emailLoginRef.value?.loginFormData
  } else if (activeTab.value === 'phone') {
    loginFormData = phoneLoginRef.value?.loginFormData
  }

  if (loginFormData) {
    loginFormData.captchaVerification = data.captchaVerification
    loading.value = true
    try {
      await userStore.userLogin(loginFormData)
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
</script>

<style lang="scss" scoped>
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: relative;

  .login-form-card {
    border: none;
    width: 30rem;
    padding: 40px;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    animation: fadeIn 1s ease;
    z-index: 1;

    h1 {
      margin-bottom: 30px;
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      color: #333;
    }

    .login_btn {
      width: 100%;
      background-color: #00a8e8;
      border-color: #00a8e8;
      color: white;
      transition:
        background-color 0.3s ease,
        transform 0.2s ease;
      position: relative;

      &:hover {
        background-color: #0085b2;
        border-color: #0085b2;
        transform: translateY(-3px);
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

    // 输入框聚焦动画
    :deep(.el-input__inner:focus) {
      border-color: #00a8e8;
      box-shadow: 0 0 5px rgba(0, 168, 232, 0.5);
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
    padding: 0;
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
}
</style>
