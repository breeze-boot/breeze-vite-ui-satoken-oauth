<!--
 * @author: gaoweixuan
 * @since: 2024-08-11
-->

<!-- 待办任务审批弹出框 -->
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import TodoTask from '@/components/TodoTask/index.vue'
import { getFlowButtonInfo, getTaskInfo } from '@/api/bpm/task/todo'
import { TodoRecord } from '@/api/bpm/task/todo/type.ts'
import { ElMessage } from 'element-plus'
import { Button } from '@/types/types.ts'

defineOptions({
  name: 'TodoApproval',
  inheritAttrs: false,
})

const $route = useRoute()
const todoTaskRef = ref()
const buttons = ref<Button[]>()
const startUser = ref<string>()
let form = shallowRef()
let taskInfo = ref<TodoRecord>({})

onMounted(async () => {
  if (!$route.query.taskId) {
    return
  }
  const response: any = await getTaskInfo($route.query.taskId as string)
  if (response.code != '0000') {
    ElMessage.warning('任务不存在')
  }
  taskInfo.value = response.data
  await flowButtonInfo(
    taskInfo.value.procDefKey as string,
    taskInfo.value.businessKey as string,
    taskInfo.value.procInstId as string,
  )
  form.value = defineAsyncComponent(() => {
    return import(`/src/views${taskInfo.value.formKey as string}/index.vue`)
  })
})

/**
 * 获取流程的按钮信息
 */
const flowButtonInfo = async (procDefKey: string, businessKey: string, procInstId: string) => {
  const response: any = await getFlowButtonInfo(procDefKey, businessKey, procInstId)
  if (response.code !== '0000') {
    ElMessage.warning('按钮获取失败')
    return
  }
  buttons.value = response.data.buttons
  startUser.value = response.data.startUser
}
/**
 * 获取流程的按钮信息
 */
const approveClickCallBack = (item: Button) => {
  console.log(item)
}
</script>

<template>
  <todo-task
    ref="todoTaskRef"
    @approveClickCallBack="approveClickCallBack"
    :taskInfo="taskInfo"
    v-model:buttons="buttons"
  >
    <template v-slot:formSlot>
      <component v-if="form" :is="form" />
    </template>
  </todo-task>
</template>
