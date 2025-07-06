<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { watch, ref, nextTick, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useTabStore from '@/store/modules/tabs.ts'
import useSettingStore from '@/store/modules/setting'
import SvgIcon from '@/components/SvgIcon/index.vue'
import aiChat from '@/layout/components/aiChat/index.vue'
import { useRoute } from 'vue-router'

let { refresh } = storeToRefs(useSettingStore())
let tabStore = useTabStore()
let flag = ref(true)

const $route = useRoute()
const container = ref<HTMLElement>()
const direction = ref('forward')
const isAnimating = ref(false)

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

// 判断路由前进/后退方向
watch($route, (to, from) => {
  if (isAnimating.value) return

  direction.value = to.path.length > from.path.length ? 'forward' : 'backward'
  animateRouteChange()
})

const animateRouteChange = () => {
  const isForward = direction.value === 'forward'
  const containerEl = container.value as HTMLElement

  if (!containerEl) return

  isAnimating.value = true

  // 设置初始状态
  containerEl.style.transition = 'none'
  containerEl.style.opacity = '0'
  containerEl.style.transform = isForward ? 'translateX(50px)' : 'translateX(-50px)'

  nextTick(() => {
    // 触发动画
    containerEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    containerEl.style.opacity = '1'
    containerEl.style.transform = 'translateX(0)'

    // 动画结束后重置状态
    setTimeout(() => {
      isAnimating.value = false
    }, 500)
  })
}

// 初始加载时的动画
onMounted(() => {
  const containerEl = container.value

  if (containerEl) {
    containerEl.style.opacity = '0'
    containerEl.style.transform = 'translateY(20px)'
    containerEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease'

    nextTick(() => {
      containerEl.style.opacity = '1'
      containerEl.style.transform = 'translateY(0)'
    })
  }
})
</script>

<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component, route }">
    <div ref="container" class="router-container">
      <el-scrollbar class="scrollbar">
        <el-backtop :visibility-height="100" target=".scrollbar .el-scrollbar__wrap" :bottom="100">
          <div class="backTop">
            <svg-icon name="back-top" width="1.5rem" height="1.5rem" />
          </div>
        </el-backtop>
        <keep-alive :include="cacheTabs">
          <component :key="route.fullPath" :is="markRaw(Component)" v-if="flag" />
        </keep-alive>
      </el-scrollbar>
    </div>
  </router-view>

  <!-- 全局组件 CHAT 聊天-->
  <ai-chat />
</template>

<style lang="scss" scoped>
.router-container {
  position: relative;
  min-height: 85vh; // 确保容器有足够高度
  overflow: hidden;
}

.router-container > div {
  position: absolute;
  width: 100%;
}

.backTop {
  width: 100%;
  height: 100%;
  line-height: 40px;
  color: #1989fa;
  text-align: center;
  background-color: transparent;
}

.isCollapse {
  width: 56px;
}
</style>
