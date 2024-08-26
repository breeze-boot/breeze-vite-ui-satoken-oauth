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
import Tenant from './tenant/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import { storeToRefs } from 'pinia'
import { DEVICE } from '@/utils/common.ts'

let settingStore = useSettingStore()
const { device } = storeToRefs(settingStore)
</script>

<template>
  <!-- 搜索 -->
  <search-dialog v-if="device !== DEVICE.MOBILE" />
  <!-- 国际化 -->
  <i18n v-if="device !== DEVICE.MOBILE" />
  <!-- 字体大小 -->
  <font-size v-if="device !== DEVICE.MOBILE" />
  <!-- 刷新 -->
  <refresh v-if="device !== DEVICE.MOBILE" />
  <!-- 全屏 -->
  <full-screen v-if="device !== DEVICE.MOBILE" />
  <!-- 消息 -->
  <notice v-if="device !== DEVICE.MOBILE" />
  <!-- 设置抽屉 -->
  <settings-drawer v-if="device !== DEVICE.MOBILE" />
  <!-- 租户 -->
  <tenant />
  <!-- 登录人 -->
  <login-user />
</template>
