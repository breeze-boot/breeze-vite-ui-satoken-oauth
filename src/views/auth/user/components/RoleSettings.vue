<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 用户角色配置抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { page } from '@/api/auth/role'
import { TableInfo } from '@/components/Table/types/types.ts'
import { RoleQuery, RoleRecord, RoleRecords } from '@/api/auth/role/type.ts'

const direction = ref('rtl')
const { t } = useI18n()
const visible = ref(false)
const roleTableRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<RoleQuery>({
  roleCode: '',
  roleName: '',
  current: 1,
  size: 10,
})
const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  mountedRefresh: true,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 字典
  dict: [],
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
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  console.log(row)
  switch (event) {
    case 'edit':
      break
    default:
      break
  }
}

const init = async (id: number) => {
  visible.value = true
  if (id) {
    await getInfo(id)
  }
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param id 初始化用户的角色
 */
const getInfo = async (id: number) => {
  console.log(id)
  tableInfo.refresh = Math.random()
}

let currentRows = reactive<RoleRecords>([])

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: RoleRecords) => {
  currentRows = rows
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: RoleRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 表单提交
 */
const handleUserRoleSettingsDataFormSubmit = () => {}
const handleClose = (done: () => void) => {
  done()
}

defineExpose({
  init,
})
</script>

<template>
  <el-drawer
    width="80%"
    v-model="visible"
    :title="t('user.commons.roleSettings')"
    :direction="direction"
    :before-close="handleClose"
  >
    <template #header>
      <h4>{{ $t('user.commons.roleSettings') }}</h4>
    </template>
    <template #default>
      <b-table
        ref="roleTableRef"
        :list-api="page"
        :dict="tableInfo.dict"
        :tableIndex="tableInfo.tableIndex"
        :query="queryParams"
        :refresh="tableInfo.refresh"
        :mountedRefresh="tableInfo.mountedRefresh"
        :field-list="tableInfo.fieldList"
        :select="tableInfo.select"
        :handle-btn="tableInfo.handleBtn"
        @handle-table-row-btn-click="handleTableRowBtnClick"
        @selection-change="handleSelectionChange"
        @handle-row-click="handleRowClick"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleUserRoleSettingsDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>
