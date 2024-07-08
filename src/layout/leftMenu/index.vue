<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import Menu from '@/layout/menuItem/index.vue'
import Logo from '@/layout/logo/index.vue'
import useSettingStore from '@/store/modules/setting'
import useMenuStore from '@/store/modules/menu'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { onMounted, computed, watch } from 'vue'
import useTabsStore from '@/store/modules/tabs.ts'
import variables from '@/styles/variables.module.scss'

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
const menuLayout = computed(() => theme.menuLayout)

/**
 * 计算获取菜单数据
 */
const menuList = computed(() => (menuLayout.value === 'mix' ? menuStore.mixMenuRoutes : menuStore.menuRoutes))

/**
 * 计算获取菜单数据
 */
const isCollapse = computed(() => settings.isCollapse)

/**
 * 菜单选择事件
 *
 * @param index
 */
const selectMenu = async (index: string) => {
  if (menuLayout.value !== 'top') {
    await $router.push({ path: index })
    tabStore.setTab($route)
  }
}

watch(
  () => theme.menuLayout,
  () => {
    $router.push({ path: $route.path, query: {} })
  },
)
</script>

<template>
  <el-aside v-if="menuLayout !== 'top'" :width="variables.baseLeftMenuWidth" :class="{ isCollapse: isCollapse }">
    <el-scrollbar>
      <el-menu background-color="transparent" :default-active="$route.path" :collapse="isCollapse" @select="selectMenu">
        <Logo />
        <Menu :layout="menuLayout" position="noTop" :menuList="menuList" />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style lang="scss" scoped>
// 菜单区域
.el-aside {
  background: var(--base-left-theme);
  box-shadow: rgb(0 0 0 / 10%) 0 3px 3px 0;
  transition: all 0.3s;

  .el-sub-menu__title,
  .el-menu-item {
    color: var(--base-text-color);
  }

  .el-sub-menu__title:hover,
  .el-menu-item:hover {
    color: red;
  }

  .el-menu {
    border-right: none;
  }
}

.isCollapse {
  width: 56px;
}
</style>
