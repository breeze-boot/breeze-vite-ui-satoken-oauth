<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!--  流程实例管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { page, exportExcel, deleteInstance } from '@/api/flow/instance'
import type { InstanceRecords } from '@/api/flow/instance/type.ts'
import type { InstanceRecord, InstanceQuery } from '@/api/flow/instance/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Instance',
  inheritAttrs: false,
})

const { t } = useI18n()
const instanceQueryFormRef = ref(ElForm)
const instanceAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<InstanceQuery>({
  businessKey: '',
  name: '',
  startUserName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<InstanceRecord>({})

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
      permission: ['flow:instance:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['flow:instance:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: InstanceRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['flow:instance:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['flow:instance:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'businessKey',
      showOverflowTooltip: true,
      label: t('instance.fields.businessKey'),
    },
    {
      prop: 'startUserName',
      showOverflowTooltip: true,
      label: t('instance.fields.startUserName'),
    },
    {
      prop: 'version',
      showOverflowTooltip: true,
      label: t('instance.fields.version'),
    },
    {
      prop: 'key',
      showOverflowTooltip: true,
      label: t('instance.fields.key'),
    },
    {
      prop: 'name',
      showOverflowTooltip: true,
      label: t('instance.fields.name'),
    },
    {
      prop: 'startTime',
      showOverflowTooltip: true,
      label: t('instance.fields.startTime'),
    },
    {
      prop: 'email',
      showOverflowTooltip: true,
      label: t('instance.fields.email'),
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
        permission: ['flow:instance:modify'],
        eventHandle: (row: InstanceRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['flow:instance:info'],
        eventHandle: (row: InstanceRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['flow:instance:delete'],
        eventHandle: (row: InstanceRecord) => handleDelete([row] as InstanceRecords),
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
  instanceQueryFormRef.value.resetFields()
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
  instanceAddOrEditRef.value.init(id)
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
const handleAdd = () => {}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: InstanceRecords) => {
  const instanceIds = rows.map((item: any) => item.id)
  await deleteInstance(instanceIds)
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
  console.log(row)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: InstanceRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="instanceQueryFormRef" :model="queryParams" :inline="true">
      <!--  流程实例名 -->
      <el-form-item :label="t('instance.fields.businessKey')" prop="businessKey">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('instance.fields.businessKey')"
          v-model="queryParams.businessKey"
        />
      </el-form-item>

      <!--  流程实例编码 -->
      <el-form-item :label="t('instance.fields.startUserName')" prop="startUserName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('instance.fields.startUserName')"
          v-model="queryParams.startUserName"
        />
      </el-form-item>

      <!--  流程实例编码 -->
      <el-form-item :label="t('instance.fields.name')" prop="name">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('instance.fields.name')"
          v-model="queryParams.name"
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
    ref="instanceTableRef"
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
</template>
