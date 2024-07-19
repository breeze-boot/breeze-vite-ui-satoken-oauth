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
const userStore = useUserStore()

onMounted(() => {
  const accessToken = $route.query.accessToken as string
  const refreshToken = $route.query.refreshToken as string
  if (accessToken && refreshToken) {
    userStore.storeLoginInfo(accessToken, refreshToken)
    router.push('Layout')
  }
})
</script>

<template>welcome</template>

<style lang="scss" scoped></style>
