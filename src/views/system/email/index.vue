<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->
<!-- 邮箱管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { page, exportExcel, deleteEmail, open } from '@/api/system/email'
import type { EmailRecords, EmailRecord, EmailQuery } from '@/api/system/email/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/EmailAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Email',
  inheritAttrs: false,
})

const { t } = useI18n()
const emailQueryFormRef = ref(ElForm)
const emailAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<EmailQuery>({
  username: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<EmailRecord>({})

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
      permission: ['sys:email:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:email:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: EmailRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:email:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:email:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'smtpHost',
      showOverflowTooltip: true,
      label: t('email.fields.smtpHost'),
      width: 200,
    },
    {
      prop: 'port',
      showOverflowTooltip: true,
      label: t('email.fields.port'),
    },
    {
      prop: 'username',
      sortable: 'custom',
      showOverflowTooltip: true,
      label: t('email.fields.username'),
      width: 150,
    },
    {
      prop: 'password',
      showOverflowTooltip: true,
      label: t('email.fields.password'),
      width: 150,
    },
    {
      prop: 'encoding',
      showOverflowTooltip: true,
      label: t('email.fields.encoding'),
    },
    {
      prop: 'smtpDebug',
      showOverflowTooltip: true,
      label: t('email.fields.smtpDebug'),
    },
    {
      prop: 'smtpSocketFactoryClass',
      showOverflowTooltip: true,
      label: t('email.fields.smtpSocketFactoryClass'),
      width: 150,
    },
    {
      prop: 'status',
      label: t('email.fields.status'),
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
      label: t('email.fields.auth'),
    },
    {
      prop: 'protocol',
      showOverflowTooltip: true,
      label: t('email.fields.protocol'),
    },
    {
      prop: 'ssl',
      showOverflowTooltip: true,
      label: t('email.fields.ssl'),
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
        permission: ['sys:email:modify'],
        eventHandle: (row: EmailRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:email:info'],
        eventHandle: (row: EmailRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:email:delete'],
        eventHandle: (row: EmailRecord) => handleDelete([row] as EmailRecords),
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
const handleDelete = async (rows: EmailRecords) => {
  const emailIds = rows.map((item: any) => item.id)
  await deleteEmail(emailIds)
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
const handleUpdate = (row: EmailRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: EmailRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="emailQueryFormRef" :model="queryParams" :inline="true">
      <!-- 用户名 -->
      <el-form-item :label="t('email.fields.username')" prop="username">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('email.fields.username')"
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
