<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Menu from '@/layout/menuItem/index.vue'
import Logo from '@/layout/logo/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import useMenuStore from '@/store/modules/menu.ts'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs.ts'

let tabsStore = useTabsStore()
let settingStore = useSettingStore()

let { settings, theme } = storeToRefs(settingStore)
let menuStore = useMenuStore()
let $route = useRoute()
let $router = useRouter()

/**
 * 菜单点击回调
 *
 * @param index
 */
const selectMenu = async (index: string) => {
  const menuInfo = menuStore.getMenuInfo('path', index)
  await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  if (theme.value.menuLayout !== '' && menuInfo?.meta?.type === 1) {
    await $router.push({ path: index, query: {} })
    tabsStore.setTab($route)
  }
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
    >
      <Logo v-if="theme.menuLayout !== 'mix'" />
      <Menu :layout="theme.menuLayout" position="top" :menuList="menuStore.menuRoutes" />
    </el-menu>
  </el-scrollbar>
</template>
<style lang="scss">
.el-menu,
.el-menu-item {
  border-bottom: none !important;
}
</style>
