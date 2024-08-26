<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { watchEffect, computed } from 'vue'
import { storeToRefs } from 'pinia'
import LeftMenu from './leftMenu/index.vue'
import TabBar from './tabbar/index.vue'
import Main from './main/index.vue'
import useSettingStore from '@/store/modules/setting'
import ContextMenu from '@/layout/tabbar/tab/contextMenu/index.vue'
import { useWindowSize } from '@vueuse/core'
import websocket from '@/layout/websocket/index.vue'
import { DEVICE } from '@/utils/common.ts'
import variables from '@/styles/variables.module.scss'
import SvgIcon from '@/components/SvgIcon/index.vue'

let settingStore = useSettingStore()
const { theme, settings } = storeToRefs(settingStore)
const { width } = useWindowSize()

/**
 * 动态获取tab的样式
 */
const tabStyle = computed(() => {
  return {
    background: variables.baseMainTheme,
    left:
      theme.value.menuLayout !== 'top' ? (!settings.value.isCollapse ? variables.baseLeftMenuWidth : '56px') : '0px',
    width:
      theme.value.menuLayout !== 'top'
        ? settings.value.isCollapse
          ? 'calc(100% - 56px)'
          : 'calc(100% - ' + variables.baseLeftMenuWidth + ')'
        : '100%',
  }
})

const WIDTH: number = 992
watchEffect(() => {
  if (width.value > WIDTH) {
    settingStore.setDevice(DEVICE.PC)
  } else {
    if (width.value >= WIDTH / 2 && width.value < WIDTH) {
      settingStore.setDevice(DEVICE.PAD)
    } else {
      settingStore.setDevice(DEVICE.MOBILE)
    }
  }
})
</script>

<template>
  <el-container class="layout-container">
    <left-menu />

    <el-container class="layout-main-container">
      <tab-bar />

      <!-- 内容区域 -->
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
  </el-container>

  <!-- 全局组件 -->
  <context-menu ref="contextMenuRef" />
  <websocket />
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  --el-main-top-height: 90px;

  .layout-main-container {
    flex-direction: column !important;

    // 内容区域
    .el-main {
      position: absolute;
      top: $base-main-top-height;
      left: 200px;
      width: calc(100% - $base-left-menu-width);
      height: calc(100vh - $base-main-top-height);
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
}

.isCollapse {
  width: 56px;
}
</style>
