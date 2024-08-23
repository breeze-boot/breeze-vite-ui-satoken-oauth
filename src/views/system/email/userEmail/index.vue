<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 发送人用户查询 -->
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BTable from '@/components/Table/BTable/index.vue'
import { TableInfo } from '@/components/Table/types/types.ts'
import { EmailSetUserQuery } from '@/api/system/email/msubject/type.ts'
import { listToEmail, listCcEmail } from '@/api/system/email/msubject'
import JSONBigInt from 'json-bigint'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'UserEmail',
  inheritAttrs: false,
})

const { t } = useI18n()
const userTableRef = ref()
const userQueryFormRef = ref()

/**
 * 查询条件
 */
const queryParams = ref<EmailSetUserQuery>({
  id: 0,
  column: '',
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
  rows: [],
  pager: true,
  tableIndex: true,
  // 选择框类型
  select: 'multi',
  // 选中的行
  checkedRows: [],
  tbHeaderBtn: [],
  // 表格字段配置
  fieldList: [
    {
      prop: 'email',
      showOverflowTooltip: true,
      label: t('user.fields.email'),
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 * @param column
 */
onMounted(async () => {
  // 重置表单数据
  const route = useRoute()
  if (userQueryFormRef.value) {
    userQueryFormRef.value.resetFields()
  }

  queryParams.value.id = JSONBigInt.parse(route.query.id)
  queryParams.value.column = route.query.column as string
  await getInfo(queryParams.value.id, queryParams.value.column)
})

/**
 * 初始化选中的用户
 *
 * @param id
 * @param column
 */
const getInfo = async (id: number, column: string) => {
  if (column === 'toEmail') {
    const response: any = await listToEmail(id)
    if (response.code === '0000') {
      tableInfo.rows = response.data
      tableInfo.refresh = Math.random()
    }
  } else if (column === 'ccEmail') {
    const response: any = await listCcEmail(id)
    if (response.code === '0000') {
      tableInfo.rows = response.data
      tableInfo.refresh = Math.random()
    }
  }
}
</script>

<template>
  <b-table
    ref="userTableRef"
    v-model="tableInfo.rows"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :refresh="tableInfo.refresh"
    :mountedRefresh="tableInfo.mountedRefresh"
    :field-list="tableInfo.fieldList"
    :select="tableInfo.select"
    :handle-btn="tableInfo.handleBtn"
    table-height="80%"
    :pager="tableInfo.pager"
  />
</template>
