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
import useColumnStore from '@/store/modules/column'
import useSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import Verify from '@/components/anj-plus/Verify.vue'
import { UserLoginForm } from '@/api/login/type.ts'
import { THEME } from '@/utils/common.ts'
import type { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'

let settingStore = useSettingStore()
let columnStore = useColumnStore()
let { theme, settings } = storeToRefs(settingStore)

let $router = useRouter()
let $route = useRoute()
let loading = ref(false)

const tenantOption = ref<SelectData[]>()
let userStore = useUserStore()
let loginFormRef = ref()

const loginFormData = reactive<UserLoginForm>({
  username: 'admin',
  password: '123456',
})

const verify = ref(null)
const captchaType = ref('clickWord')

/**
 * 初始化
 */
onMounted(() => {
  initSelectTenant()
  changeDark()
  changeThemeColor()
  userStore.logout()
})

const handleCheck = async () => {
  await loginFormRef.value.validate()
  handleOnShow('blockPuzzle')
  // handleOnShow('clickWord')
}

const handleOnShow = (type: any) => {
  captchaType.value = type
  verify.value?.show()
}

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
  tenantId: [
    {
      required: true,
      trigger: 'change',
    },
  ],
}

/**
 * 初始化租户下拉框数据
 */
const initSelectTenant = async () => {
  const response: any = await selectTenant()
  if (response.code === '0000') {
    tenantOption.value = response.data
  }
}

/**
 * 登录请求
 */
const handleLogin = async (data: any) => {
  await loginFormRef.value.validate()
  loginFormData.captchaVerification = data.captchaVerification
  loading.value = true
  try {
    await userStore.userLogin(loginFormData)
    let redirect: string = $route.query.redirect as string
    ElNotification({
      type: 'success',
      message: '登录成功',
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
</script>

<template>
  <el-watermark
    :font="theme.themeModel === THEME.DARK ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div class="login_container" @keyup.enter="handleCheck">
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
          <el-form-item prop="tenantId">
            <el-select size="large" v-model="loginFormData.tenantId" :popper-append-to-body="false">
              <el-option
                v-for="item in tenantOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
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

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background-image: radial-gradient(circle at 48.7% 44.3%, rgb(254, 254, 254) 10.5%, rgb(181, 239, 249) 50%);

  .login-form-card {
    border: none;
    position: absolute;
    top: 25vh;
    left: 50%;
    width: 28rem;
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

.el-card {
  box-shadow: rgb(0 0 0 / 24%) 0 0 3px;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
