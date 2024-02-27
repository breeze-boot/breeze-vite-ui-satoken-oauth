<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 客户端添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addClient, getClient, editClient, checkClientCode } from '@/api/auth/client'
import { ClientRecord } from '@/api/auth/client/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const clientDataFormRef = ref()
const clientDataForm = ref<ClientRecord>({})
const rules = ref({
  clientCode: [
    {
      required: true,
      message: t('client.rules.clientCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkClientCode(value, !clientDataForm.value.id ? undefined : JSONBigInt.parse(clientDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('client.rules.clientCodeExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
  clientName: [
    {
      required: true,
      message: t('client.rules.clientName'),
      trigger: 'blur',
    },
  ],
})

const init = async (id: number) => {
  visible.value = true
  clientDataForm.value.id = undefined
  // 重置表单数据
  if (clientDataFormRef.value) {
    clientDataFormRef.value.resetFields()
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
  const response: any = await getClient(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(clientDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleClientDataFormSubmit = () => {
  clientDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const bankId = clientDataForm.value.id
    if (bankId) {
      editClient(clientDataForm.value)
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
      addClient(clientDataForm.value)
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
    :title="!clientDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="clientDataForm"
      :rules="rules"
      ref="clientDataFormRef"
      @keyup.enter="handleClientDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('client.fields.clientName')" prop="clientName">
        <el-input
          v-model="clientDataForm.clientName"
          autocomplete="off"
          clearable
          :placeholder="$t('client.fields.clientName')"
        />
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('client.fields.clientCode')" prop="clientCode">
        <el-input
          v-model="clientDataForm.clientCode"
          autocomplete="off"
          clearable
          :placeholder="$t('client.fields.clientCode')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleClientDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
