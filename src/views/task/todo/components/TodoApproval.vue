<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 待办任务审批弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { getTodo } from '@/api/task/todo'
import type { TodoRecord } from '@/api/task/todo/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'TodoApproval',
  inheritAttrs: false,
})

const { t } = useI18n()
// const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const todoDataFormRef = ref()
const todoDataForm = ref<TodoRecord>({})
const rules = ref({})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  todoDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (todoDataFormRef.value) {
    todoDataFormRef.value.resetFields()
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
  const response: any = await getTodo(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(todoDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  todoDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
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
    :title="!todoDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="todoDataForm"
      :rules="rules"
      ref="todoDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="110px" :label="t('todo.fields.todoName')" prop="todoName">
        <el-input v-model="todoDataForm.todoName" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('todo.fields.todoCode')" prop="todoCode">
        <el-input v-model="todoDataForm.todoCode" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('todo.fields.description')" prop="description">
        <el-input v-model="todoDataForm.description" autocomplete="off" clearable type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
