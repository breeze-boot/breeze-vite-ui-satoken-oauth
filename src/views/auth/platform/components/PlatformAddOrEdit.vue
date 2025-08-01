<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 平台添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addPlatform, getPlatform, editPlatform, checkPlatformCode } from '@/api/auth/platform'
import type { PlatformForm } from '@/api/auth/platform/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'PlatformAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const platformDataFormRef = ref()
const platformDataForm = ref<PlatformForm>({})
const rules = ref({
  platformName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('platform.fields.platformName'),
      trigger: 'blur',
    },
  ],
  platformCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('platform.fields.platformCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkPlatformCode(
          value,
          !platformDataForm.value.id ? undefined : JSONBigInt.parse(platformDataForm.value.id),
        ).then((response: any) => {
          if (response.data) {
            callback()
            return
          }
          callback(new Error(t('platform.rules.platformCodeExists')))
        })
      },
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
  platformDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (platformDataFormRef.value) {
    platformDataFormRef.value.resetFields()
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
    const response: any = await getPlatform(JSONBigInt.parse(id))
    Object.assign(platformDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await platformDataFormRef.value.validate()
  loading.value = true
  const id = platformDataForm.value.id
  try {
    id ? await editPlatform(id, platformDataForm.value) : await addPlatform(platformDataForm.value)
    $message.success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
    visible.value = false
    loading.value = false
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!platformDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="platformDataForm"
      :rules="rules"
      ref="platformDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('platform.fields.platformName')" prop="platformName">
        <el-input
          v-model="platformDataForm.platformName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('platform.fields.platformName')"
        />
      </el-form-item>
      <el-form-item :label="t('platform.fields.platformCode')" prop="platformCode">
        <el-input
          v-model="platformDataForm.platformCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('platform.fields.platformCode')"
        />
      </el-form-item>
      <el-form-item :label="t('platform.fields.description')" prop="description">
        <el-input v-model="platformDataForm.description" autocomplete="off" clearable type="textarea" />
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
