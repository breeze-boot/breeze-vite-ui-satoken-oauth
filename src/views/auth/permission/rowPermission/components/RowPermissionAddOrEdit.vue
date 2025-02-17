<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 权限添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addPermission, getPermission, editPermission, checkPermissionCode } from '@/api/auth/permission/rowPermission'
import { RowPermissionForm } from '@/api/auth/permission/rowPermission/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/auth/dept'
import { listDeptUser } from '@/api/auth/user'
import { UserRecord } from '@/api/auth/user/type.ts'
import { Option, SelectData } from '@/types/types.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'RowPermissionAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const rowPermissionDataFormRef = ref()
const rowPermissionDataForm = ref<RowPermissionForm>({ permissions: [] })
const deptOption = ref<SelectData[]>()
const userList = ref<Option[]>()
const cascaderProps = {
  checkStrictly: true,
  emitPath: false,
  multiple: true,
  value: 'value',
  label: 'label',
}

const rules = ref({
  permissionCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('rowPermission.fields.permissionCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkPermissionCode(
          value,
          !rowPermissionDataForm.value.id ? undefined : JSONBigInt.parse(rowPermissionDataForm.value.id),
        ).then((response: any) => {
          if (response.data) {
            callback()
            return
          }
          callback(new Error(t('rowPermission.rules.permissionCodeExists')))
        })
      },
      trigger: 'blur',
    },
  ],
  permissionName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('rowPermission.fields.permissionName'),
      trigger: 'blur',
    },
  ],
  permissions: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('rowPermission.fields.permissions'),
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
  rowPermissionDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (rowPermissionDataFormRef.value) {
    rowPermissionDataFormRef.value.resetFields()
  }
  await initUserTransferData()
  await initDeptSelectData()
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
    const response: any = await getPermission(JSONBigInt.parse(id))
    Object.assign(rowPermissionDataForm.value, response.data)
    if (rowPermissionDataForm.value.customizesType === 'USER') {
      rowPermissionDataForm.value.permissions = rowPermissionDataForm.value.permissions?.filter((per: number) =>
        userList.value?.some((user: Option) => user.key === per),
      )
    }
  } catch (e: any) {
    console.error(e.message)
  }
}

/**
 * 表单提交
 */
const handlePermissionDataFormSubmit = async () => {
  await rowPermissionDataFormRef.value.validate()
  loading.value = true
  const id = rowPermissionDataForm.value.id
  try {
    id ? await editPermission(id, rowPermissionDataForm.value) : await addPermission(rowPermissionDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(err.message)
  } finally {
    visible.value = false
    loading.value = false
  }
}

const initDeptSelectData = async () => {
  try {
    const response: any = await selectDept()
    deptOption.value = response.data
  } catch (e: any) {
    console.error(e.message)
  }
}

const initUserTransferData = async () => {
  try {
    const response: any = await listDeptUser()
    const data: Option[] = []
    response.data.forEach((user: UserRecord) => {
      data.push({
        label: user.username as string,
        key: user.id as number,
        initial: user.userCode as string,
      })
    })
    userList.value = data
  } catch (e: any) {
    console.error(e.message)
  }
}

const filterMethod = (query: string, item: Option) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="40%"
    :title="!rowPermissionDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <el-form
      style="padding-bottom: 10px"
      :model="rowPermissionDataForm"
      :rules="rules"
      ref="rowPermissionDataFormRef"
      @keyup.enter="handlePermissionDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('rowPermission.fields.permissionCode')" prop="permissionCode">
        <el-input
          v-model="rowPermissionDataForm.permissionCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('rowPermission.fields.permissionCode')"
        />
      </el-form-item>
      <el-form-item :label="t('rowPermission.fields.permissionName')" prop="permissionName">
        <el-input
          v-model="rowPermissionDataForm.permissionName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('rowPermission.fields.permissionName')"
        />
      </el-form-item>
      <el-form-item :label="t('rowPermission.fields.customizesType')" prop="customizesType">
        <el-radio-group v-model="rowPermissionDataForm.customizesType">
          <el-radio value="USER" border>{{ t('rowPermission.fields.user') }}</el-radio>
          <el-radio value="DEPT" border>{{ t('rowPermission.fields.dept') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="text-align: center" v-if="rowPermissionDataForm.customizesType === 'USER'">
        <el-transfer
          :titles="['待选择用户列表', '已选择用户列表']"
          v-model="rowPermissionDataForm.permissions"
          filterable
          :filter-method="filterMethod"
          filter-placeholder=""
          :data="userList"
        />
      </el-form-item>

      <el-form-item v-if="rowPermissionDataForm.customizesType === 'DEPT'">
        <el-cascader
          tag-type="info"
          v-model="rowPermissionDataForm.permissions"
          :options="deptOption"
          :props="cascaderProps"
          :show-all-levels="false"
          clearable
          filterable
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
      <el-button type="primary" :loading="loading" @click="handlePermissionDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
