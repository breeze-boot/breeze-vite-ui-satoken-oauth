<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 权限添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addPermission, getPermission, editPermission, checkPermissionCode } from '@/api/auth/permission'
import { PermissionForm } from '@/api/auth/permission/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { selectDept } from '@/api/auth/dept'
import { listUser } from '@/api/auth/user'
import { UserRecord } from '@/api/auth/user/type.ts'
import { Option, SelectData } from '@/types/types.ts'

defineOptions({
  name: 'PermissionAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const permissionDataFormRef = ref()
const permissionDataForm = ref<PermissionForm>({
  customizesType: 'USER',
})
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
  permissions: [
    {
      required: true,
      message: t('permission.rules.permissions'),
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
  permissionDataForm.value.id = undefined
  // 重置表单数据
  if (permissionDataFormRef.value) {
    permissionDataFormRef.value.resetFields()
  }
  await initUserTransferData()
  await initDeptTransferData()
  if (id) {
    await getInfo(id)
  }
  visible.value = true
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
  permissionDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = permissionDataForm.value.id
    if (id) {
      await editPermission(id, permissionDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addPermission(permissionDataForm.value)
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

const initDeptTransferData = async () => {
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
    :title="!permissionDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <el-form
      style="height: 550px; padding-bottom: 200px"
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
      <el-form-item label-width="125px" :label="$t('permission.fields.customizesType')" prop="customizesType">
        <el-radio-group v-model="permissionDataForm.customizesType">
          <el-radio value="USER" border>{{ $t('permission.fields.user') }}</el-radio>
          <el-radio value="DEPT" border>{{ $t('permission.fields.dept') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="permissionDataForm.customizesType === 'USER'"
        label-width="125px"
        :label="t('permission.fields.user')"
      >
        <el-transfer
          :titles="['待选择用户列表', '已选择用户列表']"
          v-model="permissionDataForm.permissions"
          filterable
          :filter-method="filterMethod"
          filter-placeholder=""
          :data="userList"
        />
      </el-form-item>

      <el-form-item
        v-if="permissionDataForm.customizesType === 'DEPT'"
        label-width="125px"
        :label="t('permission.fields.dept')"
      >
        <el-cascader
          tag-type="info"
          v-model="permissionDataForm.permissions"
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
