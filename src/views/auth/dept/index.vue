<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 部门管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { list, exportExcel, deleteDept } from '@/api/auth/dept'
import BTreeTable from '@/components/Table/BTreeTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import AddOrEdit from './components/DeptAddOrEdit.vue'
import { ElForm } from 'element-plus'
import type { DeptRecords } from '@/api/auth/dept/type.ts'
import { DeptRecord, DeptQuery } from '@/api/auth/dept/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { DIALOG_FLAG } from '@/utils/common.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Dept',
  inheritAttrs: false,
})

const { t } = useI18n()
const deptQueryFormRef = ref(ElForm)
const deptAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<DeptQuery>({
  deptName: '',
  deptCode: '',
})

let checkedRows = reactive<DeptRecords>([])
let currentRows = reactive<DeptRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:dept:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(undefined, DIALOG_FLAG.ADD),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:dept:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (row: DeptRecord) => handleDelete(row),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:dept:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:dept:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'deptName',
      showOverflowTooltip: true,
      label: t('dept.fields.deptName'),
    },
    {
      prop: 'deptCode',
      showOverflowTooltip: true,
      label: t('dept.fields.deptCode'),
    },
  ],
  handleBtn: {
    minWidth: 300,
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
        permission: ['auth:dept:modify'],
        eventHandle: (row: DeptRecord) => handleUpdate(row.id as number, DIALOG_FLAG.EDIT),
      },
      // 详情
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'add',
        event: 'add',
        permission: ['auth:dept:info'],
        eventHandle: (row: DeptRecord) => handleInfo(row),
      },
      // 添加子级
      {
        label: t('dept.common.addSubDept'),
        type: 'warning',
        icon: 'add',
        event: 'add',
        permission: ['auth:dept:create'],
        eventHandle: (row: DeptRecord) => handleAdd(row.id as number, DIALOG_FLAG.ADD_SUB),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:dept:delete'],
        eventHandle: (row) => handleDelete(row),
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
  deptQueryFormRef.value.resetFields()
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
 * @param id   主键
 * @param flag 标识
 */
const AddOrEditHandle = (id?: number, flag?: DIALOG_FLAG) => {
  deptAddOrEditRef.value.init(id, flag)
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
const handleAdd = (id: number | undefined, flag: DIALOG_FLAG) => {
  AddOrEditHandle(id, flag)
}

/**
 * 删除
 *
 * @param row 行数据
 */
const handleDelete = async (row: DeptRecord) => {
  try {
    await deleteDept(JSONBigInt.parse(row.id))
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 修改
 *
 * @param id
 * @param flag
 */
const handleUpdate = (id: number | undefined, flag: DIALOG_FLAG.EDIT) => {
  AddOrEditHandle(id, flag)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: DeptRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: DeptRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="deptQueryFormRef" :model="queryParams" :inline="true">
      <!-- 部门名称 -->
      <el-form-item :label="t('dept.fields.deptName')" prop="deptName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('dept.fields.deptName')"
          v-model="queryParams.deptName"
        />
      </el-form-item>

      <!-- 部门编码 -->
      <el-form-item :label="t('dept.fields.deptCode')" prop="deptCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('dept.fields.deptCode')"
          v-model="queryParams.deptCode"
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

  <b-tree-table
    ref="deptTableRef"
    :export-api="exportExcel"
    :list-api="list"
    :pager="false"
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
  <add-or-edit ref="deptAddOrEditRef" @reload-data-list="reloadList" />
</template>
