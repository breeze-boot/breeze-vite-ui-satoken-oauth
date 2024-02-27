<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 租户添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addTenant, getTenant, editTenant, checkTenantCode } from '@/api/auth/tenant'
import { TenantRecord } from '@/api/auth/tenant/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const tenantDataFormRef = ref()
const tenantDataForm = ref<TenantRecord>({})
const rules = ref({
  tenantCode: [
    {
      required: true,
      message: t('tenant.rules.tenantCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkTenantCode(value, !tenantDataForm.value.id ? undefined : JSONBigInt.parse(tenantDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('tenant.rules.tenantCodeExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
  tenantName: [
    {
      required: true,
      message: t('tenant.rules.tenantName'),
      trigger: 'blur',
    },
  ],
})

const init = async (id: number) => {
  visible.value = true
  tenantDataForm.value.id = undefined
  // 重置表单数据
  if (tenantDataFormRef.value) {
    tenantDataFormRef.value.resetFields()
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
  const response: any = await getTenant(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(tenantDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleTenantDataFormSubmit = () => {
  tenantDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const bankId = tenantDataForm.value.id
    if (bankId) {
      editTenant(tenantDataForm.value)
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
      addTenant(tenantDataForm.value)
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
    :title="!tenantDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="tenantDataForm"
      :rules="rules"
      ref="tenantDataFormRef"
      @keyup.enter="handleTenantDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('tenant.fields.tenantCode')" prop="tenantCode">
        <el-input
          v-model="tenantDataForm.tenantCode"
          autocomplete="off"
          clearable
          :placeholder="$t('tenant.fields.tenantCode')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('tenant.fields.tenantName')" prop="tenantName">
        <el-input
          v-model="tenantDataForm.tenantName"
          autocomplete="off"
          clearable
          :placeholder="$t('tenant.fields.tenantName')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleTenantDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
