<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 角色添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addRole, getRole, editRole, checkRoleCode } from '@/api/auth/role'
import { RoleRecord } from '@/api/auth/role/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const roleDataFormRef = ref()
const roleDataForm = ref<RoleRecord>({})
const rules = ref({
  roleCode: [
    {
      required: true,
      message: t('role.rules.roleCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkRoleCode(value, !roleDataForm.value.id ? undefined : JSONBigInt.parse(roleDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('role.rules.roleCodeExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
  roleName: [
    {
      required: true,
      message: t('role.rules.roleName'),
      trigger: 'blur',
    },
  ],
})

const init = async (id: number) => {
  visible.value = true
  roleDataForm.value.id = undefined
  // 重置表单数据
  if (roleDataFormRef.value) {
    roleDataFormRef.value.resetFields()
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
  const response: any = await getRole(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(roleDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleRoleDataFormSubmit = () => {
  roleDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const bankId = roleDataForm.value.id
    if (bankId) {
      editRole(roleDataForm.value)
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
      addRole(roleDataForm.value)
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
    :title="!roleDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="roleDataForm"
      :rules="rules"
      ref="roleDataFormRef"
      @keyup.enter="handleRoleDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('role.fields.roleCode')" prop="roleCode">
        <el-input
          v-model="roleDataForm.roleCode"
          autocomplete="off"
          clearable
          :placeholder="$t('role.fields.roleCode')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('role.fields.roleName')" prop="roleName">
        <el-input
          v-model="roleDataForm.roleName"
          autocomplete="off"
          clearable
          :placeholder="$t('role.fields.roleName')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleRoleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
