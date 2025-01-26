<!--
 * @author: gaoweixuan
 * @since: 2024-08-11
-->

<!-- 待办任务审批 -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProcessTask from '@/components/ProcessTask/index.vue'
import { Button } from '@/types/types.ts'

defineOptions({
  name: 'TodoApproval',
  inheritAttrs: false,
})

const $route = useRoute()
const todoTaskRef = ref()

onMounted(async () => {
  if (!$route.query.taskId) {
    return
  }
  await todoTaskRef.value.initApprove($route.query.taskId as string)
})

/**
 * 获取流程的按钮信息
 */
const approveClickCallBack = (item: Button) => {
  console.log(item)
}
</script>

<template>
  <process-task ref="todoTaskRef" @approveClickCallBack="approveClickCallBack">
    <template v-slot:form></template>
  </process-task>
</template>
