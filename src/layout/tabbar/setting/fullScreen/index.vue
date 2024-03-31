<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue'

/**
 * 切换全屏
 */
const toggleFullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
    return
  }
  document.exitFullscreen()
}
</script>

<template>
  <el-button style="margin: 0 5px" circle :icon="FullScreen" @click="toggleFullScreen" />
</template>
