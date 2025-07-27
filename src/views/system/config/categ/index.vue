<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->
<!-- 系统参数分类表管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { deleteSysConfigCateg, exportExcel, page } from '@/api/system/config/categ'
import type { configCategQuery, configCategRecord, configCategRecords } from '@/api/system/config/categ/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/ConfigCategAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'SysConfigCateg',
  inheritAttrs: false,
})

const { t } = useI18n()
const configCategQueryFormRef = ref(ElForm)
const configCategAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<configCategQuery>({
  id: '',
  categCode: '',
  categName: '',
  description: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<configCategRecord>({
  id: '',
  categCode: '',
  categName: '',
  description: '',
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
      type: 'primary',
      label: t('common.add'),
      permission: ['sys:configCateg:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:configCateg:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: configCategRecords) => handleDelete(rows),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'categCode',
      showOverflowTooltip: true,
      label: t('configCateg.fields.categCode'),
    },
    {
      prop: 'categName',
      showOverflowTooltip: true,
      label: t('configCateg.fields.categName'),
    },
    {
      prop: 'description',
      showOverflowTooltip: true,
      label: t('configCateg.fields.description'),
    },
  ],
  handleBtn: {
    width: 210,
    label: t('common.operate'),
    link: true,
    btList: [
      // 编辑
      {
        label: t('common.edit'),
        type: 'success',
        icon: 'edit',
        event: 'edit',
        permission: ['sys:configCateg:modify'],
        eventHandle: (row: configCategRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:configCateg:info'],
        eventHandle: (row: configCategRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:configCateg:delete'],
        eventHandle: (row: configCategRecord) => handleDelete([row] as configCategRecords),
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
  configCategQueryFormRef.value.resetFields()
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
  configCategAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: configCategRecords) => {
  try {
    const sysConfigCategIds = rows.map((item: any) => item.id)
    await deleteSysConfigCateg(sysConfigCategIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: configCategRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: configCategRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="configCategQueryFormRef" :model="queryParams" :inline="true">
      <el-form-item :label="t('configCateg.fields.categCode')" prop="categCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('configCateg.fields.categCode')"
          v-model="queryParams.categCode"
        />
      </el-form-item>

      <el-form-item :label="t('configCateg.fields.categName')" prop="categName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('configCateg.fields.categName')"
          v-model="queryParams.categName"
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
    ref="sysConfigCategTableRef"
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
  <add-or-edit ref="configCategAddOrEditRef" @reload-data-list="reloadList" />
</template>
