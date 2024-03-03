<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典项添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addDictItem, getDictItem, editDictItem } from '@/api/system/dictItem
import { DictItemRecord } from '@/api/system/dictItem/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'DictItemAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const dictItemDataFormRef = ref()
const dictItemDataForm = ref<DictItemRecord>({ label: '', value: '', id: 0 })

const rules = ref({
  label: [
    {
      required: true,
      message: t('dictItem.rules.label'),
      trigger: 'blur',
    },
  ],
  value: [
    {
      required: true,
      message: t('dictItem.rules.value'),
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
  visible.value = true
  dictItemDataForm.value.id = undefined
  // 重置表单数据
  if (dictItemDataFormRef.value) {
    dictItemDataFormRef.value.resetFields()
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
  const response: any = await getDictItem(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(dictItemDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDictItemDataFormSubmit = () => {
  dictItemDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = dictItemDataForm.value.id
    if (id) {
      editDictItem(dictItemDataForm.value)
        .then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    } else {
      addDictItem(dictItemDataForm.value)
        .then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
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
    :title="!dictItemDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dictItemDataForm"
      :rules="rules"
      ref="dictItemDataFormRef"
      @keyup.enter="handleDictItemDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('dictItem.fields.label')" prop="label">
        <el-input
          v-model="dictItemDataForm.label"
          autocomplete="off"
          clearable
          :placeholder="$t('dictItem.fields.label')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('dictItem.fields.value')" prop="value">
        <el-input
          v-model="dictItemDataForm.value"
          autocomplete="off"
          clearable
          :placeholder="$t('dictItem.fields.value')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDictItemDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
