<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 租户添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addTenant, getTenant, editTenant, checkTenantCode } from '@/api/auth/tenant'
import { TenantForm } from '@/api/auth/tenant/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'TenantAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tenantDataFormRef = ref()
const tenantDataForm = ref<TenantForm>({})
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

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  tenantDataForm.value.id = undefined
  visible.value = true
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
  tenantDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    loading.value = true
    const id = tenantDataForm.value.id
    if (id) {
      await editTenant(id, tenantDataForm.value)
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
      await addTenant(tenantDataForm.value)
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
    width="500"
    :title="!tenantDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="tenantDataForm"
      :rules="rules"
      ref="tenantDataFormRef"
      @keyup.enter="handleTenantDataFormSubmit()"
      label-width="80px"
    >
      <el-form-item :label="$t('tenant.fields.tenantCode')" prop="tenantCode">
        <el-input
          v-model="tenantDataForm.tenantCode"
          autocomplete="off"
          clearable
          :placeholder="$t('tenant.fields.tenantCode')"
        />
      </el-form-item>
      <el-form-item :label="$t('tenant.fields.tenantName')" prop="tenantName">
        <el-input
          v-model="tenantDataForm.tenantName"
          autocomplete="off"
          clearable
          :placeholder="$t('tenant.fields.tenantName')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleTenantDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
