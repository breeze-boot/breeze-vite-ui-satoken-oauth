<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
defineOptions({
  name: 'SearchContainerBox',
  inheritAttrs: false,
})
defineProps({})
</script>

<template>
  <el-card shadow="never">
    <slot></slot>
  </el-card>
</template>
<style scoped></style>
