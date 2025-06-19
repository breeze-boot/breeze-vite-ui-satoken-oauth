<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { Phone, Lock } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'
import useLoginStore from '@/store/modules/login.ts'
import { sendPhoneCodeAPI } from '@/api/login'
import { SmsEnum } from '@/enums/SmsEnum.ts'

const { t } = useI18n()

const loginStore = useLoginStore()

const tenantOption = ref<SelectData[]>()

const loginFormRef = ref()
const buttonText = ref<string>('获取验证码')
const countdown = ref<number>(0)
const isCounting = ref<boolean>(false)
let countdownTimer: number | undefined = undefined // 存储计时器ID

const loginFormData = reactive({
  phone: '17812341234',
  code: '',
  tenantId: 1,
  captchaVerification: '',
})

const init = () => {
  const storedCountDown: number = parseInt(loginStore.phoneCountDown)

  if (storedCountDown > 0) {
    if (!countdownTimer) {
      loginStore.storagePhoneCountDown(0)
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
    loginStore.storagePhoneCountDown(0)
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
 * 手机号正则表达式
 */
const phoneRegex: RegExp = /^1[3-9]\d{9}$/

/**
 * 自定义手机号校验规则
 */
const validatorPhone = (rule: any, value: any, callback: any) => {
  debugger
  if (value.length === 0) {
    callback(new Error(t('login.phone.rules.phone')))
  } else if (!phoneRegex.test(value)) {
    callback(new Error(t('login.phone.rules.phone')))
  } else {
    callback()
  }
}

/**
 * 自定义密码校验规则
 */
const validatorCode = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error(t('login.phone.rules.code')))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error(t('login.phone.rules.code')))
  } else {
    callback()
  }
}

/**
 * 校验规则
 */
const rules = {
  phone: [
    {
      trigger: 'change',
      validator: validatorPhone,
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
      loginStore.storagePhoneCountDown(0)
    } else {
      // 存储倒计时状态
      console.log('倒计时值：', countdown.value)
      loginStore.storagePhoneCountDown(countdown.value)
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
    await loginFormRef.value.validateField('phone')
    loginStore.storagePhone(loginFormData.phone)
    const response: any = await sendPhoneCodeAPI(SmsEnum.SMS.value, loginFormData.phone)

    // 使用服务器返回的倒计时值
    countdown.value = response.data || 60
    loginStore.storagePhoneCountDown(countdown.value)

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
    <el-form-item prop="phone">
      <el-input
        :prefix-icon="Phone"
        v-model="loginFormData.phone"
        size="large"
        clearable
        :placeholder="t('login.phone.fields.phone')"
      />
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        type="password"
        :prefix-icon="Lock"
        v-model="loginFormData.code"
        size="large"
        :placeholder="t('login.phone.fields.code')"
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
        :placeholder="t('login.phone.fields.tenantId')"
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
