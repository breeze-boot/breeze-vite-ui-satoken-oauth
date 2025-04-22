<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 用户角色配置抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { listUserRoles } from '@/api/auth/role'
import RoleCheckDialog from './RoleCheckDialog.vue'
import BTable from '@/components/Table/BTable/index.vue'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { RoleRecords } from '@/api/auth/role/type.ts'
import JSONBigInt from 'json-bigint'
import { userSetRole } from '@/api/auth/user'
import { UserSetRoleForm, UserRoleQuery } from '@/api/auth/user/type.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'RoleSettings',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref<boolean>(false)
const roleDialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const roleCheckDialogRef = ref()
const userRoleTableRef = ref()
const userSetRoleDataForm = ref<UserSetRoleForm>({ userId: 0, roleIds: [] })

/**
 * 查询条件
 */
const queryParams = reactive<UserRoleQuery>({
  userId: 0,
  roleCode: '',
  roleName: '',
  current: 1,
  size: 10,
  total: 0,
})
const tableData = ref<RoleRecords>([])
const checkedRows = ref<RoleRecords>([])

// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo = reactive<TableInfo>({
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'roleName',
      showOverflowTooltip: true,
      label: t('role.fields.roleName'),
    },
    {
      prop: 'roleCode',
      showOverflowTooltip: true,
      label: t('role.fields.roleCode'),
    },
  ],
})

/**
 * 添加
 */
const handleAdd = () => {
  roleDialogVisible.value = true
}

/**
 * 选择角色，并实现去重添加到tableData.value
 */
const handleCheckRole = (row: RoleRecords) => {
  const existingRoles = new Set(tableData.value.map((role) => role.id))
  const uniqueRoles = row.filter((role) => !existingRoles.has(role.id))
  tableData.value.push(...uniqueRoles)
}

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  if (id) {
    userSetRoleDataForm.value.userId = id
    queryParams.userId = id
    await getInfo(id)
  }
  visible.value = true
}

/**
 * 初始化用户的角色
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await listUserRoles(JSONBigInt.parse(id))
    tableData.value = response.data
    refresh.value = Math.random()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 表单提交
 */
const handleUserRoleSettingsDataFormSubmit = async () => {
  loading.value = true
  userSetRoleDataForm.value.roleIds = tableData.value.map((item: any) => item.id)
  try {
    await userSetRole(userSetRoleDataForm.value)
    useMessage().success(`${t('common.success')}`)
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
    :title="t('user.common.roleSettings')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <b-table
      ref="userRoleTableRef"
      :pager="false"
      :select="select"
      :refresh="refresh"
      v-model:modelValue="tableData"
      :tableIndex="tableIndex"
      :query="queryParams"
      :field-list="tableInfo.fieldList"
      :tb-header-btn="tableInfo.tbHeaderBtn"
      :handle-btn="tableInfo.handleBtn"
      :checked-rows="checkedRows"
      table-height="80%"
    />
    <template #footer>
      <div style="flex: auto">
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
        <el-button
          v-has="['auth:user:set:role']"
          type="primary"
          :loading="loading"
          @click="handleUserRoleSettingsDataFormSubmit()"
        >
          {{ t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <role-check-dialog
    ref="roleCheckDialogRef"
    :single="false"
    title="角色列表"
    v-model:modelValue="roleDialogVisible"
    :role-checks="tableData.map((item) => item.id)"
    @updateRoleData="(row: RoleRecords) => handleCheckRole(row)"
  />
</template>
