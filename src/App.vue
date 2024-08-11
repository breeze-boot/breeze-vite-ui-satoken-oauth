<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import useSettingStore from '@/store/modules/setting'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { onMounted } from 'vue'
import setting from '@/setting.ts'

let settingStore = useSettingStore()
const { settings, theme } = settingStore

onMounted(() => {
  window.open('hiprint://' + setting.printClientUrl)
})
</script>

<template>
  <el-config-provider :size="theme.size" :locale="settings.language === 'zhCn' ? zhCn : en">
    <el-watermark
      :font="theme.themeModel === 'dark' ? theme.lightFont : theme.darkFont"
      :content="theme.watermarkContent"
    >
      <router-view></router-view>
    </el-watermark>
  </el-config-provider>
</template>

<style scoped></style>
