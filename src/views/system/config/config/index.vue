<!--
* @author: gaoweixuan
* @since: 2025-07-20
-->

<!-- 系统配置组件 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElTree } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { deleteSysConfig, exportExcel, page } from '@/api/system/config/config'
import type { ConfigQuery, ConfigRecord, ConfigRecords } from '@/api/system/config/config/type.ts'
import { list as listConfigCateg } from '@/api/system/config/categ'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/ConfigAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

interface Tree {
  id: number
  categCode: string
  categName: string
  children?: Tree[]
}

defineOptions({
  name: 'SysConfig',
  inheritAttrs: false,
})

const { t } = useI18n()
const configQueryFormRef = ref(ElForm)
const configAddOrEditRef = ref()
// 新增树形相关
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<any[]>([])
const treeLoading = ref<boolean>(false)
const selectedTreeKey = ref<string | number>('')

// 查询条件（新增parentId用于树形筛选）
const queryParams = reactive<ConfigQuery>({
  id: '',
  paramCateg: '',
  paramName: '',
  paramValue: '',
  envCode: '',
  dataType: '',
  isRequired: '',
  description: '',
  status: 0,
  categId: undefined,
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<ConfigRecord>({
  id: '',
  paramCateg: '',
  paramName: '',
  paramValue: '',
  envCode: '',
  dataType: '',
  isRequired: '',
  description: '',
  status: 0,
})
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
      permission: ['sys:config:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:config:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: ConfigRecords) => handleDelete(rows),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'paramCateg',
      showOverflowTooltip: true,
      label: t('config.fields.paramCateg'),
    },
    {
      prop: 'paramName',
      showOverflowTooltip: true,
      label: t('config.fields.paramName'),
    },
    {
      prop: 'paramValue',
      showOverflowTooltip: true,
      label: t('config.fields.paramValue'),
    },
    {
      prop: 'envCode',
      showOverflowTooltip: true,
      label: t('config.fields.envCode'),
    },
    {
      prop: 'dataType',
      showOverflowTooltip: true,
      label: t('config.fields.dataType'),
    },
    {
      prop: 'isRequired',
      showOverflowTooltip: true,
      label: t('config.fields.isRequired'),
    },
    {
      prop: 'description',
      showOverflowTooltip: true,
      label: t('config.fields.description'),
    },
    {
      prop: 'status',
      showOverflowTooltip: true,
      label: t('config.fields.status'),
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
        permission: ['sys:config:modify'],
        eventHandle: (row: ConfigRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:config:info'],
        eventHandle: (row: ConfigRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:config:delete'],
        eventHandle: (row: ConfigRecord) => handleDelete([row] as ConfigRecords),
      },
    ],
  },
})

/**
 * 新增：加载树形数据
 */
const loadConfigTree = async () => {
  try {
    treeLoading.value = true
    const response = await listConfigCateg() // 假设接口返回参数分类树形数据
    treeData.value = response.data || []
  } catch (error) {
    useMessage().error(t('common.fail'))
  } finally {
    treeLoading.value = false
  }
}

/**
 * 新增：树形叶子节点点击事件
 * @param data 节点数据
 */
const handleTreeNodeClick = (data: Tree) => {
  // 重置分页
  queryParams.current = 1
  // 携带叶子节点ID作为查询条件
  queryParams.categId = data.id
  // 刷新表格
  reloadList()
  // 高亮选中节点
  selectedTreeKey.value = data.id
  useMessage().success(`${t('config.common.leafSelected')}: ${data.categName}`)
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
  configQueryFormRef.value.resetFields()
  // 重置树形选择状态
  selectedTreeKey.value = ''
  queryParams.categId = undefined
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
 * @param id 主键
 */
const AddOrEditHandle = (id?: number) => {
  configAddOrEditRef.value.init(id)
}

/**
 * 详情
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
 * @param rows 行数据
 */
const handleDelete = async (rows: ConfigRecords) => {
  try {
    const sysConfigIds = rows.map((item: any) => item.id)
    await deleteSysConfig(sysConfigIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 修改
 * @param row 修改参数
 */
const handleUpdate = (row: ConfigRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: ConfigRecord) => {
  currentRow = row
  console.log(currentRow)
}

// 初始化加载树形数据
loadConfigTree()
</script>

<template>
  <div
    class="sys-config-container"
    style=" box-sizing: border-box;display: flex; gap: 16px; height: 100%; padding: 16px"
  >
    <!-- 左侧树形结构 -->
    <div
      class="config-tree"
      style="
        display: flex;
        flex-direction: column;
        width: 260px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
      "
    >
      <div class="tree-header" style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb">
        {{ t('config.common.treeTitle') }}
      </div>
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="{ label: 'categName', children: 'children' }"
        :loading="treeLoading"
        :highlight-current="true"
        :current-node-key="selectedTreeKey"
        @node-click="handleTreeNodeClick"
        style="flex: 1; padding: 10px; overflow-y: auto"
      />
    </div>

    <!-- 右侧原有表格区域 -->
    <div class="config-table" style=" display: flex;flex: 1; flex-direction: column; height: 100%">
      <search-container-box>
        <el-form ref="configQueryFormRef" :model="queryParams" :inline="true">
          <el-form-item :label="t('config.fields.paramCateg')" prop="paramCateg">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.paramCateg')"
              v-model="queryParams.paramCateg"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.paramName')" prop="paramName">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.paramName')"
              v-model="queryParams.paramName"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.paramValue')" prop="paramValue">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.paramValue')"
              v-model="queryParams.paramValue"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.envCode')" prop="envCode">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.envCode')"
              v-model="queryParams.envCode"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.dataType')" prop="dataType">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.dataType')"
              v-model="queryParams.dataType"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.isRequired')" prop="isRequired">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.isRequired')"
              v-model="queryParams.isRequired"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.description')" prop="description">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.description')"
              v-model="queryParams.description"
            />
          </el-form-item>

          <el-form-item :label="t('config.fields.status')" prop="status">
            <el-input
              @keyup.enter="handleQuery"
              style="width: 200px"
              :placeholder="t('config.fields.status')"
              v-model="queryParams.status"
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
        ref="sysConfigTableRef"
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
  <add-or-edit ref="configAddOrEditRef" @reload-data-list="reloadList" />
</template>

<style scoped>
.sys-config-container {
  height: 100vh;
  overflow: hidden;
}
</style>
