<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 菜单管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { list, exportExcel, deleteMenu } from '@/api/auth/menu'
import AddOrUpdate from './components/MenuAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { MenuRecords } from '@/api/auth/menu/type.ts'
import { MenuRecord, MenuQuery } from '@/api/auth/menu/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { DIALOG_FLAG } from '@/utils/common.ts'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'Menus',
  inheritAttrs: false,
})

const { t } = useI18n()
const menuQueryFormRef = ref(ElForm)
const menuAddOrUpdateRef = ref()

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
})

// 查询条件
const queryParams = reactive<MenuQuery>({
  title: '',
  name: '',
})

let checkedRows = reactive<MenuRecords>([])
let currentRows = reactive<MenuRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 字典
  dict: [],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:menu:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:menu:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:menu:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      width: '150px',
      prop: 'title',
      showOverflowTooltip: true,
      label: t('menu.fields.title'),
    },
    {
      prop: 'name',
      showOverflowTooltip: true,
      label: t('menu.fields.name'),
    },
    {
      prop: 'sort',
      showOverflowTooltip: true,
      label: t('menu.fields.sort'),
    },
    {
      width: '70px',
      align: 'center',
      prop: 'icon',
      showOverflowTooltip: true,
      label: t('menu.fields.icon'),
      type: 'icon',
    },
    {
      width: '150px',
      prop: 'permission',
      showOverflowTooltip: true,
      label: t('menu.fields.permission'),
    },
    {
      width: '100px',
      prop: 'path',
      showOverflowTooltip: true,
      label: t('menu.fields.path'),
    },
    {
      width: '150px',
      prop: 'component',
      showOverflowTooltip: true,
      label: t('menu.fields.component'),
    },
    {
      width: '100px',
      prop: 'hidden',
      showOverflowTooltip: true,
      label: t('menu.fields.hidden'),
    },
    {
      width: '100px',
      prop: 'type',
      showOverflowTooltip: true,
      label: t('menu.fields.type'),
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
        permission: ['auth:menu:modify'],
      },
      // 添加子级
      {
        label: t('common.addSubLevel'),
        type: 'warning',
        icon: 'add',
        event: 'add',
        permission: ['auth:menu:create'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:menu:delete'],
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
  menuQueryFormRef.value.resetFields()
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
 * @param id     主键
 * @param flag   标识
 */
const addOrUpdateHandle = (id?: number, flag?: DIALOG_FLAG) => {
  menuAddOrUpdateRef.value.init(id, flag)
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
      handleDelete(row)
      break
    case 'add':
      handleAdd(row.id, DIALOG_FLAG.ADD_SUB)
      break
    default:
      break
  }
}

/**
 * 表格组件头部按钮事件分发
 *
 * @param event 事件
 */
const handleTableHeaderBtnClick = (event: string) => {
  switch (event) {
    case 'add':
      handleAdd(undefined, DIALOG_FLAG.ADD)
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
const handleAdd = (id: number | undefined, flag: DIALOG_FLAG) => {
  addOrUpdateHandle(id, flag)
}

/**
 * 删除
 *
 * @param row 行数据
 */
const handleDelete = async (row: MenuRecord) => {
  await deleteMenu(JSONBigInt.parse(row.id))
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
  addOrUpdateHandle(row.id, DIALOG_FLAG.EDIT)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: MenuRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MenuRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="menuQueryFormRef" :model="queryParams" :inline="true">
      <!-- 菜单名 -->
      <el-form-item :label="t('menu.fields.name')" prop="name">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('menu.fields.name')"
          v-model="queryParams.name"
        />
      </el-form-item>

      <!-- 菜单标题 -->
      <el-form-item :label="t('menu.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('menu.fields.title')"
          v-model="queryParams.title"
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

  <b-tree-table
    ref="menuTableRef"
    :export-api="exportExcel"
    :list-api="list"
    :pager="false"
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
  <add-or-update ref="menuAddOrUpdateRef" @reload-data-list="reloadList" />
</template>
