<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'
import BreadCrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
import TopMenu from './topMenu/index.vue'
import Tab from '@/layout/components/tabbar/tab/index.vue'
import { DEVICE, LAYOUT } from '@/utils/common.ts'

const { theme, device } = storeToRefs(useSettingStore())
</script>

<template>
  <el-header class="el-header-container">
    <div class="tabbar">
      <div class="tabbar-left">
        <top-menu v-if="theme.menuLayout !== LAYOUT.VERTICAL && theme.menuLayout !== LAYOUT.COLUMNS" />
        <bread-crumb
          v-if="(theme.menuLayout === LAYOUT.VERTICAL || theme.menuLayout === LAYOUT.COLUMNS) && device === DEVICE.PC"
        />
      </div>
      <div class="tabbar-right">
        <setting />
      </div>
    </div>

    <div class="tab-container">
      <tab />
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

  .tabbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70%;
    width: 100%;

    .tabbar-left {
      display: flex;
      margin-left: 10px;
      align-items: flex-start;
    }

    .tabbar-right {
      display: flex;
      align-items: center;
      justify-items: flex-end;
    }
  }

  .tab-container {
    border: 1px solid rgba(238, 238, 238, 0.47);
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30%;
  }
}
</style>
