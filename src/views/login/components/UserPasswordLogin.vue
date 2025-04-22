<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'

const { t } = useI18n()

const tenantOption = ref<SelectData[]>()

const loginFormRef = ref()

const loginFormData = reactive({
  username: 'admin',
  password: '123456',
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
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 自定义用户名校验规则
 */
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error(t('login.userPassword.rules.username')))
  } else {
    callback()
  }
}

/**
 * 自定义密码校验规则
 */
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error(t('login.userPassword.rules.password')))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error(t('login.userPassword.rules.password')))
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

defineExpose({
  loginFormRef,
  loginFormData,
  rules,
})
</script>
<template>
  <el-form :model="loginFormData" :rules="rules" ref="loginFormRef">
    <el-form-item prop="username">
      <el-input
        :prefix-icon="User"
        v-model="loginFormData.username"
        size="large"
        clearable
        :placeholder="t('login.userPassword.fields.username')"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        :prefix-icon="Lock"
        show-password
        v-model="loginFormData.password"
        size="large"
        :placeholder="t('login.userPassword.fields.password')"
        clearable
      />
    </el-form-item>
    <el-form-item prop="tenantId">
      <el-select
        size="large"
        v-model="loginFormData.tenantId"
        :placeholder="t('login.userPassword.fields.tenantId')"
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
