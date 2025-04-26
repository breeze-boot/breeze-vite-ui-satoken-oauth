<!--
 * @author: gaoweixuan
 * @since: 2025-04-22
-->
<!-- 聊天文档管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { deleteAiChatKnowledge, exportExcel, page } from '@/api/ai/chatKnowledge'
import type {
  AiChatKnowledgeQuery,
  AiChatKnowledgeRecord,
  AiChatKnowledgeRecords,
} from '@/api/ai/chatKnowledge/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import Add from './components/AiChatKnowledgeAdd.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'AiChatKnowledge',
  inheritAttrs: false,
})

const { t } = useI18n()
const aiChatKnowledgeQueryFormRef = ref(ElForm)
const aiChatKnowledgeAddRef = ref()

// 查询条件
const queryParams = reactive<AiChatKnowledgeQuery>({
  docName: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<AiChatKnowledgeRecord>({ docId: '', docName: '', docUrl: '', id: 0, refDocId: '' })
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
      permission: ['ai:chatKnowledge:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['ai:chatKnowledge:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: AiChatKnowledgeRecords) => handleDelete(rows),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'docId',
      showOverflowTooltip: true,
      label: t('aiChatKnowledge.fields.docId'),
    },
    {
      prop: 'docName',
      showOverflowTooltip: true,
      label: t('aiChatKnowledge.fields.docName'),
    },
    {
      prop: 'docUrl',
      showOverflowTooltip: true,
      label: t('aiChatKnowledge.fields.docUrl'),
    },
    {
      prop: 'refDocId',
      showOverflowTooltip: true,
      label: t('aiChatKnowledge.fields.refDocId'),
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
        permission: ['ai:chatKnowledge:modify'],
        eventHandle: (row: AiChatKnowledgeRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['ai:chatKnowledge:info'],
        eventHandle: (row: AiChatKnowledgeRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['ai:chatKnowledge:delete'],
        eventHandle: (row: AiChatKnowledgeRecord) => handleDelete([row] as AiChatKnowledgeRecords),
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
  aiChatKnowledgeQueryFormRef.value.resetFields()
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
const AddHandle = (id?: number) => {
  aiChatKnowledgeAddRef.value.init(id)
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
  AddHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: AiChatKnowledgeRecords) => {
  try {
    const aiChatKnowledgeIds = rows.map((item: any) => item.id)
    await deleteAiChatKnowledge(aiChatKnowledgeIds)
    useMessage().success(` + $ + '{t(\'common.delete\') + t(\'common.success\')}' + `)
    reloadList()
  } catch (err: any) {
    useMessage().error(` + $ + '{t(\'common.fail\')}' + ` + err.message)
  }
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: AiChatKnowledgeRecord) => {
  AddHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: AiChatKnowledgeRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="aiChatKnowledgeQueryFormRef" :model="queryParams" :inline="true">
      <el-form-item :label="t('aiChatKnowledge.fields.docName')" prop="docName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('aiChatKnowledge.fields.docName')"
          v-model="queryParams.docName"
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
    ref="aiChatKnowledgeTableRef"
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
  <add ref="aiChatKnowledgeAddRef" @reload-data-list="reloadList" />
</template>
