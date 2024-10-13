<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs.ts'
import useMenuStore from '@/store/modules/menu'
import useSettingStore from '@/store/modules/setting'
import TabBar from '@/layout/components/tabbar/index.vue'
import ColumnsMenu from '@/layout/components/columnsMenu/index.vue'
import Main from '@/layout/components/main/index.vue'
import MenuItem from '@/layout/components/menuItem/index.vue'
import Logo from '@/layout/components/logo/index.vue'
import variables from '@/styles/variables.module.scss'

let $router = useRouter()
let $route = useRoute()
let menuStore = useMenuStore()
let tabStore = useTabsStore()
let { theme, settings } = storeToRefs(useSettingStore())

onMounted(async () => {
  settings.value.isCollapse = true
  const mixLeftMenuInfo = (await menuStore.getMixLeftMenuInfo()) as RouteRecordRaw[]
  await menuStore.setMenuChildren(mixLeftMenuInfo)
  tabStore.setTab($route)
})

/**
 * 菜单选择事件
 *
 * @param index
 */
const selectMenu = async (index: string) => {
  await $router.push({ path: index })
  tabStore.setTab($route)
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="variables.baseColumnsLeftMenuWidth" style="overflow: hidden">
      <Logo :title="false" />
      <el-scrollbar>
        <columns-menu v-for="item in menuStore.menuRoutes" :menu="item" :key="item.path" />
      </el-scrollbar>
    </el-aside>
    <el-aside
      :width="variables.baseLeftMenuWidth"
      style="overflow: hidden"
      :class="{ isCollapse: settings.isCollapse }"
    >
      <Logo :logo-img="false" />
      <el-scrollbar>
        <el-menu
          background-color="transparent"
          :default-active="$route.path"
          :collapse="settings.isCollapse"
          @select="selectMenu"
        >
          <menu-item v-for="item in menuStore.subMenuRoutes" :key="item.path" :layout="theme.menuLayout" :menu="item" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="layout-main-container">
      <tab-bar />
      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  // 菜单区域
  .el-aside {
    background: var(--base-left-theme);
    box-shadow: rgb(0 0 0 / 10%) 0 3px 3px 0;
    transition: all 0.3s;

    .el-menu {
      border-right: none;
    }
  }

  .isCollapse {
    width: 0;
  }

  .layout-main-container {
    height: 100%;
    flex-direction: column !important;
  }
}
</style>
