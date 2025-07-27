<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->
<!-- 字典管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElTree } from 'element-plus'
import { page, open, exportExcel, deleteDict } from '@/api/system/dict/dict'
import { list as listDictGroup } from '@/api/system/dict/group'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import AddOrEdit from './components/DictAddOrEdit.vue'
import DictItem from './components/DictItem.vue'
import type { DictRecords } from '@/api/system/dict/dict/type.ts'
import { DictRecord, DictQuery } from '@/api/system/dict/dict/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { ElForm } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/message'
import { useI18n } from 'vue-i18n'

interface Tree {
  id: number
  groupCode: string
  groupName: string
  children?: Tree[]
}

defineOptions({
  name: 'Dict',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const dictQueryFormRef = ref(ElForm)
const dictAddOrEditRef = ref()
const dictItemRef = ref()
// 新增：树形组件相关
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<any[]>([])
const treeLoading = ref<boolean>(false)
const selectedTreeKey = ref<string | number>('')

onMounted(() => {
  loadDictTree()
})

/**
 * 查询条件
 */
const queryParams = reactive<DictQuery>({
  dictCode: '',
  dictName: '',
  groupId: undefined,
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<DictRecords>([])
let currentRows = reactive<DictRecords>([])
const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'single'

const tableInfo = reactive<TableInfo>({
  // 字典
  dict: ['DICT_STATUS'],
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
      eventHandle: (rows: DictRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:dict:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:dict:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  fieldList: [
    {
      prop: 'dictName',
      showOverflowTooltip: true,
      label: t('dict.fields.dictName'),
    },
    {
      prop: 'dictCode',
      showOverflowTooltip: true,
      label: t('dict.fields.dictCode'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('dict.fields.status'),
      type: 'dict',
      dict: 'DICT_STATUS',
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('dict.fields.status'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'id',
        status: 'status',
      },
    },
  ],
  handleBtn: {
    width: 250,
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
        eventHandle: (row: DictRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:dict:info'],
        eventHandle: (row: DictRecord) => handleInfo(row),
      },
      // 查看字典项
      {
        label: t('dictItem.common.dictItemViewing'),
        type: 'info',
        icon: 'dict_item_view',
        event: 'dict_item_view',
        permission: ['sys:dict:list'],
        eventHandle: (row: DictRecord) => handleDictItemViewLog(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:dict:delete'],
        eventHandle: (row: DictRecord) => handleDelete([row] as DictRecords),
      },
    ],
  },
})

/**
 * 新增：加载树形数据
 */
const loadDictTree = async () => {
  try {
    treeLoading.value = true
    const response: any = await listDictGroup()
    treeData.value = response.data || []
  } catch (error) {
    $message.error(t('common.fail'))
  } finally {
    treeLoading.value = false
  }
}

/**
 * 新增：树形叶子节点点击事件
 * @param data 节点数据
 */
const handleTreeNodeClick = (data: Tree) => {
  debugger
  // 携带叶子节点ID作为查询条件
  queryParams.groupId = data.id
  // 刷新表格数据
  reloadList()
  // 高亮选中节点
  selectedTreeKey.value = data.id
  $message.success(`${t('dict.common.leafSelected')}: ${data.groupName}`)
}

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
  dictQueryFormRef.value.resetFields()
  // 重置树形选择
  selectedTreeKey.value = ''
  queryParams.groupId = undefined
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
  dictAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: DictRecords) => {
  const dictIds = rows.map((item: any) => item.id)
  try {
    await deleteDict(dictIds)
    $message.success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 查看字典项
 *
 * @param row 行数据
 */
const handleDictItemViewLog = (row: DictRecord) => {
  dictItemRef.value.init(row.id)
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
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: DictRecords) => {
  currentRows = rows
  console.log(currentRows)
}
</script>

<template>
  <div class="dict-container" style="display: flex; gap: 16px; height: 100%">
    <!-- 新增：左侧树形结构 -->
    <div class="dict-tree" style="width: 260px; overflow: hidden; border: 1px solid #e5e7eb; border-radius: 4px">
      <div class="tree-header" style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb">
        {{ t('dict.common.treeTitle') }}
      </div>
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="{ label: 'groupName', children: 'children' }"
        :loading="treeLoading"
        :highlight-current="true"
        :current-node-key="selectedTreeKey"
        @node-click="handleTreeNodeClick"
        style=" height: calc(100% - 45px);padding: 10px; overflow-y: auto"
      />
    </div>

    <!-- 右侧原有表格区域 -->
    <div class="dict-table" style=" display: flex;flex: 1; flex-direction: column; height: 100%">
      <search-container-box>
        <el-form ref="dictQueryFormRef" :model="queryParams" :inline="true">
          <!-- 字典名称 -->
          <el-form-item :label="t('dict.fields.dictName')" prop="dictName">
            <el-input
              style="width: 200px"
              :placeholder="t('dict.fields.dictName')"
              @keyup.enter="handleQuery"
              v-model="queryParams.dictName"
            />
          </el-form-item>

          <!-- 字典编码 -->
          <el-form-item :label="t('dict.fields.dictCode')" prop="dictCode">
            <el-input
              style="width: 200px"
              :placeholder="t('dict.fields.dictCode')"
              @keyup.enter="handleQuery"
              v-model="queryParams.dictCode"
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
        ref="dictTableRef"
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
        style="flex: 1; min-height: 0"
      />
    </div>
  </div>

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="dictAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 字典项抽屉 -->
  <dict-item ref="dictItemRef" />
</template>

<style scoped>
.dict-container {
  box-sizing: border-box;
  height: 100vh;
  padding: 16px;
}
</style>
