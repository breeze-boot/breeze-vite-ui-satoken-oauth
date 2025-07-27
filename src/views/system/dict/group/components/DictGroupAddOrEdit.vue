<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->

<!-- 字典分组添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addSysDictGroup, getSysDictGroup, editSysDictGroup } from '@/api/system/dict/group'
import type { DictGroupForm } from '@/api/system/dict/group/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DictGroupAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const dictGroupDataFormRef = ref()
const dictGroupDataForm = ref<DictGroupForm>({
  id: 0,
  groupName: '',
  groupCode: '',
  status: 0,
})
const rules = ref({
  groupName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dictGroup.fields.groupName'),
      trigger: 'blur',
    },
  ],
  groupCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dictGroup.fields.groupCode'),
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dictGroup.fields.status'),
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
  dictGroupDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (dictGroupDataFormRef.value) {
    dictGroupDataFormRef.value.resetFields()
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
    const response: any = await getSysDictGroup(JSONBigInt.parse(id))
    Object.assign(dictGroupDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await dictGroupDataFormRef.value.validate()
  loading.value = true
  const id = dictGroupDataForm.value.id
  try {
    id ? await editSysDictGroup(id, dictGroupDataForm.value) : await addSysDictGroup(dictGroupDataForm.value)
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
    :title="!dictGroupDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dictGroupDataForm"
      :rules="rules"
      ref="dictGroupDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="100px"
    >
      <el-form-item :label="t('dictGroup.fields.groupName')" prop="groupName">
        <el-input
          v-model="dictGroupDataForm.groupName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('dictGroup.fields.groupName')"
        />
      </el-form-item>

      <el-form-item :label="t('dictGroup.fields.groupCode')" prop="groupCode">
        <el-input
          v-model="dictGroupDataForm.groupCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('dictGroup.fields.groupCode')"
        />
      </el-form-item>

      <el-form-item :label="t('dictGroup.fields.status')" prop="status">
        <el-input
          v-model="dictGroupDataForm.status"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('dictGroup.fields.status')"
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
