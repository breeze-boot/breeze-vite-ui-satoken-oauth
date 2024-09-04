<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue'
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'
import useMenuStore from '@/store/modules/menu.ts'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs.ts'

const props = defineProps(['menu'])

let tabsStore = useTabsStore()
let menuStore = useMenuStore()
let $route = useRoute()
let $router = useRouter()
let { settings } = storeToRefs(useSettingStore())

const handleClickMenu = async (menu: any) => {
  if (menu.meta.type === 1) {
    settings.value.isCollapse = true
    await menuStore.setMenuChildren([menu] as RouteRecordRaw[])
    await $router.push({ path: menu.path, query: {} })
  } else {
    settings.value.isCollapse = false
    const menuInfo = menuStore.getMenuInfo('path', menu.path)
    await menuStore.setMenuChildren(menuInfo?.children as RouteRecordRaw[])
  }
  tabsStore.setTab($route)
}
</script>

<template>
  <div class="left-menu-wrapper" v-if="!props.menu.meta.hidden" @click="handleClickMenu(props.menu)">
    <div class="left-menu-logo">
      <svg-icon :name="props.menu.meta.icon" height="1.2rem" width="1.2rem" />
    </div>

    <div class="left-menu-content">
      <span>{{ props.menu.meta.title }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left-menu-wrapper {
  width: var(--el-aside-width);
  height: var(--el-aside-width);
  display: flex;
  z-index: 99;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  background: var(--base-left-theme);
  cursor: pointer;

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
  }

  .left-menu-wrapper:hover {
    background-color: #ff0000;
  }
}
</style>
