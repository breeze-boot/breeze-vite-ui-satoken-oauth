<!--
 * @author: gaoweixuan
 * @since: 2025-01-05
-->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { Phone, Lock } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'

const { t } = useI18n()

const tenantOption = ref<SelectData[]>()

const loginFormRef = ref()

const loginFormData = reactive({
  phone: '',
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

const phoneRegex: RegExp = /^1[3-9]\d{9}$/

/**
 * 自定义手机号校验规则
 */
const validatorPhone = (rule: any, value: any, callback: any) => {
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

defineExpose({
  loginFormRef,
  loginFormData,
  rules,
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
        type="text"
        :prefix-icon="Lock"
        show-code
        v-model="loginFormData.code"
        size="large"
        :placeholder="t('login.phone.fields.code')"
        clearable
      />
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
