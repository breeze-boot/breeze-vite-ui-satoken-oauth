<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 表弹出框 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { listColumns } from '@/api/dev/tables/index.ts'
import BTable from '@/components/Table/BTable/index.vue'
import { useI18n } from 'vue-i18n'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'

defineOptions({
  name: 'ColumnList',
  inheritAttrs: false,
})
/**
 * 查询条件
 */
const queryParams = reactive<any>({ tableName: '', permissionId: '' })
const disableColumn = ['id', 'is_delete', 'tenant_id', 'delete_by']
const { t } = useI18n()
const visible = ref<boolean>(false)
const direction = ref('rtl')

// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo: TableInfo = {
  // 表格顶部按钮
  tbHeaderBtn: [],
  // 表格字段配置
  fieldList: [
    {
      prop: 'columnName',
      showOverflowTooltip: true,
      label: t('column.fields.columnName'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'dataType',
      showOverflowTooltip: true,
      label: t('gen.column.fields.dataType'),
      align: 'center',
      width: 100,
    },
    {
      prop: 'columnComment',
      showOverflowTooltip: true,
      label: t('gen.column.fields.columnComment'),
      align: 'center',
      width: 150,
    },
    {
      prop: 'columnKey',
      showOverflowTooltip: true,
      label: t('gen.column.fields.columnKey'),
      align: 'center',
      width: 80,
    },
    {
      prop: 'extra',
      showOverflowTooltip: true,
      label: t('gen.column.fields.extra'),
      align: 'center',
      width: 100,
    },
    {
      prop: 'ordinalPosition',
      showOverflowTooltip: true,
      label: t('gen.column.fields.ordinalPosition'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'isNullable',
      showOverflowTooltip: true,
      label: t('gen.column.fields.isNullable'),
      align: 'center',
      width: 150,
    },
    {
      prop: 'columnDefault',
      showOverflowTooltip: true,
      label: t('gen.column.fields.columnDefault'),
      align: 'center',
      width: 150,
    },
    {
      prop: 'characterMaximumLength',
      showOverflowTooltip: true,
      label: t('gen.column.fields.characterMaximumLength'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'numericPrecision',
      showOverflowTooltip: true,
      label: t('gen.column.fields.numericPrecision'),
      align: 'center',
      width: 100,
    },
    {
      prop: 'numericScale',
      showOverflowTooltip: true,
      label: t('gen.column.fields.numericScale'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'datetimePrecision',
      showOverflowTooltip: true,
      label: t('gen.column.fields.datetimePrecision'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'characterSetName',
      showOverflowTooltip: true,
      label: t('gen.column.fields.characterSetName'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'collationName',
      showOverflowTooltip: true,
      label: t('gen.column.fields.collationName'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'columnType',
      showOverflowTooltip: true,
      label: t('gen.column.fields.columnType'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'privileges',
      showOverflowTooltip: true,
      label: t('gen.column.fields.privileges'),
      align: 'center',
      width: 120,
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('gen.column.fields.status'),
      type: 'select',
      width: 200,
      formOptions: {
        isDisabled: (field: any, row: any) => {
          return disableColumn.some((item) => item === row.columnName)
        },
        options: [
          {
            label: '显示',
            value: true,
          },
          {
            label: '隐藏',
            value: false,
          },
        ],
        handleChange: async (row: any) => {
          if (row.status) {
            return
          }
        },
      },
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('column.fields.status'),
      type: 'radio',
      width: 200,
      formOptions: {
        isDisabled: (field: any, row: any) => {
          return disableColumn.some((item) => item === row.columnName)
        },
        options: [
          {
            label: '显示',
            value: true,
          },
          {
            label: '隐藏',
            value: false,
          },
        ],
        handleChange: async (row: any) => {
          if (row.status) {
            return
          }
        },
      },
    },
  ],
}

/**
 * 初始化
 */
const init = async (tableName: string) => {
  queryParams.tableName = tableName
  visible.value = true
  refresh.value = Math.random()
}

defineExpose({
  init,
})
</script>

<template>
  <el-drawer :title="t('gen.common.column')" size="100%" v-model="visible" :direction="direction">
    <b-table
      ref="columnListTableRef"
      :pager="false"
      :select="select"
      :refresh="refresh"
      :list-api="listColumns"
      :tableIndex="tableIndex"
      :query="queryParams"
      :dict="tableInfo.dict"
      :field-list="tableInfo.fieldList"
      :tb-header-btn="tableInfo.tbHeaderBtn"
      :handle-btn="tableInfo.handleBtn"
    />
  </el-drawer>
</template>
