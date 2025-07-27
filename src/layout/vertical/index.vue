<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs.ts'
import useMenuStore from '@/store/modules/menu'
import useSettingStore from '@/store/modules/setting'
import Main from '@/layout/components/main/index.vue'
import MenuItem from '@/layout/components/menuItem/index.vue'
import Logo from '@/layout/components/logo/index.vue'
import variables from '@/styles/variables.module.scss'
import { DEVICE } from '@/utils/common.ts'
import Setting from '@/layout/components/tabbar/setting/index.vue'
import BreadCrumb from '@/layout/components/tabbar/breadcrumb/index.vue'
import Tabs from '@/layout/components/tabbar/tabs/index.vue'

const $router = useRouter()
const $route = useRoute()
const menuStore = useMenuStore()
const tabStore = useTabsStore()
const settingStore = useSettingStore()
const { theme, settings, device } = storeToRefs(settingStore)

// 监听路由变化，更新标签页
watch(
  () => $route.path,
  () => {
    tabStore.setTab($route)
  },
)

onMounted(() => {
  tabStore.setTab($route)
})

/**
 * 菜单选择事件
 *
 * @param index - 路由路径
 */
const selectMenu = async (index: string) => {
  if (index !== $route.path) {
    await $router.push({ path: index })
    // 路由变化会触发watch监听，无需在此重复调用setTab
  }
}

/**
 * 计算侧边栏宽度
 */
const sidebarWidth = computed(() => {
  return settings.value.isCollapse ? '56px' : variables.baseLeftMenuWidth
})

/**
 * 动态获取main的样式
 */
const mainStyle = computed(() => ({
  background: variables.baseMainTheme,
  left: sidebarWidth.value,
  transition: 'left 0.3s',
}))
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth" class="sidebar" :class="{ 'is-collapsed': settings.isCollapse }">
      <div class="sidebar-header">
        <Logo />
      </div>
      <el-scrollbar class="sidebar-scrollbar">
        <el-menu
          background-color="transparent"
          :default-active="$route.path"
          :collapse="settings.isCollapse"
          @select="selectMenu"
        >
          <menu-item
            v-for="item in menuStore.menuRoutes"
            :key="item.path"
            :layout="theme.menuLayout"
            position="noTop"
            :menu="item"
          />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="layout-main-container">
      <!-- 顶部导航栏 -->
      <div class="tabbar">
        <div class="tabbar-left">
          <BreadCrumb v-if="device === DEVICE.PC" />
        </div>
        <div class="tabbar-right">
          <Setting />
        </div>
      </div>
      <div class="tab-container">
        <tabs />
      </div>
      <!-- 内容区域 -->
      <el-main :style="mainStyle">
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;

  // 侧边栏区域
  .sidebar {
    z-index: 100;
    background: var(--base-left-theme);
    box-shadow: rgb(0 0 0 / 10%) 0 3px 3px 0;
    transition: width 0.3s;

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      border-bottom: 1px solid rgb(255 255 255 / 10%);
    }

    .sidebar-scrollbar {
      height: calc(100vh - 60px);
    }

    .el-menu {
      border-right: none;
    }
  }

  .is-collapsed {
    width: 56px !important;
  }

  // 主内容区域
  .layout-main-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    .tabbar {
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 15px;
      background: var(--base-top-theme);
      box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

      .tabbar-left {
        display: flex;
        flex: 1;
        align-items: center;
      }

      .tabbar-right {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
