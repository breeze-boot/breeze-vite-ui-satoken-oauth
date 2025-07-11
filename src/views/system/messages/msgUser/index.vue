<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 用户消息管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteMsgUser } from '@/api/system/messages/msgUser'
import { ElForm } from 'element-plus'
import type { MsgUserRecords } from '@/api/system/messages/msgUser/type.ts'
import { MsgUserRecord, MsgUserQuery } from '@/api/system/messages/msgUser/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import BTable from '@/components/Table/BTable/index.vue'

defineOptions({
  name: 'MsgUser',
  inheritAttrs: false,
})

const { t } = useI18n()
const msgUserQueryFormRef = ref(ElForm)

/**
 * 查询条件
 */
const queryParams = reactive<MsgUserQuery>({
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<MsgUserRecords>([])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRows = reactive<MsgUserRecords>([])
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'

const tableInfo = reactive<TableInfo>({
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:msgUser:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: MsgUserRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:msgUser:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:msgUser:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'title',
      showOverflowTooltip: true,
      label: t('msgUser.fields.title'),
    },
    {
      prop: 'code',
      showOverflowTooltip: true,
      label: t('msgUser.fields.code'),
    },
    {
      prop: 'type',
      showOverflowTooltip: true,
      label: t('msgUser.fields.type'),
    },
    {
      prop: 'level',
      showOverflowTooltip: true,
      label: t('msgUser.fields.level'),
    },
    {
      prop: 'username',
      showOverflowTooltip: true,
      label: t('msgUser.fields.username'),
    },
    {
      prop: 'createTime',
      showOverflowTooltip: true,
      label: t('msgUser.fields.createTime'),
    },
    {
      prop: 'isRead',
      showOverflowTooltip: true,
      label: t('msgUser.fields.isRead'),
    },
    {
      prop: 'isClose',
      showOverflowTooltip: true,
      label: t('msgUser.fields.isClose'),
    },
  ],
  handleBtn: {
    width: 160,
    label: t('common.operate'),
    fixed: 'right',
    link: true,
    btList: [
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:msgUser:info'],
        eventHandle: (rows: MsgUserRecords) => handleInfo(rows),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:msgUser:delete'],
        eventHandle: (row: MsgUserRecord) => handleDelete([row] as MsgUserRecords),
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
  msgUserQueryFormRef.value.resetFields()
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
const handleInfo = (row: any) => {
  console.log(row)
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: MsgUserRecords) => {
  try {
    const msgUserIds = rows.map((item: any) => item.id)
    await deleteMsgUser(msgUserIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MsgUserRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="msgUserQueryFormRef" :model="queryParams" :inline="true">
      <!-- 消息标题 -->
      <el-form-item :label="t('msgUser.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('msgUser.fields.title')"
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
    ref="msgUserTableRef"
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
</template>
