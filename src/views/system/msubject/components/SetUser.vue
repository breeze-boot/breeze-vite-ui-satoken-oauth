<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 发送人用户配置抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { TableInfo } from '@/components/Table/types/types.ts'
import { UserRecord, UserRecords } from '@/api/auth/user/type.ts'
import { page } from '@/api/auth/user'
import { EmailSetUserQuery, SetUserMSubjectForm } from '@/api/system/msubject/type.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { getMSubject, setEmailUser } from '@/api/system/msubject'
import JSONBigInt from 'json-bigint'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'SetUser',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const userTableRef = ref()
const userQueryFormRef = ref()
const setUserMSubjectForm = ref<SetUserMSubjectForm>({ ccUserId: [], toUserId: [] })

let currentRows = reactive<UserRecords>([])

/**
 * 查询条件
 */
const queryParams = ref<EmailSetUserQuery>({
  column: '',
  id: 0,
  email: '',
  userCode: '',
  username: '',
  current: 1,
  size: 10,
})

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  mountedRefresh: true,
  pager: true,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 选中的行
  checkedRows: [],
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: [],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'username',
      showOverflowTooltip: true,
      label: t('user.fields.username'),
    },
    {
      prop: 'email',
      showOverflowTooltip: true,
      label: t('user.fields.email'),
    },
  ],
})

/**
 * 查询
 */
const handleQuery = () => {
  getInfo(queryParams.value.id, queryParams.value.column)
}

/**
 * 重置查询
 */
const resetQuery = () => {
  userQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 初始化
 *
 * @param id
 * @param column
 */
const init = async (id: number, column: string) => {
  // 重置表单数据
  if (userQueryFormRef.value) {
    userQueryFormRef.value.resetFields()
  }
  if (id) {
    queryParams.value.id = id
    queryParams.value.column = column
    await getInfo(id, column)
  }
  visible.value = true
}

/**
 * 初始化选中的用户
 *
 * @param id
 * @param column
 */
const getInfo = async (id: number, column: string) => {
  const response: any = await getMSubject(JSONBigInt.parse(id))
  if (response.code === '0000') {
    tableInfo.checkedRows = response.data[column]
    tableInfo.refresh = Math.random()
  }
}

/**
 * 添加
 */
const handleAdd = () => {}

/**
 * 选中行，设置当前行currentRow
 *
 * @param rows 选择的行数据
 */
const handleSelectionChange = (rows: UserRecords) => {
  currentRows = rows
}

/**
 * 表单提交
 */
const handleUserDataFormSubmit = async () => {
  if (!currentRows || currentRows.length === 0) return
  const id = queryParams.value.id

  let userIds: number[] = []
  currentRows.forEach((row: UserRecord) => {
    if (row.id != null) {
      userIds.push(row.id)
    }
  })
  if (queryParams.value.column === 'toUserId') {
    setUserMSubjectForm.value[queryParams.value.column] = userIds
  } else if (queryParams.value.column === 'ccUserId') {
    setUserMSubjectForm.value[queryParams.value.column] = userIds
  }
  await setEmailUser(id, setUserMSubjectForm.value)
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      visible.value = false
      $emit('reloadDataList')
    },
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="50%"
    :title="t('common.add')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <search-container-box>
      <el-form ref="userQueryFormRef" :model="queryParams" :inline="true">
        <!-- 用户名 -->
        <el-form-item :label="t('user.fields.username')" prop="username">
          <el-input
            @keyup.enter="handleQuery"
            style="width: 200px"
            :placeholder="t('user.fields.username')"
            v-model="queryParams.username"
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item :label="t('user.fields.email')" prop="email">
          <el-input
            @keyup.enter="handleQuery"
            style="width: 200px"
            :placeholder="t('user.fields.email')"
            v-model="queryParams.email"
          />
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
      :checked-rows="tableInfo.checkedRows"
      :list-api="page"
      :tableIndex="tableInfo.tableIndex"
      :query="queryParams"
      :refresh="tableInfo.refresh"
      :mountedRefresh="tableInfo.mountedRefresh"
      :field-list="tableInfo.fieldList"
      :select="tableInfo.select"
      :handle-btn="tableInfo.handleBtn"
      table-height="80%"
      :pager="tableInfo.pager"
      @selection-change="handleSelectionChange"
    />
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleUserDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
