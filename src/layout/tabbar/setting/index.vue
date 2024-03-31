<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import SearchDialog from './searchDialog/index.vue'
import I18n from './i18n/index.vue'
import LoginUser from './loginUser/index.vue'
import SettingsDrawer from './settingsDrawer/index.vue'
import FontSize from './fontSize/index.vue'
import Notice from './notice/index.vue'
import FullScreen from './fullScreen/index.vue'
import Refresh from './refresh/index.vue'
</script>

<template>
  <!-- 搜索 -->
  <search-dialog />
  <!-- 国际化 -->
  <i18n />
  <!-- 字体大小 -->
  <font-size />
  <!-- 刷新 -->
  <refresh />
  <!-- 全屏 -->
  <full-screen />
  <!-- 消息 -->
  <notice />
  <!-- 设置抽屉 -->
  <settings-drawer />
  <!-- 登录人 -->
  <login-user />
</template>
