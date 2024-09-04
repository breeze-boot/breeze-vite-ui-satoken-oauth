<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'

let { refresh } = storeToRefs(useSettingStore())

/**
 * 刷新
 */
const updateRefresh = () => {
  refresh.value = !refresh.value
}
</script>

<template>
  <el-button style="margin: 0 5px" circle :icon="Refresh" @click="updateRefresh" />
</template>
