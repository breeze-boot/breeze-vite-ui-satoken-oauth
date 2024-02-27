<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 日志管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { page, deleteLog } from '@/api/system/log'
import { ElForm, ElMessage } from 'element-plus'
import type { LogRecords } from '@/api/system/log/type.ts'
import { LogRecord, LogQuery } from '@/api/system/log/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'

defineOptions({
  name: 'Log',
  inheritAttrs: false,
})

const { t } = useI18n()
const logQueryFormRef = ref(ElForm)
const { RESULT, LOG_TYPE, DO_TYPE } = useDict('RESULT', 'LOG_TYPE', 'DO_TYPE')

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
})

/**
 * 查询条件
 */
const queryParams = reactive<LogQuery>({
  current: 1,
  size: 10,
})

let checkedRows = reactive<LogRecords>([])
let currentRows = reactive<LogRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: ['RESULT', 'LOG_TYPE', 'DO_TYPE'],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:log:delete'],
      event: 'del',
      icon: 'delete',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'systemModule',
      showOverflowTooltip: true,
      label: t('log.fields.systemModule'),
    },
    {
      prop: 'logTitle',
      showOverflowTooltip: true,
      label: t('log.fields.logTitle'),
    },
    {
      prop: 'logType',
      showOverflowTooltip: true,
      label: t('log.fields.logType'),
      type: 'dict',
      dict: 'LOG_TYPE',
    },
    {
      prop: 'doType',
      showOverflowTooltip: true,
      label: t('log.fields.doType'),
      type: 'dict',
      dict: 'DO_TYPE',
    },
    {
      prop: 'requestType',
      showOverflowTooltip: true,
      label: t('log.fields.requestType'),
    },
    {
      prop: 'browser',
      showOverflowTooltip: true,
      label: t('log.fields.browser'),
    },
    {
      prop: 'result',
      showOverflowTooltip: true,
      label: t('log.fields.result'),
      type: 'dict',
      dict: 'RESULT',
    },
    {
      prop: 'system',
      showOverflowTooltip: true,
      label: t('log.fields.system'),
    },
    {
      prop: 'ip',
      showOverflowTooltip: true,
      label: t('log.fields.ip'),
    },
    {
      prop: 'createBy',
      showOverflowTooltip: true,
      label: t('log.fields.createBy'),
    },
  ],
  handleBtn: {
    minWidth: 400,
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
        permission: ['sys:log:info'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:log:delete'],
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
  logQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
}

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  switch (event) {
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
  console.log(row)
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = (rows: LogRecords) => {
  const logIds = rows.map((item: any) => item.id)
  deleteLog(logIds)
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
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: LogRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: LogRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="logQueryFormRef" :model="queryParams" :inline="true" style="flex-wrap: wrap">
      <el-form-item :label="t('log.fields.systemModule')" props="systemModule">
        <el-input
          v-model="queryParams.systemModule"
          @keyup.enter="handleQuery"
          clearable
          :placeholder="t('log.fields.systemModule')"
        />
      </el-form-item>
      <el-form-item :label="t('log.fields.doType')" prop="doType">
        <el-select
          class="m-2"
          style="width: 240px"
          v-model="queryParams.doType"
          @change="handleQuery"
          :placeholder="t('log.fields.doType')"
        >
          <el-option v-for="item in DO_TYPE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('log.fields.logType')" prop="logType">
        <el-select
          class="m-2"
          style="width: 240px"
          v-model="queryParams.logType"
          @change="handleQuery"
          :placeholder="t('log.fields.logType')"
        >
          <el-option v-for="item in LOG_TYPE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('log.fields.result')" prop="result">
        <el-select
          class="m-2"
          style="width: 240px"
          v-model="queryParams.result"
          @change="handleQuery"
          :placeholder="t('log.fields.result')"
        >
          <el-option v-for="item in RESULT" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('log.fields.createBy')" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          @keyup.enter="handleQuery"
          clearable
          :placeholder="t('log.fields.createBy')"
        />
      </el-form-item>
      <el-form-item :label="t('log.fields.searchDate')" prop="searchDate">
        <el-date-picker
          class="m-2"
          v-model="queryParams.searchDate"
          clearable
          style="width: 250px"
          :end-placeholder="t('log.fields.endDate')"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          :start-placeholder="t('log.fields.startDate')"
          type="datetimerange"
        ></el-date-picker>
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
    ref="logTableRef"
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
</template>
