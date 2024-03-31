<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 角色添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addRole, getRole, editRole, checkRoleCode, selectPermission, selectCustomizePermission } from '@/api/auth/role'
import { RoleRecord } from '@/api/auth/role/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { SelectData } from '@/types/types.ts'

defineOptions({
  name: 'RoleAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const roleDataFormRef = ref()
const roleDataForm = ref<RoleRecord>({})
const permissionOption = ref<SelectData[]>()
const customizePermissionOption = ref<SelectData[]>()
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
  permissionCode: [
    {
      required: true,
      message: t('role.rules.permissionCode'),
      trigger: 'change',
    },
  ],
  permissionIds: [
    {
      required: true,
      message: t('role.rules.permissionIds'),
      trigger: 'change',
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
  roleDataForm.value.id = undefined
  // 重置表单数据
  if (roleDataFormRef.value) {
    roleDataFormRef.value.resetFields()
  }
  await initSelectPermission()
  await initSelectCustomizePermission()
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
 * 初始权限下拉框数据
 */
const initSelectPermission = async () => {
  const response: any = await selectPermission()
  if (response.code === '0000') {
    permissionOption.value = response.data
  }
}

/**
 * 初始化自定义权限下拉框数据
 */
const initSelectCustomizePermission = async () => {
  const response: any = await selectCustomizePermission()
  if (response.code === '0000') {
    customizePermissionOption.value = response.data
  }
}

/**
 * 表单提交
 */
const handleRoleDataFormSubmit = () => {
  roleDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = roleDataForm.value.id
    if (id) {
      await editRole(roleDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addRole(roleDataForm.value)
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
      <el-form-item label-width="125px" :label="$t('role.fields.permissionCode')" prop="permissionCode">
        <el-select v-model="roleDataForm.permissionCode" :placeholder="$t('role.fields.permissionCode')">
          <el-option
            v-for="item in permissionOption"
            :key="item.value"
            :label="item.label"
            :value="item.value.valueOf()"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="roleDataForm.permissionCode === 'CUSTOMIZES'"
        label-width="125px"
        :label="$t('role.fields.permissionIds')"
        prop="permissionIds"
      >
        <el-select multiple v-model="roleDataForm.permissionIds" :placeholder="$t('role.fields.permissionIds')">
          <el-option
            v-for="item in customizePermissionOption"
            :key="item.value"
            :label="item.label"
            :value="item.value.valueOf()"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleRoleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
