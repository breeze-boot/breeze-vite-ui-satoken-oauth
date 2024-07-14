<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 平台添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addPlatform, getPlatform, editPlatform, checkPlatformCode } from '@/api/auth/platform'
import type { PlatformForm } from '@/api/auth/platform/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'PlatformAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const platformDataFormRef = ref()
const platformDataForm = ref<PlatformForm>({})
const rules = ref({
  platformName: [
    {
      required: true,
      message: t('platform.rules.platformName'),
      trigger: 'blur',
    },
  ],
  platformCode: [
    {
      required: true,
      message: t('platform.rules.platformCode'),
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
          callback(new Error(t('platform.rules.platformCodeDuplicate')))
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
  // 重置表单数据
  if (platformDataFormRef.value) {
    platformDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
  visible.value = true
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getPlatform(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(platformDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  platformDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = platformDataForm.value.id
    if (id) {
      await editPlatform(id, platformDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addPlatform(platformDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
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
    :title="!platformDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="platformDataForm"
      :rules="rules"
      ref="platformDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="110px" :label="t('platform.fields.platformName')" prop="platformName">
        <el-input v-model="platformDataForm.platformName" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('platform.fields.platformCode')" prop="platformCode">
        <el-input v-model="platformDataForm.platformCode" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('platform.fields.description')" prop="description">
        <el-input v-model="platformDataForm.description" autocomplete="off" clearable type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
