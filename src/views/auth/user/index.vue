<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<!-- 用户管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { page, open, exportExcel, deleteUser, editAvatar } from '@/api/auth/user'
import AddOrEdit from './components/UserAddOrEdit.vue'
import { ElForm, ElMessage } from 'element-plus'
import type { UserRecords } from '@/api/auth/user/type.ts'
import { UserRecord, UserQuery } from '@/api/auth/user/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'
import UserRoleSettings from '@/views/auth/user/components/UserRoleSettings.vue'
import UserPasswordReset from '@/views/auth/user/components/UserPasswordReset.vue'
import { editFile } from '@/api/system/file'
import { FileRecord } from '@/api/system/file/type.ts'

defineOptions({
  name: 'User',
  inheritAttrs: false,
})

const { t } = useI18n()
const userQueryFormRef = ref(ElForm)
const userAddOrEditRef = ref()
const roleSettingsRef = ref()
const restPasswordRef = ref()
const { IS_LOCK } = useDict('IS_LOCK')

/**
 * 查询条件
 */
const queryParams = reactive<UserQuery>({
  email: '',
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
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:user:delete'],
      event: 'del',
      icon: 'delete',
      eventHandle: (rows: UserRecords) => handleDelete(rows),
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
      type: 'image',
    },
    // 测试
    {
      prop: 'avatar',
      showOverflowTooltip: true,
      label: t('user.fields.avatar'),
      type: 'rowLink',
      width: 200,
      linkInfo: {
        routePath: '/auth/menu',
        rowParam: ['id', 'username'],
        query: {
          status: 1,
        },
      },
    },
    {
      prop: '',
      label: t('user.fields.fileUpload'),
      width: 100,
      type: 'fileUpload',
      upload: {
        // 默认系统标识
        bizType: 'system',
        // 上传限制文件个数
        fileLimit: 1,
        // 上传限制文件类型
        fileType: ['image/jpeg', 'image/png'],
        // 上传限制文件大小 M
        fileSize: 2,
        // 完成上传回调保存数据的接口的主键
        pk: 'id',
        // 上传后是否刷新
        uploadRefresh: false,
        // 需要保存的字段映射 {上传返回的KEY : 提交的KEY}
        columns: { fileId: 'avatarFileId', url: 'avatar' },
        // 完成上传回调保存数据的接口
        api: editAvatar,
        // 上传完成后的回调
        callback: (row: any) => handleUpdateBiz(row),
      },
    },
    {
      prop: '',
      label: t('user.fields.customFileUpload'),
      width: 120,
      type: 'fileUpload',
      upload: {
        // 默认系统标识
        bizType: 'system',
        // 上传限制文件个数
        fileLimit: 1,
        // 上传限制文件类型
        fileType: ['image/jpeg', 'image/png'],
        // 上传限制文件大小 M
        fileSize: 2,
        // 上传完成后的回调
        callback: (row: any) => handleUpdateCurrentRow(row),
      },
    },
    {
      prop: 'file',
      showOverflowTooltip: true,
      label: t('user.fields.file'),
      type: 'fileList',
    },
    // 测试
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
      tag: {
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
    minWidth: 510,
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
        eventHandle: (row: UserRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:user:info'],
        eventHandle: (row: UserRecord) => handleInfo(row),
      },
      // 重置密码
      {
        label: t('user.common.resetPassword'),
        type: 'info',
        icon: 'user_reset_password',
        event: 'user_reset_password',
        permission: ['auth:user:reset'],
        eventHandle: (row: UserRecord) => handleUserRestPassword(row),
      },
      // 角色设置
      {
        label: t('user.common.roleSettings'),
        type: 'info',
        icon: 'user_role_settings',
        event: 'user_role_settings',
        permission: ['auth:user:set:role'],
        eventHandle: (row: UserRecord) => handleUserRoleSettings(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:user:delete'],
        eventHandle: (row: UserRecord) => handleDelete([row] as UserRecords),
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
const AddOrEditHandle = (id?: number) => {
  userAddOrEditRef.value.init(id)
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
 * 密码重置
 *
 * @param row 参数
 */
const handleUserRestPassword = (row: any) => {
  restPasswordRef.value.init(row.id)
}

/**
 * 角色设置
 *
 * @param row 参数
 */
const handleUserRoleSettings = (row: any) => {
  roleSettingsRef.value.init(row.id)
}

/**
 * 添加
 */
const handleAdd = () => {
  AddOrEditHandle()
}

/**
 * 更新头像
 *
 * @param row 行数据
 */
const handleUpdateCurrentRow = async (row: any) => {
  let data = {}
  row.fileUpload.forEach((column: any) => {
    data = {
      id: row.id,
      avatar: column.url,
      avatarFileId: column.fileId,
    }
  })
  // 若是一对多的文件上传，可以自定义回调逻辑
  await editAvatar(data as UserRecord)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      handleUpdateBiz(row)
    },
  })
}

/**
 * 更新文件表的业务ID
 *
 * @param row 行数据
 */
const handleUpdateBiz = async (row: any) => {
  let data = {}
  row.fileUpload.forEach((column: any) => {
    data = {
      bizId: row.id,
      id: column.fileId,
    }
  })
  await editFile(data as FileRecord)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: UserRecords) => {
  const userIds = rows.map((item: any) => item.id)
  await deleteUser(userIds)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      reloadList()
    },
  })
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
    @selection-change="handleSelectionChange"
    @handle-row-click="handleRowClick"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="userAddOrEditRef" @reload-data-list="reloadList" />

  <!-- 角色设置 抽屉 -->
  <user-role-settings ref="roleSettingsRef" />

  <!-- 密码重置 Dialog -->
  <user-password-reset ref="restPasswordRef" />
</template>
