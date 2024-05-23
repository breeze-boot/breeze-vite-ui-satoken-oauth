<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!--  流程定义管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { page, exportExcel, deleteDefinition } from '@/api/flow/definition'
import type { DefinitionRecords } from '@/api/flow/definition/type.ts'
import type { DefinitionRecord, DefinitionQuery } from '@/api/flow/definition/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/DefinitionAddOrEdit.vue'
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
const queryParams = reactive<DefinitionQuery>({
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<DefinitionRecord>({})

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
      type: 'primary',
      label: t('common.add'),
      permission: ['flow:definition:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['flow:definition:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: DefinitionRecords) => handleDelete(rows),
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
      prop: 'key',
      showOverflowTooltip: true,
      label: t('definition.fields.key'),
    },
    {
      prop: 'name',
      showOverflowTooltip: true,
      label: t('definition.fields.name'),
    },
    {
      prop: 'categoryName',
      showOverflowTooltip: true,
      label: t('definition.fields.categoryName'),
    },
    {
      prop: 'tenantId',
      showOverflowTooltip: true,
      label: t('definition.fields.tenantId'),
    },
    {
      prop: 'deploymentTime',
      showOverflowTooltip: true,
      label: t('definition.fields.deploymentTime'),
    },
    {
      prop: 'version',
      showOverflowTooltip: true,
      label: t('definition.fields.version'),
    },
    {
      prop: 'suspended',
      showOverflowTooltip: true,
      label: t('definition.fields.suspended'),
    },
  ],
  handleBtn: {
    minWidth: 400,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 编辑
      {
        label: t('common.edit'),
        type: 'success',
        icon: 'edit',
        event: 'edit',
        permission: ['flow:definition:modify'],
        eventHandle: (row: DefinitionRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['flow:definition:info'],
        eventHandle: (row: DefinitionRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['flow:definition:delete'],
        eventHandle: (row: DefinitionRecord) => handleDelete([row] as DefinitionRecords),
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
const handleDelete = async (rows: DefinitionRecords) => {
  const definitionIds = rows.map((item: any) => item.id)
  await deleteDefinition(definitionIds)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: any) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: DefinitionRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="definitionQueryFormRef" :model="queryParams" :inline="true">
      <!--  流程定义名 -->
      <el-form-item :label="t('definition.fields.name')" prop="name">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('definition.fields.name')"
          v-model="queryParams.name"
        />
      </el-form-item>

      <!--  流程定义编码 -->
      <el-form-item :label="t('definition.fields.key')" prop="key">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('definition.fields.key')"
          v-model="queryParams.key"
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
