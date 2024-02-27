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
    <el-row :gutter="24">
      <el-col :md="24">
        <slot></slot>
      </el-col>
    </el-row>
  </el-card>
</template>
<style scoped>
.el-card {
  display: flex;
}
</style>
