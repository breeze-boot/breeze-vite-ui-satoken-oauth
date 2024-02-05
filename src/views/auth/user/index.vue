<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 用户管理 -->
<script setup lang="ts">
import { page, open, exportExcel, deleteUser } from '@/api/auth/user'
import { reactive, ref, onMounted } from 'vue'
import AddOrUpdate from './components/UserAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { UserRecords } from '@/api/auth/user/type.ts'
import { User, UserQuery } from '@/api/auth/user/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'User',
  inheritAttrs: false,
})

const userQueryFormRef = ref(ElForm)
const userAddOrUpdateRef = ref()

// 查询条件
const queryParams = reactive<UserQuery>({
  endTime: '',
  keywords: '',
  startTime: '',
  status: 0,
  current: 1,
  size: 10,
})

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  // 是否时单选框
  selection: true,
  // 表格顶部按钮
  tableBtnGroup: [
    {
      type: 'primary',
      label: '添加',
      permission: ['auth:user:create'],
      event: 'add',
    },
    {
      type: 'danger',
      label: '删除',
      permission: ['auth:user:delete'],
      event: 'del',
    },
    {
      type: 'info',
      label: '导出',
      permission: ['auth:user:export'],
      event: 'exportCurrentPage',
    },
    {
      type: 'info',
      label: '导出全部',
      permission: ['auth:user:export'],
      event: 'exportAll',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'userCode',
      label: '用户编码',
      showOverflowTooltip: true,
      hidden: false,
    },
    {
      prop: 'username',
      showOverflowTooltip: true,
      label: '用户名',
      hidden: false,
    },
    {
      prop: 'amountName',
      showOverflowTooltip: true,
      label: '展示名称',
      hidden: false,
    },
    {
      prop: 'isLock',
      label: '状态',
      type: 'tag',
      dictCode: 'IS_LOCK',
      hidden: false,
    },
    {
      prop: 'isLock',
      label: '锁定',
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'username',
        status: 'isLock',
      },
      hidden: false,
    },
  ],
  tableIndex: true,
  handle: {
    minWidth: 200,
    label: '操作',
    fixed: 'right',
    link: true,
    btList: [
      // 编辑
      {
        label: '编辑',
        type: 'success',
        icon: 'Edit',
        event: 'edit',
        permission: ['auth:user:modify'],
      },
      // 查看
      {
        label: '查看',
        type: 'warning',
        icon: 'View',
        event: 'view',
        permission: ['auth:user:info'],
      },
      // 删除
      {
        label: '删除',
        type: 'danger',
        icon: 'Delete',
        event: 'delete',
        permission: ['auth:user:delete'],
      },
    ],
  },
})

/**
 * 初始化
 */
onMounted(() => {
  console.debug(`数据初始化`)
  reloadList()
})

/**
 * 刷新表格
 */
const reloadList = () => {
  tableInfo.refresh = Math.random()
}

/**
 * 重置查询
 */
const resetQuery = () => {
  userQueryFormRef.value.resetFields()
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
const addOrUpdateHandle = (id?: number) => {
  userAddOrUpdateRef.value.init(id)
}

/**
 * 表格组件事件分发
 *
 * @param event
 * @param row
 */
const handleTableRowBtnClick = (event: any, row: any) => {
  switch (event) {
    case 'edit':
      handleUpdate(row)
      break
    case 'view':
      handleView(row)
      break
    case 'delete':
      handleDelete([row])
      break
    default:
      break
  }
}

/**
 * 表格组件头部按钮事件分发
 *
 * @param event 事件
 * @param rows  行数据
 */
const handleTableHeaderBtnClick = (event: string, rows: any) => {
  switch (event) {
    case 'add':
      handleAdd()
      break
    case 'del':
      handleDelete(rows)
      break
    default:
      break
  }
}

/**
 * 详情
 *
 * @param data 参数
 */
const handleView = (data: any) => {
  alert(data + '查询')
}

/**
 * 添加
 */
const handleAdd = () => {
  addOrUpdateHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = (rows: UserRecords) => {
  const userIds = rows.map((item: any) => item.id)
  deleteUser(userIds)
    .then(() => {
      ElMessage.success({
        message: '成功',
        duration: 500,
        onClose: () => {},
      })
    })
    .finally(() => {
      reloadList()
    })
}

/**
 * 修改
 *
 * @param data 修改参数
 */
const handleUpdate = (data: any) => {
  addOrUpdateHandle(data.id)
}

let currentRow = reactive<User>({})
let currentRows = reactive<UserRecords>([])

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: User) {
  currentRow = row
  console.log(currentRow)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: UserRecords) => {
  currentRows = rows
  console.log(currentRows)
}
</script>

<template>
  <search-container-box>
    <el-form ref="userQueryFormRef" :model="queryParams" :inline="true">
      <!-- 用户名 -->
      <el-form-item label="用户编码" prop="userCode">
        <el-input @keyup.enter="handleQuery" style="width: 200px" placeholder="用户名" v-model="queryParams.keywords" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          <Refresh />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="userTable"
    :list-api="page"
    :export-api="exportExcel"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :dicts="['IS_LOCK']"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tableBtnGroup"
    :singleSelect="false"
    :selection="true"
    :checked-list="currentRows"
    :handle="tableInfo.handle"
    @handle-table-row-btn-click="handleTableRowBtnClick"
    @handle-table-header-btn-click="handleTableHeaderBtnClick"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 弹窗, 新增 / 修改 -->
  <add-or-update ref="userAddOrUpdateRef" @reload-data-list="reloadList">确定</add-or-update>
</template>
