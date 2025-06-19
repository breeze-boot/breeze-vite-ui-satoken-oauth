<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import useTabsStore from '@/store/modules/tabs'
import useMenuStore from '@/store/modules/menu'
import useSettingStore from '@/store/modules/setting'
import Main from '@/layout/components/main/index.vue'
import MenuItem from '@/layout/components/menuItem/index.vue'
import Logo from '@/layout/components/logo/index.vue'
import variables from '@/styles/variables.module.scss'
import Setting from '@/layout/components/tabbar/setting/index.vue'
import TopMenu from '@/layout/components/tabbar/topMenu/index.vue'
import Tab from '@/layout/components/tabbar/tab/index.vue'

const $router = useRouter()
const $route = useRoute()
const menuStore = useMenuStore()
const tabStore = useTabsStore()
const { theme, settings } = storeToRefs(useSettingStore())

// 监听路由变化，自动更新标签页
watch(
  () => $route.path,
  () => {
    tabStore.setTab($route)
  },
)

onMounted(async () => {
  try {
    // 获取并设置菜单数据
    const mixLeftMenuInfo = (await menuStore.getMixLeftMenuInfo()) as RouteRecordRaw[]
    await menuStore.setMenuChildren(mixLeftMenuInfo)
    // 初始化标签页
    tabStore.setTab($route)
  } catch (error) {
    console.error('菜单加载失败:', error)
  }
})

/**
 * 菜单选择事件
 *
 * @param index - 路由路径
 */
const selectMenu = async (index: string) => {
  // 避免重复导航到当前路由
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
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth" class="sidebar" :class="{ 'is-collapsed': settings.isCollapse }">
      <Logo />
      <el-scrollbar class="sidebar-scrollbar">
        <el-menu
          background-color="transparent"
          :default-active="$route.path"
          :collapse="settings.isCollapse"
          @select="selectMenu"
        >
          <menu-item
            v-for="item in menuStore.subMenuRoutes"
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
          <TopMenu />
        </div>
        <div class="tabbar-right">
          <Setting />
        </div>
      </div>

      <!-- 标签页容器 -->
      <div class="tab-container">
        <Tab />
      </div>

      <!-- 内容区域 -->
      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  display: flex;

  // 侧边栏区域
  .sidebar {
    background: var(--base-left-theme);
    box-shadow: rgba(0, 0, 0, 0.1) 0 3px 3px 0;
    transition: width 0.3s;
    z-index: 100;

    .sidebar-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
    flex: 1;
    display: flex;
    flex-direction: column;

    .tabbar {
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 15px;
      background: var(--base-top-theme);
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

      .tabbar-left {
        flex: 1;
        display: flex;
        align-items: center;
      }

      .tabbar-right {
        display: flex;
        align-items: center;
      }
    }

    .tab-container {
      border: 1px solid rgba(238, 238, 238, 0.47);
      height: 40px; // 固定标签栏高度
      display: flex;
      align-items: center;
    }
  }
}
</style>
