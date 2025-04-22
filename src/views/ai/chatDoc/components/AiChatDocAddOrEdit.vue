<!--
 * @author: gaoweixuan
 * @since: 2025-04-22
-->

<!-- 聊天文档添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addAiChatDoc, getAiChatDoc, editAiChatDoc } from '@/api/ai/chatDoc'
import type { AiChatDocForm } from '@/api/ai/chatDoc/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'AiChatDocAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const aiChatDocDataFormRef = ref()
const aiChatDocDataForm = ref<AiChatDocForm>({ docId: '', docName: '', docUrl: '', id: 0, refDocId: '' })
const rules = ref({})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  aiChatDocDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (aiChatDocDataFormRef.value) {
    aiChatDocDataFormRef.value.resetFields()
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
    const response: any = await getAiChatDoc(JSONBigInt.parse(id))
    Object.assign(aiChatDocDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await aiChatDocDataFormRef.value.validate()
  loading.value = true
  const id = aiChatDocDataForm.value.id
  try {
    id ? await editAiChatDoc(id, aiChatDocDataForm.value) : await addAiChatDoc(aiChatDocDataForm.value)
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
    :title="!aiChatDocDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="aiChatDocDataForm"
      :rules="rules"
      ref="aiChatDocDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('aiChatDoc.fields.id')" prop="id">
        <el-input
          v-model="aiChatDocDataForm.id"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiChatDoc.fields.id')"
        />
      </el-form-item>
      <el-form-item :label="t('aiChatDoc.fields.docId')" prop="docId">
        <el-input
          v-model="aiChatDocDataForm.docId"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiChatDoc.fields.docId')"
        />
      </el-form-item>
      <el-form-item :label="t('aiChatDoc.fields.docName')" prop="docName">
        <el-input
          v-model="aiChatDocDataForm.docName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiChatDoc.fields.docName')"
        />
      </el-form-item>
      <el-form-item :label="t('aiChatDoc.fields.docUrl')" prop="docUrl">
        <el-input
          v-model="aiChatDocDataForm.docUrl"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiChatDoc.fields.docUrl')"
        />
      </el-form-item>
      <el-form-item :label="t('aiChatDoc.fields.refDocId')" prop="refDocId">
        <el-input
          v-model="aiChatDocDataForm.refDocId"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('aiChatDoc.fields.refDocId')"
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
