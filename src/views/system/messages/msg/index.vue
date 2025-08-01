<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 消息管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteMsg } from '@/api/system/messages/msg'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import SendMsgSetting from '@/views/system/messages/msg/components/SendMsgSetting.vue'
import { ElForm } from 'element-plus'
import AddOrEdit from './components/MsgAddOrEdit.vue'
import type { MsgRecords } from '@/api/system/messages/msg/type.ts'
import { MsgRecord, MsgQuery } from '@/api/system/messages/msg/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Msg',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const msgQueryFormRef = ref(ElForm)
const msgAddOrEditRef = ref()
const sendMsgSettingRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<MsgQuery>({
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<MsgRecords>([])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRows = reactive<MsgRecords>([])
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
      permission: ['sys:msg:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:msg:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: MsgRecords) => handleDelete(rows),
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
    width: 280,
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
        eventHandle: (row: MsgRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:msg:info'],
        eventHandle: (row: MsgRecord) => handleInfo(row),
      },
      // 推送
      {
        label: t('msg.common.send'),
        type: 'warning',
        icon: 'send',
        event: 'send',
        permission: ['sys:msg:send'],
        eventHandle: (row: MsgRecord) => handleSend(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:msg:delete'],
        eventHandle: (rows: MsgRecords) => handleDelete(rows),
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
 * 详情
 *
 * @param row 参数
 */
const handleInfo = (row: MsgRecord) => {
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
const handleSend = (row: MsgRecord) => {
  sendMsgSettingRef.value.init(row.id)
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: MsgRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: MsgRecords) => {
  try {
    const msgTemplateIds = rows.map((item: any) => item.id)
    await deleteMsg(msgTemplateIds)
    $message.success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
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
          {{ t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="templateTableRef"
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
  <add-or-edit ref="msgAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 新增 / 修改 Dialog -->
  <send-msg-setting ref="sendMsgSettingRef" />
</template>
