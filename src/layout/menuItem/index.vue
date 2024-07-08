<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="Menu">
const props = defineProps(['menuList', 'layout', 'position'])
</script>

<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 不是混合菜单 含有子菜单时 -->
    <el-sub-menu v-if="props.layout !== 'mix' && item.meta.type === 0" :index="item.path">
      <template #title>
        <svg-icon :name="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menu-list="item.children"></Menu>
    </el-sub-menu>

    <!-- 递归的菜单项 情况1：菜单链接在第二级 -->
    <template v-if="item.meta.type === 1 && item.meta.href === 0">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path">
        <svg-icon :name="item.meta.icon" />
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 递归的菜单项 情况2：菜单是个外部链接-->
    <template v-else-if="item.meta.type === 1 && item.path && item.meta.href === 1">
      <el-menu-item v-if="!item.meta.hidden" :index="''">
        <svg-icon :name="item.meta.icon" />
        <template #title>
          <el-link :href="item.path" target="_blank">
            <span>{{ item.meta.title }}</span>
          </el-link>
        </template>
      </el-menu-item>
    </template>

    <!-- 混合菜单的左侧菜单 有子菜单时 -->
    <el-sub-menu v-if="props.layout === 'mix' && props.position !== 'top' && item.meta.type === 0" :index="item.path">
      <template #title>
        <svg-icon :name="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menu-list="item.children"></Menu>
    </el-sub-menu>
    <!-- 混合菜单时 左侧+头部菜单使用 -->
    <template v-else-if="props.layout === 'mix' && item.meta.type === 0">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path">
        <svg-icon :name="item.meta.icon" />
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<style lang="scss" scoped>
.el-link {
  border: none !important;
  display: block !important;
  width: 100% !important;
  text-align: left !important;
  color: var(--base-text-color);
}

span,
.el-sub-menu__title,
.el-menu-item {
  color: var(--base-text-color);
}

.el-sub-menu__title:hover,
.el-menu-item:hover,
span:hover {
  color: red;
}

</style>
