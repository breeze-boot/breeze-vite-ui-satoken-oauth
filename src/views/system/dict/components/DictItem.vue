<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典项查看抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { list, deleteDictItem } from '@/api/system/dictItem/index.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { DictItemQuery, DictItemRecords } from '@/api/system/dictItem/type.ts'
import { ElMessage } from 'element-plus'
import AddOrUpdate from '@/views/system/dict/components/DictItemAddOrEdit.vue'

defineOptions({
  name: 'DictItem',
  inheritAttrs: false,
})

const direction = ref('rtl')
const { t } = useI18n()
const visible = ref(false)
const dictItemTableRef = ref()
const dictItemAddOrUpdateRef = ref()

let currentRows = reactive<DictItemRecords>([])

/**
 * 查询条件
 */
const queryParams = reactive<DictItemQuery>({
  dictId: 0,
  dictCode: '',
  dictName: '',
})
const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  mountedRefresh: true,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 字典
  dict: [],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['sys:dict:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:dict:delete'],
      event: 'del',
      icon: 'delete',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'label',
      showOverflowTooltip: true,
      label: t('dictItem.fields.label'),
    },
    {
      prop: 'value',
      showOverflowTooltip: true,
      label: t('dictItem.fields.value'),
    },
    {
      prop: 'type',
      showOverflowTooltip: true,
      label: t('dictItem.fields.type'),
      type: 'tag',
      tag: {
        primary: { name: 'primary', type: 'primary' },
        success: { name: 'success', type: 'success' },
        warning: { name: 'warning', type: 'warning' },
        danger: { name: 'danger', type: 'danger' },
        info: { name: 'info', type: 'info' },
      },
    },
  ],
  handleBtn: {
    minWidth: 350,
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
        permission: ['sys:dict:modify'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:dict:delete'],
      },
    ],
  },
})

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  console.log(row)
  switch (event) {
    case 'edit':
      handleUpdate(row)
      break
    default:
      break
  }
}

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  visible.value = true
  if (id) {
    await getInfo(id)
  }
}

/**
 * 初始化任务的日志
 *
 * @param id
 */
const getInfo = async (id: number) => {
  queryParams.dictId = id
  reloadList()
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
 * 刷新表格
 */
const reloadList = () => {
  tableInfo.refresh = Math.random()
}

/**
 * 添加
 */
const handleAdd = () => {
  addOrUpdateHandle(queryParams.dictId)
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
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: DictItemRecords) => {
  const dictIds = rows.map((item: any) => item.id)
  await deleteDictItem(dictIds)
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
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: DictItemRecords) => {
  currentRows = rows
  console.log(currentRows)
}

/**
 * 添加或者修改
 *
 * @param id 主键
 */
const addOrUpdateHandle = (id?: number) => {
  dictItemAddOrUpdateRef.value.init(id)
}

defineExpose({
  init,
})
</script>

<template>
  <el-drawer size="50%" v-model="visible" :title="t('dictItem.common.dictItemViewing')" :direction="direction">
    <template #header>
      <h4>{{ $t('dictItem.common.dictItemViewing') }}</h4>
    </template>
    <template #default>
      <b-table
        ref="dictItemTableRef"
        :pager="false"
        :list-api="list"
        :dict="tableInfo.dict"
        :tableIndex="tableInfo.tableIndex"
        :query="queryParams"
        :refresh="tableInfo.refresh"
        :mountedRefresh="tableInfo.mountedRefresh"
        :field-list="tableInfo.fieldList"
        :tb-header-btn="tableInfo.tbHeaderBtn"
        :select="tableInfo.select"
        :handle-btn="tableInfo.handleBtn"
        table-height="80%"
        @handle-table-row-btn-click="handleTableRowBtnClick"
        @handle-table-header-btn-click="handleTableHeaderBtnClick"
        @selection-change="handleSelectionChange"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 新增 / 修改 Dialog -->
  <add-or-update ref="dictItemAddOrUpdateRef" @reload-data-list="reloadList" />
</template>
