<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 审计日志管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { deleteLog, page } from '@/api/system/log/auditLog/index.ts'
import { AuditLogQuery, AuditLogRecord, AuditLogRecords } from '@/api/system/log/auditLog/type.ts'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { ElForm } from 'element-plus'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'AuditLog',
  inheritAttrs: false,
})

const { t } = useI18n()
const logQueryFormRef = ref(ElForm)

/**
 * 查询条件
 */
const queryParams = reactive<AuditLogQuery>({
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<AuditLogRecords>([])
let currentRows = reactive<AuditLogRecords>([])
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
      permission: ['sys:auditLog:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: AuditLogRecords) => handleDelete(rows),
    },
  ],
  // 字典
  dict: [],
  // 表格字段配置
  fieldList: [
    {
      prop: 'field',
      showOverflowTooltip: true,
      label: t('auditLog.fields.field'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('auditLog.fields.status'),
    },
    {
      prop: 'batch',
      showOverflowTooltip: true,
      label: t('auditLog.fields.batch'),
    },
  ],
  handleBtn: {
    width: 200,
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
        permission: ['sys:auditLog:info'],
        eventHandle: (rows: AuditLogRecords) => handleInfo(rows),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:auditLog:delete'],
        eventHandle: (row: AuditLogRecord) => handleDelete([row] as AuditLogRecords),
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
const handleDelete = async (rows: AuditLogRecords) => {
  try {
    const logIds = rows.map((item: any) => item.id)
    await deleteLog(logIds)
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: AuditLogRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: AuditLogRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="logQueryFormRef" :model="queryParams" :inline="true" style="flex-wrap: wrap">
      <el-form-item :label="t('auditLog.common.searchDate')" prop="searchDate">
        <el-date-picker
          class="m-2"
          v-model="queryParams.searchDate"
          clearable
          style="width: 250px"
          :start-placeholder="t('auditLog.common.startDate')"
          :end-placeholder="t('auditLog.common.endDate')"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          type="datetimerange"
        ></el-date-picker>
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
    ref="logTableRef"
    :refresh="refresh"
    :select="select"
    :list-api="page"
    v-model:loading="tableLoading"
    :tableIndex="tableIndex"
    :query="queryParams"
    :checked-rows="checkedRows"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  >
    <template #col-slot="{ row }"></template>
  </b-table>
</template>
