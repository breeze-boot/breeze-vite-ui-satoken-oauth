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
import useWidth from '@/hooks/dialogWidth'

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
    },
    {
      prop: 'comment',
      showOverflowTooltip: true,
      label: t('column.fields.comment'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('column.fields.status'),
      type: 'select',
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
      width: 100,
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
      prop: 'isNullAble',
      showOverflowTooltip: true,
      label: t('column.fields.isNullAble'),
    },
    {
      prop: 'typeName',
      showOverflowTooltip: true,
      label: t('column.fields.typeName'),
    },
    {
      prop: 'columnSize',
      showOverflowTooltip: true,
      label: t('column.fields.columnSize'),
    },
    {
      prop: 'decimalDigits',
      showOverflowTooltip: true,
      label: t('column.fields.decimalDigits'),
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
  <el-drawer :size="useWidth()" :title="t('column.common.columnSetting')" v-model="visible" :direction="direction">
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
