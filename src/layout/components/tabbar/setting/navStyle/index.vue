<!--
 * @author: gaoweixuan
 * @since: 2024-01-31
-->
<script setup lang="ts" name="NavStyle">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'
import type { MenuLayout } from '@/types/types.ts'
import { LAYOUT } from '@/utils/common.ts'

const settingStore = useSettingStore()
const { theme } = storeToRefs(settingStore)

// 判断当前布局是否被选中
const isLayoutSelected = computed(() => (layout: MenuLayout) => {
  return layout === theme.value.menuLayout
})

// 布局选项配置
const layoutOptions: Array<{
  id: MenuLayout
  label: string
  icon: string
  description: string
}> = [
  { id: LAYOUT.VERTICAL, label: '垂直布局', icon: 'vertical', description: '左侧导航 + 主内容区' },
  { id: LAYOUT.HORIZONTAL, label: '水平布局', icon: 'horizontal', description: '顶部导航 + 主内容区' },
  { id: LAYOUT.MIX, label: '混合布局', icon: 'mix', description: '顶部+左侧导航 + 主内容区' },
  { id: LAYOUT.COLUMNS, label: '多列布局', icon: 'columns', description: '双导航栏 + 主内容区' },
]

// 切换布局样式
const handleClickMenuStyle = (layout: MenuLayout) => {
  if (layout !== theme.value.menuLayout) {
    settingStore.setMenuLayout(layout)
  }
}
</script>

<template>
  <div class="layout-style">
    <div
      v-for="option in layoutOptions"
      :key="option.id"
      class="layout-option"
      :class="{ selected: isLayoutSelected(option.id) }"
      @click="handleClickMenuStyle(option.id)"
    >
      <!-- 布局预览容器 -->
      <div class="layout-preview">
        <div :class="'preview-' + option.icon">
          <!-- 垂直布局结构 -->
          <template v-if="option.id === LAYOUT.VERTICAL">
            <div class="el-aside"></div>
            <div class="el-main">
              <div class="el-header"></div>
              <div class="el-content"></div>
            </div>
          </template>

          <!-- 水平布局结构 -->
          <template v-if="option.id === LAYOUT.HORIZONTAL">
            <div class="el-header"></div>
            <div class="el-main"></div>
          </template>

          <!-- 混合布局结构 -->
          <template v-if="option.id === LAYOUT.MIX">
            <div class="el-header"></div>
            <div class="el-main">
              <div class="el-aside"></div>
              <div class="el-content"></div>
            </div>
          </template>

          <!-- 多列布局结构 -->
          <template v-if="option.id === LAYOUT.COLUMNS">
            <div class="el-aside main"></div>
            <div class="el-aside sub"></div>
            <div class="el-main">
              <div class="el-header"></div>
              <div class="el-content"></div>
            </div>
          </template>
        </div>
      </div>

      <span class="layout-label">{{ option.label }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 全局盒模型统一（解决尺寸计算问题）
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

// 基础样式
.layout-style {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  padding: 1rem;
}

.layout-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &.selected .layout-preview {
    box-shadow:
      0 0 0 2px rgb(64 158 255 / 50%),
      0 2px 5px rgb(61 61 61 / 30%);
  }
}

.layout-preview {
  position: relative;
  width: 65px;
  height: 60px;
  margin-bottom: 0.5rem;
  overflow: hidden;
  border: 1px solid #eee; // 增加边框便于观察布局边界
  border-radius: 5px;
}

// 垂直布局 (preview-vertical)
.preview-vertical {
  display: flex;
  align-items: stretch; // 强制子元素高度一致
  width: 100%;
  height: 100%;

  .el-aside {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30%;
    height: 100%;
    font-size: 12px;
    color: white;
    background: rgb(64 158 255 / 70%) !important;
  }

  .el-main {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 100%;

    .el-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20%;
      font-size: 12px;
      color: white;
      background: rgb(103 194 58 / 70%) !important;
    }

    .el-content {
      display: flex;
      flex: 1; // 自动填充剩余高度（替代固定80%，更灵活）
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      background: rgb(230 162 60 / 70%) !important;
    }
  }
}

// 水平布局 (preview-horizontal)
.preview-horizontal {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .el-header {
    height: 20%;
    background: rgb(103 194 58 / 70%) !important;
  }

  .el-main {
    flex: 1;
    background: rgb(230 162 60 / 70%) !important;
  }
}

// 混合布局 (preview-mix)
.preview-mix {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .el-header {
    height: 20%;
    background: rgb(103 194 58 / 70%) !important;
  }

  .el-main {
    display: flex;
    flex: 1;

    .el-aside {
      width: 20%;
      height: 100%;
      background: rgb(64 158 255 / 70%) !important;
    }

    .el-content {
      flex: 1;
      background: rgb(230 162 60 / 70%) !important;
    }
  }
}

// 多列布局 (preview-columns)
.preview-columns {
  display: flex;
  width: 100%;
  height: 100%;

  .el-aside.main {
    width: 8%;
    height: 100%;
    background: rgb(64 158 255 / 70%) !important;
  }

  .el-aside.sub {
    width: 22%;
    height: 100%;
    background: rgb(144 147 153 / 70%) !important;
  }

  .el-main {
    display: flex;
    flex: 1;
    flex-direction: column;

    .el-header {
      height: 20%;
      background: rgb(103 194 58 / 70%) !important;
    }

    .el-content {
      flex: 1;
      background: rgb(230 162 60 / 70%) !important;
    }
  }
}

.layout-label {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}
</style>
