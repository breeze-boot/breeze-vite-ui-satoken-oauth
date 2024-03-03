<!--
 * @author: gaoweixuan
 * @since: 2024-01-29
-->

<script lang="ts" setup>
import useTabStore from '@/store/modules/tabs.ts'
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
const removeTab = (targetName: string) => {
  tabsStore.removeTab(targetName)
  if (!tabsStore.currentTab.fullPath) return
  $router
    .push({
      path: tabsStore.currentTab.fullPath,
      query: { ...tabsStore.currentTab.query },
    })
    .then((r) => {
      console.debug(r)
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
  <el-header class="el-header-tabs-container">
    <el-tabs
      v-model="tabsStore.currentTabName"
      type="card"
      class="tabs"
      v-right-menu="''"
      closable
      @tab-click="handleSwitchTab"
      @tab-remove="removeTab"
    >
      <el-tab-pane v-for="(item, index) in tabsStore.tabs" :key="index" :label="item.title" :name="item.name">
        {{ item }}
      </el-tab-pane>
    </el-tabs>
  </el-header>
</template>
<style lang="scss" scoped>
.el-header-tabs-container {
  position: relative;
  height: 30px !important;
  padding: 0;
  text-align: right;
  font-size: 12px;
  background: transparent !important;
  z-index: 999;

  .tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}
</style>

<style lang="scss">
// el scss
.el-header-tabs-container {
  .tabs .el-tabs__header {
    margin: 0;
    height: 30px !important;
  }

  .tabs > .el-tabs__content {
    display: none;
  }

  .el-tabs__nav-scroll {
    padding: 0 10px;
    height: 30px !important;

    .el-tabs__nav {
      border: none !important;
      height: 30px !important;

      .el-tabs__item {
        width: auto !important;
        background: rgba(162, 162, 162, 0.1);
        padding: 0 10px;
        border-right: none !important;
        border-bottom: none !important;
        border-left: none !important;
        padding-left: 23px !important;
        padding-right: 23px !important;
        border-radius: 20px 20px 0 0;
        height: 30px !important;
      }

      .el-tabs__item::before,
      .el-tabs__item::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(162, 162, 162, 0.1);
        z-index: -999;
      }

      .el-tabs__item:hover {
        background: rgba(236, 234, 234, 0.5);
      }

      .el-tabs__item::before {
        left: -20px;
        bottom: 0;
        background: radial-gradient(circle at 0 0, transparent 20px, rgba(162, 162, 162, 0.1) 20px);
      }

      .el-tabs__item:hover::before {
        background: radial-gradient(circle at 0 0, transparent 20px, rgba(236, 234, 234, 0.5) 20px);
        z-index: 999;
      }

      .el-tabs__item::after {
        right: -20px;
        bottom: 0;
        background: radial-gradient(circle at 100% 0, transparent 20px, rgba(162, 162, 162, 0.1) 20px);
      }

      .el-tabs__item:hover::after {
        background: radial-gradient(circle at 100% 0, transparent 20px, rgba(236, 234, 234, 0.5) 20px);
        z-index: 999;
      }
    }
  }
}
</style>
