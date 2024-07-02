<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import TabBar from './tabbar/index.vue'
import Tab from './tabbar/tab/index.vue'
import Main from './main/index.vue'
import useSettingStore from '@/store/modules/setting'
import useMenuStore from '@/store/modules/menu'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { watch, onMounted, computed } from 'vue'
import variables from '@/styles/variables.module.scss'
import useTabsStore from '@/store/modules/tabs.ts'
import ContextMenu from '@/layout/tabbar/tab/contextMenu/index.vue'
import websocket from '@/layout/websocket/index.vue'

let $router = useRouter()
let $route = useRoute()
let menuStore = useMenuStore()
let tabStore = useTabsStore()
let { theme, settings } = useSettingStore()

onMounted(async () => {
  await menuStore.setMenuChildren(
    menuStore.getOneLevelMenuInfo('path', tabStore.currentTab.path)?.children as RouteRecordRaw[],
  )
  tabStore.setTab($route)
})

/**
 * 菜单位置计算属性
 */
const menuLayout = computed(() => {
  return theme.menuLayout
})

/**
 * 计算获取菜单数据
 */
const menuList = computed(() => {
  return theme.menuLayout === 'mix' ? menuStore.mixMenuRoutes : menuStore.menuRoutes
})

/**
 * 计算获取菜单数据
 */
const isCollapse = computed(() => {
  return settings.isCollapse
})

const selectMenu = async (index: string) => {
  if (menuLayout.value !== 'top') {
    await $router.push({ path: index })
    tabStore.setTab($route)
  }
}

/**
 * 动态获取tab的样式
 */
const tabStyle = computed(() => {
  return {
    background: variables.baseMainTheme,
    left: menuLayout.value !== 'top' ? (!isCollapse.value ? '200px' : '56px') : '0px',
    width: menuLayout.value !== 'top' ? (isCollapse.value ? 'calc(100% - 56px)' : 'calc(100% - 200px)') : '100%',
  }
})

watch(
  () => theme.menuLayout,
  () => {
    $router.push({ path: $route.path, query: {} })
  },
)
</script>
<template>
  <el-container class="layout-container">
    <el-aside v-if="menuLayout !== 'top'" width="200px" :class="{ isCollapse: isCollapse }">
      <el-scrollbar>
        <el-menu
          background-color="transparent"
          :default-active="$route.path"
          :collapse="isCollapse"
          @select="selectMenu"
        >
          <Logo />
          <Menu :layout="menuLayout" position="noTop" :menuList="menuList" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <TabBar />
      <Tab />
      <el-main :style="tabStyle">
        <el-scrollbar class="scrollbar">
          <el-backtop :visibility-height="100" target=".scrollbar .el-scrollbar__wrap" :bottom="100">
            <div class="backTop">
              <svg-icon name="back-top" width="1.5rem" height="1.5rem" />
            </div>
          </el-backtop>
          <Main />
        </el-scrollbar>
      </el-main>
    </el-container>

    <context-menu ref="contextMenuRef" />
    <websocket />
  </el-container>
</template>
<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  // 菜单区域
  .el-aside {
    box-shadow: rgb(0 0 0 / 10%) 0 3px 3px 0;
    transition: all 0.3s;

    .el-menu {
      border-right: none;
    }
  }

  .el-container {
    flex-direction: column !important;
  }

  // 内容区域
  .el-main {
    position: absolute;
    top: $tabbar-height;
    left: 200px;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $tabbar-height);
    padding: 20px;
    transition: all 0.3s;
  }

  .backTop {
    height: 100%;
    width: 100%;
    background-color: transparent;
    text-align: center;
    line-height: 40px;
    color: #1989fa;
  }
}

.isCollapse {
  width: 56px;
}
</style>
