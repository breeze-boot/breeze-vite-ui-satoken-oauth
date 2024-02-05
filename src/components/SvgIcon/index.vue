<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import variables from '@/styles/variables.module.scss'

defineOptions({
  name: 'SvgIcon',
  inheritAttrs: false,
})

defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //svg矢量图的名字
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: '',
  },
  //svg宽度
  width: {
    type: String,
    default: '24px',
  },
  //svg高度
  height: {
    type: String,
    default: '24px',
  },
})
</script>

<template>
  <svg :style="{ width: width, height: height }">
    <use :xlink:href="prefix + name" :fill="color === '' ? variables.svgTheme : color"></use>
  </svg>
</template>
<style scoped></style>
