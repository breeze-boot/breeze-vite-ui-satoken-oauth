<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!--  流程定义管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { page, exportExcel, deleteDefinition, startInstance, isSuspended } from '@/api/flow/definition'
import type { FlowDefinitionRecords } from '@/api/flow/definition/type.ts'
import type { FlowDefinitionRecord, FlowDefinitionQuery } from '@/api/flow/definition/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import AddOrEdit from '@/views/flow/definition/components/DefinationAddOrEdit.vue'
import { FlowStartParam } from '@/api/flow/definition/type.ts'
import useUserStore from '@/store/modules/user.ts'

defineOptions({
  name: 'Definition',
  inheritAttrs: false,
})

const { t } = useI18n()
const definitionQueryFormRef = ref(ElForm)
const definitionAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<FlowDefinitionQuery>({
  definitionKey: '',
  definitionName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<FlowDefinitionRecord>({
  categoryName: '',
  definitionKey: '',
  definitionName: '',
  deploymentTime: '',
  suspended: '',
  tenantId: '',
  version: '',
  xml: '',
})

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: ['FLOW_SUSPENDED'],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.design'),
      permission: ['flow:definition:design'],
      event: 'design',
      icon: 'design',
      eventHandle: () => handleDesign(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['flow:definition:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: FlowDefinitionRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['flow:definition:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['flow:definition:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'definitionKey',
      showOverflowTooltip: true,
      label: t('definition.fields.definitionKey'),
      width: 280,
    },
    {
      prop: 'definitionName',
      showOverflowTooltip: true,
      label: t('definition.fields.definitionName'),
      width: 150,
    },
    {
      prop: 'categoryName',
      showOverflowTooltip: true,
      label: t('definition.fields.categoryName'),
      width: 150,
    },
    {
      prop: 'deploymentTime',
      showOverflowTooltip: true,
      label: t('definition.fields.deploymentTime'),
      width: 150,
    },
    {
      prop: 'version',
      showOverflowTooltip: true,
      label: t('definition.fields.version'),
      width: 100,
    },
    {
      prop: 'suspended',
      label: t('definition.fields.suspended'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: isSuspended,
        pk: 'id',
        status: 'suspended',
      },
    },
    {
      prop: 'suspended',
      showOverflowTooltip: true,
      label: t('definition.fields.suspended'),
      width: 100,
      type: 'dict',
      dict: 'FLOW_SUSPENDED',
    },
    {
      prop: 'tenantId',
      showOverflowTooltip: true,
      label: t('definition.fields.tenantId'),
      width: 150,
    },
  ],
  handleBtn: {
    minWidth: 400,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 设计
      {
        label: t('common.design'),
        type: 'success',
        icon: 'design',
        event: 'design',
        permission: ['flow:definition:design'],
        eventHandle: (row: FlowDefinitionRecord) => handleDesign(row),
      },
      // 启动
      {
        label: t('common.start'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['flow:instance:start'],
        eventHandle: (row: FlowDefinitionRecord) => handleStart(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['flow:definition:info'],
        eventHandle: (row: FlowDefinitionRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['flow:definition:delete'],
        eventHandle: (row: FlowDefinitionRecord) => handleDelete([row] as FlowDefinitionRecords),
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
  definitionQueryFormRef.value.resetFields()
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
  definitionAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: FlowDefinitionRecords) => {
  const definitions: any[] = rows.map((item: any) => {
    return { definitionKey: item.definitionKey, cascade: true }
  })
  await deleteDefinition(definitions)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 *启动
 *
 * @param row 修改参数
 */
const handleStart = async (row: FlowDefinitionRecord) => {
  let startParam: FlowStartParam = {
    definitionKey: row.definitionKey,
    businessKey: '',
    variables: {
      approved: true,
    },
    isPassFirstNode: true,
    tenantId: useUserStore().userInfo.tenantId.toString(),
  }
  await startInstance(startParam)
}

/**
 * 设计
 *
 * @param row 修改参数
 */
const handleDesign = (row?: FlowDefinitionRecord) => {
  AddOrEditHandle(row?.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: FlowDefinitionRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="definitionQueryFormRef" :model="queryParams" :inline="true">
      <!--  流程定义名 -->
      <el-form-item :label="t('definition.fields.definitionName')" prop="name">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('definition.fields.definitionName')"
          v-model="queryParams.definitionName"
        />
      </el-form-item>

      <!--  流程定义编码 -->
      <el-form-item :label="t('definition.fields.definitionKey')" prop="definitionKey">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('definition.fields.definitionKey')"
          v-model="queryParams.definitionKey"
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
    ref="definitionTableRef"
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
  <add-or-edit ref="definitionAddOrEditRef" @reload-data-list="reloadList" />
</template>
