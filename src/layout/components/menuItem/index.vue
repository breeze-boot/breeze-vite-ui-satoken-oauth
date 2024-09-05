<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="MenuItem">
import SvgIcon from '@/components/SvgIcon/index.vue'
import { LAYOUT } from '@/utils/common.ts'

const props = defineProps(['menu', 'layout', 'position'])
</script>

<template>
  <!-- 递归的菜单项 情况1：菜单链接在第二级 -->
  <el-menu-item v-if="menu?.meta?.type === 1 && menu?.meta.href === 0 && !menu?.meta.hidden" :index="menu.path">
    <svg-icon :name="menu.meta.icon" />
    <template #title>
      <span>{{ menu.meta?.title }}</span>
    </template>
  </el-menu-item>

  <!-- 递归的菜单项 情况2：菜单是个外部链接-->
  <el-menu-item v-if="menu?.meta?.type === 1 && menu.path && menu.meta?.href === 1 && !menu.meta?.hidden" :index="''">
    <svg-icon :name="menu.meta?.icon" />
    <template #title>
      <el-link :href="menu.path" target="_blank">
        <span>{{ menu.meta?.title }}</span>
      </el-link>
    </template>
  </el-menu-item>

  <!-- 不是混合菜单 含有子菜单时 -->
  <el-sub-menu v-if="props.layout !== LAYOUT.MIX && menu?.meta?.type === 0" :index="menu.path">
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
    <menu-item :menu="menu.children" />
    <menu-item v-for="item in menu.children" :key="item.path" :layout="layout" position="top" :menu="item" />
  </el-sub-menu>

  <!-- 混合菜单的左侧菜单 有子菜单时 -->
  <el-menu-item v-if="props.layout === LAYOUT.MIX && menu?.meta?.type === 0" :index="menu.path">
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.el-link {
  border: none !important;
  display: block !important;
  width: 100% !important;
  text-align: left !important;
  color: inherit;
}
</style>
