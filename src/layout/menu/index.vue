<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="Menu">
const props = defineProps(['menuList', 'layout'])
</script>

<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- HOME -->
    <template v-if="item.path === '/'">
      <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 没有子路由 -->
    <template v-if="item.meta.type === 1 && item.path !== '/'">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <template v-else-if="props.layout === 'mix' && item.meta.type === 0 && item.path !== '/'">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有子路由且大于0 子菜单 -->
    <el-sub-menu v-if="item.path !== '/' && item.meta.type === 0 && props.layout !== 'mix'" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menu-list="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped></style>
