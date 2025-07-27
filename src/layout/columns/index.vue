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
import ColumnsMenu from '@/layout/components/columnsMenu/index.vue'
import Main from '@/layout/components/main/index.vue'
import MenuItem from '@/layout/components/menuItem/index.vue'
import Logo from '@/layout/components/logo/index.vue'
import variables from '@/styles/variables.module.scss'
import { DEVICE } from '@/utils/common.ts'
import Setting from '@/layout/components/tabbar/setting/index.vue'
import BreadCrumb from '@/layout/components/tabbar/breadcrumb/index.vue'
import Tabs from '@/layout/components/tabbar/tabs/index.vue'

let $router = useRouter()
let $route = useRoute()
let menuStore = useMenuStore()
let tabStore = useTabsStore()
let { theme, settings, device } = storeToRefs(useSettingStore())

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
      <div class="column-menu">
        <columns-menu v-for="item in menuStore.menuRoutes" :menu="item" :key="item.path" />
      </div>
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
      <div class="tabbar">
        <div class="tabbar-left">
          <bread-crumb v-if="device === DEVICE.PC" />
        </div>
        <div class="tabbar-right">
          <setting />
        </div>
      </div>

      <div class="tab-container">
        <tabs />
      </div>
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
    padding-bottom: 60px;
    background: var(--base-left-theme);
    box-shadow: rgb(0 0 0 / 10%) 0 3px 3px 0;
    transition: all 0.3s;

    .column-menu {
      height: 100%;
      overflow: hidden scroll;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .isCollapse {
    width: 0;
  }

  .layout-main-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    .tabbar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 60px;

      .tabbar-left {
        display: flex;
        align-items: flex-start;
        width: 80%;
        margin-left: 10px;
      }

      .tabbar-right {
        display: flex;
        place-items: center flex-end;
        width: 25%;
      }
    }
  }
}
</style>
