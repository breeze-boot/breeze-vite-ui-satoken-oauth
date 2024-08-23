<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!-- 分类管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { page, exportExcel, deleteCategory } from '@/api/bpm/def/category'
import type { CategoryRecords } from '@/api/bpm/def/category/type.ts'
import type { CategoryRecord, CategoryQuery } from '@/api/bpm/def/category/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/CategoryAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FlowCategory',
  inheritAttrs: false,
})

const { t } = useI18n()
const categoryQueryFormRef = ref(ElForm)
const categoryAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<CategoryQuery>({
  categoryCode: '',
  categoryName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<CategoryRecord>({ categoryCode: '', categoryName: '', tenantId: '' })

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
      permission: ['bpm:category:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['bpm:category:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: CategoryRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['bpm:category:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['bpm:category:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'categoryCode',
      showOverflowTooltip: true,
      label: t('category.fields.categoryCode'),
    },
    {
      prop: 'categoryName',
      showOverflowTooltip: true,
      label: t('category.fields.categoryName'),
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
        permission: ['bpm:category:modify'],
        eventHandle: (row: CategoryRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['bpm:category:info'],
        eventHandle: (row: CategoryRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['bpm:category:delete'],
        eventHandle: (row: CategoryRecord) => handleDelete([row] as CategoryRecords),
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
  categoryQueryFormRef.value.resetFields()
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
  categoryAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: CategoryRecords) => {
  const categoryIds = rows.map((item: any) => item.id)
  await deleteCategory(categoryIds)
  ElMessage.success({
    message: `${t('common.delete') + t('common.success')}`,
    duration: 1000,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 详情
 *
 * @param row 修改参数
 */
const handleInfo = (row: any) => {
  console.log(row)
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
const handleSelectionChange = (row: CategoryRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="categoryQueryFormRef" :model="queryParams" :inline="true">
      <!-- 分类名 -->
      <el-form-item :label="t('category.fields.categoryName')" prop="categoryName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('category.fields.categoryCode')"
          v-model="queryParams.categoryName"
        />
      </el-form-item>

      <!-- 分类编码 -->
      <el-form-item :label="t('category.fields.categoryCode')" prop="categoryCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('category.fields.categoryCode')"
          v-model="queryParams.categoryCode"
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
    ref="categoryTableRef"
    :export-api="exportExcel"
    :list-api="page"
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
  <add-or-edit ref="categoryAddOrEditRef" @reload-data-list="reloadList" />
</template>
