<!--
 * @author: gaoweixuan
 * @since: 2025-04-22
-->

<!-- AI模型添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addAiModel, getAiModel, editAiModel } from '@/api/ai/model'
import type { AiModelForm } from '@/api/ai/model/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'
import { SelectData } from '@/types/types.ts'
import { selectAIPlatform } from '@/api/ai/platform'

defineOptions({
  name: 'AiModelAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const platformOptions = ref<SelectData[]>()
const aiModelDataFormRef = ref()
const aiModelDataForm = ref<AiModelForm>({ description: '', modelName: '', platformCode: '' })
const rules = ref({
  modelName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiModel.fields.modelName'),
      trigger: 'blur',
    },
  ],
  platformCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiModel.fields.platformCode'),
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
  aiModelDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (aiModelDataFormRef.value) {
    aiModelDataFormRef.value.resetFields()
  }
  await initSelectPlatform()
  if (id) {
    await getInfo(id)
  }
}

/**
 * 初始化平台下拉框数据
 */
const initSelectPlatform = async () => {
  try {
    const response: any = await selectAIPlatform()
    platformOptions.value = response.data
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getAiModel(JSONBigInt.parse(id))
    Object.assign(aiModelDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await aiModelDataFormRef.value.validate()
  loading.value = true
  const id = aiModelDataForm.value.id
  try {
    id ? await editAiModel(id, aiModelDataForm.value) : await addAiModel(aiModelDataForm.value)
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
    :title="!aiModelDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="aiModelDataForm"
      :rules="rules"
      ref="aiModelDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('aiModel.fields.modelName')" prop="modelName">
        <el-input
          v-model="aiModelDataForm.modelName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiModel.fields.modelName')"
        />
      </el-form-item>
      <el-form-item :label="t('aiModel.fields.platformCode')" prop="platformCode" style="text-align: left">
        <el-select
          v-model="aiModelDataForm.platformCode"
          :placeholder="t('common.placeholder.choose') + t('aiModel.fields.platformCode')"
        >
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('aiModel.fields.description')" prop="description">
        <el-input
          v-model="aiModelDataForm.description"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiModel.fields.description')"
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
