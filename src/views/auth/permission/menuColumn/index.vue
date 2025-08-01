<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 权限管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, deleteMenuColumn } from '@/api/auth/permission/menuColumn'
import { ElForm } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import type { MenuColumnRecords } from '@/api/auth/permission/menuColumn/type.ts'
import { MenuColumnRecord, MenuColumnQuery } from '@/api/auth/permission/menuColumn/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'MenuColumn',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const menuColumnQueryFormRef = ref(ElForm)

/**
 * 查询条件
 */
const queryParams = reactive<MenuColumnQuery>({
  menu: '',
  column: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<MenuColumnRecords>([])
let currentRows = reactive<MenuColumnRecords>([])
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'

const tableInfo = reactive<TableInfo>({
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
  refresh.value = Math.random()
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
    $message.success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 选中行，设置当前行currentColumn
 *
 * @param row 选择的行数据
 */
const handleMenuColumnRowClick = (row: MenuColumnRecord) => {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentColumn
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MenuColumnRecords) => {
  currentRows = rows
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
    :refresh="refresh"
    :select="select"
    :list-api="page"
    v-model:loading="tableLoading"
    :tableIndex="tableIndex"
    :query="queryParams"
    :dict="tableInfo.dict"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleMenuColumnRowClick"
  />
</template>
