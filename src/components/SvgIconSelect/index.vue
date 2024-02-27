<!--
 * @author: gaoweixuan
 * @since: 2024-02-25
-->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

defineOptions({
  name: 'SvgIconSelect',
  inheritAttrs: false,
})

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})
const $emit = defineEmits(['update:icon'])
let allIcon = ref<any>([])
const icon = computed({
  get: () => {
    return props.icon
  },
  set: (value) => {
    $emit('update:icon', value)
  },
})

/**
 * icon 初始化
 */
onMounted(() => {
  initLoadIcons()
})

/**
 * icon 加载
 */
const handleCheckIcon = (_icon: string) => {
  icon.value = _icon
}

/**
 * icon 加载
 */
const initLoadIcons = () => {
  const icons = import.meta.glob('../../assets/icons/*.svg')
  for (const icon in icons) {
    const iconName = icon.replace('../../assets/icons/', '').replace('.svg', '')
    allIcon.value.push(iconName)
  }
}
</script>

<template>
  <el-popover placement="bottom" :width="530" trigger="click">
    <template #reference>
      <el-input :placeholder="props.placeholder" :value="icon" style="margin-right: 16px; width: 530px">
        <template #append>
          <svg-icon :name="`${icon}`" height="1.2rem" width="1.2rem" />
        </template>
      </el-input>
    </template>
    <div class="icon-box">
      <ul class="icon-list">
        <li class="icon-item" v-for="(icon, index) in allIcon" :key="index" @click="handleCheckIcon(icon)">
          <span class="svg-icon" @click="handleCheckIcon(icon)">
            <svg-icon :name="`${icon}`" height="1.2rem" width="1.2rem" />
          </span>
          <span class="icon-name">
            {{ icon }}
          </span>
        </li>
      </ul>
    </div>
  </el-popover>
</template>

<style scoped>
.icon-box {
  height: 350px;
  overflow-y: scroll;

  .icon-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    height: auto;
    text-align: center;
    color: var(--el-text-color-regular);
    font-size: 13px;
    transition: background-color var(--el-transition-duration);

    .icon-item {
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid var(--el-border-color);
      margin: 10px;

      .icon-name {
        font-size: 0.5rem;
        margin-top: 8px;
      }
    }

    .icon-item:hover {
      background: rgba(192, 192, 192, 0.23);
      border: none;
    }
  }
}
</style>
