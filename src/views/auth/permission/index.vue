<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 权限管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { page, exportExcel, deletePermission } from '@/api/auth/permission'
import AddOrUpdate from './components/PermissionAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { PermissionRecords } from '@/api/auth/permission/type.ts'
import { PermissionRecord, PermissionQuery } from '@/api/auth/permission/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Permission',
  inheritAttrs: false,
})

const { t } = useI18n()
const permissionQueryFormRef = ref(ElForm)
const permissionAddOrUpdateRef = ref()

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
})

/**
 * 查询条件
 */
const queryParams = reactive<PermissionQuery>({
  endTime: '',
  permissionCode: '',
  permissionName: '',
  isLock: '',
  startTime: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<PermissionRecords>([])
let currentRows = reactive<PermissionRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: [],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:permission:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:permission:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:permission:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:permission:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'permissionName',
      showOverflowTooltip: true,
      label: t('permission.fields.permissionName'),
    },
    {
      prop: 'permissionCode',
      showOverflowTooltip: true,
      label: t('permission.fields.permissionCode'),
    },
    {
      prop: 'permissions',
      showOverflowTooltip: true,
      label: t('permission.fields.permissions'),
      type: 'tag',
    },
    {
      prop: 'createName',
      showOverflowTooltip: true,
      label: t('permission.fields.createName'),
    },
  ],
  handleBtn: {
    minWidth: 400,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 编辑
      {
        label: t('common.edit'),
        type: 'success',
        icon: 'edit',
        event: 'edit',
        permission: ['auth:permission:modify'],
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:permission:info'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:permission:delete'],
      },
    ],
  },
})

/**
 * 刷新表格
 */
const reloadList = () => {
  tableInfo.refresh = Math.random()
}

/**
 * 重置查询
 */
const resetQuery = () => {
  permissionQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
}

/**
 * 添加或者修改
 *
 * @param id 主键
 */
const addOrUpdateHandle = (id?: number) => {
  permissionAddOrUpdateRef.value.init(id)
}

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  switch (event) {
    case 'edit':
      handleUpdate(row)
      break
    case 'view':
      handleView(row)
      break
    case 'delete':
      handleDelete([row])
      break
    default:
      break
  }
}

/**
 * 表格组件头部按钮事件分发
 *
 * @param event 事件
 * @param rows  行数据
 */
const handleTableHeaderBtnClick = (event: string, rows: any) => {
  switch (event) {
    case 'add':
      handleAdd()
      break
    case 'del':
      handleDelete(rows)
      break
    default:
      break
  }
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleView = (row: any) => {
  console.log(row)
}

/**
 * 添加
 */
const handleAdd = () => {
  addOrUpdateHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: PermissionRecords) => {
  const permissionIds = rows.map((item: any) => item.id)
  await deletePermission(permissionIds)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: any) => {
  addOrUpdateHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: PermissionRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: PermissionRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="permissionQueryFormRef" :model="queryParams" :inline="true">
      <!-- 权限编码 -->
      <el-form-item :label="t('permission.fields.permissionCode')" prop="permissionCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('permission.fields.permissionCode')"
          v-model="queryParams.permissionCode"
        />
      </el-form-item>

      <!-- 权限名称 -->
      <el-form-item :label="t('permission.fields.permissionName')" prop="permissionName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('permission.fields.permissionName')"
          v-model="queryParams.permissionName"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">
          {{ $t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ $t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="permissionTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :dict="tableInfo.dict"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @handle-table-row-btn-click="handleTableRowBtnClick"
    @handle-table-header-btn-click="handleTableHeaderBtnClick"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-update ref="permissionAddOrUpdateRef" @reload-data-list="reloadList" />
</template>
