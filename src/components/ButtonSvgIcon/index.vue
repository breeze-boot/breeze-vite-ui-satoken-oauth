<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
defineOptions({
  name: 'ButtonSvgIcon',
  inheritAttrs: false,
})
const props = defineProps({
  //svg矢量图的名字
  icon: String,
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
  //类型
  type: {
    type: String,
    default: '',
  },
  //标题
  title: {
    type: String,
    default: '',
  },
  //是否圆角
  circle: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <el-button :circle="props.circle" :type="props.type">
    <span v-if="props.title !== ''">{{ props.title }}</span>
    <i class="el-icon">
      <svg-icon :name="props.icon" :width="props.width" :height="props.height" />
    </i>
  </el-button>
</template>
<style scoped></style>
