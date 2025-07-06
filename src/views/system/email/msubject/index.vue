<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->
<!-- 邮箱主题管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import { page, exportExcel, deleteMSubject, open } from '@/api/system/email/msubject'
import type { MSubjectRecords } from '@/api/system/email/msubject/type.ts'
import type { MSubjectRecord, MSubjectQuery } from '@/api/system/email/msubject/type.ts'
import { SelectEvent, TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/MSubjectAddOrEdit.vue'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import SetUser from '@/views/system/email/msubject/components/SetUser.vue'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'MSubject',
  inheritAttrs: false,
})

const { t } = useI18n()
const mSubjectQueryFormRef = ref(ElForm)
const mSubjectAddOrEditRef = ref()
const setUserRef = ref()

// 查询条件
const queryParams = reactive<MSubjectQuery>({
  subject: '',
  current: 1,
  size: 10,
  total: 0,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<MSubjectRecord>({ cc: '', content: '', subject: '', to: '' })

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
      permission: ['sys:mSubject:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['sys:mSubject:delete'],
      event: 'delete',
      icon: 'delete',
      eventHandle: (rows: MSubjectRecords) => handleDelete(rows),
    },
    {
      type: 'default',
      label: t('common.export'),
      permission: ['sys:mSubject:export'],
      event: 'exportCurrentPage',
      icon: 'export',
    },
    {
      type: 'default',
      label: t('common.exportAll'),
      permission: ['sys:mSubject:export'],
      event: 'exportAll',
      icon: 'excel',
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'subject',
      showOverflowTooltip: true,
      label: t('mSubject.fields.subject'),
      width: 200,
    },
    {
      prop: 'content',
      showOverflowTooltip: true,
      label: t('mSubject.fields.content'),
    },
    {
      prop: 'to',
      showOverflowTooltip: true,
      label: t('mSubject.fields.to'),
      type: 'rowLink',
      width: 200,
      linkInfo: {
        routePath: '/email/userEmail',
        rowParam: ['id'],
        query: { column: 'toEmail' },
      },
    },
    {
      prop: 'to',
      showOverflowTooltip: true,
      label: t('mSubject.fields.to'),
      type: 'customRowLink',
      width: 200,
      linkInfo: {
        routePath: '/email/userEmail',
        rowParam: ['id'],
        query: { column: 'toEmail' },
        // 自定义固定的字段值
        fixColumnName: '发送方',
      },
    },
    {
      prop: 'cc',
      showOverflowTooltip: true,
      label: t('mSubject.fields.cc'),
      type: 'customRowLink',
      width: 100,
      linkInfo: {
        routePath: '/email/userEmail',
        query: { column: 'ccEmail' },
        rowParam: ['id'],
        // 自定义动态字段值
        columnName: 'subject',
      },
    },
    {
      prop: 'status',
      label: t('mSubject.fields.status'),
      type: 'switch',
      switch: {
        activeValue: 1,
        inactiveValue: 0,
        api: open,
        pk: 'id',
        status: 'status',
      },
    },
  ],
  handleBtn: {
    width: 300,
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
        permission: ['sys:mSubject:modify'],
        eventHandle: (row: MSubjectRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['sys:mSubject:info'],
        eventHandle: (row: MSubjectRecord) => handleInfo(row),
      },
      // 设置邮箱发送人
      {
        label: t('mSubject.common.setTo'),
        type: 'success',
        icon: 'view',
        event: 'view',
        eventHandle: (row: MSubjectRecord) => handleSetTo(row),
      },
      // 设置邮箱抄送人
      {
        label: t('mSubject.common.setCc'),
        type: 'success',
        icon: 'view',
        event: 'view',
        eventHandle: (row: MSubjectRecord) => handleSetCc(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['sys:mSubject:delete'],
        eventHandle: (row: MSubjectRecord) => handleDelete([row] as MSubjectRecords),
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
  mSubjectQueryFormRef.value.resetFields()
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
  mSubjectAddOrEditRef.value.init(id)
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleInfo = (row: MSubjectRecord) => {
  console.log(row)
}

/**
 * 设置邮箱发送人
 *
 * @param row 参数
 */
const handleSetTo = (row: MSubjectRecord) => {
  setUserRef.value.init(row.id, 'toUserId')
}

/**
 * 设置邮箱抄送人
 *
 * @param row 参数
 */
const handleSetCc = (row: MSubjectRecord) => {
  setUserRef.value.init(row.id, 'ccUserId')
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
const handleDelete = async (rows: MSubjectRecords) => {
  try {
    const mSubjectIds = rows.map((item: any) => item.id)
    await deleteMSubject(mSubjectIds)
    useMessage().success(`${t('common.delete')} ${t('common.success')}`)
    reloadList()
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: MSubjectRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: MSubjectRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="mSubjectQueryFormRef" :model="queryParams" :inline="true">
      <!-- 用户名 -->
      <el-form-item :label="t('mSubject.fields.subject')" prop="subject">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('mSubject.fields.subject')"
          v-model="queryParams.subject"
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
    ref="mSubjectTableRef"
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
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="mSubjectAddOrEditRef" @reload-data-list="reloadList" />

  <set-user ref="setUserRef" @reload-data-list="reloadList" />
</template>
