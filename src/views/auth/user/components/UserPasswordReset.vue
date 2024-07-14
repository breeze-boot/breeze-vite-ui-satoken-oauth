<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 密码重置弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userResetPassword } from '@/api/auth/user'
import { UserResetPasswordForm } from '@/api/auth/user/type.ts'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'PasswordReset',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref(false)
const restUserPasswordDataFormRef = ref()
const userRestPasswordDataForm = ref<UserResetPasswordForm>({})
const rules = ref({
  password: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(t('user.rules.password')))
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
  // 重置表单数据
  if (restUserPasswordDataFormRef.value) {
    restUserPasswordDataFormRef.value.resetFields()
  }
  if (id) {
    userRestPasswordDataForm.value.id = id
  }
  visible.value = true
}

/**
 * 表单提交
 */
const handleUserRestPasswordDataFormSubmit = () => {
  restUserPasswordDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = userRestPasswordDataForm.value.id
    if (id) {
      await userResetPassword(userRestPasswordDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
        },
      })
    }
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="38%"
    :title="t('user.common.resetPassword')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="userRestPasswordDataForm"
      :rules="rules"
      ref="restUserPasswordDataFormRef"
      @keyup.enter="handleUserRestPasswordDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="160px" :label="$t('user.fields.password')" prop="password">
        <el-input
          v-model="userRestPasswordDataForm.password"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="$t('user.fields.password')"
        />
      </el-form-item>
      <el-form-item label-width="160px" :label="$t('user.fields.confirmPassword')" prop="confirmPassword">
        <el-input
          v-model="userRestPasswordDataForm.confirmPassword"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="$t('user.fields.confirmPassword')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleUserRestPasswordDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
