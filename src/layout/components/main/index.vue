<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { watch, ref, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useTabStore from '@/store/modules/tabs.ts'
import useSettingStore from '@/store/modules/setting'
import SvgIcon from '@/components/SvgIcon/index.vue'
import aiChat from '@/layout/components/aiChat/index.vue'

let { refresh } = storeToRefs(useSettingStore())
let tabStore = useTabStore()
let flag = ref(true)

/**
 * 当前缓存的页面
 */
const cacheTabs = computed(() => {
  return tabStore.cacheTabs
})

/**
 * 监听刷新
 */
watch(
  () => refresh.value,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<template>
  <el-scrollbar class="scrollbar">
    <el-backtop :visibility-height="100" target=".scrollbar .el-scrollbar__wrap" :bottom="100">
      <div class="backTop">
        <svg-icon name="back-top" width="1.5rem" height="1.5rem" />
      </div>
    </el-backtop>
    <!-- 路由组件出口的位置 -->
    <router-view v-slot="{ Component, route }">
      <transition name="slide-fade">
        <keep-alive :include="cacheTabs">
          <component :key="route.fullPath" :is="Component" v-if="flag" />
        </keep-alive>
      </transition>
    </router-view>
  </el-scrollbar>

  <!-- 全局组件 CHAT 聊天-->
  <ai-chat />
</template>

<style lang="scss" scoped>
/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

// 内容区域
.el-main {
  position: absolute;
  top: $base-main-top-height;
  left: 200px;
  width: calc(100% - $base-left-menu-width);
  height: calc(100vh - $base-main-top-height);
  padding: 20px;
  transition: all 0.3s;
}

.backTop {
  height: 100%;
  width: 100%;
  background-color: transparent;
  text-align: center;
  line-height: 40px;
  color: #1989fa;
}
.isCollapse {
  width: 56px;
}
</style>
