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
import { useWindowSize } from '@vueuse/core'
import { MENU_TYPE } from '@/utils/common.ts'
import { ref } from 'vue'

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
  if (menuInfo?.meta?.type === MENU_TYPE.MENU) {
    await $router.push({ path: index, query: {} })
    await menuStore.setMenuChildren([menuInfo] as RouteRecordRaw[])
  } else {
    await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  }
  tabsStore.setTab($route)
}
const menuRef = ref<HTMLDivElement | null>(null)

// 处理鼠标滚轮事件，实现横向滚动
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (menuRef.value) {
    menuRef.value.scrollLeft = menuRef.value.scrollLeft + e.deltaY
  }
}
</script>

<template>
  <div class="h-menu" title="滑轮滚动" ref="menuRef" @wheel.prevent="handleWheel">
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
      <menu-item
        v-for="item in menuStore.menuRoutes"
        :key="item.path"
        :layout="theme.menuLayout"
        position="top"
        :menu="item"
      />
    </el-menu>
  </div>
</template>
<style lang="scss">
.h-menu {
  width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .el-menu,
  .el-menu-item {
    border-bottom: none !important;
  }
}
</style>
