<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 权限管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deletePermission } from '@/api/auth/permission/rowPermission'
import AddOrEdit from './components/RowPermissionAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { ElForm } from 'element-plus'
import type { RowPermissionRecords } from '@/api/auth/permission/rowPermission/type.ts'
import { RowPermissionRecord, RowPermissionQuery } from '@/api/auth/permission/rowPermission/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'RowPermission',
  inheritAttrs: false,
})

const { t } = useI18n()
const rowPermissionQueryFormRef = ref(ElForm)
const rowPermissionAddOrEditRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<RowPermissionQuery>({
  permissionCode: '',
  permissionName: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<RowPermissionRecords>([])
let currentRows = reactive<RowPermissionRecords>([])
const tableLoading = ref<boolean>(false)
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
      permission: ['auth:rowPermission:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:rowPermission:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: RowPermissionRecords) => handleDelete(rows),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'permissionName',
      showOverflowTooltip: true,
      label: t('rowPermission.fields.permissionName'),
    },
    {
      prop: 'permissionCode',
      showOverflowTooltip: true,
      label: t('rowPermission.fields.permissionCode'),
    },
    {
      prop: 'createName',
      showOverflowTooltip: true,
      label: t('rowPermission.fields.createName'),
    },
  ],
  handleBtn: {
    width: 210,
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
        permission: ['auth:rowPermission:modify'],
        eventHandle: (row: RowPermissionRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:rowPermission:info'],
        eventHandle: (row: RowPermissionRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:rowPermission:delete'],
        eventHandle: (row: RowPermissionRecord) => handleDelete([row] as RowPermissionRecords),
      },
    ],
  },
})

/**
 * 刷新表格
 */
const reloadList = () => {
  refresh.value = Math.random()
}

/**
 * 重置查询
 */
const resetQuery = () => {
  rowPermissionQueryFormRef.value.resetFields()
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
const AddOrEditHandle = (id?: number) => {
  rowPermissionAddOrEditRef.value.init(id)
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleInfo = (row: any) => {
  console.log(row)
}

/**
 * 添加
 */
const handleAdd = () => {
  AddOrEditHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: RowPermissionRecords) => {
  try {
    const permissionIds = rows.map((item: any) => item.id)
    await deletePermission(permissionIds)
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}` + err.message)
  }
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: any) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: RowPermissionRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="rowPermissionQueryFormRef" :model="queryParams" :inline="true">
      <!-- 权限编码 -->
      <el-form-item :label="t('rowPermission.fields.permissionCode')" prop="permissionCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('rowPermission.fields.permissionCode')"
          v-model="queryParams.permissionCode"
        />
      </el-form-item>

      <!-- 权限名称 -->
      <el-form-item :label="t('rowPermission.fields.permissionName')" prop="permissionName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('rowPermission.fields.permissionName')"
          v-model="queryParams.permissionName"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">
          {{ t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="permissionTableRef"
    :refresh="refresh"
    :select="select"
    :list-api="page"
    :export-api="exportExcel"
    v-model:loading="tableLoading"
    :tableIndex="tableIndex"
    :query="queryParams"
    :checked-rows="checkedRows"
    :dict="tableInfo.dict"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="rowPermissionAddOrEditRef" @reload-data-list="reloadList" />
</template>
