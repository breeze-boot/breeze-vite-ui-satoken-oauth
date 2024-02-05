<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import useSettingStore from '@/store/modules/setting'

let settingStore = useSettingStore()

/**
 * 全局字体大小设置
 *
 * @param size
 */
const changeSizeSetting = (size: string) => {
  settingStore.setSize(size)
}
</script>

<template>
  <el-dropdown style="margin: 0 5px" :show-timeout="70" :hide-timeout="50" trigger="click" @command="changeSizeSetting">
    <button-svg-icon icon="size" :circle="true" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="default">默认</el-dropdown-item>
        <el-dropdown-item command="small">小</el-dropdown-item>
        <el-dropdown-item command="large">大</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped></style>
