<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addDict, getDict, editDict } from '@/api/system/dict'
import { DictForm } from '@/api/system/dict/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DictAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const dictDataFormRef = ref()
const dictDataForm = ref<DictForm>({ dictCode: '', dictName: '', status: 0 })

const rules = ref({
  dictName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dict.fields.dictName'),
      trigger: 'blur',
    },
  ],
  dictCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dict.fields.dictCode'),
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
  try {
    const response: any = await getDict(JSONBigInt.parse(id))
    Object.assign(dictDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDictDataFormSubmit = async () => {
  await dictDataFormRef.value.validate()
  loading.value = true
  const id = dictDataForm.value.id
  try {
    id ? await editDict(id, dictDataForm.value) : await addDict(dictDataForm.value)
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
    :title="!dictDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dictDataForm"
      :rules="rules"
      ref="dictDataFormRef"
      @keyup.enter="handleDictDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('dict.fields.dictName')" prop="dictName">
        <el-input
          v-model="dictDataForm.dictName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('dict.fields.dictName')"
        />
      </el-form-item>

      <el-form-item :label="t('dict.fields.dictCode')" prop="dictCode">
        <el-input
          v-model="dictDataForm.dictCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('dict.fields.dictCode')"
        />
      </el-form-item>

      <el-form-item :label="t('dict.fields.status')" prop="status">
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
      <el-button type="primary" :loading="loading" @click="handleDictDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
