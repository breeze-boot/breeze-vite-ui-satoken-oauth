<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MenuItem from '@/layout/menuItem/index.vue'
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
let { theme, settings } = storeToRefs(useSettingStore())

onMounted(async () => {
  await menuStore.setMenuChildren(
    menuStore.getOneLevelMenuInfo('path', tabStore.currentTab.path)?.children as RouteRecordRaw[],
  )
  tabStore.setTab($route)
})

/**
 * 计算获取菜单数据
 */
const menuList = computed(() => (theme.value.menuLayout === 'mix' ? menuStore.mixMenuRoutes : menuStore.menuRoutes))

/**
 * 菜单选择事件
 *
 * @param index
 */
const selectMenu = async (index: string) => {
  if (theme.value.menuLayout !== 'top') {
    await $router.push({ path: index })
    tabStore.setTab($route)
  }
}

watch(
  () => theme.value.menuLayout,
  () => {
    $router.push({ path: $route.path, query: {} })
  },
)
</script>

<template>
  <el-aside
    v-if="theme.menuLayout !== 'top'"
    :width="variables.baseLeftMenuWidth"
    :class="{ isCollapse: settings.isCollapse }"
  >
    <el-scrollbar>
      <el-menu
        background-color="transparent"
        :default-active="$route.path"
        :collapse="settings.isCollapse"
        @select="selectMenu"
      >
        <Logo />
        <menu-item v-for="item in menuList" :key="item.path" :layout="theme.menuLayout" position="noTop" :menu="item" />
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

  .el-menu {
    border-right: none;
  }
}

.isCollapse {
  width: 56px;
}
</style>
