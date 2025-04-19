<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 表弹出框 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { genCode, listTables } from '@/api/dev/tables/index.ts'
import BTable from '@/components/Table/BTable/index.vue'
import { useI18n } from 'vue-i18n'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { ElForm } from 'element-plus'
import ColumnList from '@/views/dev/tables/components/ColumnList.vue'
import { Table, TableQuery } from '@/api/dev/tables/type.ts'
import { saveTypeFile } from '@/utils/download.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'TableInfo',
  inheritAttrs: false,
})
const columnListRef = ref(ElForm)
const tableInfoTableRef = ref()

const { t } = useI18n()
let currentRows = reactive<Table[]>([])

// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'
// 查询条件
const queryParams = reactive<TableQuery>({
  tableName: '',
})
const tableInfo = reactive<TableInfo>({
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('gen.common.gen'),
      permission: ['gen:dev:code'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleGen(),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'tableName',
      showOverflowTooltip: true,
      label: t('gen.table.fields.tableName'),
    },
    {
      prop: 'tableComment',
      showOverflowTooltip: true,
      label: t('gen.table.fields.tableComment'),
    },
    {
      prop: 'tableType',
      showOverflowTooltip: true,
      label: t('gen.table.fields.tableType'),
    },
    {
      prop: 'createTime',
      showOverflowTooltip: true,
      label: t('gen.table.fields.createTime'),
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
        permission: ['gen:db:columns'],
        eventHandle: (row: any) => handleInfo(row),
      },
    ],
  },
})

const handleInfo = (row: any) => {
  columnListRef.value.init(row.tableName)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: Table[]) => {
  currentRows = rows
}

const handleGen = async () => {
  try {
    const response: any = await genCode(currentRows.map((item: Table) => item.tableName))
    saveTypeFile(response, response.type, '代码生成.zip')
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}` + err.message)
  }
}
</script>

<template>
  <b-table
    ref="tableInfoTableRef"
    pk="tableName"
    :pager="false"
    :list-api="listTables"
    :select="select"
    :tableIndex="tableIndex"
    :query="queryParams"
    :refresh="refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
  />

  <column-list ref="columnListRef" />
</template>
