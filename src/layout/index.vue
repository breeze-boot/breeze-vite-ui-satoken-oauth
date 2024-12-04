<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { watchEffect, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import useSettingStore from '@/store/modules/setting'
import ContextMenu from '@/layout/components/tabbar/contextMenu/index.vue'
import websocket from '@/layout/components/websocket/index.vue'
import { DEVICE } from '@/utils/common.ts'
import { MenuLayout } from '@/types/types.ts'

let { theme } = storeToRefs(useSettingStore())
let settingStore = useSettingStore()
const { width } = useWindowSize()

type LayoutDict = Record<MenuLayout, any>

const layoutDict: LayoutDict = {
  horizontal: defineAsyncComponent(() => import('@/layout/horizontal/index.vue')),
  columns: defineAsyncComponent(() => import('@/layout/columns/index.vue')),
  mix: defineAsyncComponent(() => import('@/layout/mix/index.vue')),
  vertical: defineAsyncComponent(() => import('@/layout/vertical/index.vue')),
}

const WIDTH: number = 992
watchEffect(() => {
  if (width.value > WIDTH) {
    settingStore.setDevice(DEVICE.PC, 50 + '%', 80 + '%')
  } else if (width.value >= WIDTH / 2 && width.value < WIDTH) {
    settingStore.setDevice(DEVICE.PAD, 90 + '%', 100 + '%')
  } else {
    settingStore.setDevice(DEVICE.MOBILE, 100 + '%', 100 + '%')
  }
})
</script>

<template>
  <transition name="slide-fade">
    <component :is="layoutDict[theme.menuLayout]" />
  </transition>

  <!-- 全局组件 -->
  <context-menu ref="contextMenuRef" />
  <!-- 全局组件 -->
  <websocket />
</template>

<style lang="scss" scoped>
/*
    进入和离开动画可以使用不同
    持续时间和速度曲线。
  */
.slide-fade-enter-active {
  transition: opacity 0.1s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
