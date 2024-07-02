<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 流程分类添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addCategory, getCategory, editCategory, checkCategoryCode } from '@/api/flow/category'
import type { CategoryRecord } from '@/api/flow/category/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import useUserStore from '@/store/modules/user.ts'

defineOptions({
  name: 'CategoryAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const tenantIdOption = ref<SelectData[]>()
const categoryDataFormRef = ref()
const categoryDataForm = ref<CategoryRecord>({ categoryCode: '', categoryName: '', tenantId: '' })
const rules = ref({
  categoryName: [
    {
      required: true,
      message: t('category.rules.categoryName'),
      trigger: 'blur',
    },
  ],
  categoryCode: [
    {
      required: true,
      message: t('category.rules.categoryCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkCategoryCode(
          value,
          !categoryDataForm.value.id ? undefined : JSONBigInt.parse(categoryDataForm.value.id),
        ).then((response: any) => {
          if (response.data) {
            callback()
            return
          }
          callback(new Error(t('category.rules.categoryCodeDuplicate')))
        })
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
const init = async (id: number) => {
  visible.value = true
  categoryDataForm.value.id = undefined
  // 重置表单数据
  if (categoryDataFormRef.value) {
    categoryDataFormRef.value.resetFields()
  }
  await initTenant()
  if (id) {
    await getInfo(id)
  }
}

/**
 * 初始化租户下拉框
 */
const initTenant = async () => {
  const response: any = await selectTenant()
  if (response.code === '0000') {
    tenantIdOption.value = response.data
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getCategory(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(categoryDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  categoryDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    categoryDataForm.value.tenantId = useUserStore().userInfo.tenantId.toString()
    const id = categoryDataForm.value.id
    if (id) {
      await editCategory(categoryDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addCategory(categoryDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
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
    :title="!categoryDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="categoryDataForm"
      :rules="rules"
      ref="categoryDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="110px" :label="t('category.fields.categoryCode')" prop="categoryCode">
        <el-input v-model="categoryDataForm.categoryCode" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('category.fields.categoryName')" prop="categoryName">
        <el-input v-model="categoryDataForm.categoryName" autocomplete="off" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
