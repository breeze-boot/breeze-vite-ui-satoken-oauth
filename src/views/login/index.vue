<template>
  <el-watermark
    :font="theme.themeModel === THEME.DARK ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div
      class="login-container flex justify-center items-center w-full h-screen relative bg-gradient-to-br from-blue-50 to-blue-100"
    >
      <el-card
        class="login-form-card border-none min-w-[420px] max-w-[500px] p-8 bg-white shadow-xl rounded-2xl z-10 transform transition-all duration-500 hover:shadow-2xl"
      >
        <div class="login-header flex flex-col items-center mb-6">
          <h1 class="m-0 text-2xl md:text-3xl font-bold text-center text-gray-800">{{ title }}</h1>
        </div>

        <!-- 登录表单内容 -->
        <div v-show="activeTab === 'login-user-password'">
          <user-password-login ref="userPasswordLoginRef" />
        </div>
        <div v-show="activeTab === 'login-phone'">
          <phone-login ref="phoneLoginRef" />
        </div>
        <div v-show="activeTab === 'login-email'">
          <email-login ref="emailLoginRef" />
        </div>

        <el-form-item>
          <el-button
            @keyup.enter="handleCheck"
            :loading="loading"
            size="large"
            class="login-btn w-full bg-blue-500 border-blue-500 text-white transition-all duration-300 rounded-2xl shadow-lg py-4 text-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-8 transform hover:-translate-y-1"
            type="primary"
            @click="handleCheck"
          >
            {{ t('login.common.login') }}
          </el-button>
        </el-form-item>

        <div class="third-party-login mt-8 text-center">
          <div class="divider flex items-center justify-center my-5">
            <span class="text-gray-400 text-sm px-3 bg-white">{{ t('login.common.otherWay') }}</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>
          <div class="social-btn-list flex justify-center space-x-5">
            <svg-button
              v-for="(item, index) in btns"
              :key="index"
              :style="{ background: 'transparent !important' }"
              @svg-btn-click="handleSwitchLogin(item)"
              width="1.8rem"
              height="1.8rem"
              :icon="item.name"
              :circle="true"
            />
          </div>
        </div>
      </el-card>
      <Verify
        mode="pop"
        @success="handleLogin"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        ref="verify"
      />
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
const btns = [
  { name: 'login-weibo', label: '微博' },
  { name: 'login-ding', label: '钉钉' },
  { name: 'login-user-password', label: '用户登录' },
  { name: 'login-phone', label: '手机号登录' },
  { name: 'login-email', label: '邮箱登录' },
]
// 存储当前激活的标签
const activeTab = ref('login-user-password')

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
 * 切换登录方式
 */
const handleSwitchLogin = (tab: any) => {
  activeTab.value = tab.name
  if (tab.name === 'login-email') {
    emailLoginRef.value.init()
  } else if (tab.name === 'login-user-password') {
    userPasswordLoginRef.value.init()
  } else if (tab.name === 'login-phone') {
    phoneLoginRef.value.init()
  } else {
    ElNotification({
      type: 'info',
      message: '暂不支持此登录方式',
      title: '提示',
    })
  }
}
/**
 * 处理检查操作
 */
const handleCheck = async () => {
  let currLoginFormRef
  if (activeTab.value === 'login-user-password') {
    currLoginFormRef = userPasswordLoginRef
  } else if (activeTab.value === 'login-email') {
    currLoginFormRef = emailLoginRef
  } else if (activeTab.value === 'login-phone') {
    currLoginFormRef = phoneLoginRef
  }

  if (currLoginFormRef) {
    await currLoginFormRef.value.loginFormRef.validate()
    handleOnShow('blockPuzzle')
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
  if (activeTab.value === 'login-user-password') {
    let loginFormData = userPasswordLoginRef.value?.loginFormData
    await handleLoginResponse(loginFormData, data, () => userStore.userLogin(loginFormData))
  } else if (activeTab.value === 'login-email') {
    let loginFormData = emailLoginRef.value?.loginFormData
    await handleLoginResponse(loginFormData, data, () => userStore.emailLogin(loginFormData))
  } else if (activeTab.value === 'login-phone') {
    let loginFormData = phoneLoginRef.value?.loginFormData
    await handleLoginResponse(loginFormData, data, () => userStore.phoneLogin(loginFormData))
  }
}
</script>

<style lang="scss" scoped>
/* 登录容器样式 */
.login-container {
  position: relative;
  overflow: hidden;
  background-image:
    radial-gradient(circle at 10% 20%, rgb(59 130 246 / 10%) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgb(59 130 246 / 10%) 0%, transparent 20%),
    radial-gradient(circle at 30% 70%, rgb(59 130 246 / 10%) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgb(59 130 246 / 10%) 0%, transparent 20%);
}

/* 卡片样式优化 */
.login-form-card {
  box-shadow:
    0 15px 30px -10px rgb(0 0 0 / 10%),
    0 10px 20px -5px rgb(0 0 0 / 4%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: fadeIn 0.6s ease forwards;
}

.login-form-card:hover {
  box-shadow:
    0 25px 40px -10px rgb(0 0 0 / 15%),
    0 15px 30px -5px rgb(0 0 0 / 6%);
  transform: translateY(-8px);
}

/* 底部图标式按钮样式 */
.login-methods {
  .login-method-btn {
    transition: all 0.3s ease;

    .login-icon-wrapper {
      transition: all 0.3s ease;
    }

    &:hover {
      .login-icon-wrapper {
        transform: scale(1.1);
      }
    }
  }

  .text-blue-500 {
    .login-icon-wrapper {
      border: 1px solid #bfdbfe;
    }

    svg {
      fill: #3b82f6;
    }
  }

  .text-gray-500 {
    svg {
      fill: #6b7280;
    }
  }
}

/* 分割线样式 */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;

  .text-gray-400 {
    padding: 0 1.2rem;
    font-size: 0.9rem;
    font-weight: 400;
    background-color: #fff;
  }

  .flex-1 {
    height: 1px;
    background-color: #e5e7eb;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
