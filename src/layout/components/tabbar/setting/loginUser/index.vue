<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting'
import UserPasswordReset from '@/layout/components/tabbar/setting/userPasswordReset/index.vue'

const { t } = useI18n()
const restPasswordRef = ref()
let userStore = useUserStore()
let personalCenterDialogVisible = ref(false)
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

/**
 * 修改密码
 */
const handleEditPassword = async () => {
  restPasswordRef.value.init(userStore.userInfo.id)
}

/**
 * 个人中心
 */
const handlePersonalCenter = async () => {
  personalCenterDialogVisible.value = true
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
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
        <el-dropdown-item @click="handlePersonalCenter">个人中心</el-dropdown-item>
        <el-dropdown-item @click="handleEditPassword">修改密码</el-dropdown-item>
        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- 密码重置 Dialog -->
  <user-password-reset ref="restPasswordRef" />

  <el-dialog v-model="personalCenterDialogVisible" title="个人中心" width="70%" :before-close="handleClose">
    <el-descriptions class="margin-top" title="With border" :column="3" :size="size" border>
      <template #extra>
        <el-button type="primary">Operation</el-button>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            Username
          </div>
        </template>
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <iphone />
            </el-icon>
            Telephone
          </div>
        </template>
        18100000000
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <location />
            </el-icon>
            Place
          </div>
        </template>
        Suzhou
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <tickets />
            </el-icon>
            Remarks
          </div>
        </template>
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            Address
          </div>
        </template>
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="personalCenterDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="personalCenterDialogVisible = false">{{ t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
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
