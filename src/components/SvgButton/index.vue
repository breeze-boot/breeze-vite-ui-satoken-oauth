<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SvgButton',
  inheritAttrs: false,
})

const props = defineProps({
  //svg矢量图的名字
  icon: {
    type: String,
    default: '',
  },
  //svg宽度
  width: {
    type: String,
    default: '1em',
  },
  //svg高度
  height: {
    type: String,
    default: '1em',
  },
  //类型
  type: {
    type: String,
    default: '',
  },
  //启用
  disabled: {
    type: Boolean,
    default: false,
  },
  //标题
  label: {
    type: String,
    default: '',
  },
  //是否圆角
  circle: {
    type: Boolean,
    default: false,
  },
  //是否链接样式
  link: {
    type: Boolean,
    default: false,
  },
})

const iconStyle = computed(() => {
  return {
    width: props.width,
    height: props.height,
  }
})

const $emit = defineEmits(['svg-btn-click'])
const handleChick = () => {
  $emit('svg-btn-click')
}
</script>

<template>
  <el-button
    :disabled="props.disabled"
    @click="handleChick"
    :circle="props.circle"
    :link="props.link"
    :type="props.type"
  >
    <i class="el-icon" :style="iconStyle">
      <svg-icon :name="props.icon" :width="props.width" :height="props.height" />
    </i>
    <span v-if="props.label !== ''" style="margin: 5px">{{ props.label }}</span>
  </el-button>
</template>
<style scoped></style>
