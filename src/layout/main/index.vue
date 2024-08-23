<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { watch, ref, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting'
import useTabStore from '@/store/modules/tabs'

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
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component, route }">
    <transition name="slide-fade">
      <keep-alive :include="cacheTabs">
        <component :key="route.fullPath" :is="Component" v-if="flag" />
      </keep-alive>
    </transition>
  </router-view>
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
</style>
