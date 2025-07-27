<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->

<!-- 系统参数分类表添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addSysConfigCateg, getSysConfigCateg, editSysConfigCateg } from '@/api/system/config/categ'
import type { SysConfigCategForm } from '@/api/system/config/categ/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'ConfigCategAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const configCategDataFormRef = ref()
const configCategDataForm = ref<SysConfigCategForm>({
  id: '',
  categCode: '',
  categName: '',
  description: '',
})
const rules = ref({
  categCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('configCatg.fields.categCode'),
      trigger: 'blur',
    },
  ],
  categName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('configCatg.fields.categName'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('configCatg.fields.description'),
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
  configCategDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (configCategDataFormRef.value) {
    configCategDataFormRef.value.resetFields()
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
    const response: any = await getSysConfigCateg(JSONBigInt.parse(id))
    Object.assign(configCategDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await configCategDataFormRef.value.validate()
  loading.value = true
  const id = configCategDataForm.value.id
  try {
    id ? await editSysConfigCateg(id, configCategDataForm.value) : await addSysConfigCateg(configCategDataForm.value)
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
    :title="!configCategDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="configCategDataForm"
      :rules="rules"
      ref="configCategDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('configCatg.fields.categCode')" prop="categCode">
        <el-input
          v-model="configCategDataForm.categCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('configCatg.fields.categCode')"
        />
      </el-form-item>

      <el-form-item :label="t('configCatg.fields.categName')" prop="categName">
        <el-input
          v-model="configCategDataForm.categName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('configCatg.fields.categName')"
        />
      </el-form-item>

      <el-form-item :label="t('configCatg.fields.description')" prop="description">
        <el-input
          v-model="configCategDataForm.description"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('configCatg.fields.description')"
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
