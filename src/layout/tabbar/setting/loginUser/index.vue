<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { computed } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

let $router = useRouter()
let $route = useRoute()
let userStore = useUserStore()

/**
 *退出登录
 */
const handleLogout = async () => {
  await userStore.logout()
  $router.push({ path: '/login', query: { redirect: $route.path } }).then((r) => console.debug(r))
}

/**
 * 登录人头像
 */
const avatar = computed(() => {
  return userStore.userInfo.avatar
})

/**
 * 登录人
 */
const username = computed(() => {
  return userStore.userInfo.username
})
</script>

<template>
  <img class="avatar" :src="avatar" alt="" />
  <el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click">
    <span class="el-dropdown-link" style="cursor: pointer">
      {{ username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.el-dropdown-link {
  margin-right: 20px;
}
.avatar {
  width: 24px;
  height: 24px;
  margin: 0 10px 0 20px;
  border-radius: 20px;
}
</style>
