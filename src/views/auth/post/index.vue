<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 职位管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, exportExcel, deletePost } from '@/api/auth/post'
import AddOrEdit from './components/PostAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { ElForm } from 'element-plus'
import type { PostRecords } from '@/api/auth/post/type.ts'
import { PostRecord, PostQuery } from '@/api/auth/post/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Post',
  inheritAttrs: false,
})

const { t } = useI18n()
const postQueryFormRef = ref(ElForm)
const postAddOrEditRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<PostQuery>({
  postCode: '',
  postName: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<PostRecords>([])
let currentRows = reactive<PostRecords>([])
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
      permission: ['auth:post:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:post:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: PostRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:post:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:post:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'postName',
      showOverflowTooltip: true,
      label: t('post.fields.postName'),
    },
    {
      prop: 'postCode',
      showOverflowTooltip: true,
      label: t('post.fields.postCode'),
    },
  ],
  handleBtn: {
    width: 210,
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
        permission: ['auth:post:modify'],
        eventHandle: (row: PostRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:post:info'],
        eventHandle: (row: PostRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:post:delete'],
        eventHandle: (row: PostRecord) => handleDelete([row] as PostRecords),
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
  postQueryFormRef.value.resetFields()
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
  postAddOrEditRef.value.init(id)
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
const handleDelete = async (rows: PostRecords) => {
  try {
    const postIds = rows.map((item: any) => item.id)
    await deletePost(postIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
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
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: PostRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="postQueryFormRef" :model="queryParams" :inline="true">
      <!-- 职位编码 -->
      <el-form-item :label="t('post.fields.postCode')" prop="postCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('post.fields.postCode')"
          v-model="queryParams.postCode"
        />
      </el-form-item>

      <!-- 职位名称 -->
      <el-form-item :label="t('post.fields.postName')" prop="postName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('post.fields.postName')"
          v-model="queryParams.postName"
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
    ref="postTableRef"
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
  <add-or-edit ref="postAddOrEditRef" @reload-data-list="reloadList" />
</template>
