<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 用户管理 -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { page, open, exportExcel, deleteUser } from '@/api/auth/user'
import AddOrUpdate from './components/UserAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { UserRecords } from '@/api/auth/user/type.ts'
import { UserRecord, UserQuery } from '@/api/auth/user/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'
import RoleSettings from '@/views/auth/user/components/RoleSettings.vue'

defineOptions({
  name: 'User',
  inheritAttrs: false,
})

const { t } = useI18n()
const userQueryFormRef = ref(ElForm)
const userAddOrUpdateRef = ref()
const roleSettingsRef = ref()
const { IS_LOCK } = useDict('IS_LOCK')

/**
 * 初始化
 */
onMounted(() => {
  reloadList()
})

/**
 * 查询条件
 */
const queryParams = reactive<UserQuery>({
  endTime: '',
  userCode: '',
  username: '',
  isLock: '',
  startTime: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<UserRecords>([])
let currentRows = reactive<UserRecords>([])

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 字典
  dict: ['IS_LOCK', 'SEX'],
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:user:create'],
      event: 'add',
      icon: 'add',
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:user:delete'],
      event: 'del',
      icon: 'delete',
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:user:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:user:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'avatar',
      showOverflowTooltip: true,
      label: t('user.fields.avatar'),
    },
    {
      prop: 'username',
      showOverflowTooltip: true,
      label: t('user.fields.username'),
    },
    {
      prop: 'userCode',
      showOverflowTooltip: true,
      label: t('user.fields.userCode'),
    },
    {
      prop: 'amountName',
      showOverflowTooltip: true,
      label: t('user.fields.amountName'),
    },
    {
      prop: 'idCard',
      showOverflowTooltip: true,
      label: t('user.fields.idCard'),
    },
    {
      prop: 'postName',
      showOverflowTooltip: true,
      label: t('user.fields.postName'),
    },
    {
      prop: 'deptName',
      showOverflowTooltip: true,
      label: t('user.fields.deptName'),
    },
    {
      prop: 'sex',
      label: t('user.fields.sex'),
      type: 'dict',
      dict: 'SEX',
    },
    {
      prop: 'sex',
      label: t('user.fields.sex'),
      type: 'tag',
      tagOptions: {
        1: { name: '男', type: 'success' },
        0: { name: '女', type: 'success' },
      },
    },
    {
      prop: 'phone',
      showOverflowTooltip: true,
      label: t('user.fields.phone'),
    },
    {
      prop: 'email',
      showOverflowTooltip: true,
      label: t('user.fields.email'),
    },
    {
      prop: 'isLock',
      label: t('user.fields.isLock'),
      type: 'dict',
      dict: 'IS_LOCK',
    },
    {
      prop: 'isLock',
      label: t('user.fields.isLock'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'username',
        status: 'isLock',
      },
    },
  ],
  handleBtn: {
    minWidth: 400,
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
        permission: ['auth:user:modify'],
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:user:info'],
      },
      // 重置密码
      {
        label: t('user.commons.resetPass'),
        type: 'info',
        icon: 'reset_password',
        event: 'reset_password',
        permission: ['auth:user:info'],
      },
      // 角色设置
      {
        label: t('user.commons.roleSettings'),
        type: 'info',
        icon: 'role_settings',
        event: 'role_settings',
        permission: ['auth:user:info'],
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:user:delete'],
      },
    ],
  },
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
    case 'reset_password':
      handleRestPassword(row)
      break
    case 'role_settings':
      handleRoleSettings(row)
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
 * @param row 参数
 */
const handleView = (row: any) => {
  console.log(row)
}

/**
 * 密码重置
 *
 * @param row 参数
 */
const handleRestPassword = (row: any) => {
  console.log(row)
}

/**
 * 角色设置
 *
 * @param row 参数
 */
const handleRoleSettings = (row: any) => {
  roleSettingsRef.value.init(row.id)
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
        message: t('common.success'),
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
 * @param row 修改参数
 */
const handleUpdate = (row: any) => {
  addOrUpdateHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
function handleRowClick(row: UserRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: UserRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="userQueryFormRef" :model="queryParams" :inline="true">
      <!-- 用户编码 -->
      <el-form-item :label="t('user.fields.userCode')" prop="userCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('user.fields.userCode')"
          v-model="queryParams.userCode"
        />
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item :label="t('user.fields.username')" prop="username">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('user.fields.username')"
          v-model="queryParams.username"
        />
      </el-form-item>

      <!-- 是否锁定 -->
      <el-form-item :label="t('user.fields.isLock')" prop="isLock">
        <el-select
          @change="handleQuery"
          class="m-2"
          :placeholder="$t('user.fields.isLock')"
          style="width: 240px"
          v-model="queryParams.isLock"
        >
          <el-option v-for="item in IS_LOCK" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">
          {{ $t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ $t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="userTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :dict="tableInfo.dict"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @handle-table-row-btn-click="handleTableRowBtnClick"
    @handle-table-header-btn-click="handleTableHeaderBtnClick"
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-update ref="userAddOrUpdateRef" @reload-data-list="reloadList" />

  <!-- 角色设置 抽屉 -->
  <role-settings ref="roleSettingsRef" />
</template>
