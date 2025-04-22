<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 租户添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addTenant, getTenant, editTenant, checkTenantCode } from '@/api/auth/tenant'
import { TenantForm } from '@/api/auth/tenant/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

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
      message: t('common.placeholder.enter') + t('tenant.fields.tenantCode'),
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
      message: t('common.placeholder.enter') + t('tenant.fields.tenantName'),
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
  try {
    const response: any = await getTenant(JSONBigInt.parse(id))
    Object.assign(tenantDataForm.value, response.data)
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 表单提交
 */
const handleTenantDataFormSubmit = async () => {
  await tenantDataFormRef.value.validate()
  loading.value = true
  const id = tenantDataForm.value.id
  try {
    id ? await editTenant(id, tenantDataForm.value) : await addTenant(tenantDataForm.value)
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
    :title="!tenantDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="tenantDataForm"
      :rules="rules"
      ref="tenantDataFormRef"
      @keyup.enter="handleTenantDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('tenant.fields.tenantCode')" prop="tenantCode">
        <el-input
          v-model="tenantDataForm.tenantCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('tenant.fields.tenantCode')"
        />
      </el-form-item>
      <el-form-item :label="t('tenant.fields.tenantName')" prop="tenantName">
        <el-input
          v-model="tenantDataForm.tenantName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('tenant.fields.tenantName')"
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
      <el-button type="primary" :loading="loading" @click="handleTenantDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
