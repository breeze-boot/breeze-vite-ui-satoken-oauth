<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { Lock } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'
import EmailLogin from './EmailIcon.vue'

const { t } = useI18n()

const tenantOption = ref<SelectData[]>()

const loginFormRef = ref()

const loginFormData = reactive({
  email: '',
  code: '',
  tenantId: 1,
  captchaVerification: '',
})
/**
 * 初始化
 */
onMounted(() => {
  initSelectTenant()
})

/**
 * 初始化租户下拉框数据
 */
const initSelectTenant = async () => {
  try {
    const response: any = await selectTenant()
    tenantOption.value = response.data
  } catch (e: any) {
    useMessage().error(e.message)
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

defineExpose({
  loginFormRef,
  loginFormData,
  rules,
})
</script>
<template>
  <el-form :model="loginFormData" :rules="rules" ref="loginFormRef">
    <el-form-item prop="email">
      <el-input
        :prefix-icon="EmailLogin"
        v-model="loginFormData.email"
        size="large"
        clearable
        :placeholder="t('login.email.fields.email')"
      />
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        type="text"
        :prefix-icon="Lock"
        show-code
        v-model="loginFormData.code"
        size="large"
        :placeholder="t('login.email.fields.code')"
        clearable
      />
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
