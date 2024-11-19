<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->
<!-- 在线用户管理管理 -->
<script setup lang="ts">
import { reactive } from 'vue'
import BTable from '@/components/Table/BTable/index.vue'
import {
  list,
  focusKickOut,
  focusKickOutByTokenValue,
  focusLogoutByTokenValue,
  focusLogout,
} from '@/api/auth/onlineUser'
import type { OnlineUserQuery, OnlineUserRecord, LoginDevice } from '@/api/auth/onlineUser/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'OnlineUser',
  inheritAttrs: false,
})

const { t } = useI18n()

// 查询条件
const queryParams = reactive<OnlineUserQuery>({ current: 0, size: 0 })

let checkedRows = reactive<string[]>([])
let currentRow = reactive<OnlineUserRecord>({ userId: 0 })

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 表格字段配置
  fieldList: [
    {
      prop: 'username',
      showOverflowTooltip: true,
      label: t('onlineUser.fields.username'),
    },
    {
      prop: 'displayName',
      showOverflowTooltip: true,
      label: t('onlineUser.fields.displayName'),
    },
    {
      prop: 'sessionCreateTime',
      showOverflowTooltip: true,
      label: t('onlineUser.fields.sessionCreateTime'),
    },
    {
      prop: 'userCode',
      showOverflowTooltip: true,
      label: t('onlineUser.fields.userCode'),
    },
    {
      prop: 'slot',
      type: 'slot',
      showOverflowTooltip: true,
      label: t('onlineUser.fields.loginDeviceCount'),
    },
  ],
  handleBtn: {
    width: 210,
    label: t('common.operate'),
    link: true,
    btList: [
      // 踢下线
      {
        label: t('onlineUser.common.kickOut'),
        type: 'danger',
        icon: 'kickOut',
        event: 'kickOut',
        eventHandle: (row: OnlineUserRecord) => handleKickOut(row),
      },
      // 强制登出
      {
        label: t('onlineUser.common.logout'),
        type: 'warning',
        icon: 'kickOut',
        event: 'kickOut',
        eventHandle: (row: OnlineUserRecord) => handleLogout(row),
      },
    ],
  },
})

/**
 * 踢下线
 *
 * @param row 参数
 */
const handleKickOut = async (row: OnlineUserRecord) => {
  try {
    const response: any = await focusKickOut(row?.userId)
    useMessage().success(response.message)
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 踢下线
 *
 * @param row 参数
 */
const handleLogout = async (row: OnlineUserRecord) => {
  try {
    const response: any = await focusLogout(row?.userId)
    useMessage().success(response.message)
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 强退
 *
 * @param row 参数
 */
const handleKickOutByToken = async (row: LoginDevice) => {
  try {
    const response: any = await focusKickOutByTokenValue(row?.value)
    useMessage().success(response.message)
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 强制注销
 *
 * @param row 参数
 */
const handleLogoutByToken = async (row: LoginDevice) => {
  try {
    const response: any = await focusLogoutByTokenValue(row?.value)
    useMessage().success(response.message)
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: OnlineUserRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <b-table
    ref="onlineUserTableRef"
    :list-api="list"
    :pager="false"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :default-sort="tableInfo.defaultSort"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
  >
    <template #col-slot="{ row }">
      <el-popover placement="top-end" :width="620" trigger="click">
        <template #reference>
          <el-button type="primary" link>登录设备数： {{ row?.loginDeviceCount }}</el-button>
        </template>
        <el-table :data="row.loginDevice">
          <el-table-column width="150" property="device" label="device" />
          <el-table-column width="300" property="value" label="value" />
          <el-table-column align="right" width="130">
            <template #header>操作</template>
            <template #default="{ row }">
              <el-button link type="danger" size="small" @click="handleKickOutByToken(row)">
                {{ t('onlineUser.common.kickOut') }}
              </el-button>
              <el-button link type="warning" size="small" @click="handleLogoutByToken(row)">
                {{ t('onlineUser.common.logout') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-popover>
    </template>
  </b-table>
</template>
