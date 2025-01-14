<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!-- 请假工单管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { deleteLeave, exportExcel, page } from '@/api/wo/leave'
import type { LeaveQuery, LeaveRecord, LeaveRecords } from '@/api/wo/leave/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/LeaveAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Leave',
  inheritAttrs: false,
})

const { t } = useI18n()
const leaveQueryFormRef = ref(ElForm)
const leaveAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<LeaveQuery>({
  title: '',
  current: 1,
  size: 10,
  total: 0,
})
const $router = useRouter()

let checkedRows = reactive<string[]>([])
let currentRow = reactive<LeaveRecord>({})
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo = reactive<TableInfo>({
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:platform:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:platform:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: LeaveRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['wo:leave:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['wo:leave:export'],
      event: 'exportAll',
      icon: 'excel',
    },
    {
      type: 'primary',
      label: t('common.startFlow'),
      event: 'startFlow',
      icon: 'startFlow',
      eventHandle: (row: LeaveRecord) => handleStartFlow(row),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'title',
      showOverflowTooltip: true,
      label: t('leave.fields.title'),
    },
    {
      prop: 'reason',
      showOverflowTooltip: true,
      label: t('leave.fields.reason'),
    },
    {
      prop: 'leaveCode',
      sortable: 'custom',
      showOverflowTooltip: true,
      label: t('leave.fields.startDate'),
    },
    {
      prop: 'description',
      showOverflowTooltip: true,
      label: t('leave.fields.endDate'),
    },
  ],
  handleBtn: {
    width: 100,
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
        permission: ['wo:leave:info'],
        eventHandle: (row: LeaveRecord) => handleInfo(row),
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
  leaveQueryFormRef.value.resetFields()
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
  leaveAddOrEditRef.value.init(id)
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
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: LeaveRecords) => {
  const leaveIds = rows.map((item: any) => item.id)
  await deleteLeave(leaveIds)
  ElMessage.success({
    message: `${t('common.delete') + t('common.success')}`,
    duration: 1000,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 发起审批
 *
 * @param row 行数据
 */
const handleStartFlow = async (row: LeaveRecord) => {
  await $router.push({
    path: '/wo/startApproval',
    query: {},
  })
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: LeaveRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="leaveQueryFormRef" :model="queryParams" :inline="true">
      <!-- 标题 -->
      <el-form-item :label="t('leave.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('leave.fields.title')"
          v-model="queryParams.title"
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
    ref="leaveTableRef"
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
  <add-or-edit ref="leaveAddOrEditRef" @reload-data-list="reloadList" />
</template>
