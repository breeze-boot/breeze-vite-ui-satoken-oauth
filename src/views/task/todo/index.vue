<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!-- 待办任务管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import { page, exportExcel } from '@/api/task/todo'
import type { TodoRecord, TodoQuery } from '@/api/task/todo/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/TodoApproval.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Todo',
  inheritAttrs: false,
})

const { t } = useI18n()
const todoQueryFormRef = ref(ElForm)
const todoApprovalRef = ref()

// 查询条件
const queryParams = reactive<TodoQuery>({
  title: '',
  name: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<TodoRecord>({})

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: [],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'default',
      label: t('common.export'),
      permission: ['task:todo:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['task:todo:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'title',
      showOverflowTooltip: true,
      label: t('todo.fields.title'),
      width: 300,
    },
    {
      prop: 'processDefinitionKey',
      showOverflowTooltip: true,
      label: t('todo.fields.processDefinitionKey'),
      width: 300,
    },
    {
      prop: 'creatTime',
      showOverflowTooltip: true,
      label: t('todo.fields.creatTime'),
      width: 300,
    },
    {
      prop: 'tenantId',
      showOverflowTooltip: true,
      label: t('todo.fields.tenantId'),
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
        permission: ['task:todo:info'],
        eventHandle: (row: TodoRecord) => handleInfo(row),
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
  todoQueryFormRef.value.resetFields()
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
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: TodoRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="todoQueryFormRef" :model="queryParams" :inline="true">
      <!-- 待办任务名 -->
      <el-form-item :label="t('todo.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('todo.fields.title')"
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

  <b-table
    ref="todoTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :dict="tableInfo.dict"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :default-sort="tableInfo.defaultSort"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="todoApprovalRef" @reload-data-list="reloadList" />
</template>
