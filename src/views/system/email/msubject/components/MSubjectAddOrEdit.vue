<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 邮箱主题添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addMSubject, getMSubject, editMSubject } from '@/api/system/email/msubject'
import type { MSubjectForm } from '@/api/system/email/msubject/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'MSubjectAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const mSubjectDataFormRef = ref()
const mSubjectDataForm = ref<MSubjectForm>({ subject: '', content: '', ccUserId: [], cc: '', to: '', toUserId: [] })
const rules = ref({
  subject: [
    {
      required: true,
      message: t('mSubject.rules.subject'),
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: t('mSubject.rules.content'),
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
  mSubjectDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (mSubjectDataFormRef.value) {
    mSubjectDataFormRef.value.resetFields()
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
  const response: any = await getMSubject(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(mSubjectDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  mSubjectDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    loading.value = true
    const id = mSubjectDataForm.value.id
    if (id) {
      await editMSubject(id, mSubjectDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addMSubject(mSubjectDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
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
    width="600"
    :title="!mSubjectDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="mSubjectDataForm"
      :rules="rules"
      ref="mSubjectDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="70px"
    >
      <el-form-item :label="t('mSubject.fields.subject')" prop="subject">
        <el-input v-model="mSubjectDataForm.subject" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="t('mSubject.fields.content')" prop="content">
        <el-input v-model="mSubjectDataForm.content" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="t('mSubject.fields.status')" prop="status" style="text-align: left">
        <el-switch
          v-model="mSubjectDataForm.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="handleDataFormSubmit()">
          {{ t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
