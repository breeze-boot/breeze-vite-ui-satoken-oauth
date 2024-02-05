<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import variables from '@/styles/variables.module.scss'
import { ArrowRight, Fold, Expand } from '@element-plus/icons-vue'
import useSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

let settings = useSettingStore().settings
const $route = useRoute()
const changeIcon = () => {
  settings.isCollapse = !settings.isCollapse
}
</script>

<template>
  <!-- el折叠图标 -->
  <el-icon class="is-collapse-icon" size="20px" @click="changeIcon">
    <component :is="settings.isCollapse ? Expand : Fold" :style="{ color: variables.baseTextColor }"></component>
  </el-icon>
  <!-- 面包屑导航 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.meta.tyepe == 1 ? { path: item.path } : {}"
    >
      <span style="margin: 0 5px; vertical-align: middle">
        {{ item.meta?.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.is-collapse-icon {
  margin-right: 10px;
  cursor: pointer;
  color: #f1f1f1;
}
</style>
