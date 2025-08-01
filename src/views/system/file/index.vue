<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 文件管理 -->
<script setup lang="ts">
import { page, exportExcel, deleteFile, download } from '@/api/system/file'
import { reactive, ref } from 'vue'
import AddOrEdit from './components/FileAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { ElForm } from 'element-plus'
import type { FileRecords } from '@/api/system/file/type.ts'
import { FileRecord, FileQuery } from '@/api/system/file/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { saveFile } from '@/utils/download.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'File',
  inheritAttrs: false,
})

const { t } = useI18n()
const fileQueryFormRef = ref(ElForm)
const fileAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<FileQuery>({
  name: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<FileRecords>([])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRows = reactive<FileRecords>([])
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
      type: 'primary',
      label: t('common.upload'),
      permission: ['sys:file:upload'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:file:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: FileRecords) => handleDelete(rows),
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
    width: 210,
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
        permission: [],
        eventHandle: (row: FileRecord) => handleInfo(row),
      },
      // 下载
      {
        label: t('common.download'),
        type: 'primary',
        icon: 'download',
        event: 'download',
        permission: ['sys:file:download'],
        eventHandle: (row: FileRecord) => handleDownload(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:file:delete'],
        eventHandle: (row: FileRecord) => handleDelete([row] as FileRecords),
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
const AddOrEditHandle = (id?: number) => {
  fileAddOrEditRef.value.init(id)
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleInfo = (row: FileRecord) => {
  const { info } = useMessage()
  info(row.name)
}

/**
 * 下载
 *
 * @param row 参数
 */
const handleDownload = (row: FileRecord) => {
  download(JSONBigInt.parse(row.id || 0)).then((response: any) => {
    saveFile(response, row.name)
  })
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
const handleDelete = async (rows: FileRecords) => {
  try {
    const fileIds = rows.map((item: any) => item.id)
    await deleteFile(fileIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
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
          {{ t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="fileTable"
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
  <add-or-edit ref="fileAddOrEditRef" @reload-data-list="reloadList" />
</template>
