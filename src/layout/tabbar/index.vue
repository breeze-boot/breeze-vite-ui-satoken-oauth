<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import BreadCrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
import TopMenu from './topMenu/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import { computed } from 'vue'

const { theme } = useSettingStore()

/**
 * 菜单布局计算属性
 */
const menuLayout = computed(() => {
  return theme.menuLayout
})
</script>

<template>
  <el-header class="el-header-container">
    <div class="toolbar">
      <div class="toolbar-left">
        <TopMenu v-if="menuLayout !== 'left'" />
        <BreadCrumb v-else />
      </div>
      <div class="toolbar-right">
        <Setting />
      </div>
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
.el-header-container {
  padding: 0;
  text-align: right;
  font-size: 12px;
  background: transparent !important;

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    .toolbar-left {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
    }
  }
}
</style>
