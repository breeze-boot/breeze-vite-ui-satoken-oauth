<template>
  <div style="width: 99%; height: auto">
    <component :is="pages.asyncComponent" v-bind="pages.params" :key="pages.pageId" />
    <slot name="backTop">
      <el-backtop v-if="backTop" :bottom="200" :visibility-height="100"></el-backtop>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, watch, markRaw, onBeforeUnmount, defineAsyncComponent } from 'vue'

defineOptions({
  name: 'TabWrapper',
  inheritAttrs: false,
})

const $route = useRoute()

const { path, backTop, pageId } = defineProps({
  path: {
    type: String,
    default: '',
  },
  backTop: {
    type: Boolean,
    default: true,
  },
  pageId: {
    type: String,
    required: true,
  },
})

// 创建响应式数据
const pages = ref<any>({})

watch(
  () => pageId,
  () => {
    const _path = atob(decodeURIComponent(path))
    if (pageId && _path) {
      pages.value = {
        pageId: pageId,
        asyncComponent: markRaw(
          defineAsyncComponent(() => {
            return import(`/src/views${/* @vite-ignore */ _path}.vue`)
          }),
        ),
        params: { ...$route.query, ...$route.params },
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {})
</script>
<style scoped></style>
