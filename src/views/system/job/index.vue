<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 任务管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { page, exportExcel, deleteJob } from '@/api/system/job'
import AddOrUpdate from './components/JobAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { JobRecords } from '@/api/system/job/type.ts'
import { JobRecord, JobQuery } from '@/api/system/job/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'

defineOptions({
  name: 'Job',
  inheritAttrs: false,
})

const { t } = useI18n()
const jobQueryFormRef = ref(ElForm)
const jobAddOrUpdateRef = ref()
const { JOB_STATUS } = useDict('JOB_STATUS')

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
})

/**
 * 查询条件
 */
const queryParams = reactive<JobQuery>({
  current: 1,
  size: 10,
})

let checkedRows = reactive<JobRecords>([])
let currentRows = reactive<JobRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: ['CONCURRENT', 'MISFIRE_POLICY', 'JOB_GROUP', 'JOB_STATUS'],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['sys:job:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:job:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:job:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:job:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'jobName',
      showOverflowTooltip: true,
      label: t('job.fields.jobName'),
    },
    {
      prop: 'jobGroupName',
      showOverflowTooltip: true,
      label: t('job.fields.jobGroupName'),
      type: 'dict',
      dict: 'JOB_GROUP',
    },
    {
      prop: 'cronExpression',
      showOverflowTooltip: true,
      label: t('job.fields.cronExpression'),
    },
    {
      prop: 'clazzName',
      showOverflowTooltip: true,
      label: t('job.fields.clazzName'),
    },
    {
      prop: 'misfirePolicy',
      showOverflowTooltip: true,
      label: t('job.fields.misfirePolicy'),
      type: 'dict',
      dict: 'MISFIRE_POLICY',
    },
    {
      prop: 'concurrent',
      showOverflowTooltip: true,
      label: t('job.fields.concurrent'),
      type: 'dict',
      dict: 'CONCURRENT',
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('job.fields.status'),
      type: 'dict',
      dict: 'JOB_STATUS',
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
        permission: ['sys:job:modify'],
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:job:info'],
      },
      // 查看日志
      {
        label: t('common.showLog'),
        type: 'info',
        icon: 'view',
        event: 'view',
        permission: ['sys:job:info'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:job:delete'],
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
  jobQueryFormRef.value.resetFields()
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
  jobAddOrUpdateRef.value.init(id)
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
  alert('查询')
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
const handleDelete = (rows: JobRecords) => {
  const jobIds = rows.map((item: any) => item.id)
  deleteJob(jobIds)
    .then(() => {
      ElMessage.success({
        message: t('common.success'),
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
function handleRowClick(row: JobRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: JobRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="jobQueryFormRef" :model="queryParams" :inline="true">
      <!-- 任务编码 -->
      <el-form-item :label="t('job.fields.jobName')" prop="jobName">
        <el-input
          style="width: 200px"
          :placeholder="t('job.fields.jobName')"
          @keyup.enter="handleQuery"
          v-model="queryParams.jobName"
        />
      </el-form-item>

      <!-- 任务状态 -->
      <el-form-item :label="t('job.fields.status')" prop="status">
        <el-select
          @change="handleQuery"
          class="m-2"
          :placeholder="$t('job.fields.status')"
          style="width: 240px"
          v-model="queryParams.status"
        >
          <el-option v-for="item in JOB_STATUS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
    ref="jobTableRef"
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
  <add-or-update ref="jobAddOrUpdateRef" @reload-data-list="reloadList" />
</template>
