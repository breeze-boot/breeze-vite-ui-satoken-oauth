<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->
<!-- 字典分组管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { deleteSysDictGroup, exportExcel, page } from '@/api/system/dict/group'
import type { DictGroupQuery, DictGroupRecord, DictGroupRecords } from '@/api/system/dict/group/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/DictGroupAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DictGroup',
  inheritAttrs: false,
})

const { t } = useI18n()
const dictGroupQueryFormRef = ref(ElForm)
const dictGroupAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<DictGroupQuery>({
  id: 0,
  groupName: '',
  groupCode: '',
  status: 0,
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<DictGroupRecord>({
  id: 0,
  groupName: '',
  groupCode: '',
  status: 0,
})
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
      permission: ['sys:dictGroup:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:dictGroup:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: DictGroupRecords) => handleDelete(rows),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'groupName',
      showOverflowTooltip: true,
      label: t('dictGroup.fields.groupName'),
    },
    {
      prop: 'groupCode',
      showOverflowTooltip: true,
      label: t('dictGroup.fields.groupCode'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('dictGroup.fields.status'),
    },
  ],
  handleBtn: {
    width: 210,
    label: t('common.operate'),
    link: true,
    btList: [
      // 编辑
      {
        label: t('common.edit'),
        type: 'success',
        icon: 'edit',
        event: 'edit',
        permission: ['sys:dictGroup:modify'],
        eventHandle: (row: DictGroupRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:dictGroup:info'],
        eventHandle: (row: DictGroupRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:dictGroup:delete'],
        eventHandle: (row: DictGroupRecord) => handleDelete([row] as DictGroupRecords),
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
  dictGroupQueryFormRef.value.resetFields()
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
  dictGroupAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: DictGroupRecords) => {
  try {
    const sysDictGroupIds = rows.map((item: any) => item.id)
    await deleteSysDictGroup(sysDictGroupIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: DictGroupRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: DictGroupRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="dictGroupQueryFormRef" :model="queryParams" :inline="true">
      <el-form-item :label="t('dictGroup.fields.groupName')" prop="groupName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('dictGroup.fields.groupName')"
          v-model="queryParams.groupName"
        />
      </el-form-item>

      <el-form-item :label="t('dictGroup.fields.groupCode')" prop="groupCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('dictGroup.fields.groupCode')"
          v-model="queryParams.groupCode"
        />
      </el-form-item>

      <el-form-item :label="t('dictGroup.fields.status')" prop="status">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('dictGroup.fields.status')"
          v-model="queryParams.status"
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
    ref="sysDictGroupTableRef"
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
  <add-or-edit ref="dictGroupAddOrEditRef" @reload-data-list="reloadList" />
</template>
