<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 部门添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addDept, getDept, editDept, selectDept, checkDeptCode } from '@/api/auth/dept'
import type { DeptForm } from '@/api/auth/dept/type.ts'
import { useI18n } from 'vue-i18n'
import type { SelectData } from '@/types/types.ts'
import { DIALOG_FLAG, ROOT } from '@/utils/common.ts'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DeptAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const deptOption = ref<SelectData[]>()
const deptDataFormRef = ref()
const deptDataForm = ref<DeptForm>({})
const rules = ref({
  parentId: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('dept.filed.superiorDept'),
      trigger: 'blur',
    },
  ],
  deptName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dept.fields.deptName'),
      trigger: 'blur',
    },
  ],
  deptCode: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('dept.fields.deptCode'),
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
 * @param flag
 */
const init = async (id: number, flag: DIALOG_FLAG) => {
  deptDataForm.value.id = undefined
  deptDataForm.value.parentId = undefined

  visible.value = true
  // 重置表单数据
  if (deptDataFormRef.value) {
    deptDataFormRef.value.resetFields()
  }
  if (flag === DIALOG_FLAG.ADD) {
    // 添加，都可以选择
    deptDataForm.value.parentId = ROOT.value as number
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
  try {
    const response: any = await selectDept(JSONBigInt.parse(id || 0))
    deptOption.value = [
      {
        value: ROOT.value,
        label: ROOT.label,
        children: response.data,
      },
    ]
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getDept(JSONBigInt.parse(id))
    Object.assign(deptDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDeptDataFormSubmit = async () => {
  await deptDataFormRef.value.validate()
  loading.value = true
  const id = deptDataForm.value.id
  try {
    id ? await editDept(id, deptDataForm.value) : await addDept(deptDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  } finally {
    visible.value = false
    loading.value = false
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!deptDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="deptDataForm" :rules="rules" ref="deptDataFormRef" @keyup.enter="handleDeptDataFormSubmit()">
      <el-form-item :label="t('dept.fields.superiorDept')" prop="parentId">
        <el-cascader
          tag-type="info"
          v-model="deptDataForm.parentId"
          :options="deptOption"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
          :placeholder="t('common.placeholder.choose') + t('dept.fields.superiorDept')"
        />
      </el-form-item>
      <el-form-item :label="t('dept.fields.deptName')" prop="deptName">
        <el-input
          v-model="deptDataForm.deptName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('dept.fields.deptName')"
        />
      </el-form-item>
      <el-form-item :label="t('dept.fields.deptCode')" prop="deptCode">
        <el-input
          v-model="deptDataForm.deptCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.choose') + t('dept.fields.deptCode')"
        />
      </el-form-item>
    </el-form>
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
      <el-button type="primary" :loading="loading" @click="handleDeptDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
