<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 邮箱添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addEmailConfig, getEmailConfig, editEmailConfig } from '@/api/system/email/emailConfig'
import type { EmailConfigForm } from '@/api/system/email/emailConfig/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'EmailConfigAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const emailDataFormRef = ref()
const emailDataForm = ref<EmailConfigForm>({})
const rules = ref({
  smtpHost: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.smtpHost'),
      trigger: 'blur',
    },
  ],
  port: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.port'),
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.username'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.password'),
      trigger: 'blur',
    },
  ],
  encoding: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.encoding'),
      trigger: 'blur',
    },
  ],
  smtpDebug: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.smtpDebug'),
      trigger: 'blur',
    },
  ],
  smtpSocketFactoryClass: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.smtpSocketFactoryClass'),
      trigger: 'blur',
    },
  ],
  auth: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.auth'),
      trigger: 'blur',
    },
  ],
  protocol: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.protocol'),
      trigger: 'change',
    },
  ],
  ssl: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.ssl'),
      trigger: 'change',
    },
  ],
  status: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('emailConfig.fields.status'),
      trigger: 'change',
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
  try {
    const response: any = await getEmailConfig(JSONBigInt.parse(id))
    Object.assign(emailDataForm.value, response.data)
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await emailDataFormRef.value.validate()
  loading.value = true
  const id = emailDataForm.value.id
  try {
    id ? await editEmailConfig(id, emailDataForm.value) : await addEmailConfig(emailDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
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
    :title="!emailDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="emailDataForm"
      :rules="rules"
      ref="emailDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('emailConfig.fields.smtpHost')" prop="smtpHost">
        <el-input
          v-model="emailDataForm.smtpHost"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.smtpHost')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.port')" prop="port">
        <el-input
          v-model="emailDataForm.port"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.smtpHost')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.username')" prop="username">
        <el-input
          v-model="emailDataForm.username"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.username')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.password')" prop="password">
        <el-input
          v-model="emailDataForm.password"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.password')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.encoding')" prop="encoding">
        <el-input
          v-model="emailDataForm.encoding"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.encoding')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.smtpSocketFactoryClass')" prop="smtpSocketFactoryClass">
        <el-input
          v-model="emailDataForm.smtpSocketFactoryClass"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.smtpSocketFactoryClass')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.ssl')" prop="ssl">
        <el-input
          v-model="emailDataForm.ssl"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.ssl')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.protocol')" prop="protocol">
        <el-input
          v-model="emailDataForm.protocol"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('emailConfig.fields.protocol')"
        />
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.smtpDebug')" prop="smtpDebug">
        <el-switch
          v-model="emailDataForm.smtpDebug"
          :active-value="'true'"
          :inactive-value="'false'"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.auth')" prop="auth">
        <el-switch
          v-model="emailDataForm.auth"
          :active-value="'true'"
          :inactive-value="'false'"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
      <el-form-item :label="t('emailConfig.fields.status')" prop="status" style="text-align: left">
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
      <el-button type="primary" :loading="loading" @click="handleDataFormSubmit()">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
