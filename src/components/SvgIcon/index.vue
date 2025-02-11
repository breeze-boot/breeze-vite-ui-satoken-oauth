<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import variables from '@/styles/variables.module.scss'
import { computed } from 'vue'

defineOptions({
  name: 'SvgIcon',
  inheritAttrs: false,
})
const props = defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //svg矢量图的名字
  name: {
    type: String,
    default: '',
  },
  //svg图标的颜色
  color: {
    type: String,
    default: '',
  },
  //svg宽度
  width: {
    type: String,
    default: '1rem',
  },
  //svg高度
  height: {
    type: String,
    default: '1rem',
  },
})

const iconStyle = computed(() => {
  return {
    width: props.width,
    height: props.height,
  }
})
const emits = defineEmits(['svg-click'])
const handleClick = () => {
  emits('svg-click')
}
</script>

<template>
  <i class="el-icon" :style="iconStyle">
    <svg @click="handleClick" :style="{ width: width, height: height, cursor: 'pointer' }">
      <use :xlink:href="prefix + name" :fill="color === '' ? variables.svgTheme : color" />
    </svg>
  </i>
</template>
<style scoped></style>
