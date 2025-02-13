<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 密码重置弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { userResetPassword } from '@/api/auth/user'
import { UserResetPasswordForm } from '@/api/auth/user/type.ts'
import { useI18n } from 'vue-i18n'
import { encrypt } from '@/utils/common.ts'
import { SALES } from '@/types/types.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'PasswordReset',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const restUserPasswordDataFormRef = ref()
const userRestPasswordDataForm = ref<UserResetPasswordForm>({})
const rules = ref({
  password: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('user.fields.password'),
      trigger: 'blur',
    },
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(t('user.fields.password')))
        } else {
          if (userRestPasswordDataForm.value.confirmPassword !== '') {
            restUserPasswordDataFormRef.value.validateField('confirmPassword')
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('user.fields.confirmPassword'),
      trigger: 'blur',
    },
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(t('user.rules.passwordAgain')))
        } else if (value !== userRestPasswordDataForm.value.password) {
          callback(new Error(t('user.rules.passwordUnanimous')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  userRestPasswordDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (restUserPasswordDataFormRef.value) {
    restUserPasswordDataFormRef.value.resetFields()
  }
  if (id) {
    userRestPasswordDataForm.value.id = id
  }
}

/**
 * 表单提交
 */
const handleUserRestPasswordDataFormSubmit = async () => {
  await restUserPasswordDataFormRef.value.validate()
  loading.value = true
  try {
    const fromData: UserResetPasswordForm = {
      id: userRestPasswordDataForm.value.id,
      password: encrypt(userRestPasswordDataForm.value.password!.trim(), SALES) as string,
    }
    loading.value = true
    await userResetPassword(fromData)
    useMessage().success(`${t('common.success')}`)
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}`)
  } finally {
    visible.value = false
    loading.value = false
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="t('user.common.resetPassword')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="userRestPasswordDataForm"
      :rules="rules"
      ref="restUserPasswordDataFormRef"
      @keyup.enter="handleUserRestPasswordDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('user.fields.password')" prop="password">
        <el-input
          v-model="userRestPasswordDataForm.password"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="t('user.fields.password')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.confirmPassword')" prop="confirmPassword">
        <el-input
          v-model="userRestPasswordDataForm.confirmPassword"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="t('user.fields.confirmPassword')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        @click="
          () => {
            visible = false
            loading = false
          }
        "
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleUserRestPasswordDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
