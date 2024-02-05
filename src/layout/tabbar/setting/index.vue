<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { Refresh, FullScreen } from '@element-plus/icons-vue'
import useSettingStore from '@/store/modules/setting'
import searchDialog from './searchDialog/index.vue'
import i18n from './i18n/index.vue'
import loginUser from './loginUser/index.vue'
import settingsDrawer from './settingsDrawer/index.vue'
import fontSize from './fontSize/index.vue'
import { storeToRefs } from 'pinia'

let { refresh } = storeToRefs(useSettingStore())

/**
 * 刷新
 */
const updateRefresh = () => {
  refresh.value = !refresh.value
}

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
  <!-- 搜索 -->
  <search-dialog />
  <!-- 国际化 -->
  <i18n />
  <!-- 字体大小 -->
  <font-size />
  <!-- 刷新 -->
  <el-button style="margin: 0 5px" circle :icon="Refresh" @click="updateRefresh" />
  <!-- 全屏 -->
  <el-button style="margin: 0 5px" circle :icon="FullScreen" @click="toggleFullScreen" />
  <!-- 设置抽屉 -->
  <settings-drawer />
  <!-- 登录人 -->
  <login-user />
</template>
