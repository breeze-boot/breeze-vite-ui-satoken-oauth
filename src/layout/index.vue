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
    settingStore.setDevice(DEVICE.PC)
  } else if (width.value >= WIDTH / 2 && width.value < WIDTH) {
    settingStore.setDevice(DEVICE.PAD)
  } else {
    settingStore.setDevice(DEVICE.MOBILE)
  }
})
</script>

<template>
  <component :is="layoutDict[theme.menuLayout]" />

  <!-- 全局组件 -->
  <context-menu ref="contextMenuRef" />
  <!-- 全局组件 -->
  <websocket />
</template>
