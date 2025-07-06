<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="MenuItem">
import SvgIcon from '@/components/SvgIcon/index.vue'
import { LAYOUT, MENU_HREF, MENU_TYPE } from '@/utils/common.ts'

const props = defineProps(['menu', 'layout', 'position'])
</script>

<template>
  <!-- 递归的菜单项 情况1：菜单链接在第二级 -->
  <el-menu-item
    v-if="menu?.meta?.type === MENU_TYPE.MENU && menu?.meta.href === MENU_HREF.MENU && !menu?.meta.hidden"
    :index="menu.path"
  >
    <svg-icon :name="menu.meta.icon" />
    <template #title>
      <span>{{ menu.meta?.title }}</span>
    </template>
  </el-menu-item>

  <!-- 递归的菜单项 情况2：菜单是个外部链接-->
  <el-menu-item
    v-if="menu?.meta?.type === MENU_TYPE.MENU && menu.path && menu.meta?.href === MENU_HREF.HREF && !menu.meta?.hidden"
    :index="''"
  >
    <svg-icon :name="menu.meta?.icon" />
    <template #title>
      <el-link :href="menu.path" target="_blank">
        <span>{{ menu.meta?.title }}</span>
      </el-link>
    </template>
  </el-menu-item>

  <!------------------------------------------>

  <!-- 横向菜单的左侧菜单 有子菜单时 -->
  <el-sub-menu v-if="props.layout === LAYOUT.HORIZONTAL && menu?.meta?.type === MENU_TYPE.FOLDER" :index="menu.path">
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.path" :layout="layout" :menu="item" />
  </el-sub-menu>

  <!-- 垂直菜单 含有子菜单时 -->
  <el-sub-menu v-if="props.layout === LAYOUT.VERTICAL && menu?.meta?.type === MENU_TYPE.FOLDER" :index="menu.path">
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.path" :layout="layout" :menu="item" />
  </el-sub-menu>

  <!-- column垂直菜单 含有子菜单时 -->
  <el-sub-menu v-if="props.layout === LAYOUT.COLUMNS && menu?.meta?.type === MENU_TYPE.FOLDER" :index="menu.path">
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.path" :layout="layout" :menu="item" />
  </el-sub-menu>

  <!-- 混合菜单的顶部菜单 -->
  <el-menu-item
    v-if="props.layout === LAYOUT.MIX && menu?.meta?.type === MENU_TYPE.FOLDER && position === 'top'"
    :index="menu.path"
  >
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
  </el-menu-item>

  <!-- 混合菜单的左侧菜单 -->
  <el-sub-menu
    v-if="props.layout === LAYOUT.MIX && menu?.meta?.type === MENU_TYPE.FOLDER && position === 'noTop'"
    :index="menu.path"
  >
    <template #title>
      <svg-icon :name="menu?.meta.icon" />
      <span>{{ menu?.meta.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.path" :layout="layout" :menu="item" />
  </el-sub-menu>
</template>

<style lang="scss" scoped>
.el-link {
  display: block !important;
  width: 100% !important;
  color: inherit;
  text-align: left !important;
  border: none !important;
}
</style>
