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

const $emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})
// 原始容器
let allIcon = ref<string[]>([])
// 临时容器存储查询到的icon
let tempAllIcon = ref<string[]>([])

/**
 * 保持单向数据流
 */
const icon = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('update:modelValue', value)
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
const handleCheckIcon = (value: string) => {
  icon.value = value
}

const filterText = ref('')

/**
 * icon 查询
 */
const handleSearchIcon = (value: string) => {
  tempAllIcon.value = allIcon.value.filter((item: string) => !item.indexOf(value))
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
  tempAllIcon.value = allIcon.value
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
      <div class="input-line">
        <el-input @input="handleSearchIcon" v-model="filterText" placeholder="Filter keyword" />
      </div>
      <ul class="icon-list">
        <li class="icon-item" v-for="(icon, index) in tempAllIcon" :key="index" @click="handleCheckIcon(icon)">
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

  .input-line {
    text-align: center;
    width: 94%;
    margin: 8px;
  }

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
