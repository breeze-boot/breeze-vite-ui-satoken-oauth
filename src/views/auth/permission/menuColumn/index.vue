<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 权限管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteMenuColumn } from '@/api/auth/permission/menuColumn'
import { ElForm } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import type { MenuColumnRecords } from '@/api/auth/permission/menuColumn/type.ts'
import { MenuColumnRecord, MenuColumnQuery } from '@/api/auth/permission/menuColumn/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'MenuColumn',
  inheritAttrs: false,
})

const { t } = useI18n()
const menuColumnQueryFormRef = ref(ElForm)

/**
 * 查询条件
 */
const queryParams = reactive<MenuColumnQuery>({
  menu: '',
  column: '',
  current: 1,
  size: 10,
})

let checkedColumns = reactive<MenuColumnRecords>([])
let currentColumns = reactive<MenuColumnRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:menuColumn:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: MenuColumnRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:menuColumn:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:menuColumn:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'menu',
      showOverflowTooltip: true,
      label: t('menuColumn.fields.menu'),
    },
    {
      prop: 'column',
      showOverflowTooltip: true,
      label: t('menuColumn.fields.column'),
    },
  ],
  handleBtn: {
    minWidth: 210,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:menuColumn:info'],
        eventHandle: (row: MenuColumnRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:menuColumn:delete'],
        eventHandle: (row: MenuColumnRecord) => handleDelete([row] as MenuColumnRecords),
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
  menuColumnQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
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
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: MenuColumnRecords) => {
  try {
    const permissionIds = rows.map((item: any) => item.id)
    await deleteMenuColumn(permissionIds)
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 选中行，设置当前行currentColumn
 *
 * @param row 选择的行数据
 */
function handleColumnClick(row: MenuColumnRecord) {
  currentColumns = [row]
  console.log(currentColumns)
}

/**
 * 选中行，设置当前行currentColumn
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MenuColumnRecords) => {
  currentColumns = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="menuColumnQueryFormRef" :model="queryParams" :inline="true">
      <!-- 菜单编码 -->
      <el-form-item :label="t('menuColumn.fields.menu')" prop="menu">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('menuColumn.fields.menu')"
          v-model="queryParams.menu"
        />
      </el-form-item>

      <!-- 列 -->
      <el-form-item :label="t('menuColumn.fields.column')" prop="column">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('menuColumn.fields.column')"
          v-model="queryParams.column"
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
    :export-api="exportExcel"
    :list-api="page"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedColumns"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleColumnClick"
  />
</template>
