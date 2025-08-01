<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 租户管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deleteTenant } from '@/api/auth/tenant'
import AddOrEdit from './components/TenantAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { ElForm } from 'element-plus'
import type { TenantRecords } from '@/api/auth/tenant/type.ts'
import { TenantRecord, TenantQuery } from '@/api/auth/tenant/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Tenant',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const tenantQueryFormRef = ref(ElForm)
const tenantAddOrEditRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<TenantQuery>({
  tenantCode: '',
  tenantName: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<TenantRecords>([])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRows = reactive<TenantRecords>([])
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
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:tenant:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:tenant:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: TenantRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:tenant:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:tenant:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'tenantName',
      showOverflowTooltip: true,
      label: t('tenant.fields.tenantName'),
    },
    {
      prop: 'tenantCode',
      showOverflowTooltip: true,
      label: t('tenant.fields.tenantCode'),
    },
  ],
  handleBtn: {
    width: 210,
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
        permission: ['auth:tenant:modify'],
        eventHandle: (row: TenantRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:tenant:info'],
        eventHandle: (row: TenantRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:tenant:delete'],
        eventHandle: (row: TenantRecord) => handleDelete([row] as TenantRecords),
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
  tenantQueryFormRef.value.resetFields()
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
  tenantAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: TenantRecords) => {
  try {
    const tenantIds = rows.map((item: any) => item.id)
    await deleteTenant(tenantIds)
    $message.success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
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
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: TenantRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="tenantQueryFormRef" :model="queryParams" :inline="true">
      <!-- 租户编码 -->
      <el-form-item :label="t('tenant.fields.tenantCode')" prop="tenantCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('tenant.fields.tenantCode')"
          v-model="queryParams.tenantCode"
        />
      </el-form-item>

      <!-- 租户名称 -->
      <el-form-item :label="t('tenant.fields.tenantName')" prop="tenantName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('tenant.fields.tenantName')"
          v-model="queryParams.tenantName"
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
    ref="tenantTableRef"
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
  <add-or-edit ref="tenantAddOrEditRef" @reload-data-list="reloadList" />
</template>
