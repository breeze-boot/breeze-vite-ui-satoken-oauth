<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 客户端管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { page, exportExcel, deleteClient } from '@/api/auth/client'
import AddOrUpdate from './components/ClientAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { ClientRecords } from '@/api/auth/client/type.ts'
import { ClientRecord, ClientQuery } from '@/api/auth/client/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Client',
  inheritAttrs: false,
})

const { t } = useI18n()
const clientQueryFormRef = ref(ElForm)
const clientAddOrUpdateRef = ref()

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
})

/**
 * 查询条件
 */
const queryParams = reactive<ClientQuery>({
  clientCode: '',
  clientName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<ClientRecords>([])
let currentRows = reactive<ClientRecords>([])

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
      permission: ['auth:client:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:client:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:client:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:client:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'clientId',
      showOverflowTooltip: true,
      label: t('client.fields.clientId'),
    },
    {
      prop: 'clientName',
      showOverflowTooltip: true,
      label: t('client.fields.clientName'),
    },
    {
      prop: 'clientSecret',
      showOverflowTooltip: true,
      label: t('client.fields.clientSecret'),
    },
    {
      prop: 'clientIdIssuedAt',
      showOverflowTooltip: true,
      label: t('client.fields.clientIdIssuedAt'),
    },
    {
      prop: 'redirectUris',
      showOverflowTooltip: true,
      label: t('client.fields.redirectUris'),
    },
    {
      prop: 'scopes',
      showOverflowTooltip: true,
      label: t('client.fields.scopes'),
    },
    {
      prop: 'authorizationGrantTypes',
      showOverflowTooltip: true,
      label: t('client.fields.authorizationGrantTypes'),
    },
    {
      prop: 'clientAuthenticationMethods',
      showOverflowTooltip: true,
      label: t('client.fields.clientAuthenticationMethods'),
    },
    {
      prop: 'clientSecretExpiresAt',
      showOverflowTooltip: true,
      label: t('client.fields.clientSecretExpiresAt'),
    },
    {
      prop: 'clientSettings',
      showOverflowTooltip: true,
      label: t('client.fields.clientSettings'),
      children: [
        {
          prop: 'requireProofKey',
          showOverflowTooltip: true,
          label: t('client.fields.requireProofKey'),
        },
        {
          prop: 'requireAuthorizationConsent',
          showOverflowTooltip: true,
          label: t('client.fields.requireAuthorizationConsent'),
        },
        {
          prop: 'jwkSetUrl',
          showOverflowTooltip: true,
          label: t('client.fields.jwkSetUrl'),
        },
        {
          prop: 'tokenEndpointAuthenticationSigningAlgorithm',
          showOverflowTooltip: true,
          label: t('client.fields.tokenEndpointAuthenticationSigningAlgorithm'),
        },
      ],
    },
    {
      prop: 'tokenSettings',
      showOverflowTooltip: true,
      label: t('client.fields.tokenSettings'),
      children: [
        {
          prop: 'idTokenSignatureAlgorithm',
          showOverflowTooltip: true,
          label: t('client.fields.idTokenSignatureAlgorithm'),
        },
        {
          prop: 'accessTokenFormat',
          showOverflowTooltip: true,
          label: t('client.fields.accessTokenFormat'),
        },
        {
          prop: 'authorizationCodeTimeToLive',
          showOverflowTooltip: true,
          label: t('client.fields.authorizationCodeTimeToLive'),
        },
        {
          prop: 'accessTokenTimeToLive',
          showOverflowTooltip: true,
          label: t('client.fields.accessTokenTimeToLive'),
        },
        {
          prop: 'reuseRefreshTokens',
          showOverflowTooltip: true,
          label: t('client.fields.reuseRefreshTokens'),
        },
        {
          prop: 'refreshTokenTimeToLive',
          showOverflowTooltip: true,
          label: t('client.fields.refreshTokenTimeToLive'),
        },
      ],
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
        permission: ['auth:client:modify'],
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:client:info'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:client:delete'],
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
  clientQueryFormRef.value.resetFields()
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
const addOrUpdateHandle = (id?: number) => {
  clientAddOrUpdateRef.value.init(id)
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
  addOrUpdateHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: ClientRecords) => {
  const clientIds = rows.map((item: any) => item.id)
  await deleteClient(clientIds)
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
  addOrUpdateHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: ClientRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: ClientRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="clientQueryFormRef" :model="queryParams" :inline="true">
      <!-- 客户端名称 -->
      <el-form-item :label="t('client.fields.clientName')" prop="clientName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('client.fields.clientName')"
          v-model="queryParams.clientName"
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
    ref="clientTableRef"
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
  <add-or-update ref="clientAddOrUpdateRef" @reload-data-list="reloadList" />
</template>
