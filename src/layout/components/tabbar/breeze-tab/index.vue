<!--
 * @author: gaoweixuan
 * @since: 2025-07-20
-->
<!-- 标签栏组件 -->
<script lang="ts" setup name="BreezeTab">
import { computed, watch, defineProps, defineEmits, onMounted, ref, nextTick, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface TabItem {
  name: string
  title: string
  fullPath: string
  query?: Record<string, any>
  icon?: string
}

const props = defineProps<{
  tabs: TabItem[]
  currentTabName: string
  homeConstantTab: TabItem
}>()

const emits = defineEmits<{
  (event: 'update:currentTabName', tabName: string): void
  (event: 'tab-remove', tabName: string): void
}>()

const router = useRouter()
const route = useRoute()
const tabsNav = ref<HTMLDivElement | null>(null)
const scrollStep = 200

const canScrollLeft = computed(() => {
  if (!tabsNav.value) return false
  return tabsNav.value.scrollLeft > 1
})

const canScrollRight = computed(() => {
  if (!tabsNav.value) return false
  const { scrollLeft, scrollWidth, clientWidth } = tabsNav.value
  return scrollLeft < scrollWidth - clientWidth - 1
})

const handleSwitchTab = async (tab: TabItem) => {
  if (tab.name !== props.currentTabName) {
    emits('update:currentTabName', tab.name)

    try {
      if (tab.fullPath) {
        await router.push({
          path: tab.fullPath,
          query: tab.query,
        })
      }
    } catch (error) {
      console.error('路由切换失败:', error)
    }
  }

  nextTick(() => {
    ensureTabVisible(tab.name)
  })
}

const removeTab = async (tabName: string) => {
  if (tabName === props.homeConstantTab.name) return

  emits('tab-remove', tabName)

  if (tabName === props.currentTabName) {
    const remainingTabs = props.tabs.filter((tab) => tab.name !== tabName)
    const nextTab = remainingTabs.length ? remainingTabs[remainingTabs.length - 1] : props.homeConstantTab

    try {
      if (nextTab.fullPath) {
        await router.push({
          path: nextTab.fullPath,
          query: nextTab.query,
        })
      }
    } catch (error) {
      console.error('路由切换失败:', error)
    }
  }
}

const scrollLeft = () => {
  if (!tabsNav.value) return
  tabsNav.value.scrollBy({ left: -scrollStep, behavior: 'smooth' })
  nextTick(checkScrollButtons)
}

const scrollRight = () => {
  if (!tabsNav.value) return
  tabsNav.value.scrollBy({ left: scrollStep, behavior: 'smooth' })
  nextTick(checkScrollButtons)
}

const handleWheel = (e: WheelEvent) => {
  if (!tabsNav.value) return
  e.preventDefault()
  tabsNav.value.scrollBy({ left: e.deltaY, behavior: 'smooth' })
  nextTick(checkScrollButtons)
}

const ensureTabVisible = (tabName: string) => {
  if (!tabsNav.value) return

  const tab = tabsNav.value.querySelector(`[data-name="${tabName}"]`) as HTMLElement
  if (!tab) return

  const tabRect = tab.getBoundingClientRect()
  const containerRect = tabsNav.value.getBoundingClientRect()

  if (tabRect.left < containerRect.left) {
    tabsNav.value.scrollLeft -= containerRect.left - tabRect.left + 10
  } else if (tabRect.right > containerRect.right) {
    tabsNav.value.scrollLeft += tabRect.right - containerRect.right + 10
  }
  nextTick(checkScrollButtons)
}

watch(
  () => route.fullPath,
  (newPath) => {
    const matchedTab = props.tabs.find((tab) => tab.fullPath === newPath)
    if (matchedTab && matchedTab.name !== props.currentTabName) {
      emits('update:currentTabName', matchedTab.name)
    }
  },
  { immediate: true },
)

watch(
  () => props.tabs,
  () => {
    nextTick(() => {
      ensureTabVisible(props.currentTabName)
      checkScrollButtons()
    })
  },
  { deep: true },
)

const checkScrollButtons = () => {
  canScrollLeft.value
  canScrollRight.value
  tabsNav.value?.offsetHeight
}

onMounted(() => {
  nextTick(() => {
    if (tabsNav.value) {
      tabsNav.value.addEventListener('wheel', handleWheel)
      tabsNav.value.addEventListener('scroll', checkScrollButtons)
    }
    checkScrollButtons()
  })
})

onUnmounted(() => {
  if (tabsNav.value) {
    tabsNav.value.removeEventListener('wheel', handleWheel)
    tabsNav.value.removeEventListener('scroll', checkScrollButtons)
  }
})
</script>
<template>
  <!-- 模板内容保持不变 -->
  <div class="custom-tabs-container">
    <div class="tabs-scroll-controls">
      <!-- 左侧滚动按钮 -->
      <button v-show="canScrollLeft" class="scroll-btn scroll-left" @click="scrollLeft" aria-label="向左滚动标签">
        <i class="fa fa-chevron-left"></i>
      </button>

      <div class="tabs-scroll-container">
        <div class="tabs-nav" ref="tabsNav">
          <!-- 标签项 -->
          <div
            v-for="tab in tabs"
            :key="tab.name"
            :data-name="tab.name"
            :class="['tab-item', { active: tab.name === currentTabName }]"
            @click="handleSwitchTab(tab)"
            :title="tab.title"
          >
            <span class="tab-icon" v-if="tab.icon">
              <i :class="tab.icon"></i>
            </span>
            <span class="tab-title">{{ tab.title }}</span>
            <button
              v-if="tab.name !== homeConstantTab.name"
              class="tab-close-btn"
              @click.stop="removeTab(tab.name)"
              aria-label="关闭标签"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧滚动按钮 -->
      <button v-show="canScrollRight" class="scroll-btn scroll-right" @click="scrollRight" aria-label="向右滚动标签">
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use 'element-plus/theme-chalk/src/common/var.scss' as *;

.custom-tabs-container {
  position: relative;
  height: 35px !important; /* 整体高度从48px缩减到40px */
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: 0 1px 2px var(--el-shadow-color); /* 阴影减弱 */
  transition:
    background-color 0.3s,
    border-color 0.3s;

  .tabs-scroll-controls {
    display: flex;
    height: 100%;

    .scroll-btn {
      z-index: 10;
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 30px; /* 按钮宽度从36px缩减到30px */
      height: 100%;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      background: var(--el-bg-color);
      border: none;
      opacity: 0.8;
      transition: all 0.2s;

      &.scroll-left {
        border-right: 1px solid var(--el-border-color-lighter);
      }

      &.scroll-right {
        border-left: 1px solid var(--el-border-color-lighter);
      }

      &:hover {
        color: var(--el-color-primary);
        background: var(--el-fill-color);
        opacity: 1;
      }

      i {
        font-size: 12px; /* 按钮图标进一步缩小 */
      }
    }
  }

  .tabs-scroll-container {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  .tabs-nav {
    display: flex;
    height: 100%;
    padding: 0 2px; /* 内边距缩减 */
    overflow: auto hidden;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .tab-item {
      position: relative;
      display: flex;
      align-items: center;
      height: 32px; /* 标签高度从38px缩减到32px */
      padding: 0 12px 0 10px; /* 内边距缩减 */
      padding-right: 26px !important; /* 右侧内边距缩减（给关闭按钮留空间） */
      margin: 4px 2px 0; /* 外边距缩减 */
      font-size: 12px; /* 字体进一步缩小到12px */
      font-weight: 400;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      background: var(--el-fill-color);
      border: 1px solid transparent;
      border-bottom: none;
      border-radius: 4px 4px 0 0; /* 圆角减小 */
      transition: all 0.2s;

      &.active {
        font-weight: 500;
        color: var(--el-text-color-primary);
        background: var(--el-bg-color);
        border-color: var(--el-border-color);
        border-top-color: var(--el-color-primary);
        border-top-width: 2px;
        box-shadow: 0 1px 2px var(--el-shadow-color); /* 阴影减弱 */
      }

      &:hover:not(.active) {
        color: var(--el-text-color-primary);
        background: var(--el-fill-color-light);
      }

      .tab-icon {
        margin-right: 4px; /* 图标与文字间距缩减 */
        font-size: 12px; /* 图标大小缩小 */
        color: inherit;
      }

      .tab-title {
        max-width: 140px; /* 最大宽度缩减 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tab-close-btn {
        position: absolute;
        right: 4px; /* 向右偏移量缩减 */
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px; /* 关闭按钮进一步缩小到16px */
        height: 16px;
        font-size: 10px; /* 关闭图标缩小 */
        color: var(--el-text-color-placeholder);
        cursor: pointer;
        background: transparent;
        border: none;
        border-radius: 50%;
        transition: all 0.2s;

        &:hover {
          color: var(--el-color-danger);
          background: var(--el-border-color);
        }

        .tab-item:not(:hover) & {
          opacity: 0;
        }
      }
    }
  }
}
</style>
