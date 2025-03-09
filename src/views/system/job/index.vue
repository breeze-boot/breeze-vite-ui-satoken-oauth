<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 任务管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteJob, runJobNow, open } from '@/api/system/job'
import AddOrEdit from './components/JobAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import JLog from './components/JLog.vue'
import { ElForm } from 'element-plus'
import type { JobRecords } from '@/api/system/job/type.ts'
import { JobRecord, JobQuery } from '@/api/system/job/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Job',
  inheritAttrs: false,
})

const { t } = useI18n()
const jobQueryFormRef = ref(ElForm)
const jobAddOrEditRef = ref()
const jLogRef = ref()
const { JOB_STATUS } = useDict('JOB_STATUS')

/**
 * 查询条件
 */
const queryParams = reactive<JobQuery>({
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<JobRecords>([])
let currentRows = reactive<JobRecords>([])
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo = reactive<TableInfo>({
  // 字典
  dict: ['JOB_STATUS', 'MISFIRE_POLICY', 'CONCURRENT'],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['sys:job:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:job:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: JobRecords) => handleDelete(rows),
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
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('job.fields.status'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'id',
        status: 'status',
      },
    },
  ],
  handleBtn: {
    width: 410,
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
        eventHandle: (row: JobRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:job:info'],
        eventHandle: (row: JobRecord) => handleInfo(row),
      },
      // 查看日志
      {
        label: t('jLog.common.jLogViewing'),
        type: 'info',
        icon: 'job_view_log',
        event: 'job_view_log',
        permission: ['sys:jLog:list'],
        eventHandle: (row: JobRecord) => handleJobViewLog(row),
      },
      // 立即运行
      {
        label: t('job.common.jobRunImmediately'),
        type: 'info',
        icon: 'job_run_immediately',
        event: 'job_run_immediately',
        permission: ['sys:job:run'],
        eventHandle: (row: JobRecord) => handleJobRunImmediately(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:job:delete'],
        eventHandle: (row: JobRecord) => handleDelete([row] as JobRecords),
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
const AddOrEditHandle = (id?: number) => {
  jobAddOrEditRef.value.init(id)
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
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: any) => {
  AddOrEditHandle(row.id)
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: JobRecords) => {
  try {
    const jobIds = rows.map((item: any) => item.id)
    await deleteJob(jobIds)
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}` + err.message)
  }
}

/**
 * 查看日志
 *
 * @param row 行数据
 */
const handleJobViewLog = (row: JobRecord) => {
  jLogRef.value.init(row.id)
}

/**
 * 运行一次
 *
 * @param row 行数据
 */
const handleJobRunImmediately = async (row: JobRecord) => {
  try {
    await runJobNow(JSONBigInt.parse(row.id))
    useMessage().success(t('job.common.jobRunSuccess'))
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}` + err.message)
  }
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
          :placeholder="t('job.fields.status')"
          style="width: 240px"
          v-model="queryParams.status"
        >
          <el-option v-for="item in JOB_STATUS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
    ref="jobTableRef"
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
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="jobAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 任务日志抽屉 -->
  <j-log ref="jLogRef" />
</template>
