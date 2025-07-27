<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->

<!-- 系统参数配置表添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addSysConfig, getSysConfig, editSysConfig } from '@/api/system/config/config'
import type { ConfigForm } from '@/api/system/config/config/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'SysConfigAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const configDataFormRef = ref()
const configDataForm = ref<ConfigForm>({
  id: '',
  paramCateg: '',
  paramName: '',
  paramValue: '',
  envCode: '',
  dataType: '',
  isRequired: '',
  description: '',
  status: 0,
})
const rules = ref({
  paramCateg: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.paramCateg'),
      trigger: 'blur',
    },
  ],
  paramName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.paramName'),
      trigger: 'blur',
    },
  ],
  paramValue: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.paramValue'),
      trigger: 'blur',
    },
  ],
  envCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.envCode'),
      trigger: 'blur',
    },
  ],
  dataType: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.dataType'),
      trigger: 'blur',
    },
  ],
  isRequired: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.isRequired'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.description'),
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('config.fields.status'),
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
  configDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (configDataFormRef.value) {
    configDataFormRef.value.resetFields()
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
    const response: any = await getSysConfig(JSONBigInt.parse(id))
    Object.assign(configDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await configDataFormRef.value.validate()
  loading.value = true
  const id = configDataForm.value.id
  try {
    id ? await editSysConfig(id, configDataForm.value) : await addSysConfig(configDataForm.value)
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
    :title="!configDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="configDataForm"
      :rules="rules"
      ref="configDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('config.fields.paramCateg')" prop="paramCateg">
        <el-input
          v-model="configDataForm.paramCateg"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.paramCateg')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.paramName')" prop="paramName">
        <el-input
          v-model="configDataForm.paramName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.paramName')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.paramValue')" prop="paramValue">
        <el-input
          v-model="configDataForm.paramValue"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.paramValue')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.envCode')" prop="envCode">
        <el-input
          v-model="configDataForm.envCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.envCode')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.dataType')" prop="dataType">
        <el-input
          v-model="configDataForm.dataType"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.dataType')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.isRequired')" prop="isRequired">
        <el-input
          v-model="configDataForm.isRequired"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.isRequired')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.description')" prop="description">
        <el-input
          v-model="configDataForm.description"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.description')"
        />
      </el-form-item>

      <el-form-item :label="t('config.fields.status')" prop="status">
        <el-input
          v-model="configDataForm.status"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('config.fields.status')"
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
