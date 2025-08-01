<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!--  流程实例管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { page, exportExcel, deleteInstance, suspendedInstance } from '@/api/bpm/def/instance'
import type { InstanceRecords } from '@/api/bpm/def/instance/type.ts'
import type { InstanceRecord, InstanceQuery } from '@/api/bpm/def/instance/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import BpmnXmlViewDialog from '@/views/bpm/def/instance/component/BpmnXmlViewDialog.vue'
import BpmnPngViewDialog from '@/views/bpm/def/instance/component/BpmnPngViewDialog.vue'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Instance',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const instanceQueryFormRef = ref(ElForm)
const bpmnXmlViewDialogRef = ref()
const bpmnPngViewDialogRef = ref()

// 查询条件
const queryParams = reactive<InstanceQuery>({
  businessKey: '',
  procDefName: '',
  startUserName: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<InstanceRecord>({
  businessKey: '',
  email: '',
  key: '',
  name: '',
  startTime: '',
  startUserName: '',
  version: '',
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
      type: 'default',
      label: t('common.export'),
      permission: ['bpm:instance:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['bpm:instance:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'procDefKey',
      showOverflowTooltip: true,
      label: t('instance.fields.procDefKey'),
      width: 200,
    },
    {
      prop: 'procDefName',
      showOverflowTooltip: true,
      label: t('instance.fields.procDefName'),
      width: 200,
    },
    {
      prop: 'businessKey',
      showOverflowTooltip: true,
      label: t('instance.fields.businessKey'),
      width: 200,
    },
    {
      prop: 'assignee',
      showOverflowTooltip: true,
      label: t('instance.fields.assignee'),
      width: 200,
    },
    {
      prop: 'startUserId',
      showOverflowTooltip: true,
      label: t('instance.fields.startUserId'),
      width: 200,
    },
    {
      prop: 'startUserName',
      showOverflowTooltip: true,
      label: t('instance.fields.startUserName'),
      width: 200,
    },
    {
      prop: 'suspensionState',
      label: t('instance.fields.suspensionState'),
      type: 'switch',
      switch: {
        activeValue: '1',
        inactiveValue: '2',
        api: suspendedInstance,
        pk: 'procInstId',
      },
    },
    {
      prop: 'startTime',
      showOverflowTooltip: true,
      label: t('instance.fields.startTime'),
      width: 200,
    },
    {
      prop: 'version',
      showOverflowTooltip: true,
      label: t('instance.fields.version'),
      width: 50,
    },
    {
      prop: 'email',
      showOverflowTooltip: true,
      label: t('instance.fields.email'),
      width: 250,
    },
  ],
  handleBtn: {
    width: 280,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 查看
      {
        label: `${t('common.info') + t('instance.common.picture')}`,
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['bpm:instance:info'],
        eventHandle: (row: InstanceRecord) => handleViewBpmPng(row),
      },
      // 查看
      {
        label: `${t('common.info') + t('instance.common.xml')}`,
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['bpm:instance:info'],
        eventHandle: (row: InstanceRecord) => handleViewBpmnXml(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['bpm:instance:delete'],
        eventHandle: (row: InstanceRecord) => handleDelete([row] as InstanceRecords),
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
 * 详情
 *
 * @param row 参数
 */
const handleViewBpmnXml = (row: any) => {
  bpmnXmlViewDialogRef.value.init(row.procDefKey, row.version)
}
/**
 * 详情
 *
 * @param row 参数
 */
const handleViewBpmPng = (row: any) => {
  bpmnPngViewDialogRef.value.init(row.procDefKey, row.version)
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: InstanceRecords) => {
  try {
    const instanceIds = rows.map((item: any) => item.id)
    await deleteInstance(instanceIds)
    $message.success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
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
    ref="instanceTableRef"
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

  <bpmn-xml-view-dialog ref="bpmnXmlViewDialogRef" />

  <bpmn-png-view-dialog ref="bpmnPngViewDialogRef" />
</template>
