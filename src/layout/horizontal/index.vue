<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import Main from '@/layout/components/main/index.vue'
import Setting from '@/layout/components/tabbar/setting/index.vue'
import TopMenu from '@/layout/components/tabbar/topMenu/index.vue'
import Logo from '@/layout/components/logo/index.vue'
import Tabs from '@/layout/components/tabbar/tabs/index.vue'
</script>

<template>
  <el-container class="layout-container">
    <el-container class="layout-main-container">
      <div class="tabbar">
        <div class="tabbar-left">
          <div>
            <Logo />
          </div>
          <top-menu />
        </div>
        <div class="tabbar-right">
          <setting />
        </div>
      </div>

      <div class="tab-container"><tabs /></div>
      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .layout-main-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    .tabbar {
      box-sizing: border-box; // 确保 padding 不会增加整体宽度
      display: flex;
      align-items: center;
      justify-content: space-between; // 关键属性：让子元素两端对齐
      width: 100%;
      height: 60px;
      padding: 0 15px;

      .tabbar-left {
        display: flex;
        flex: 1; // 占据剩余空间
        align-items: center; // 垂直居中对齐
        max-width: 70%; // 限制左侧区域最大宽度
        margin-left: 10px;
      }

      .tabbar-right {
        display: flex;
        align-items: center;
        justify-content: flex-end; // 让右侧内容靠右对齐
      }
    }
  }
}
</style>
