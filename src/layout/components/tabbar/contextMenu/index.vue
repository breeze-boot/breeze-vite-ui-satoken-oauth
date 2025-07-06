<!--
 * @author: gaoweixuan
 * @since: 2024-01-28
-->

<script lang="ts" setup>
import { computed } from 'vue'
import useTabsStore from '@/store/modules/tabs.ts'
import { LocationQueryRaw, useRouter } from 'vue-router'

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

const handleMenuItemClick = async (event: string) => {
  tabsStore.contextMenuStatus = false
  switch (event) {
    case 'all':
      tabsStore.initAllTab()
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
  await $router.push({
    path: tabsStore.currentTab.fullPath,
    query: tabsStore.currentTab.query as LocationQueryRaw,
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
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;

  .context-menu {
    position: relative;
    width: $base-context-menu-width;

    .context-menu-item {
      width: inherit;
      height: 30px;
      font-size: 80%;
      line-height: 30px;
      color: rgb(50 50 50 / 90%);
      text-align: center;
      cursor: pointer;
      background: rgb(255 255 255 / 80%);
      border: 1px solid #eee;
    }

    .context-menu-item:hover {
      color: var(--el-color-primary) !important;
      background: rgb(255 255 255);
    }
  }
}
</style>
