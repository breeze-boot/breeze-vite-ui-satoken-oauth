<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 表弹出框 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { listTables } from '@/api/dev/tables/index.ts'
import BTable from '@/components/Table/BTable/index.vue'
import { useI18n } from 'vue-i18n'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { ElForm } from 'element-plus'
import ColumnList from '@/views/dev/tables/components/ColumnList.vue'

defineOptions({
  name: 'TableInfoList',
  inheritAttrs: false,
})
const columnListRef = ref(ElForm)
const tableInfoTableRef = ref()

const { t } = useI18n()
const visible = ref<boolean>(false)
const currentRow = ref<any>()

// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo = reactive<TableInfo>({
  // 表格顶部按钮
  tbHeaderBtn: [],
  // 表格字段配置
  fieldList: [
    {
      prop: 'tableName',
      showOverflowTooltip: true,
      label: t('table.fields.tableName'),
    },
    {
      prop: 'remarks',
      showOverflowTooltip: true,
      label: t('table.fields.remarks'),
    },
    {
      prop: 'tableType',
      showOverflowTooltip: true,
      label: t('table.fields.tableType'),
    },
  ],
  handleBtn: {
    minWidth: 100,
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
        permission: ['auth:db:columns'],
        eventHandle: (row: any) => handleInfo(row),
      },
    ],
  },
})

/**
 * 初始化
 */
const init = async (row: any) => {
  currentRow.value = row
  visible.value = true
}

const handleInfo = (row: any) => {
  columnListRef.value.init(row.tableName)
}

defineExpose({
  init,
})
</script>

<template>
  <b-table
    ref="tableInfoTableRef"
    :pager="false"
    :list-api="listTables"
    :select="select"
    :tableIndex="tableIndex"
    :refresh="refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :handle-btn="tableInfo.handleBtn"
  />

  <column-list ref="columnListRef" />
</template>
