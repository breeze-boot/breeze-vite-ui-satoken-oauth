<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 登录日志管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, deleteLog } from '@/api/system/log/loginLog/index.ts'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { ElForm } from 'element-plus'
import type { LoginLogRecords } from '@/api/system/log/loginLog/type.ts'
import { LoginLogRecord, LoginLogQuery } from '@/api/system/log/loginLog/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'LoginLog',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const logQueryFormRef = ref(ElForm)
const { RESULT, LOG_TYPE, DO_TYPE } = useDict('RESULT', 'LOG_TYPE', 'DO_TYPE')

/**
 * 查询条件
 */
const queryParams = reactive<LoginLogQuery>({
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<LoginLogRecords>([])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRows = reactive<LoginLogRecords>([])
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
      permission: ['sys:loginLog:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: LoginLogRecords) => handleDelete(rows),
    },
  ],
  // 字典
  dict: ['LOG_TYPE', 'DO_TYPE', 'RESULT'],
  // 表格字段配置
  fieldList: [
    {
      prop: 'systemModule',
      showOverflowTooltip: true,
      label: t('loginLog.fields.systemModule'),
    },
    {
      prop: 'logTitle',
      showOverflowTooltip: true,
      label: t('loginLog.fields.logTitle'),
    },
    {
      prop: 'logType',
      showOverflowTooltip: true,
      label: t('loginLog.fields.logType'),
      type: 'dict',
      dict: 'LOG_TYPE',
    },
    {
      prop: 'doType',
      showOverflowTooltip: true,
      label: t('loginLog.fields.doType'),
      type: 'dict',
      dict: 'DO_TYPE',
    },
    {
      prop: 'requestType',
      showOverflowTooltip: true,
      label: t('loginLog.fields.requestType'),
    },
    {
      prop: 'browser',
      showOverflowTooltip: true,
      label: t('loginLog.fields.browser'),
    },
    {
      prop: 'result',
      showOverflowTooltip: true,
      label: t('loginLog.fields.result'),
      type: 'dict',
      dict: 'RESULT',
    },
    {
      prop: 'system',
      showOverflowTooltip: true,
      label: t('loginLog.fields.system'),
    },
    {
      prop: 'ip',
      showOverflowTooltip: true,
      label: t('loginLog.fields.ip'),
    },
    {
      prop: 'createBy',
      type: 'slot',
      showOverflowTooltip: true,
      label: t('loginLog.fields.createBy'),
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
        permission: ['sys:loginLog:info'],
        eventHandle: (rows: LoginLogRecords) => handleInfo(rows),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:loginLog:delete'],
        eventHandle: (row: LoginLogRecord) => handleDelete([row] as LoginLogRecords),
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
const handleDelete = async (rows: LoginLogRecords) => {
  try {
    const logIds = rows.map((item: any) => item.id)
    await deleteLog(logIds)
    $message.success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: LoginLogRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="logQueryFormRef" :model="queryParams" :inline="true" style="flex-wrap: wrap">
      <el-form-item :label="t('loginLog.fields.systemModule')" props="systemModule">
        <el-input
          v-model="queryParams.systemModule"
          @keyup.enter="handleQuery"
          clearable
          :placeholder="t('loginLog.fields.systemModule')"
        />
      </el-form-item>
      <el-form-item :label="t('loginLog.fields.doType')" prop="doType">
        <el-select
          class="m-2"
          style="width: 240px"
          v-model="queryParams.doType"
          @change="handleQuery"
          :placeholder="t('loginLog.fields.doType')"
        >
          <el-option v-for="item in DO_TYPE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('loginLog.fields.logType')" prop="logType">
        <el-select
          class="m-2"
          style="width: 240px"
          v-model="queryParams.logType"
          @change="handleQuery"
          :placeholder="t('loginLog.fields.logType')"
        >
          <el-option v-for="item in LOG_TYPE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('loginLog.fields.result')" prop="result">
        <el-select
          class="m-2"
          style="width: 240px"
          v-model="queryParams.result"
          @change="handleQuery"
          :placeholder="t('loginLog.fields.result')"
        >
          <el-option v-for="item in RESULT" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('loginLog.fields.createBy')" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          @keyup.enter="handleQuery"
          clearable
          :placeholder="t('loginLog.fields.createBy')"
        />
      </el-form-item>
      <el-form-item :label="t('loginLog.fields.searchDate')" prop="searchDate">
        <el-date-picker
          class="m-2"
          v-model="queryParams.searchDate"
          clearable
          style="width: 250px"
          :start-placeholder="t('loginLog.common.startDate')"
          :end-placeholder="t('loginLog.common.endDate')"
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
    :dict="tableInfo.dict"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
  >
    <template #col-createBy="{ row }">
      <span>{{ row?.createBy }}</span>
    </template>
  </b-table>
</template>
