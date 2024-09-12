<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue'

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
    default: '0.9rem',
  },
  //svg高度
  height: {
    type: String,
    default: '0.9rem',
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
  //loading
  loading: {
    type: Boolean,
    default: false,
  },
  //按钮样式
  style: {
    type: Object,
    default: () => {},
  },
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
    :loading="props.loading"
    :style="props.style"
    :type="props.type"
  >
    <svg-icon v-if="props.icon" :name="props.icon" :width="props.width" :height="props.height" />
    <span v-if="props.label !== ''" style="margin: 5px">{{ props.label }}</span>
  </el-button>
</template>
<style scoped></style>
