<!--
 * @author: gaoweixuan
 * @since: 2024-01-29
-->

<script lang="ts" setup>
import useTabStore, { homeConstantTab } from '@/store/modules/tabs.ts'
import { LocationQueryRaw, RouteRecordRaw, useRouter } from 'vue-router'
import useMenuStore from '@/store/modules/menu.ts'

let $router = useRouter()
let tabsStore = useTabStore()
let menuStore = useMenuStore()

/**
 * 移除tab
 *
 * @param targetName
 */
const removeTab = async (targetName: string) => {
  tabsStore.removeTab(targetName)
  if (!tabsStore.currentTab.fullPath) return
  await $router.push({
    path: tabsStore.currentTab.fullPath,
    query: { ...tabsStore.currentTab.query },
  })
}

/**
 * 切换tab
 *
 * @param pane
 */
const handleSwitchTab = async (pane: any) => {
  const routeName: string = pane.paneName
  const menuInfo = menuStore.getMenuInfo('name', routeName)
  await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  tabsStore.currentTab = tabsStore.getCurrentTab(routeName)
  if (!tabsStore.currentTab.fullPath) return
  await $router.push({
    path: tabsStore.currentTab.fullPath,
    query: tabsStore.currentTab.query as LocationQueryRaw,
  })
}
</script>

<template>
  <div class="el-header-tabs-container">
    <el-tabs
      v-model="tabsStore.currentTabName"
      type="card"
      class="tabs"
      :closable="homeConstantTab.name === 'Home'"
      v-right-menu="''"
      @tab-click="handleSwitchTab"
      @tab-remove="removeTab"
    >
      <el-tab-pane v-for="(item, index) in tabsStore.tabs" :key="index" :label="item.title" :name="item.name">
        {{ item }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.el-header-tabs-container {
  position: relative;
  height: 30px !important;
  padding: 0;
  font-size: 12px;
  text-align: right;
  background: transparent !important;

  .tabs > .el-tabs__content {
    padding: 32px;
    font-size: 32px;
    font-weight: 600;
    color: #6b778c;
  }
}
</style>

<style lang="scss">
// el scss
.el-header-tabs-container {
  .el-tabs__header {
    height: 30px !important;
    margin: 0;
  }

  .el-tabs__nav-prev,
  .el-tabs__nav-next {
    line-height: 30px !important;
  }

  .el-tabs__content {
    display: none;
  }

  .el-tabs__nav-scroll {
    height: 30px !important;
    padding: 0 10px;

    .el-tabs__nav {
      position: relative;
      z-index: calc(var(--el-index-normal) - 1);
      display: flex;
      float: left;
      height: 30px !important;
      white-space: nowrap;
      border: none !important;
      transition: transform var(--el-transition-duration);

      .el-tabs__item {
        width: auto !important;
        height: 30px !important;
        padding: 0 10px;
        padding-right: 23px !important;
        padding-left: 23px !important;
        background: transparent !important;
        border-right: none !important;
        border-bottom: none !important;
        border-left: none !important;
        border-radius: 20px 20px 0 0;
      }

      .el-tabs__item::before,
      .el-tabs__item::after {
        position: absolute;
        z-index: -999;
        width: 20px;
        height: 20px;
        content: '';
        background: transparent !important;
      }

      .el-tabs__item:hover {
        background: rgb(236 234 234 / 50%) !important;
      }

      .el-tabs__item::before {
        bottom: 0;
        left: -20px;
        background: transparent !important;
      }

      .el-tabs__item:hover::before {
        z-index: 999;
        background: radial-gradient(circle at 0 0, transparent 20px, rgb(236 234 234 / 50%) 20px) !important;
      }

      .el-tabs__item::after {
        right: -20px;
        bottom: 0;
        background: transparent !important;
      }

      .el-tabs__item:hover::after {
        z-index: 999;
        background: radial-gradient(circle at 100% 0, transparent 20px, rgb(236 234 234 / 50%) 20px) !important;
      }
    }
  }
}
</style>
