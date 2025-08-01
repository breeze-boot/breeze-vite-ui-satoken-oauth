<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 流程分类添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addCategory, getCategory, editCategory, checkCategoryCode } from '@/api/bpm/def/category'
import type { CategoryForm } from '@/api/bpm/def/category/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import useUserStore from '@/store/modules/user.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'CategoryAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const categoryDataFormRef = ref()
const categoryDataForm = ref<CategoryForm>({ categoryCode: '', categoryName: '', tenantId: '' })
const rules = ref({
  categoryName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('category.fields.categoryName'),
      trigger: 'blur',
    },
  ],
  categoryCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('category.fields.categoryCode'),
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
  categoryDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (categoryDataFormRef.value) {
    categoryDataFormRef.value.resetFields()
  }

  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getCategory(JSONBigInt.parse(id))
    Object.assign(categoryDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleCategoryDataFormSubmit = async () => {
  await categoryDataFormRef.value.validate()
  loading.value = true
  categoryDataForm.value.tenantId = useUserStore().userInfo.tenantId.toString()
  const id = categoryDataForm.value.id
  try {
    id ? await editCategory(id, categoryDataForm.value) : await addCategory(categoryDataForm.value)
    $message.success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
    visible.value = false
    loading.value = false
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!categoryDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="categoryDataForm"
      :rules="rules"
      ref="categoryDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('category.fields.categoryCode')" prop="categoryCode">
        <el-input
          v-model="categoryDataForm.categoryCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('category.fields.categoryCode')"
        />
      </el-form-item>
      <el-form-item :label="t('category.fields.categoryName')" prop="categoryName">
        <el-input
          v-model="categoryDataForm.categoryName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('category.fields.categoryName')"
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
      <el-button type="primary" :loading="loading" @click="handleCategoryDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
