<!--
 * @author: gaoweixuan
 * @since: 2025-04-22
-->

<!-- AI平台添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addAiPlatform, getAiPlatform, editAiPlatform } from '@/api/ai/platform'
import type { AiPlatformForm } from '@/api/ai/platform/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'AiPlatformAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const aiPlatformDataFormRef = ref()
const aiPlatformDataForm = ref<AiPlatformForm>({ description: '', platformCode: '', platformName: '' })
const rules = ref({
  platformCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.fields.platformCode'),
      trigger: 'blur',
    },
  ],
  platformName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.fields.platformName'),
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
  aiPlatformDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (aiPlatformDataFormRef.value) {
    aiPlatformDataFormRef.value.resetFields()
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
    const response: any = await getAiPlatform(JSONBigInt.parse(id))
    Object.assign(aiPlatformDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await aiPlatformDataFormRef.value.validate()
  loading.value = true
  const id = aiPlatformDataForm.value.id
  try {
    id ? await editAiPlatform(id, aiPlatformDataForm.value) : await addAiPlatform(aiPlatformDataForm.value)
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
    :title="!aiPlatformDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="aiPlatformDataForm"
      :rules="rules"
      ref="aiPlatformDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('aiPlatform.fields.platformCode')" prop="platformCode">
        <el-input
          v-model="aiPlatformDataForm.platformCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.fields.platformCode')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.fields.platformName')" prop="platformName">
        <el-input
          v-model="aiPlatformDataForm.platformName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.fields.platformName')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.fields.description')" prop="description">
        <el-input
          v-model="aiPlatformDataForm.description"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.fields.description')"
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
