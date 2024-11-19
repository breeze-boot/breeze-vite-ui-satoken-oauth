<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 角色添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import {
  addRole,
  getRole,
  editRole,
  checkRoleCode,
  selectRowPermissionType,
  selectCustomizePermission,
} from '@/api/auth/role'
import { RoleForm } from '@/api/auth/role/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { SelectData } from '@/types/types.ts'
import useWidth from '@/hooks/dialogWidth'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'RoleAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const roleDataFormRef = ref()
const roleDataForm = ref<RoleForm>({})
const permissionOption = ref<SelectData[]>()
const customizeRowPermissionOption = ref<SelectData[]>()
const rules = ref({
  roleCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('role.fields.roleCode'),
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
      message: t('common.placeholder.enter') + t('role.fields.roleName'),
      trigger: 'blur',
    },
  ],
  rowPermissionType: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('role.fields.rowPermissionType'),
      trigger: 'change',
    },
  ],
  rowPermissionIds: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('role.fields.rowPermissionIds'),
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
  roleDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (roleDataFormRef.value) {
    roleDataFormRef.value.resetFields()
  }
  await initSelectRowPermissionType()
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
  try {
    const response: any = await getRole(JSONBigInt.parse(id))
    Object.assign(roleDataForm.value, response.data)
  } catch (e: any) {
    console.error(e.message)
  }
}

/**
 * 初始权限下拉框数据
 */
const initSelectRowPermissionType = async () => {
  try {
    const response: any = await selectRowPermissionType()
    permissionOption.value = response.data
  } catch (e: any) {
    console.error(e.message)
  }
}

/**
 * 初始化自定义行权限下拉框数据
 */
const initSelectCustomizePermission = async () => {
  try {
    const response: any = await selectCustomizePermission()
    customizeRowPermissionOption.value = response.data
  } catch (e: any) {
    console.error(e.message)
  }
}

/**
 * 表单提交
 */
const handleRoleDataFormSubmit = async () => {
  await roleDataFormRef.value.validate()
  loading.value = true
  const id = roleDataForm.value.id
  try {
    id ? await editRole(id, roleDataForm.value) : await addRole(roleDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(err.message)
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
    :width="useWidth()"
    :title="!roleDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="roleDataForm"
      :rules="rules"
      ref="roleDataFormRef"
      @keyup.enter="handleRoleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('role.fields.roleCode')" prop="roleCode">
        <el-input
          v-model="roleDataForm.roleCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('role.fields.roleCode')"
        />
      </el-form-item>
      <el-form-item :label="t('role.fields.roleName')" prop="roleName">
        <el-input
          v-model="roleDataForm.roleName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('role.fields.roleName')"
        />
      </el-form-item>
      <el-form-item :label="t('role.fields.rowPermissionType')" prop="rowPermissionType">
        <el-select
          v-model="roleDataForm.rowPermissionType"
          :placeholder="t('common.placeholder.choose') + t('role.fields.rowPermissionType')"
        >
          <el-option
            v-for="item in permissionOption"
            :key="item.value"
            :label="item.label"
            :value="item.value.valueOf()"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="roleDataForm.rowPermissionType === 'CUSTOMIZES'"
        :label="t('role.fields.rowPermissionIds')"
        prop="rowPermissionIds"
      >
        <el-select
          multiple
          v-model="roleDataForm.rowPermissionIds"
          :placeholder="t('common.placeholder.choose') + t('role.fields.rowPermissionIds')"
        >
          <el-option
            v-for="item in customizeRowPermissionOption"
            :key="item.value"
            :label="item.label"
            :value="item.value.valueOf()"
          />
        </el-select>
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
      <el-button type="primary" :loading="loading" @click="handleRoleDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
