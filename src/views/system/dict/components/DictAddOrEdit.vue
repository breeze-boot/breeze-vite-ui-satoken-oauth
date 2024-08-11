<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addDict, getDict, editDict } from '@/api/system/dict'
import { DictForm } from '@/api/system/dict/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'DictAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const dictDataFormRef = ref()
const dictDataForm = ref<DictForm>({ dictCode: '', dictName: '', status: 0 })

const rules = ref({
  dictName: [
    {
      required: true,
      message: t('dict.rules.dictName'),
      trigger: 'blur',
    },
  ],
  dictCode: [
    {
      required: true,
      message: t('dict.rules.dictCode'),
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
  dictDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (dictDataFormRef.value) {
    dictDataFormRef.value.resetFields()
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
  const response: any = await getDict(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(dictDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDictDataFormSubmit = () => {
  dictDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = dictDataForm.value.id
    if (id) {
      await editDict(id, dictDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addDict(dictDataForm.value)
      ElMessage.success({
        message: t('common.success'),
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
    :title="!dictDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dictDataForm"
      :rules="rules"
      ref="dictDataFormRef"
      @keyup.enter="handleDictDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('dict.fields.dictCode')" prop="dictCode">
        <el-input
          v-model="dictDataForm.dictCode"
          autocomplete="off"
          clearable
          :placeholder="$t('dict.fields.dictCode')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('dict.fields.dictName')" prop="dictName">
        <el-input
          v-model="dictDataForm.dictName"
          autocomplete="off"
          clearable
          :placeholder="$t('dict.fields.dictName')"
        />
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('dict.fields.status')" prop="status">
        <el-switch
          v-model="dictDataForm.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDictDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
