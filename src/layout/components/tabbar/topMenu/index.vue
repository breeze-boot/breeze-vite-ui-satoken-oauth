<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MenuItem from '@/layout/components/menuItem/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import useMenuStore from '@/store/modules/menu.ts'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs.ts'
import Logo from '@/layout/components/logo/index.vue'
import { useWindowSize } from '@vueuse/core'
import { LAYOUT } from '@/utils/common.ts'

let tabsStore = useTabsStore()
let settingStore = useSettingStore()
let { settings, theme } = storeToRefs(settingStore)
let menuStore = useMenuStore()
let $route = useRoute()
let $router = useRouter()
const { width } = useWindowSize()

/**
 * 菜单点击回调
 *
 * @param index
 */
const selectMenu = async (index: string) => {
  const menuInfo = menuStore.getMenuInfo('path', index)
  await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  if (menuInfo?.meta?.type === 1) {
    await $router.push({ path: index, query: {} })
    await menuStore.setMenuChildren([menuInfo] as RouteRecordRaw[])
  } else {
    await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  }
  tabsStore.setTab($route)
}
</script>

<template>
  <el-scrollbar>
    <el-menu
      ellipsis
      mode="horizontal"
      :default-active="$route.path"
      background-color="transparent"
      :collapse="settings.isCollapse"
      @select="selectMenu"
      :style="{
        maxWidth: width - 100 + 'px',
      }"
    >
      <Logo v-if="theme.menuLayout !== LAYOUT.MIX" />
      <menu-item
        v-for="item in menuStore.menuRoutes"
        :key="item.path"
        :layout="theme.menuLayout"
        position="top"
        :menu="item"
      />
    </el-menu>
  </el-scrollbar>
</template>
<style lang="scss">
.el-menu,
.el-menu-item {
  border-bottom: none !important;
}
</style>
