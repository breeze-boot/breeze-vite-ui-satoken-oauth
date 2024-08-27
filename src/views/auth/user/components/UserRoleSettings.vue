<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 用户角色配置抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { listUserRoles, page } from '@/api/auth/role'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { TableInfo } from '@/components/Table/types/types.ts'
import { RoleRecords } from '@/api/auth/role/type.ts'
import JSONBigInt from 'json-bigint'
import { Refresh, Search } from '@element-plus/icons-vue'
import { userSetRole } from '@/api/auth/user'
import { UserSetRoleForm, UserRoleQuery } from '@/api/auth/user/type.ts'
import { ElMessage } from 'element-plus'
import useWidth from '@/hooks/dialogWidth'

defineOptions({
  name: 'RoleSettings',
  inheritAttrs: false,
})

const direction = ref('rtl')
const { t } = useI18n()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const userRoleTableRef = ref()
const roleQueryFormRef = ref()
const userSetRoleDataForm = ref<UserSetRoleForm>({ userId: 0, roleIds: [] })

let currentRows = reactive<RoleRecords>([])

/**
 * 查询条件
 */
const queryParams = reactive<UserRoleQuery>({
  userId: 0,
  roleCode: '',
  roleName: '',
  current: 1,
  size: 10,
})
const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  mountedRefresh: true,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 选中的行
  checkedRows: [],
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
  ],
})

/**
 * 查询
 */
const handleQuery = () => {
  getInfo(queryParams.userId)
}

/**
 * 重置查询
 */
const resetQuery = () => {
  roleQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  if (id) {
    userSetRoleDataForm.value.userId = id
    queryParams.userId = id
    await getInfo(id)
  }
  visible.value = true
}

/**
 * 初始化用户的角色
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await listUserRoles(JSONBigInt.parse(id))
  if (response.code === '0000') {
    tableInfo.checkedRows = response.data
    tableInfo.refresh = Math.random()
  }
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: RoleRecords) => {
  currentRows = rows
}

/**
 * 表单提交
 */
const handleUserRoleSettingsDataFormSubmit = async () => {
  loading.value = true
  userSetRoleDataForm.value.roleIds = currentRows.map((item: any) => item.id)
  const response: any = await userSetRole(userSetRoleDataForm.value)
  if (response.code === '0000') {
    ElMessage.success({
      message: t('common.success'),
      duration: 1000,
      onClose: () => {
        visible.value = false
        loading.value = false
      },
    })
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-drawer :size="useWidth()" v-model="visible" :title="t('user.common.roleSettings')" :direction="direction">
    <template #header>
      <h4>{{ t('user.common.roleSettings') }}</h4>
    </template>
    <template #default>
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
        ref="userRoleTableRef"
        :list-api="page"
        :checked-rows="tableInfo.checkedRows"
        :tableIndex="tableInfo.tableIndex"
        :query="queryParams"
        :refresh="tableInfo.refresh"
        :mountedRefresh="tableInfo.mountedRefresh"
        :field-list="tableInfo.fieldList"
        :select="tableInfo.select"
        :handle-btn="tableInfo.handleBtn"
        table-height="80%"
        @selection-change="handleSelectionChange"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
        <el-button
          v-has="['auth:user:set:role']"
          type="primary"
          :loading="loading"
          @click="handleUserRoleSettingsDataFormSubmit()"
        >
          {{ t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
