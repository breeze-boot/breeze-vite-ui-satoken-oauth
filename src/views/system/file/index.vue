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
import { File, FileQuery } from '@/api/system/file/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'File',
  inheritAttrs: false,
})

const fileQueryFormRef = ref(ElForm)
const fileAddOrUpdateRef = ref()

// 查询条件
const queryParams = reactive<FileQuery>({
  endTime: '',
  fileName: '',
  keywords: '',
  status: 0,
  startTime: '',
  current: 1,
  size: 10,
})

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  // 是否时单选框
  selection: true,
  // 表格顶部按钮
  tableBtnGroup: [
    {
      type: 'primary',
      label: '添加',
      permission: ['sys:file:upload'],
      event: 'add',
    },
    {
      type: 'danger',
      label: '删除',
      permission: ['sys:file:delete'],
      event: 'del',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'title',
      label: '标题',
      showOverflowTooltip: true,
    },
    {
      prop: 'bucket',
      showOverflowTooltip: true,
      label: '桶',
    },
    {
      prop: 'contentType',
      showOverflowTooltip: true,
      label: '上下文',
    },
    {
      prop: 'fileName',
      showOverflowTooltip: true,
      label: '文件名称',
    },
    {
      prop: 'fileFormat',
      label: '文件格式',
      showOverflowTooltip: true,
      type: 'tag',
    },
    {
      prop: 'objectName',
      label: '对象',
      showOverflowTooltip: true,
    },
    {
      prop: 'path',
      label: '路径',
      showOverflowTooltip: true,
    },
    {
      prop: 'objectName',
      label: '文件',
      type: 'upload',
      width: '300px',
      upload: {
        msg: '只能上传一个文件',
        limit: 1,
        types: ['jpg', 'png'],
        api: import.meta.env.VITE_APP_SERVER + import.meta.env.VITE_APP_BASE_API + '/file/uploadMinioS3',
        pk: 'id',
      },
    },
  ],
  tableIndex: true,
  handle: {
    minWidth: 200,
    label: '操作',
    fixed: 'right',
    link: true,
    btList: [
      // 查看
      {
        label: '查看',
        type: 'warning',
        icon: 'View',
        event: 'view',
        permission: ['sys:file:preview'],
      },
      // 删除
      {
        label: '下载',
        type: 'primary',
        icon: 'Download',
        event: 'download',
        permission: ['sys:file:download'],
      },
      // 删除
      {
        label: '删除',
        type: 'danger',
        icon: 'Delete',
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
  console.debug(`数据初始化`)
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
 * @param data 参数
 */
const handleView = (data: File) => {
  alert(data + '查询')
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
const handleDelete = (rows: FileRecords) => {
  const userIds = rows.map((item: any) => item.id)
  deleteFile(userIds)
    .then(() => {
      ElMessage.success({
        message: '成功',
        duration: 500,
        onClose: () => {},
      })
    })
    .finally(() => {
      reloadList()
    })
}

/**
 * 修改
 *
 * @param data 修改参数
 */
const handleUpdate = (data: any) => {
  addOrUpdateHandle(data.id)
}

let currentRow = reactive<File>({} as File)
let currentRows = reactive<FileRecords>([])

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: File) {
  currentRow = row
  console.log(currentRow)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: FileRecords) => {
  currentRows = rows
  console.log(currentRows)
}
</script>

<template>
  <search-container-box>
    <el-form ref="fileQueryFormRef" :model="queryParams" :inline="true">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="userCode">
        <el-input @keyup.enter="handleQuery" style="width: 200px" placeholder="文件名" v-model="queryParams.fileName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          <Refresh />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="userTable"
    :list-api="page"
    :export-api="exportExcel"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :table-header-btn="tableInfo.tableBtnGroup"
    :singleSelect="false"
    :selection="true"
    :checked-list="currentRows"
    :handle="tableInfo.handle"
    @handle-table-row-btn-click="handleTableRowBtnClick"
    @handle-table-header-btn-click="handleTableHeaderBtnClick"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 弹窗, 新增 / 修改 -->
  <add-or-update ref="fileAddOrUpdateRef" @reload-data-list="reloadList">确定</add-or-update>
</template>
