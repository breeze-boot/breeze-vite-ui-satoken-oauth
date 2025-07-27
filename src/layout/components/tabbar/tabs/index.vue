<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->
<!-- 标签栏组件 -->
<template>
  <div class="app-container">
    <BreezeTab
      v-right-menu
      :tabs="tabsStore.tabs"
      :currentTabName="tabsStore.currentTab.name"
      :homeConstantTab="homeConstantTab"
      @update:currentTabName="handleTabChange"
      @tab-remove="handleTabRemove"
    />
  </div>
</template>

<script lang="ts" setup>
import BreezeTab from '@/layout/components/tabbar/breeze-tab/index.vue'
import useTabStore, { homeConstantTab } from '@/store/modules/tabs.ts'
import useMenuStore from '@/store/modules/menu.ts'

const tabsStore = useTabStore()
const menuStore = useMenuStore()

/**
 * 移除tab
 */
const handleTabRemove = async (targetName: string) => {
  tabsStore.removeTab(targetName)
}

/**
 * 切换tab
 */
const handleTabChange = async (tabName: string) => {
  // 获取对应的菜单信息
  const menuInfo = menuStore.getMenuInfo('name', tabName)
  if (menuInfo?.children) {
    await menuStore.setMenuChildren(menuInfo.children)
  }

  // 更新当前选中的tab
  const targetTab = tabsStore.getCurrentTab(tabName)
  if (targetTab) {
    tabsStore.currentTab = targetTab
  }
}
</script>
