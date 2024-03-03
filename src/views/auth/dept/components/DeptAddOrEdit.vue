<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 部门添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addDept, getDept, editDept, selectDept, checkDeptCode } from '@/api/auth/dept'
import type { DeptRecord } from '@/api/auth/dept/type.ts'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { DIALOG_FLAG, ROOT } from '@/utils/common.ts'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'DeptAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const deptOption = ref<SelectData[]>()
const deptDataFormRef = ref()
const deptDataForm = ref<DeptRecord>({})
const rules = ref({
  parentId: [
    {
      required: true,
      message: t('dept.rules.parentId'),
      trigger: 'blur',
    },
  ],
  deptName: [
    {
      required: true,
      message: t('dept.rules.deptName'),
      trigger: 'blur',
    },
  ],
  deptCode: [
    {
      required: true,
      message: t('dept.rules.deptCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkDeptCode(value, !deptDataForm.value.id ? undefined : JSONBigInt.parse(deptDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('dept.rules.deptCodeExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number, flag: DIALOG_FLAG) => {
  visible.value = true
  deptDataForm.value.id = undefined
  deptDataForm.value.parentId = undefined

  // 重置表单数据
  if (deptDataFormRef.value) {
    deptDataFormRef.value.resetFields()
  }
  if (flag === DIALOG_FLAG.ADD) {
    // 添加，都可以选择
    deptDataForm.value.parentId = ROOT.value
    await initSelectDept(undefined)
  }

  if (flag === DIALOG_FLAG.ADD_SUB) {
    // 添加子节点，赋值父节点为当前节点
    await initSelectDept(id)
    deptDataForm.value.parentId = id
  }

  if (flag === DIALOG_FLAG.EDIT && id) {
    // 修改/添加子节点
    // 不可选择本节点
    await initSelectDept(id)
    await getInfo(id)
  }
}

/**
 * 初始化部门下拉框数据
 */
const initSelectDept = async (id?: number) => {
  const response: any = await selectDept(JSONBigInt.parse(id || 0))
  if (response.code === '0000') {
    deptOption.value = [
      {
        value: ROOT.value,
        label: ROOT.label,
        children: response.data,
      },
    ]
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getDept(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(deptDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDeptDataFormSubmit = () => {
  deptDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = deptDataForm.value.id
    if (id) {
      editDept(deptDataForm.value)
        .then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    } else {
      addDept(deptDataForm.value)
        .then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    }
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="38%"
    :title="!deptDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="deptDataForm"
      :rules="rules"
      ref="deptDataFormRef"
      @keyup.enter="handleDeptDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="100px" :label="t('dept.fields.superiorDept')" prop="parentId">
        <el-cascader
          tag-type="info"
          v-model="deptDataForm.parentId"
          :options="deptOption"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
          :placeholder="t('dept.fields.superiorDept')"
        />
      </el-form-item>
      <el-form-item label-width="100px" :label="t('dept.fields.deptName')" prop="deptName">
        <el-input
          v-model="deptDataForm.deptName"
          autocomplete="off"
          clearable
          :placeholder="t('dept.fields.deptName')"
        />
      </el-form-item>
      <el-form-item label-width="100px" :label="t('dept.fields.deptCode')" prop="deptCode">
        <el-input
          v-model="deptDataForm.deptCode"
          autocomplete="off"
          clearable
          :placeholder="t('dept.fields.deptCode')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDeptDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
