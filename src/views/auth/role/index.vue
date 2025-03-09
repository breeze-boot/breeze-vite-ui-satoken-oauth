<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 角色管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { deleteRole, exportExcel, page } from '@/api/auth/role'
import AddOrEdit from './components/RoleAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import RoleMenuPermissionList from './components/RoleMenuPermissionList.vue'
import RoleMenuColumnPermissionList from './components/RoleMenuColumnPermissionList.vue'
import { ElForm } from 'element-plus'
import { RoleQuery, RoleRecord, RoleRecords } from '@/api/auth/role/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'Role',
  inheritAttrs: false,
})

const { t } = useI18n()
const roleQueryFormRef = ref(ElForm)
const roleAddOrEditRef = ref()
const roleMenuPermissionListRef = ref()
const roleMenuColumnPermissionListRef = ref()

/**
 * 查询条件
 */
const queryParams = reactive<RoleQuery>({
  roleCode: '',
  roleName: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<RoleRecords>([])
let currentRows = reactive<RoleRecords>([])
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
      permission: ['auth:role:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:role:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: RoleRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['auth:role:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['auth:role:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'roleName',
      showOverflowTooltip: true,
      label: t('role.fields.roleName'),
    },
    {
      prop: 'roleCode',
      showOverflowTooltip: true,
      label: t('role.fields.roleCode'),
    },
    {
      prop: 'rowPermissionType',
      showOverflowTooltip: true,
      label: t('role.fields.rowPermissionType'),
    },
    {
      prop: 'rowPermissionName',
      showOverflowTooltip: true,
      label: t('role.fields.rowPermissionName'),
    },
  ],
  handleBtn: {
    minWidth: 250,
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
        permission: ['auth:role:modify'],
        eventHandle: (row: RoleRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:role:info'],
        eventHandle: (row: RoleRecord) => handleInfo(row),
      },
      // 设置角色菜单权限, 具有权限或者超级管理员可以设置
      {
        label: t('role.common.menuPermission'),
        type: 'success',
        icon: 'role_permission',
        event: 'role_permission',
        permission: ['auth:menu:permission:modify', 'ROLE_ADMIN'],
        eventHandle: (row: RoleRecord) => handleRolePermission(row),
      },
      // 设置角色菜单列权限, 具有权限或者超级管理员可以设置
      {
        label: t('role.common.menuColumnPermission'),
        type: 'primary',
        icon: 'role_permission',
        event: 'role_permission',
        permission: ['auth:menu:column:permission:modify', 'ROLE_ADMIN'],
        eventHandle: (row: RoleRecord) => handleRoleMenuColumnPermission(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:role:delete'],
        eventHandle: (row: RoleRecord) => handleDelete([row] as RoleRecords),
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
  roleQueryFormRef.value.resetFields()
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
  roleAddOrEditRef.value.init(id)
}

/**
 * 设置角色的权限
 *
 * @param id 主键
 */
const setRolePermissionHandle = (id?: number) => {
  roleMenuPermissionListRef.value.init(id)
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
 * 设置角色的菜单权限
 *
 * @param row 参数
 */
const handleRolePermission = (row: RoleRecord) => {
  setRolePermissionHandle(row.id)
}

/**
 * 设置角色菜单列的权限
 *
 * @param row 参数
 */
const handleRoleMenuColumnPermission = (row: RoleRecord) => {
  roleMenuColumnPermissionListRef.value.init(row.id)
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
const handleDelete = async (rows: RoleRecords) => {
  try {
    const roleIds = rows.map((item: any) => item.id)
    await deleteRole(roleIds)
    useMessage().success(`${t('common.delete') + t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}` + err.message)
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
 * @param row 选择的行数据
 */
function handleRowClick(row: RoleRecord) {
  currentRows = [row]
  console.log(currentRows)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: RoleRecords) => {
  currentRows = rows
}
</script>

<template>
  <search-container-box>
    <el-form ref="roleQueryFormRef" :model="queryParams" :inline="true">
      <!-- 角色编码 -->
      <el-form-item :label="t('role.fields.roleCode')" prop="roleCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('role.fields.roleCode')"
          v-model="queryParams.roleCode"
        />
      </el-form-item>

      <!-- 角色名称 -->
      <el-form-item :label="t('role.fields.roleName')" prop="roleName">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('role.fields.roleName')"
          v-model="queryParams.roleName"
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
    ref="roleTableRef"
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
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="roleAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 角色的菜单权限 Dialog -->
  <role-menu-permission-list ref="roleMenuPermissionListRef" />

  <!-- 角色的菜单列权限 Dialog -->
  <role-menu-column-permission-list ref="roleMenuColumnPermissionListRef" />
</template>
