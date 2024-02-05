<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import useSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

let { refresh } = storeToRefs(useSettingStore())
let flag = ref(true)

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
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div :key="$route.path">
        <component :is="Component" v-if="flag" />
      </div>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
