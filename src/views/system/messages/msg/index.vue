<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 消息管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteMsg } from '@/api/system/messages/msg'
import { ElForm, ElMessage } from 'element-plus'
import AddOrEdit from './components/MsgAddOrEdit.vue'
import type { MsgRecords } from '@/api/system/messages/msg/type.ts'
import { MsgRecord, MsgQuery } from '@/api/system/messages/msg/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import SendMsgSetting from '@/views/system/messages/msg/components/SendMsgSetting.vue'

defineOptions({
  name: 'Msg',
  inheritAttrs: false,
})

const { t } = useI18n()
const msgQueryFormRef = ref(ElForm)
const msgAddOrEditRef = ref()
const sendMsgSettingRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<MsgQuery>({
  current: 1,
  size: 10,
})

let checkedRows = reactive<MsgRecords>([])
let currentRows = reactive<MsgRecords>([])

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
      permission: ['sys:msg:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:msg:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:msg:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:msg:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'title',
      showOverflowTooltip: true,
      label: t('msg.fields.title'),
    },
    {
      prop: 'code',
      showOverflowTooltip: true,
      label: t('msg.fields.code'),
    },
    {
      prop: 'type',
      showOverflowTooltip: true,
      label: t('msg.fields.type'),
    },
    {
      prop: 'level',
      showOverflowTooltip: true,
      label: t('msg.fields.level'),
    },
    {
      prop: 'content',
      showOverflowTooltip: true,
      label: t('msg.fields.content'),
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
        permission: ['sys:msg:modify'],
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:msg:info'],
      },
      // 推送
      {
        label: t('msg.common.send'),
        type: 'warning',
        icon: 'send',
        event: 'send',
        permission: ['sys:msg:send'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:msg:delete'],
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
  msgQueryFormRef.value.resetFields()
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
  msgAddOrEditRef.value.init(id)
}

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  switch (event) {
    case 'edit':
      handleUpdate(row)
      break
    case 'send':
      handleSend(row)
      break
    case 'view':
      handleView(row)
      break
    case 'delete':
      handleDelete([row])
      break
    default:
      break
  }
}

/**
 * 表格组件头部按钮事件分发
 *
 * @param event 事件
 * @param rows  行数据
 */
const handleTableHeaderBtnClick = (event: string, rows: any) => {
  switch (event) {
    case 'add':
      handleAdd()
      break
    case 'del':
      handleDelete(rows)
      break
    default:
      break
  }
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleView = (row: any) => {
  console.log(row)
}

/**
 * 添加
 */
const handleAdd = () => {
  AddOrEditHandle()
}

/**
 * 推送消息
 */
const handleSend = (row: any) => {
  sendMsgSettingRef.value.init(row.id)
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
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: MsgRecords) => {
  const msgTemplateIds = rows.map((item: any) => item.id)
  await deleteMsg(msgTemplateIds)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: MsgRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MsgRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="msgQueryFormRef" :model="queryParams" :inline="true">
      <!-- 消息标题 -->
      <el-form-item :label="t('msg.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('msg.fields.title')"
          v-model="queryParams.title"
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
    ref="templateTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :dict="tableInfo.dict"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @handle-table-row-btn-click="handleTableRowBtnClick"
    @handle-table-header-btn-click="handleTableHeaderBtnClick"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="msgAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 新增 / 修改 Dialog -->
  <send-msg-setting ref="sendMsgSettingRef" />
</template>
