<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典项查看抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import AddOrEdit from '@/views/system/dict/components/DictItemAddOrEdit.vue'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import BTable from '@/components/Table/BTable/index.vue'
import { list, deleteDictItem } from '@/api/system/dictItem/index.ts'
import { DictItemQuery, DictItemRecord, DictItemRecords } from '@/api/system/dictItem/type.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DictItem',
  inheritAttrs: false,
})

const direction = ref('rtl')
const { t } = useI18n()
const visible = ref<boolean>(false)
const dictItemTableRef = ref()
const dictItemAddOrEditRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<DictItemQuery>({
  dictId: 0,
  dictCode: '',
  dictName: '',
})

let currentRows = reactive<DictItemRecords>([])
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const mountedRefresh = ref<boolean>(true)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'

const tableInfo = reactive<TableInfo>({
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['sys:dict:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:dict:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: DictItemRecords) => handleDelete(rows),
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
        eventHandle: (row: DictItemRecord) => handleUpdate(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:dict:delete'],
        eventHandle: (row: DictItemRecord) => handleDelete([row]),
      },
    ],
  },
})

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
 * 刷新表格
 */
const reloadList = () => {
  refresh.value = Math.random()
}

/**
 * 添加
 */
const handleAdd = () => {
  AddOrEditHandle(queryParams.dictId)
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
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: DictItemRecords) => {
  try {
    const dictIds = rows.map((item: any) => item.id)
    await deleteDictItem(dictIds)
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(err.message)
  }
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
const AddOrEditHandle = (id?: number) => {
  dictItemAddOrEditRef.value.init(id)
}

defineExpose({
  init,
})
</script>

<template>
  <el-drawer v-model="visible" :title="t('dictItem.common.dictItemViewing')" :direction="direction">
    <template #header>
      <h4>{{ t('dictItem.common.dictItemViewing') }}</h4>
    </template>
    <template #default>
      <b-table
        ref="dictItemTableRef"
        table-height="80%"
        :pager="false"
        :refresh="refresh"
        :mountedRefresh="mountedRefresh"
        :select="select"
        :list-api="list"
        v-model:loading="tableLoading"
        :tableIndex="tableIndex"
        :query="queryParams"
        :dict="tableInfo.dict"
        :field-list="tableInfo.fieldList"
        :tb-header-btn="tableInfo.tbHeaderBtn"
        :handle-btn="tableInfo.handleBtn"
        @selection-change="handleSelectionChange"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button
          @click="
            () => {
              visible = false
            }
          "
        >
          {{ t('common.cancel') }}
        </el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="dictItemAddOrEditRef" @reload-data-list="reloadList" />
</template>
