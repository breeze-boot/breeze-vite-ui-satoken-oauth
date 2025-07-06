<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { ref } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'

let fullscreenDiv = ref()

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    if (fullscreenDiv.value && fullscreenDiv.value.requestFullscreen) {
      fullscreenDiv.value.requestFullscreen().catch((err: any) => {
        alert(`无法进入全屏模式: ${err.message}`)
      })
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        alert(`无法退出全屏模式: ${err.message}`)
      })
    }
  }
}
</script>

<template>
  <div ref="fullscreenDiv" class="fullscreen-div">
    <p>数据大屏</p>
    <div class="tabbar">
      <el-button style="margin: 0 5px" circle :icon="FullScreen" @click="toggleFullscreen" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fullscreen-div {
  position: relative;
  display: flex;
  align-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  margin-top: 20px;
  background: red;

  .tabbar {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
