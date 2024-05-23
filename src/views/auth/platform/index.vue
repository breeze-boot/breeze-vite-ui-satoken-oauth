<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!-- 平台管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { page, exportExcel, deletePlatform } from '@/api/auth/platform'
import type { PlatformRecords } from '@/api/auth/platform/type.ts'
import type { PlatformRecord, PlatformQuery } from '@/api/auth/platform/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/PlatformAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Platform',
  inheritAttrs: false,
})

const { t } = useI18n()
const platformQueryFormRef = ref(ElForm)
const platformAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<PlatformQuery>({
  platformCode: '',
  platformName: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<PlatformRecord>({})

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
      permission: ['auth:platform:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:platform:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: PlatformRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:platform:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:platform:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'platformName',
      sortable: 'custom',
      showOverflowTooltip: true,
      label: t('platform.fields.platformName'),
      type: 'input',
      formOptions: {
        rules: [
          {
            required: true,
            message: 'Please input platform name',
            trigger: 'blur',
          },
        ],
      },
    },
    {
      prop: 'platformCode',
      sortable: 'custom',
      showOverflowTooltip: true,
      label: t('platform.fields.platformCode'),
    },
    {
      prop: 'description',
      showOverflowTooltip: true,
      label: t('platform.fields.description'),
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
        permission: ['auth:platform:modify'],
        eventHandle: (row: PlatformRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:platform:info'],
        eventHandle: (row: PlatformRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:platform:delete'],
        eventHandle: (row: PlatformRecord) => handleDelete([row] as PlatformRecords),
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
  platformQueryFormRef.value.resetFields()
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
  platformAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: PlatformRecords) => {
  const platformIds = rows.map((item: any) => item.id)
  await deletePlatform(platformIds)
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
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: PlatformRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="platformQueryFormRef" :model="queryParams" :inline="true">
      <!-- 平台名 -->
      <el-form-item :label="t('platform.fields.platformName')" prop="platformName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('platform.fields.platformCode')"
          v-model="queryParams.platformName"
        />
      </el-form-item>

      <!-- 平台编码 -->
      <el-form-item :label="t('platform.fields.platformCode')" prop="platformCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('platform.fields.platformCode')"
          v-model="queryParams.platformCode"
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
    ref="platformTableRef"
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
  <add-or-edit ref="platformAddOrEditRef" @reload-data-list="reloadList" />
</template>
