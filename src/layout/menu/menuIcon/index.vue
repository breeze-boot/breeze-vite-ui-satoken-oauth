<!--
 * @author: gaoweixuan
 * @since: 2024-02-07
-->
<script setup lang="ts" name="MenuIcon">
const props = defineProps({
  //svg矢量图的名字
  icon: {
    type: String,
    default: 'home',
  },
  //svg宽度
  width: {
    type: String,
    default: '1rem',
  },
  //svg高度
  height: {
    type: String,
    default: '1rem',
  },
})
</script>

<template>
  <i class="el-icon">
    <svg-icon :name="props.icon" :width="props.width" :height="props.height" />
  </i>
</template>
<style scoped></style>
