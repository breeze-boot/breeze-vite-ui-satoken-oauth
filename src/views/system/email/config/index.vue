<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->
<!-- 邮箱管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { page, exportExcel, deleteEmailConfig, open } from '@/api/system/email/emailConfig'
import type { EmailConfigRecords, EmailConfigRecord, EmailConfigQuery } from '@/api/system/email/emailConfig/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/EmailConfigAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'EmailConfig',
  inheritAttrs: false,
})

const { t } = useI18n()
const emailQueryFormRef = ref(ElForm)
const emailAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<EmailConfigQuery>({
  username: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<EmailConfigRecord>({})

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
      permission: ['sys:emailConfig:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:emailConfig:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: EmailConfigRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:emailConfig:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:emailConfig:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'smtpHost',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.smtpHost'),
      width: 200,
    },
    {
      prop: 'port',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.port'),
    },
    {
      prop: 'username',
      sortable: 'custom',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.username'),
      width: 150,
    },
    {
      prop: 'password',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.password'),
      width: 150,
    },
    {
      prop: 'encoding',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.encoding'),
    },
    {
      prop: 'smtpDebug',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.smtpDebug'),
    },
    {
      prop: 'smtpSocketFactoryClass',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.smtpSocketFactoryClass'),
      width: 150,
    },
    {
      prop: 'status',
      label: t('emailConfig.fields.status'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'id',
        status: 'status',
      },
    },
    {
      prop: 'auth',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.auth'),
    },
    {
      prop: 'protocol',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.protocol'),
    },
    {
      prop: 'ssl',
      showOverflowTooltip: true,
      label: t('emailConfig.fields.ssl'),
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
        permission: ['sys:emailConfig:modify'],
        eventHandle: (row: EmailConfigRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:emailConfig:info'],
        eventHandle: (row: EmailConfigRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:emailConfig:delete'],
        eventHandle: (row: EmailConfigRecord) => handleDelete([row] as EmailConfigRecords),
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
  emailQueryFormRef.value.resetFields()
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
  emailAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: EmailConfigRecords) => {
  const emailIds = rows.map((item: any) => item.id)
  await deleteEmailConfig(emailIds)
  ElMessage.success({
    message: `${t('common.delete') + t('common.success')}`,
    duration: 1000,
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
const handleUpdate = (row: EmailConfigRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: EmailConfigRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="emailQueryFormRef" :model="queryParams" :inline="true">
      <!-- 用户名 -->
      <el-form-item :label="t('emailConfig.fields.username')" prop="username">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('emailConfig.fields.username')"
          v-model="queryParams.username"
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
    ref="emailTableRef"
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
  <add-or-edit ref="emailAddOrEditRef" @reload-data-list="reloadList" />
</template>
