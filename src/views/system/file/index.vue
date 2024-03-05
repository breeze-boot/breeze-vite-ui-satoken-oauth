<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 文件管理 -->
<script setup lang="ts">
import { page, exportExcel, deleteFile } from '@/api/system/file'
import { reactive, ref, onMounted } from 'vue'
import AddOrUpdate from './components/FileAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { FileRecords } from '@/api/system/file/type.ts'
import { FileRecord, FileQuery } from '@/api/system/file/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'File',
  inheritAttrs: false,
})

const { t } = useI18n()
const fileQueryFormRef = ref(ElForm)
const fileAddOrUpdateRef = ref()

// 查询条件
const queryParams = reactive<FileQuery>({
  name: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<FileRecords>([])
let currentRows = reactive<FileRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.upload'),
      permission: ['sys:file:upload'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:file:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:file:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:file:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'bucket',
      showOverflowTooltip: true,
      label: t('file.fields.bucket'),
    },
    {
      prop: 'contentType',
      showOverflowTooltip: true,
      label: t('file.fields.contentType'),
    },
    {
      prop: 'name',
      showOverflowTooltip: true,
      label: t('file.fields.name'),
    },
    {
      prop: 'format',
      showOverflowTooltip: true,
      label: t('file.fields.format'),
      type: 'tag',
    },
    {
      prop: 'objectName',
      showOverflowTooltip: true,
      label: t('file.fields.objectName'),
    },
    {
      prop: 'path',
      showOverflowTooltip: true,
      label: t('file.fields.path'),
    },
    {
      prop: 'bizId',
      showOverflowTooltip: true,
      label: t('file.fields.bizId'),
    },
    {
      prop: 'bizType',
      showOverflowTooltip: true,
      label: t('file.fields.bizType'),
    },
    {
      prop: 'storeType',
      showOverflowTooltip: true,
      label: t('file.fields.storeType'),
    },
    {
      prop: 'createBy',
      showOverflowTooltip: true,
      label: t('file.fields.createBy'),
    },
    {
      prop: 'createName',
      showOverflowTooltip: true,
      label: t('file.fields.createName'),
    },
  ],
  handleBtn: {
    minWidth: 200,
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
        permission: ['sys:file:info'],
      },
      // 删除
      {
        label: t('common.download'),
        type: 'primary',
        icon: 'download',
        event: 'download',
        permission: ['sys:file:download'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:file:delete'],
      },
    ],
  },
})

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
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
  fileQueryFormRef.value.resetFields()
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
  fileAddOrUpdateRef.value.init(id)
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
const handleTableHeaderBtnClick = (event: string, rows: FileRecords) => {
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
const handleView = (row: FileRecord) => {
  alert(row + '查询')
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
const handleDelete = async (rows: FileRecords) => {
  const fileIds = rows.map((item: any) => item.id)
  await deleteFile(fileIds)
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
function handleRowClick(row: FileRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: FileRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="fileQueryFormRef" :model="queryParams" :inline="true">
      <!-- 文件名 -->
      <el-form-item :label="t('file.fields.name')" prop="name">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('file.fields.name')"
          v-model="queryParams.name"
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
    ref="fileTable"
    :list-api="page"
    :export-api="exportExcel"
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
  <add-or-update ref="fileAddOrUpdateRef" @reload-data-list="reloadList">确定</add-or-update>
</template>
