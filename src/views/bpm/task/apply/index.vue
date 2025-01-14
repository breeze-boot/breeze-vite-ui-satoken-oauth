<!--
 * @author: gaoweixuan
 * @since: 2024-08-11
-->
<!-- 发起任务管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import { list } from '@/api/bpm/task/apply'
import type { ApplyRecord, ApplyQuery } from '@/api/bpm/task/apply/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import BTable from '@/components/Table/BTable/index.vue'

defineOptions({
  name: 'Apply',
  inheritAttrs: false,
})

const { t } = useI18n()
const completedQueryFormRef = ref(ElForm)

// 查询条件
const queryParams = reactive<ApplyQuery>({
  taskName: '',
  taskTitle: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<ApplyRecord>({})
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo: TableInfo = reactive({
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'default',
      label: t('common.export'),
      permission: ['task:completed:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['task:completed:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'taskName',
      showOverflowTooltip: true,
      label: t('apply.fields.taskName'),
      width: 200,
    },
    {
      prop: 'procDefKey',
      showOverflowTooltip: true,
      label: t('apply.fields.procDefKey'),
      width: 200,
    },
    {
      prop: 'taskDefKey',
      showOverflowTooltip: true,
      label: t('apply.fields.taskDefKey'),
      width: 200,
    },
    {
      prop: 'procDefKey',
      showOverflowTooltip: true,
      label: t('apply.fields.procDefKey'),
      width: 200,
    },
    {
      prop: 'businessKey',
      showOverflowTooltip: true,
      label: t('apply.fields.businessKey'),
      width: 200,
    },
    {
      prop: 'assignee',
      showOverflowTooltip: true,
      label: t('apply.fields.assignee'),
      width: 200,
    },
    {
      prop: 'assigneeName',
      showOverflowTooltip: true,
      label: t('apply.fields.assigneeName'),
      width: 200,
    },
    {
      prop: 'taskDefKey',
      showOverflowTooltip: true,
      label: t('apply.fields.taskDefKey'),
      width: 180,
    },
    {
      prop: 'formKey',
      showOverflowTooltip: true,
      label: t('apply.fields.formKey'),
      width: 100,
    },
    {
      prop: 'applyUser',
      showOverflowTooltip: true,
      label: t('apply.fields.applyUser'),
    },
    {
      prop: 'applyUserName',
      showOverflowTooltip: true,
      label: t('apply.fields.applyUserName'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('apply.fields.status'),
    },
    {
      prop: 'comment',
      showOverflowTooltip: true,
      label: t('apply.fields.comment'),
      width: 200,
    },
    {
      prop: 'createTime',
      showOverflowTooltip: true,
      label: t('apply.fields.createTime'),
      width: 180,
    },
  ],
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
  completedQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: ApplyRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="completedQueryFormRef" :model="queryParams" :inline="true">
      <!-- 待办任务名 -->
      <el-form-item :label="t('completed.fields.taskName')" prop="taskName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('completed.fields.taskName')"
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
    ref="completedTableRef"
    :refresh="refresh"
    :select="select"
    :list-api="list"
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
</template>
