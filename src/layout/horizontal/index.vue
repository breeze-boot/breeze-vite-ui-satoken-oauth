<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import TabBar from '@/layout/components/tabbar/index.vue'
import Main from '@/layout/components/main/index.vue'
</script>

<template>
  <el-container class="layout-container">
    <el-container class="layout-main-container">
      <tab-bar />
      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .layout-main-container {
    height: 100%;
    flex-direction: column !important;
  }
}
</style>
