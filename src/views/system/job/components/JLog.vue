<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 任务日志查看抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { page } from '@/api/system/jLog'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { JLogQuery, JLogRecords } from '@/api/system/jLog/type.ts'
import BTable from '@/components/Table/BTable/index.vue'
import useWidth from '@/hooks/dialogWidth'

defineOptions({
  name: 'JLog',
  inheritAttrs: false,
})

const direction = ref('rtl')
const { t } = useI18n()
const visible = ref<boolean>(false)
const jLogTableRef = ref()
const loading = ref<boolean>(false)

let currentRows = reactive<JLogRecords>([])

/**
 * 查询条件
 */
const queryParams = reactive<JLogQuery>({
  current: 1,
  size: 10,
  total: 0,
})
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'
const mountedRefresh: boolean = true

const tableInfo = reactive<TableInfo>({
  // 字典
  dict: ['JOB_STATUS'],
  // 表格字段配置
  fieldList: [
    {
      prop: 'jobName',
      showOverflowTooltip: true,
      label: t('jLog.fields.jobName'),
    },
    {
      prop: 'jobGroupName',
      showOverflowTooltip: true,
      label: t('jLog.fields.jobGroupName'),
    },
    {
      prop: 'clazzName',
      showOverflowTooltip: true,
      label: t('jLog.fields.clazzName'),
    },
    {
      prop: 'cronExpression',
      showOverflowTooltip: true,
      label: t('jLog.fields.cronExpression'),
    },
    {
      prop: 'jobMessage',
      showOverflowTooltip: true,
      label: t('jLog.fields.jobMessage'),
    },
    {
      prop: 'exceptionInfo',
      showOverflowTooltip: true,
      label: t('jLog.fields.exceptionInfo'),
      type: 'longText',
    },
    {
      prop: 'jobStatus',
      showOverflowTooltip: true,
      label: t('jLog.fields.jobStatus'),
      type: 'dict',
      dict: 'JOB_STATUS',
    },
    {
      prop: 'endTime',
      showOverflowTooltip: true,
      label: t('jLog.fields.endTime'),
    },
  ],
})

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  console.log(row)
  switch (event) {
    case 'view':
      break
    default:
      break
  }
}

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  if (id) {
    await getInfo(id)
  }
  visible.value = true
}

/**
 * 初始化任务的日志
 *
 * @param id
 */
const getInfo = async (id: number) => {
  queryParams.jobId = id
  refresh.value = Math.random()
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: JLogRecords) => {
  currentRows = rows
  console.log(currentRows)
}

defineExpose({
  init,
})
</script>

<template>
  <el-drawer :size="useWidth()" v-model="visible" :title="t('jLog.common.jLogViewing')" :direction="direction">
    <template #header>
      <h4>{{ t('jLog.common.jLogViewing') }}</h4>
    </template>
    <template #default>
      <b-table
        ref="jLogTableRef"
        table-height="80%"
        :refresh="refresh"
        :mountedRefresh="mountedRefresh"
        :select="select"
        :list-api="page"
        v-model:loading="tableLoading"
        :tableIndex="tableIndex"
        :query="queryParams"
        :checked-rows="checkedRows"
        :dict="tableInfo.dict"
        :field-list="tableInfo.fieldList"
        :tb-header-btn="tableInfo.tbHeaderBtn"
        :handle-btn="tableInfo.handleBtn"
        @handle-table-row-btn-click="handleTableRowBtnClick"
        @selection-change="handleSelectionChange"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button
          @click="
            () => {
              visible = false
              loading = false
            }
          "
        >
          {{ t('common.cancel') }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
