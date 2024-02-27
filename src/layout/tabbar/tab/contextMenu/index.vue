<!--
 * @author: gaoweixuan
 * @since: 2024-01-28
-->

<script lang="ts" setup>
import { computed } from 'vue'
import useTabsStore from '@/store/modules/tabs.ts'
import { LocationQueryRaw, RouteParamsRaw, useRouter } from 'vue-router'

const $router = useRouter()
let tabsStore = useTabsStore()

/**
 * 获取菜单状态
 */
const contextMenuStatus = computed(() => {
  return tabsStore.contextMenuStatus
})

/**
 * 获取菜单位置
 */
const contextMenuPositionStyle = computed(() => {
  return {
    top: tabsStore.contextMenuLocationY + 'px',
    left: tabsStore.contextMenuLocationX + 'px',
  }
})

const handleMenuItemClick = (event: string) => {
  tabsStore.contextMenuStatus = false
  switch (event) {
    case 'all':
      tabsStore.removeAllTab()
      break
    case 'left':
      tabsStore.removeLeftTab()
      break
    case 'right':
      tabsStore.removeRightTab()
      break
    case 'current':
      tabsStore.removeCurrentTab()
      break
    case 'other':
      tabsStore.removeOtherTab()
      break
    default:
      tabsStore.contextMenuStatus = false
  }
  $router
    .push({
      path: tabsStore.currentTab.fullPath,
      query: tabsStore.currentTab.query as LocationQueryRaw,
      params: tabsStore.currentTab.params as RouteParamsRaw,
    })
    .then((r) => {
      console.debug(r)
    })
}
</script>

<template>
  <div class="context-menu-box" v-if="contextMenuStatus" @click="tabsStore.contextMenuStatus = false">
    <div class="context-menu" :style="contextMenuPositionStyle">
      <div class="context-menu-item" @click="handleMenuItemClick('all')">关闭全部</div>
      <div class="context-menu-item" @click="handleMenuItemClick('left')">关闭左边</div>
      <div class="context-menu-item" @click="handleMenuItemClick('right')">关闭右边</div>
      <div class="context-menu-item" @click="handleMenuItemClick('current')">关闭当前</div>
      <div class="context-menu-item" @click="handleMenuItemClick('other')">关闭其他</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.context-menu-box {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999;

  .context-menu {
    position: relative;
    width: $baseContextMenuWidth;

    .context-menu-item {
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #eee;
      cursor: pointer;
      width: inherit;
      background: rgba(255, 255, 255, 0.8);
      font-size: 80%;
      color: rgba(50, 50, 50, 0.9);
    }

    .context-menu-item:hover {
      background: rgb(255, 255, 255);
      color: var(--el-color-primary) !important;
    }
  }
}
</style>
