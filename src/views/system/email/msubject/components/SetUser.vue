<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 发送人用户配置抽屉 -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { UserRecord, UserRecords } from '@/api/auth/user/type.ts'
import { page } from '@/api/auth/user'
import { EmailSetUserQuery, SetUserMSubjectForm } from '@/api/system/email/msubject/type.ts'
import { Refresh, Search } from '@element-plus/icons-vue'
import { getMSubject, setEmailUser } from '@/api/system/email/msubject'
import JSONBigInt from 'json-bigint'
import { ElMessage } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'SetUser',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const userTableRef = ref()
const userQueryFormRef = ref()
const setUserMSubjectForm = ref<SetUserMSubjectForm>({ ccUserId: [], toUserId: [] })
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
  total: 0,
})

let currentRows = reactive<UserRecords>([])
// 选中的行
let checkedRows = reactive<UserRecords>([])

const tableLoading = ref<boolean>(false)
// 刷新标识
const refresh = ref<number>(1)
const pager = ref<boolean>(true)
const mountedRefresh = ref<boolean>(true)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'

const tableInfo = reactive<TableInfo>({
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
  visible.value = true
  // 重置表单数据
  if (userQueryFormRef.value) {
    userQueryFormRef.value.resetFields()
  }
  if (id) {
    queryParams.value.id = id
    queryParams.value.column = column
    await getInfo(id, column)
  }
}

/**
 * 初始化选中的用户
 *
 * @param id
 * @param column
 */
const getInfo = async (id: number, column: string) => {
  try {
    const response: any = await getMSubject(JSONBigInt.parse(id))
    checkedRows = response.data[column]
    refresh.value = Math.random()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
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
  loading.value = true
  let userIds: number[] = []
  currentRows.forEach((row: UserRecord) => {
    if (row.id) {
      userIds.push(row.id as number)
    }
  })
  if (queryParams.value.column === 'toUserId') {
    setUserMSubjectForm.value[queryParams.value.column] = userIds
  } else if (queryParams.value.column === 'ccUserId') {
    setUserMSubjectForm.value[queryParams.value.column] = userIds
  }
  await setEmailUser(id, setUserMSubjectForm.value)
  ElMessage.success({
    message: `${t('common.modify') + t('common.success')}`,
    duration: 1000,
    onClose: () => {
      visible.value = false
      loading.value = false
      $emit('reloadDataList')
    },
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog v-model="visible" :title="t('common.add')" :close-on-click-modal="false" :close-on-press-escape="false">
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
            {{ t('common.search') }}
          </el-button>
          <el-button type="success" :icon="Refresh" @click="resetQuery">
            {{ t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </search-container-box>
    <b-table
      ref="userTableRef"
      table-height="80%"
      :refresh="refresh"
      :select="select"
      :list-api="page"
      v-model:loading="tableLoading"
      :tableIndex="tableIndex"
      :query="queryParams"
      :checked-rows="checkedRows"
      :mountedRefresh="mountedRefresh"
      :dict="tableInfo.dict"
      :field-list="tableInfo.fieldList"
      :tb-header-btn="tableInfo.tbHeaderBtn"
      :handle-btn="tableInfo.handleBtn"
      @selection-change="handleSelectionChange"
    />
    <template #footer>
      <el-button
        @click="
          () => {
            visible = false
            loading = false
          }
        "
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleUserDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
