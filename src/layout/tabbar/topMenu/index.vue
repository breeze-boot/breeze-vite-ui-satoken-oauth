<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import Menu from '@/layout/menu/index.vue'
import Logo from '@/layout/logo/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import useMenuStore from '@/store/modules/menu.ts'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs.ts'
import { computed } from 'vue'

let tabsStore = useTabsStore()
let settingStore = useSettingStore()

let { settings, theme } = settingStore
let menuStore = useMenuStore()
let $route = useRoute()
let $router = useRouter()

/**
 * 菜单位置
 */
const menuLayout = computed(() => {
  return theme.menuLayout
})

/**
 * 菜单位置
 */
const isCollapse = computed(() => {
  return settings.isCollapse
})

/**
 * 获取菜单路由
 */
const menuRoutes = computed(() => {
  return menuStore.menuRoutes
})

/**
 * 菜单点击回调
 *
 * @param index
 */
const selectMenu = async (index: string) => {
  const menuInfo = menuStore.getMenuInfo('path', index)
  await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  if (menuLayout.value !== '' && menuInfo?.meta?.type === 1) {
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
      :collapse="isCollapse"
      @select="selectMenu"
    >
      <Logo v-if="menuLayout !== 'mix'" />
      <Menu :layout="menuLayout" position="top" :menuList="menuRoutes" />
    </el-menu>
  </el-scrollbar>
</template>
<style lang="scss">
.el-menu,
.el-menu-item {
  border-bottom: none !important;
}
</style>
