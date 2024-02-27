<!--
 * @author: gaoweixuan
 * @since: 2024-02-17
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user.ts'
import router from '@/router'

let $route = useRoute()
const useStore = useUserStore()

onMounted(() => {
  const accessToken = $route.query.accessToken
  if (accessToken) {
    useStore.accessToken = accessToken
    router.push('Layout')
  }
})
</script>

<template>welcome</template>

<style lang="scss" scoped></style>
