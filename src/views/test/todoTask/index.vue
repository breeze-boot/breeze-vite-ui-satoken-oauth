<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 测试TodoTask -->
<script setup lang="ts">
import { ref } from 'vue'
import TodoTask from '@/components/TodoTask/index.vue'

defineOptions({
  name: 'TodoTask',
  inheritAttrs: false,
})

const businessKey = ref<string>()
const procDefKey = ref<string>()
</script>

<template>
  <todo-task :businessKey="businessKey" :procDefKey="procDefKey" />
</template>

<style lang="scss" scoped></style>
