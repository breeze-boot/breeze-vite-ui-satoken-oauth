<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典项查看抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { list } from '@/api/system/dictItem/index.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { DictItemQuery, DictItemRecords } from '@/api/system/dictItem/type.ts'

defineOptions({
  name: 'DictItem',
  inheritAttrs: false,
})

const direction = ref('rtl')
const { t } = useI18n()
const visible = ref(false)
const dictItemTableRef = ref()

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
  ],
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
    case 'view':
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
  tableInfo.refresh = Math.random()
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
        :select="tableInfo.select"
        :handle-btn="tableInfo.handleBtn"
        table-height="80%"
        @handle-table-row-btn-click="handleTableRowBtnClick"
        @selection-change="handleSelectionChange"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>
