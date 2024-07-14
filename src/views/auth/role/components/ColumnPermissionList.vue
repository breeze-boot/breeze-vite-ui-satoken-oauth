<!--
 * @author: gaoweixuan
 * @since: 2024-03-05
-->

<!-- 角色列数据权限修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import {
  listSetColumnPermission,
  removeColumnPermission,
  selectTable,
  selectTableColumn,
  setColumnPermission,
} from '@/api/auth/role'
import { useI18n } from 'vue-i18n'
import { ColumnPermissionRecord } from '@/api/auth/role/type.ts'
import { Option, SelectData } from '@/types/types.ts'
import { ElMessage } from 'element-plus'
import { MenuTreeRecord } from '@/api/auth/menu/type.ts'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'ColumnPermissionList',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref(false)
const columnPermissionFormRef = ref()
const tableNameOptions = ref<SelectData[]>()
const columnPermissionDataForm = ref<ColumnPermissionRecord>({})
const tableColumnList = ref<Option[]>()
const tableColumnName = ref<Map<string, string[]>>(new Map())

const rules = ref({
  tableName: [
    {
      required: true,
      message: t('role.rules.tableName'),
      trigger: 'blur',
    },
  ],
  columnName: [
    {
      required: true,
      message: t('role.rules.columnName'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @data 菜单数据
 */
const init = async (data: MenuTreeRecord, currentClickRoleId: number) => {
  columnPermissionDataForm.value.menuId = data.id
  columnPermissionDataForm.value.roleId = currentClickRoleId
  // 重置表单数据
  if (columnPermissionFormRef.value) {
    tableColumnName.value = new Map()
    tableColumnList.value = []
    columnPermissionDataForm.value.tableColumnName = []
    columnPermissionDataForm.value.tableName = ''
    columnPermissionDataForm.value.columnName = []
    columnPermissionFormRef.value.resetFields()
  }

  await initTableNameSelect()
  await getInfo(currentClickRoleId)
  visible.value = true
}

/**
 * 获取信息
 */
const getInfo = async (id: number) => {
  const response: any = await listSetColumnPermission(JSONBigInt.parse(id || 0))
  if (response.code === '0000') {
    let map = new Map()
    Object.entries(response.data).forEach(([key, value]) => {
      let temp: string[] = []
      ;(value as any).forEach((item: any) => {
        temp.push(item.columnName)
      })
      map.set(key, temp)
    })
    tableColumnName.value = map
  }
}

const initTableNameSelect = async () => {
  const response: any = await selectTable()
  if (response.code === '0000') {
    tableNameOptions.value = response.data
  }
}
const handleChangeTable = (tableName: string) => {
  initTableColumnTransferData(tableName)
}

const handleAppendTableColumn = () => {
  if (columnPermissionDataForm.value.columnName && columnPermissionDataForm.value.columnName.length === 0) {
    ElMessage.warning('请选择后添加')
    return
  }
  let temp = tableColumnName.value.get(columnPermissionDataForm.value.tableName as string) as string[]
  if (temp) {
    columnPermissionDataForm.value.columnName?.forEach((columnName) => {
      if (temp.indexOf(columnName) >= 0) {
        ElMessage.warning('无需重复添加')
        return
      }
      temp.push(columnName)
    })
    return
  }
  tableColumnName.value.set(
    columnPermissionDataForm.value.tableName as string,
    columnPermissionDataForm.value.columnName as string[],
  )
}

const handleRemoveTag = async (tableName: string, columnNameIndex: number) => {
  const columnNameList = tableColumnName.value.get(tableName) as string[]
  await removeColumnPermission({
    roleId: columnPermissionDataForm.value.roleId,
    columnName: columnNameList[columnNameIndex],
  })
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      if (tableColumnName.value.get(tableName)?.length === 1) {
        columnNameList?.splice(columnNameIndex, 1)
        tableColumnName.value.delete(tableName)
        return
      }
      tableColumnName.value.get(tableName)?.splice(columnNameIndex, 1)
    },
  })
}

/**
 * 表单提交
 */
const handleColumnPermissionFormSubmit = async () => {
  columnPermissionFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    columnPermissionDataForm.value.tableColumnName = Object.fromEntries(tableColumnName.value)
    await setColumnPermission(columnPermissionDataForm.value)
    ElMessage.success({
      message: t('common.success'),
      duration: 500,
      onClose: () => {
        visible.value = false
      },
    })
  })
}

const initTableColumnTransferData = async (tableName: string) => {
  const response: any = await selectTableColumn(tableName)
  const data: Option[] = []
  if (response.code === '0000') {
    response.data.forEach((column: SelectData) => {
      data.push({
        label: column.label as string,
        key: column.value as string,
        initial: column.value as string,
      })
    })
  }
  tableColumnList.value = data
}

const filterMethod = (query: string, item: Option) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="45%"
    :title="t('role.common.columnPermission')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      style="height: 380px; overflow-y: scroll"
      :model="columnPermissionDataForm"
      :rules="rules"
      ref="columnPermissionFormRef"
      @keyup.enter="handleColumnPermissionFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="100px" :label="$t('role.fields.tableName')" prop="tableName">
        <el-select
          @change="handleChangeTable"
          v-model="columnPermissionDataForm.tableName"
          :placeholder="t('role.fields.tableName')"
          style="width: 240px"
        >
          <el-option v-for="item in tableNameOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button style="margin-left: 10px" @click="handleAppendTableColumn">append</el-button>
      </el-form-item>

      <el-form-item label-width="100px" :label="t('role.fields.columnName')" prop="columnName">
        <el-transfer
          :titles="[t('common.toBeSelectedColumns'), t('common.selectedColumns')]"
          v-model="columnPermissionDataForm.columnName"
          filterable
          :filter-method="filterMethod"
          filter-placeholder=""
          :data="tableColumnList"
        />
      </el-form-item>
    </el-form>
    <div style="height: 200px; width: 100%; padding: 10px; overflow-x: scroll">
      <div v-for="(value, key) in tableColumnName" :key="key" style="display: flex; align-items: center">
        {{ value[0] }}:
        <div v-for="(item, columnNameIndex) in value[1]" :key="columnNameIndex">
          <el-tag
            style="margin: 5px 5px"
            :key="columnNameIndex"
            closable
            :disable-transitions="false"
            @close="handleRemoveTag(value[0], columnNameIndex)"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleColumnPermissionFormSubmit()">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
