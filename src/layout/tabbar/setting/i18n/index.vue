<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import useSettingStore from '@/store/modules/setting'
import { useI18n } from 'vue-i18n'

let settingStore = useSettingStore()
const { locale } = useI18n()

/**
 * 全局国际化设置
 *
 * @param language
 */
const changeI18nSetting = (language: string) => {
  locale.value = language
  settingStore.setLanguage(language)
}
</script>

<template>
  <el-dropdown style="margin: 0 5px" :show-timeout="70" :hide-timeout="50" trigger="click" @command="changeI18nSetting">
    <button-svg-icon icon="i18n" :circle="true" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zhCn" :disabled="false">简体中文</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="false">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped></style>
