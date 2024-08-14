<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 权限添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addPermission, getPermission, editPermission, checkPermissionCode } from '@/api/auth/permission/rowPermission'
import { RowPermissionForm } from '@/api/auth/permission/rowPermission/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/auth/dept'
import { listUser } from '@/api/auth/user'
import { UserRecord } from '@/api/auth/user/type.ts'
import { Option, SelectData } from '@/types/types.ts'

defineOptions({
  name: 'RowPermissionAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
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
      message: t('rowPermission.rules.permissionCode'),
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
      message: t('rowPermission.rules.permissionName'),
      trigger: 'blur',
    },
  ],
  permissions: [
    {
      required: true,
      message: t('rowPermission.rules.permissions'),
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
  const response: any = await getPermission(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(rowPermissionDataForm.value, response.data)
    if (rowPermissionDataForm.value.customizesType === 'USER') {
      rowPermissionDataForm.value.permissions = rowPermissionDataForm.value.permissions?.filter((per: number) =>
        userList.value?.some((user: Option) => user.key === per),
      )
    }
  }
}

/**
 * 表单提交
 */
const handlePermissionDataFormSubmit = () => {
  rowPermissionDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = rowPermissionDataForm.value.id
    if (id) {
      await editPermission(id, rowPermissionDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addPermission(rowPermissionDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    }
  })
}

const initDeptSelectData = async () => {
  const response: any = await selectDept()
  if (response.code === '0000') {
    deptOption.value = response.data
  }
}

const initUserTransferData = async () => {
  const response: any = await listUser()
  const data: Option[] = []
  if (response.code === '0000') {
    response.data.forEach((user: UserRecord) => {
      data.push({
        label: user.username as string,
        key: user.id as number,
        initial: user.userCode as string,
      })
    })
  }
  userList.value = data
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
    width="50%"
    :title="!rowPermissionDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <el-form
      style="height: 550px; padding-bottom: 200px"
      :model="rowPermissionDataForm"
      :rules="rules"
      ref="rowPermissionDataFormRef"
      @keyup.enter="handlePermissionDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('rowPermission.fields.permissionCode')" prop="permissionCode">
        <el-input
          v-model="rowPermissionDataForm.permissionCode"
          autocomplete="off"
          clearable
          :placeholder="$t('rowPermission.fields.permissionCode')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('rowPermission.fields.permissionName')" prop="permissionName">
        <el-input
          v-model="rowPermissionDataForm.permissionName"
          autocomplete="off"
          clearable
          :placeholder="$t('rowPermission.fields.permissionName')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('rowPermission.fields.customizesType')" prop="customizesType">
        <el-radio-group v-model="rowPermissionDataForm.customizesType">
          <el-radio value="USER" border>{{ $t('rowPermission.fields.user') }}</el-radio>
          <el-radio value="DEPT" border>{{ $t('rowPermission.fields.dept') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="rowPermissionDataForm.customizesType === 'USER'"
        label-width="125px"
        :label="t('rowPermission.fields.user')"
      >
        <el-transfer
          :titles="['待选择用户列表', '已选择用户列表']"
          v-model="rowPermissionDataForm.permissions"
          filterable
          :filter-method="filterMethod"
          filter-placeholder=""
          :data="userList"
        />
      </el-form-item>

      <el-form-item
        v-if="rowPermissionDataForm.customizesType === 'DEPT'"
        label-width="125px"
        :label="t('rowPermission.fields.dept')"
      >
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
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handlePermissionDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
