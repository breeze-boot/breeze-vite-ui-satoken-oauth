<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import useMenuStore from '@/store/modules/menu.ts'
import useTabsStore from '@/store/modules/tabs.ts'
import { MENU_TYPE } from '@/utils/common.ts'

const props = defineProps(['menu'])

let tabsStore = useTabsStore()
let menuStore = useMenuStore()
let $route = useRoute()
let $router = useRouter()
let { settings } = storeToRefs(useSettingStore())

const handleClickMenu = async (menu: any) => {
  if (menu.meta.type === MENU_TYPE.MENU) {
    settings.value.isCollapse = true
    await menuStore.setMenuChildren([menu] as RouteRecordRaw[])
    await $router.push({ path: menu.path, query: {} })
  } else {
    settings.value.isCollapse = false
    const menuInfo = menuStore.getMenuInfo('path', menu.path)
    await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  }
  tabsStore.setTab($route)
  menuStore.currentMenu = menu
}
</script>

<template>
  <div class="left-menu-wrapper" v-if="!props.menu.meta.hidden" @click="handleClickMenu(props.menu)">
    <div class="left-menu-logo">
      <svg-icon
        :color="
          props.menu.path === menuStore.currentMenu.path ? 'var(--el-color-primary)' : 'var(--el-menu-text-color)'
        "
        :name="props.menu.meta.icon"
        height="1.2rem"
        width="1.2rem"
      />
    </div>

    <div
      class="left-menu-content"
      :style="{
        color: props.menu.path === menuStore.currentMenu.path ? 'var(--el-color-primary)' : 'var(--el-menu-text-color)',
      }"
    >
      <span>{{ props.menu.meta.title }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left-menu-wrapper {
  width: var(--el-aside-width);
  height: var(--el-aside-width);
  background: var(--base-left-theme);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
  cursor: pointer;
  transition: background-color 0.3s ease; // 添加过渡效果

  .left-menu-logo {
    width: 50px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .left-menu-content {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer !important;
    font-size: 0.8rem;
    text-align: center;
    width: 100%;
    height: 50px;
    padding: 3px;
    transition: color 0.3s ease; // 添加过渡效果
  }

  // 鼠标悬停样式
  &:hover {
    background-color: rgba(0, 0, 0, 0.1); // 更柔和的颜色
  }

  // 当前选中菜单样式
  &.active {
    background-color: rgba(0, 0, 0, 0.15);
  }
}
</style>
