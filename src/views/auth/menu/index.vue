<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 菜单管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { list, exportExcel, deleteMenu } from '@/api/auth/menu'
import BTreeTable from '@/components/Table/BTreeTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import AddOrEdit from './components/MenuAddOrEdit.vue'
import { ElForm } from 'element-plus'
import type { MenuRecords } from '@/api/auth/menu/type.ts'
import { MenuRecord, MenuQuery } from '@/api/auth/menu/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { DIALOG_FLAG } from '@/utils/common.ts'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Menus',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const menuQueryFormRef = ref(ElForm)
const menuAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<MenuQuery>({
  title: '',
  name: '',
})

let checkedRows = reactive<MenuRecords>([])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRows = reactive<MenuRecords>([])

const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'

const tableInfo = reactive<TableInfo>({
  // 字典
  dict: ['HIDDEN', 'MENU_TYPE', 'HREF', 'KEEPALIVE'],
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:menu:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(undefined, DIALOG_FLAG.ADD),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:menu:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:menu:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      width: 150,
      fixed: true,
      prop: 'title',
      align: 'left',
      showOverflowTooltip: true,
      label: t('menu.fields.title'),
    },
    {
      prop: 'name',
      width: 100,
      showOverflowTooltip: true,
      label: t('menu.fields.name'),
    },
    {
      prop: 'sort',
      showOverflowTooltip: true,
      label: t('menu.fields.sort'),
    },
    {
      prop: 'icon',
      width: 70,
      align: 'center',
      showOverflowTooltip: true,
      label: t('menu.fields.icon'),
      type: 'icon',
    },
    {
      prop: 'permission',
      width: 150,
      showOverflowTooltip: true,
      label: t('menu.fields.permission'),
    },
    {
      prop: 'path',
      width: 100,
      showOverflowTooltip: true,
      label: t('menu.fields.path'),
    },
    {
      prop: 'component',
      width: 150,
      showOverflowTooltip: true,
      label: t('menu.fields.component'),
    },
    {
      prop: 'href',
      width: 100,
      showOverflowTooltip: true,
      label: t('menu.fields.href'),
      type: 'dict',
      dict: 'HREF',
    },
    {
      prop: 'hidden',
      width: 100,
      showOverflowTooltip: true,
      label: t('menu.fields.hidden'),
      type: 'dict',
      dict: 'HIDDEN',
    },
    {
      prop: 'keepAlive',
      width: 100,
      showOverflowTooltip: true,
      label: t('menu.fields.keepAlive'),
      type: 'dict',
      dict: 'KEEPALIVE',
    },
    {
      prop: 'type',
      width: 100,
      showOverflowTooltip: true,
      label: t('menu.fields.type'),
      type: 'dict',
      dict: 'MENU_TYPE',
    },
  ],
  handleBtn: {
    width: 310,
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
        permission: ['auth:menu:modify'],
        eventHandle: (row: MenuRecord) => handleUpdate(row),
      },
      // 详情
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:menu:info'],
        eventHandle: (row: MenuRecord) => handleInfo(row),
      },
      // 添加子菜单
      {
        label: t('menu.common.addSubMenu'),
        type: 'warning',
        icon: 'add',
        event: 'add',
        permission: ['auth:menu:create'],
        eventHandle: (row: MenuRecord) => handleAdd(row.id, DIALOG_FLAG.ADD_SUB),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:menu:delete'],
        eventHandle: (row: MenuRecord) => handleDelete(row),
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
  menuQueryFormRef.value.resetFields()
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
 * @param id     主键
 * @param flag   标识
 */
const AddOrEditHandle = (id?: number, flag?: DIALOG_FLAG) => {
  menuAddOrEditRef.value.init(id, flag)
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
const handleAdd = (id: number | undefined, flag: DIALOG_FLAG) => {
  AddOrEditHandle(id, flag)
}

/**
 * 删除
 *
 * @param row 行数据
 */
const handleDelete = async (row: MenuRecord) => {
  try {
    await deleteMenu(JSONBigInt.parse(row.id))
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
  AddOrEditHandle(row.id, DIALOG_FLAG.EDIT)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: MenuRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="menuQueryFormRef" :model="queryParams" :inline="true">
      <!-- 菜单名 -->
      <el-form-item :label="t('menu.fields.name')" prop="name">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('menu.fields.name')"
          v-model="queryParams.name"
        />
      </el-form-item>

      <!-- 菜单标题 -->
      <el-form-item :label="t('menu.fields.title')" prop="title">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('menu.fields.title')"
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

  <b-tree-table
    ref="menuTableRef"
    :refresh="refresh"
    :select="select"
    :list-api="list"
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
  <add-or-edit ref="menuAddOrEditRef" @reload-data-list="reloadList" />
</template>
