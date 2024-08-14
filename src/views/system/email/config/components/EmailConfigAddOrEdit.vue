<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 邮箱添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addEmailConfig, getEmailConfig, editEmailConfig } from '@/api/system/email/emailConfig'
import type { EmailConfigForm } from '@/api/system/email/emailConfig/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'EmailConfigAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const emailDataFormRef = ref()
const emailDataForm = ref<EmailConfigForm>({})
const rules = ref({
  smtpHost: [
    {
      required: true,
      message: t('emailConfig.rules.smtpHost'),
      trigger: 'blur',
    },
  ],
  port: [
    {
      required: true,
      message: t('emailConfig.rules.port'),
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: t('emailConfig.rules.username'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('emailConfig.rules.password'),
      trigger: 'blur',
    },
  ],
  encoding: [
    {
      required: true,
      message: t('emailConfig.rules.encoding'),
      trigger: 'blur',
    },
  ],
  smtpDebug: [
    {
      required: true,
      message: t('emailConfig.rules.smtpDebug'),
      trigger: 'blur',
    },
  ],
  smtpSocketFactoryClass: [
    {
      required: true,
      message: t('emailConfig.rules.smtpSocketFactoryClass'),
      trigger: 'blur',
    },
  ],
  auth: [
    {
      required: true,
      message: t('emailConfig.rules.auth'),
      trigger: 'blur',
    },
  ],
  protocol: [
    {
      required: true,
      message: t('emailConfig.rules.protocol'),
      trigger: 'blur',
    },
  ],
  ssl: [
    {
      required: true,
      message: t('emailConfig.rules.ssl'),
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: t('emailConfig.rules.status'),
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
  emailDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (emailDataFormRef.value) {
    emailDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getEmailConfig(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(emailDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  emailDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = emailDataForm.value.id
    if (id) {
      await editEmailConfig(id, emailDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addEmailConfig(emailDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
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
    :title="!emailDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="emailDataForm"
      :rules="rules"
      ref="emailDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="110px" :label="t('emailConfig.fields.smtpHost')" prop="smtpHost">
        <el-input v-model="emailDataForm.smtpHost" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.port')" prop="port">
        <el-input v-model="emailDataForm.port" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.username')" prop="username">
        <el-input v-model="emailDataForm.username" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.password')" prop="password">
        <el-input v-model="emailDataForm.password" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.encoding')" prop="encoding">
        <el-input v-model="emailDataForm.encoding" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item
        label-width="110px"
        :label="t('emailConfig.fields.smtpSocketFactoryClass')"
        prop="smtpSocketFactoryClass"
      >
        <el-input v-model="emailDataForm.smtpSocketFactoryClass" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.ssl')" prop="ssl">
        <el-input v-model="emailDataForm.ssl" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.protocol')" prop="protocol">
        <el-input v-model="emailDataForm.protocol" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.smtpDebug')" prop="smtpDebug">
        <el-switch
          v-model="emailDataForm.smtpDebug"
          :active-value="'true'"
          :inactive-value="'false'"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.auth')" prop="auth">
        <el-switch
          v-model="emailDataForm.auth"
          :active-value="'true'"
          :inactive-value="'false'"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
      <el-form-item label-width="110px" :label="t('emailConfig.fields.status')" prop="status" style="text-align: left">
        <el-switch
          v-model="emailDataForm.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
