<template>
  <div style="width: 99%; height: auto">
    <component :is="pages.asyncComponent" v-bind="pages.params" :key="pages.pageId"></component>
    <slot name="backTop">
      <el-backtop v-if="backTop" :bottom="200" :visibility-height="100"></el-backtop>
    </slot>
  </div>
</template>
<script lang="js" setup>
import { useRoute } from 'vue-router'
import { ref, watch, onBeforeUnmount, defineAsyncComponent } from 'vue'

const $route = useRoute()

const { path, backTop, pageId } = defineProps({
  path: {
    type: String,
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
const pages = ref({})

watch(
  () => pageId,
  () => {
    const _path = atob(decodeURIComponent(path))
    if (pageId && _path) {
      pages.value = {
        pageId: pageId,
        asyncComponent: defineAsyncComponent(() => {
          return import(`/src/views${/* @vite-ignore */ _path}.vue`)
        }),
        params: { ...$route.query, ...$route.params },
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {})
</script>
<style scoped></style>
