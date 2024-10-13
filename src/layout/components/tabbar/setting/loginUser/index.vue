<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { computed } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import useSettingStore from '@/store/modules/setting.ts'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let userStore = useUserStore()
let settingStore = useSettingStore()

/**
 *退出登录
 */
const handleLogout = async () => {
  ElMessageBox.confirm(t('common.sureToLogOutExitSystem'), t('common.tip'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  }).then(() => {
    userStore.logout().then(() => {
      window.location.reload()
    })
  })
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

/**
 * 是否显示登录人头像
 */
const showAvatar = computed(() => {
  return settingStore.settings.showAvatar
})
</script>

<template>
  <el-dropdown style="margin: 0 10px" :show-timeout="70" :hide-timeout="50" trigger="click">
    <span class="el-dropdown-link" style="cursor: pointer">
      <el-avatar v-if="showAvatar" :src="showAvatar ? avatar : '#'">
        <span v-if="!showAvatar">{{ username }}</span>
      </el-avatar>
      <el-avatar v-else size="default">
        <span style="font-size: 0.7rem">{{ username }}</span>
      </el-avatar>
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
