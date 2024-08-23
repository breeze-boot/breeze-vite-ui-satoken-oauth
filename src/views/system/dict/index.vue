<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->
<!-- 字典管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, open, exportExcel, deleteDict } from '@/api/system/dict'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import AddOrEdit from './components/DictAddOrEdit.vue'
import DictItem from './components/DictItem.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { DictRecords } from '@/api/system/dict/type.ts'
import { DictRecord, DictQuery } from '@/api/system/dict/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Dict',
  inheritAttrs: false,
})

const { t } = useI18n()
const dictQueryFormRef = ref(ElForm)
const dictAddOrEditRef = ref()
const dictItemRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<DictQuery>({
  dictCode: '',
  dictName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<DictRecords>([])
let currentRows = reactive<DictRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['sys:dict:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:dict:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: DictRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:dict:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:dict:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'dictName',
      showOverflowTooltip: true,
      label: t('dict.fields.dictName'),
    },
    {
      prop: 'dictCode',
      showOverflowTooltip: true,
      label: t('dict.fields.dictCode'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('dict.fields.status'),
      type: 'dict',
      dict: 'DICT_STATUS',
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('dict.fields.status'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'id',
        status: 'status',
      },
    },
  ],
  handleBtn: {
    minWidth: 350,
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
        permission: ['sys:dict:modify'],
        eventHandle: (row: DictRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:dict:info'],
        eventHandle: (row: DictRecord) => handleInfo(row),
      },
      // 查看字典项
      {
        label: t('dictItem.common.dictItemViewing'),
        type: 'info',
        icon: 'dict_item_view',
        event: 'dict_item_view',
        permission: ['sys:dict:list'],
        eventHandle: (row: DictRecord) => handleDictItemViewLog(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:dict:delete'],
        eventHandle: (row: DictRecord) => handleDelete([row] as DictRecords),
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
  dictQueryFormRef.value.resetFields()
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
  dictAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: DictRecords) => {
  const dictIds = rows.map((item: any) => item.id)
  await deleteDict(dictIds)
  ElMessage.success({
    message: `${t('common.delete') + t('common.success')}`,
    duration: 1000,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 查看字典项
 *
 * @param row 行数据
 */
const handleDictItemViewLog = (row: DictRecord) => {
  dictItemRef.value.init(row.id)
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
function handleRowClick(row: DictRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: DictRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="dictQueryFormRef" :model="queryParams" :inline="true">
      <!-- 字典名称 -->
      <el-form-item :label="t('dict.fields.dictName')" prop="dictName">
        <el-input
          style="width: 200px"
          :placeholder="t('dict.fields.dictName')"
          @keyup.enter="handleQuery"
          v-model="queryParams.dictName"
        />
      </el-form-item>

      <!-- 字典编码 -->
      <el-form-item :label="t('dict.fields.dictCode')" prop="dictCode">
        <el-input
          style="width: 200px"
          :placeholder="t('dict.fields.dictCode')"
          @keyup.enter="handleQuery"
          v-model="queryParams.dictCode"
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
    ref="dictTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="dictAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 字典项抽屉 -->
  <dict-item ref="dictItemRef" />
</template>
