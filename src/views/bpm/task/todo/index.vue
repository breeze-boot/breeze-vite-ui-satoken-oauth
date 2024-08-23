<!--
 * @author: gaoweixuan
 * @since: 2024-08-11
-->
<!-- 待办任务管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { list, exportExcel } from '@/api/bpm/task/todo'
import type { TodoRecord, TodoQuery } from '@/api/bpm/task/todo/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user.ts'

defineOptions({
  name: 'Todo',
  inheritAttrs: false,
})

const { t } = useI18n()
let userStore = useUserStore()
const todoQueryFormRef = ref(ElForm)
let $router = useRouter()

// 查询条件
const queryParams = reactive<TodoQuery>({
  taskName: '',
  taskTitle: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<TodoRecord>({
  applyUser: '',
  applyUserName: '',
  businessKey: '',
  delegationState: '',
  owner: '',
  procDefId: '',
  procDefKey: '',
  procInstId: '',
  taskId: '',
})

const tableInfo: TableInfo = reactive({
  // 刷新标识
  refresh: 1,
  // 序号列
  tableIndex: true,
  // 选择框类型
  select: 'single',
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
      prop: 'taskName',
      showOverflowTooltip: true,
      label: t('todo.fields.taskName'),
      width: 200,
    },
    {
      prop: 'procDefKey',
      showOverflowTooltip: true,
      label: t('todo.fields.procDefKey'),
      width: 200,
    },
    {
      prop: 'taskDefKey',
      showOverflowTooltip: true,
      label: t('todo.fields.taskDefKey'),
      width: 200,
    },
    {
      prop: 'procDefKey',
      showOverflowTooltip: true,
      label: t('todo.fields.procDefKey'),
      width: 200,
    },
    {
      prop: 'businessKey',
      showOverflowTooltip: true,
      label: t('todo.fields.businessKey'),
      width: 200,
    },
    {
      prop: 'assignee',
      showOverflowTooltip: true,
      label: t('todo.fields.assignee'),
      width: 200,
    },
    {
      prop: 'assigneeName',
      showOverflowTooltip: true,
      label: t('todo.fields.assigneeName'),
      width: 200,
    },
    {
      prop: 'taskDefKey',
      showOverflowTooltip: true,
      label: t('todo.fields.taskDefKey'),
      width: 180,
    },
    {
      prop: 'formKey',
      showOverflowTooltip: true,
      label: t('todo.fields.formKey'),
      width: 100,
    },
    {
      prop: 'applyUser',
      showOverflowTooltip: true,
      label: t('todo.fields.applyUser'),
    },
    {
      prop: 'applyUserName',
      showOverflowTooltip: true,
      label: t('todo.fields.applyUserName'),
    },
    {
      prop: 'comment',
      showOverflowTooltip: true,
      label: t('todo.fields.comment'),
      width: 200,
    },
    {
      prop: 'createTime',
      showOverflowTooltip: true,
      label: t('todo.fields.createTime'),
      width: 180,
    },
  ],
  handleBtn: {
    minWidth: 100,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 去审批
      {
        label: t('todo.common.approval'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['task:todo:approval'],
        eventHandle: (row: TodoRecord) => handleToApproval(row),
      },
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
 * 详情
 *
 * @param row 参数
 */
const handleToApproval = async (row: TodoRecord) => {
  if (row.userList && !row.userList.includes(userStore.userInfo.username)) {
    ElMessage.warning(t('todo.common.notAssignee'))
    return
  }
  await $router.push({
    path: '/task/todoApproval',
    query: {
      taskId: row.taskId,
    },
  })
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
      <el-form-item :label="t('todo.fields.taskName')" prop="taskName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('todo.fields.taskName')"
          v-model="queryParams.taskName"
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
    ref="todoTableRef"
    :pager="false"
    :export-api="exportExcel"
    :list-api="list"
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
</template>
