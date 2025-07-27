<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->

<!-- 系统环境配置表管理添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addSysConfigEnv, getSysConfigEnv, editSysConfigEnv } from '@/api/system/config/env'
import type { ConfigEnvForm } from '@/api/system/config/env/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'SysConfigEnvAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const configEnvDataFormRef = ref()
const configEnvDataForm = ref<ConfigEnvForm>({
  id: '',
  envCode: '',
  envName: '',
  description: '',
})
const rules = ref({
  envCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('configEnv.fields.envCode'),
      trigger: 'blur',
    },
  ],
  envName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('configEnv.fields.envName'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('configEnv.fields.description'),
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
  configEnvDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (configEnvDataFormRef.value) {
    configEnvDataFormRef.value.resetFields()
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
    const response: any = await getSysConfigEnv(JSONBigInt.parse(id))
    Object.assign(configEnvDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await configEnvDataFormRef.value.validate()
  loading.value = true
  const id = configEnvDataForm.value.id
  try {
    id ? await editSysConfigEnv(id, configEnvDataForm.value) : await addSysConfigEnv(configEnvDataForm.value)
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
    :title="!configEnvDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="configEnvDataForm"
      :rules="rules"
      ref="configEnvDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('configEnv.fields.envCode')" prop="envCode">
        <el-input
          v-model="configEnvDataForm.envCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('configEnv.fields.envCode')"
        />
      </el-form-item>

      <el-form-item :label="t('configEnv.fields.envName')" prop="envName">
        <el-input
          v-model="configEnvDataForm.envName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('configEnv.fields.envName')"
        />
      </el-form-item>

      <el-form-item :label="t('configEnv.fields.description')" prop="description">
        <el-input
          v-model="configEnvDataForm.description"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('configEnv.fields.description')"
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
      <el-button type="primary" :loading="loading" @click="handleDataFormSubmit()">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
