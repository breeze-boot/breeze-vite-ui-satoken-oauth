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
import Tab from '@/layout/tabbar/tab/index.vue'

const { theme } = useSettingStore()

/**
 * 菜单布局计算属性
 */
const menuLayout = computed(() => theme.menuLayout)
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

    <div class="tab-container">
      <Tab />
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
.el-header-container {
  position: relative;
  padding: 0;
  text-align: right;
  font-size: 12px;
  width: 100%;
  background: var(--base-top-theme);
  height: $base-main-top-height;

  .tab-container {
    border: 1px solid rgba(238, 238, 238, 0.47);
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30%;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70%;
    width: 100%;

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
