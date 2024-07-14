<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.ts'
import { storeToRefs } from 'pinia'

let settingStore = useSettingStore()
let { theme, settings } = storeToRefs(settingStore)

let $router = useRouter()
let $route = useRoute()
let loading = ref(false)

let useStore = useUserStore()
let loginFormRef = ref()

/**
 * 初始化
 */
onMounted(() => {
  changeDark()
  changeThemeColor()
  useStore.logout()
})

/**
 * 切换日间/夜间模式
 */
const changeDark = () => {
  let html = document.documentElement
  if (theme.value.themeModel !== 'dark') {
    html.classList.remove('dark')
    return
  }
  html.classList.add('dark')
}

/**
 * 改变主题颜色
 */
const changeThemeColor = () => {
  document.documentElement.style.setProperty('--el-color-primary', theme.value.themeColor)
}

const loginFormData = reactive({
  username: 'admin',
  password: '123456',
})

/**
 * 标题动态获取计算属性
 */
const title = computed(() => {
  return settings.value.title
})

/**
 * 自定义用户名校验规则
 */
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

/**
 * 自定义密码校验规则
 */
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码应为6~16位的任意组合'))
  } else {
    callback()
  }
}

/**
 * 校验规则
 */
const rules = {
  username: [
    {
      trigger: 'change',
      validator: validatorUsername,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
}

/**
 * 登录请求
 */
const handleLogin = async () => {
  await loginFormRef.value.validate()
  loading.value = true
  try {
    await useStore.userLogin(loginFormData)
    let redirect: string = $route.query.redirect as string
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi, ${loadGreetings()}`,
    })
    await $router.push({ path: redirect || '/' })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message || '',
    })
  }
}
</script>

<template>
  <el-watermark
    :font="theme.themeModel === 'dark' ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div class="login_container">
      <el-row :gutter="24" style="margin: 0">
        <el-col
          :span="8"
          :xs="{ span: 1 }"
          :sm="{ span: 1 }"
          :md="{ span: 6 }"
          :lg="{ span: 8 }"
          :xl="{ span: 8 }"
          class="layout"
        ></el-col>
        <el-col
          :span="8"
          :xs="{ span: 22 }"
          :sm="{ span: 22 }"
          :md="{ span: 12 }"
          :lg="{ span: 8 }"
          :xl="{ span: 8 }"
          class="layout"
        >
          <el-card class="login-form-card">
            <h1>{{ title }}</h1>
            <el-form :model="loginFormData" :rules="rules" ref="loginFormRef">
              <el-form-item prop="username">
                <el-input
                  :prefix-icon="User"
                  v-model="loginFormData.username"
                  size="large"
                  clearable
                  placeholder="Username"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  :prefix-icon="Lock"
                  show-password
                  v-model="loginFormData.password"
                  size="large"
                  placeholder="Password"
                  clearable
                ></el-input>
              </el-form-item>
            </el-form>
            <el-form-item>
              <el-button :loading="loading" size="large" class="login_btn" type="primary" @click="handleLogin">
                登录
              </el-button>
            </el-form-item>
          </el-card>
        </el-col>
        <el-col
          :span="8"
          :xs="{ span: 1 }"
          :sm="{ span: 1 }"
          :md="{ span: 6 }"
          :lg="{ span: 8 }"
          :xl="{ span: 8 }"
          class="layout"
        ></el-col>
      </el-row>
    </div>
  </el-watermark>
</template>

<style lang="scss" scoped>
.login_container {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-image: radial-gradient(circle at 48.7% 44.3%, rgb(254, 254, 254) 10.5%, rgb(181, 239, 249) 50%);

  .layout {
    position: relative;
    height: 100vh;

    .login-form-card {
      border: none;
      position: absolute;
      top: 25vh;
      left: 50%;
      width: 70%;
      padding: 30px 10px;
      background-color: var(--login-theme);
      transform: translateX(-50%);

      h1 {
        margin-top: -10px;
        margin-bottom: 40px;
        font-size: 40px;
        font-weight: 700;
        text-align: center;
        background: linear-gradient(to right, blue, rgb(35 60 70));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .login_btn {
        width: 100%;
      }
    }
  }
}

.el-card {
  box-shadow: rgb(0 0 0 / 24%) 0 0 3px;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
