<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!--  流程定义管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { page, exportExcel, deleteDefinition, startInstance, suspendedDefinition } from '@/api/bpm/def/definition'
import type { BpmDefinitionRecords } from '@/api/bpm/def/definition/type.ts'
import type { BpmDefinitionRecord, BpmDefinitionQuery, BpmStartForm } from '@/api/bpm/def/definition/type.ts'
import AddOrEdit from './components/DefinationAddOrEdit.vue'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Definition',
  inheritAttrs: false,
})

const { t } = useI18n()
const definitionQueryFormRef = ref(ElForm)
const definitionAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<BpmDefinitionQuery>({
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<BpmDefinitionRecord>({
  categoryName: '',
  procDefKey: '',
  procDefId: '',
  procDefName: '',
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
      permission: ['bpm:definition:design'],
      event: 'design',
      icon: 'design',
      eventHandle: () => handleDesign(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['bpm:definition:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: BpmDefinitionRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['bpm:definition:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['bpm:definition:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'procDefKey',
      showOverflowTooltip: true,
      label: t('definition.fields.procDefKey'),
      width: 280,
    },
    {
      prop: 'procDefName',
      showOverflowTooltip: true,
      label: t('definition.fields.procDefName'),
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
        inactiveValue: 2,
        api: suspendedDefinition,
        pk: 'procDefId',
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
  ],
  handleBtn: {
    width: 280,
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
        permission: ['bpm:definition:design'],
        eventHandle: (row: BpmDefinitionRecord) => handleDesign(row),
      },
      // 启动
      {
        label: t('common.start'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['bpm:instance:start'],
        eventHandle: (row: BpmDefinitionRecord) => handleStart(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['bpm:definition:info'],
        eventHandle: (row: BpmDefinitionRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['bpm:definition:delete'],
        eventHandle: (row: BpmDefinitionRecord) => handleDelete([row] as BpmDefinitionRecords),
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
const handleDelete = async (rows: BpmDefinitionRecords) => {
  const definitions: any[] = rows.map((item: any) => {
    return { procDefKey: item.procDefKey, cascade: true }
  })
  await deleteDefinition(definitions)
  ElMessage.success({
    message: `${t('common.delete') + t('common.success')}`,
    duration: 1000,
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
const handleStart = async (row: BpmDefinitionRecord) => {
  let startParam: BpmStartForm = {
    procDefKey: row.procDefKey,
    businessKey: '',
    variables: {},
    isPassFirstNode: false,
  }
  const response: any = await startInstance(startParam)
  if (response.code === '0000') {
    ElMessage.success({
      message: `${t('common.start') + t('common.success')}`,
      duration: 1000,
    })
  }
}

/**
 * 设计
 *
 * @param row 修改参数
 */
const handleDesign = (row?: BpmDefinitionRecord) => {
  AddOrEditHandle(row?.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: BpmDefinitionRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="definitionQueryFormRef" :model="queryParams" :inline="true">
      <!--  流程定义名 -->
      <el-form-item :label="t('definition.fields.procDefName')" prop="procDefName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('definition.fields.procDefName')"
          v-model="queryParams.procDefName"
        />
      </el-form-item>

      <!--  流程定义编码 -->
      <el-form-item :label="t('definition.fields.procDefKey')" prop="procDefKey">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('definition.fields.procDefKey')"
          v-model="queryParams.procDefKey"
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
