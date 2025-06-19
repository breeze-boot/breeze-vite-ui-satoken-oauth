<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { Lock } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'
import useLoginStore from '@/store/modules/login.ts'
import { sendEmailCodeAPI } from '@/api/login'
import EmailIcon from './EmailIcon.vue'

const { t } = useI18n()

const loginStore = useLoginStore()

const tenantOption = ref<SelectData[]>()

const loginFormRef = ref()
const buttonText = ref<string>('获取验证码')
const countdown = ref<number>(0)
const isCounting = ref<boolean>(false)
let countdownTimer: number | undefined = undefined // 存储计时器ID

const loginFormData = reactive({
  email: '',
  code: '',
  tenantId: 1,
  captchaVerification: '',
})

const init = () => {
  const storedCountDown: number = parseInt(loginStore.emailCountDown)
  if (storedCountDown > 0) {
    if (!countdownTimer) {
      loginStore.storageEmailCountDown(0)
      buttonText.value = '获取验证码'
      isCounting.value = false
      return
    }
    countdown.value = storedCountDown
    isCounting.value = true
    startCountdown() // 直接启动倒计时
  } else {
    buttonText.value = '获取验证码'
    isCounting.value = false
  }
}

/**
 * 初始化
 */
onMounted(() => {
  initSelectTenant()
  init()
})

/**
 * 组件卸载时清理计时器
 */
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = undefined
    loginStore.storageEmailCountDown(0)
  }
})

/**
 * 初始化租户下拉框数据
 */
const initSelectTenant = async () => {
  try {
    const response: any = await selectTenant()
    tenantOption.value = response.data
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 邮箱正则表达式
 */
const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * 自定义邮箱校验规则
 */
const validatorEmail = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error(t('login.email.rules.email')))
  } else if (!emailRegex.test(value)) {
    callback(new Error(t('loin.email.rules.email')))
  } else {
    callback()
  }
}

/**
 * 自定义密码校验规则
 */
const validatorCode = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error(t('login.email.rules.code')))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error(t('login.email.rules.code')))
  } else {
    callback()
  }
}

/**
 * 校验规则
 */
const rules = {
  email: [
    {
      trigger: 'change',
      validator: validatorEmail,
    },
  ],
  code: [
    {
      trigger: 'change',
      validator: validatorCode,
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
 * 处理倒计时逻辑
 */
const handleCountdown = () => {
  // 清理可能存在的旧计时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  isCounting.value = true
  buttonText.value = `${countdown.value}s 后重新获取`

  countdownTimer = setInterval(() => {
    countdown.value--
    buttonText.value = `${countdown.value}s 后重新获取`

    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = undefined
      isCounting.value = false
      countdown.value = 60
      buttonText.value = '获取验证码'
      // 清除状态
      loginStore.storageEmailCountDown(0)
    } else {
      // 存储倒计时状态
      console.log('倒计时值：', countdown.value)
      loginStore.storageEmailCountDown(countdown.value)
    }
  }, 1000)
}

/**
 * 启动倒计时
 */
const startCountdown = async () => {
  // 如果已经在倒计时，不重复启动
  if (isCounting.value) return

  // 发送验证码请求
  await sendVerificationCode()
  handleCountdown()
}

/**
 * 发送验证码
 */
const sendVerificationCode = async () => {
  try {
    await loginFormRef.value.validateField('email')
    loginStore.storagePhone(loginFormData.email)
    const response: any = await sendEmailCodeAPI(loginFormData.email)

    // 使用服务器返回的倒计时值
    countdown.value = response.data || 60
    loginStore.storageEmailCountDown(countdown.value)

    buttonText.value = `${countdown.value}s 后重新获取`
    useMessage().success(response.message)
  } catch (err: any) {
    useMessage().warning(err.message)
    throw new Error(err.message)
  }
}

defineExpose({
  loginFormRef,
  loginFormData,
  rules,
  init,
})
</script>

<template>
  <el-form :model="loginFormData" :rules="rules" ref="loginFormRef">
    <el-form-item prop="email">
      <el-input
        :prefix-icon="EmailIcon"
        v-model="loginFormData.email"
        size="large"
        clearable
        :placeholder="t('login.email.fields.email')"
      />
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        type="password"
        :prefix-icon="Lock"
        v-model="loginFormData.code"
        size="large"
        :placeholder="t('login.email.fields.code')"
        clearable
      >
        <template #append>
          <el-button :disabled="isCounting" @click="startCountdown()">
            {{ buttonText }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="tenantId">
      <el-select
        size="large"
        v-model="loginFormData.tenantId"
        :placeholder="t('login.email.fields.tenantId')"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="item in tenantOption"
          :key="item.value"
          :label="item.label"
          :value="Number(item.value)"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
