<!--
 * @author: gaoweixuan
 * @since: 2025-04-19
-->

<!-- AI平台添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addAiPlatform, getAiPlatform, editAiPlatform } from '@/api/ai/aiPlatform'
import type { AiPlatformForm } from '@/api/ai/aiPlatform/type.ts'
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
  id: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.id'),
      trigger: 'blur',
    },
  ],
  platformCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.platformCode'),
      trigger: 'blur',
    },
  ],
  platformName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.platformName'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.description'),
      trigger: 'blur',
    },
  ],
  createTime: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.createTime'),
      trigger: 'blur',
    },
  ],
  createBy: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.createBy'),
      trigger: 'blur',
    },
  ],
  createName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.createName'),
      trigger: 'blur',
    },
  ],
  updateBy: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.updateBy'),
      trigger: 'blur',
    },
  ],
  updateName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.updateName'),
      trigger: 'blur',
    },
  ],
  updateTime: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.updateTime'),
      trigger: 'blur',
    },
  ],
  isDelete: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.isDelete'),
      trigger: 'blur',
    },
  ],
  deleteBy: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('aiPlatform.columns.deleteBy'),
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
    useMessage().error(` + $ + '{t(\'common.fail\')}' + ` + err.message)
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
      <el-form-item :label="t('aiPlatform.columns.id')" prop="id">
        <el-input
          v-model="aiPlatformDataForm.id"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.id')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.platformCode')" prop="platformCode">
        <el-input
          v-model="aiPlatformDataForm.platformCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.platformCode')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.platformName')" prop="platformName">
        <el-input
          v-model="aiPlatformDataForm.platformName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.platformName')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.description')" prop="description">
        <el-input
          v-model="aiPlatformDataForm.description"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.description')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.createTime')" prop="createTime">
        <el-input
          v-model="aiPlatformDataForm.createTime"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.createTime')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.createBy')" prop="createBy">
        <el-input
          v-model="aiPlatformDataForm.createBy"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.createBy')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.createName')" prop="createName">
        <el-input
          v-model="aiPlatformDataForm.createName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.createName')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.updateBy')" prop="updateBy">
        <el-input
          v-model="aiPlatformDataForm.updateBy"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.updateBy')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.updateName')" prop="updateName">
        <el-input
          v-model="aiPlatformDataForm.updateName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.updateName')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.updateTime')" prop="updateTime">
        <el-input
          v-model="aiPlatformDataForm.updateTime"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.updateTime')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.isDelete')" prop="isDelete">
        <el-input
          v-model="aiPlatformDataForm.isDelete"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.isDelete')"
        />
      </el-form-item>
      <el-form-item :label="t('aiPlatform.columns.deleteBy')" prop="deleteBy">
        <el-input
          v-model="aiPlatformDataForm.deleteBy"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiPlatform.columns.deleteBy')"
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
