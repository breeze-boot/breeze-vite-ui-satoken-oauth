<!--
 * @author: gaoweixuan
 * @since: 2024-01-28
-->

<script lang="ts" setup>
import { computed } from 'vue'
import useTabsStore from '@/store/modules/tabs.ts'
import { LocationQueryRaw, useRouter } from 'vue-router'

const $router = useRouter()
const tabsStore = useTabsStore()

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
@use 'element-plus/theme-chalk/src/common/var.scss' as *;

.context-menu-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;

  .context-menu {
    position: relative;
    width: 100px;

    // 使用Element变量替换固定颜色值
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color);
    box-shadow: 0 2px 8px var(--el-box-shadow-lighter);

    .context-menu-item {
      width: inherit;
      height: 30px;
      font-size: 80%;
      line-height: 30px;

      // 使用Element文本变量
      color: var(--el-text-color-primary);
      text-align: center;
      cursor: pointer;

      // 使用Element填充色变量
      background: var(--el-fill-color-blank);
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }
    }

    .context-menu-item:hover {
      // 使用Element主色调变量
      color: var(--el-color-primary) !important;

      // 使用Element悬停背景变量
      background: var(--el-fill-color-light);
    }
  }
}
</style>
