<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->

<!-- 发送人用户查询 -->
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BTable from '@/components/Table/BTable/index.vue'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import { EmailSetUserQuery } from '@/api/system/email/msubject/type.ts'
import { listToEmailUser, listCcEmailUser } from '@/api/system/email/msubject'
import JSONBigInt from 'json-bigint'
import { useRoute } from 'vue-router'
import { useMessage } from '@/hooks/message'

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
  total: 0,
})
// 刷新标识
const refresh = ref<number>(1)
const tableIndex = ref<boolean>(true)
// 选择框类型
const select: SelectEvent = 'multi'
const pager: boolean = true
const mountedRefresh: boolean = true
const rows = ref<any>([])

const tableInfo = reactive<TableInfo>({
  // 选中的行
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
    try {
      const response: any = await listToEmailUser(id)
      rows.value = response.data
      refresh.value = Math.random()
    } catch (err: any) {
      useMessage().error(`${t('common.fail')}` + err.message)
    }
  } else if (column === 'ccEmail') {
    try {
      const response: any = await listCcEmailUser(id)
      rows.value = response.data
      refresh.value = Math.random()
    } catch (err: any) {
      useMessage().error(`${t('common.fail')}` + err.message)
    }
  }
}
</script>

<template>
  <b-table
    ref="userTableRef"
    table-height="80%"
    v-model="rows"
    :pager="pager"
    :mountedRefresh="mountedRefresh"
    :refresh="refresh"
    :select="select"
    :tableIndex="tableIndex"
    :query="queryParams"
    :dict="tableInfo.dict"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :handle-btn="tableInfo.handleBtn"
  />
</template>
