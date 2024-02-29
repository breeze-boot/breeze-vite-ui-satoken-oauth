<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 权限添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addPermission, getPermission, editPermission, checkPermissionCode } from '@/api/auth/permission'
import { PermissionRecord } from '@/api/auth/permission/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'PermissionAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const permissionDataFormRef = ref()
const permissionDataForm = ref<PermissionRecord>({})
const rules = ref({
  permissionCode: [
    {
      required: true,
      message: t('permission.rules.permissionCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkPermissionCode(
          value,
          !permissionDataForm.value.id ? undefined : JSONBigInt.parse(permissionDataForm.value.id),
        ).then((response: any) => {
          if (response.data) {
            callback()
            return
          }
          callback(new Error(t('permission.rules.permissionCodeExists')))
        })
      },
      trigger: 'blur',
    },
  ],
  permissionName: [
    {
      required: true,
      message: t('permission.rules.permissionName'),
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
  visible.value = true
  permissionDataForm.value.id = undefined
  // 重置表单数据
  if (permissionDataFormRef.value) {
    permissionDataFormRef.value.resetFields()
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
  const response: any = await getPermission(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(permissionDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handlePermissionDataFormSubmit = () => {
  permissionDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = permissionDataForm.value.id
    if (id) {
      editPermission(permissionDataForm.value)
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
      addPermission(permissionDataForm.value)
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
    :title="!permissionDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="permissionDataForm"
      :rules="rules"
      ref="permissionDataFormRef"
      @keyup.enter="handlePermissionDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('permission.fields.permissionCode')" prop="permissionCode">
        <el-input
          v-model="permissionDataForm.permissionCode"
          autocomplete="off"
          clearable
          :placeholder="$t('permission.fields.permissionCode')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('permission.fields.permissionName')" prop="permissionName">
        <el-input
          v-model="permissionDataForm.permissionName"
          autocomplete="off"
          clearable
          :placeholder="$t('permission.fields.permissionName')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handlePermissionDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
