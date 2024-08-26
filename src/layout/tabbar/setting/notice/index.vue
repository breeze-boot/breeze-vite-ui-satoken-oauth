<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import { closeUserMsg, listUsersMsg, readUserMsg } from '@/api/system/messages/msgUser'
import useUserStore from '@/store/modules/user'
import closePng from '@/assets/images/close.png'
import { MsgUserRecord } from '@/api/system/messages/msgUser/type.ts'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { getMsg } from '@/api/system/messages/msg'
import { MsgRecord } from '@/api/system/messages/msg/type.ts'
import useSettingStore from '@/store/modules/setting.ts'

const settingStore = useSettingStore()
const userStore = useUserStore()
const drawer = ref(false)
const direction = ref('rtl')
const noticeMsg = ref<MsgUserRecord[]>([])
const noticeMsgInfo = ref<MsgRecord>({ code: '', content: '', level: '', title: '', type: 0 })
const closeImage = ref(closePng)
const { t } = useI18n()
const visible = ref<boolean>(false)
const currentMsgId = ref<number>(0)

onMounted(() => {
  initNoticeMsg()
})

/**
 * 初始化消息
 */
const initNoticeMsg = async () => {
  const response: any = await listUsersMsg(userStore.userInfo.username)
  if (response.code === '0000') {
    noticeMsg.value = response.data
  }
}

/**
 * 查看消息
 */
const handleShowMsg = async () => {
  await initNoticeMsg()
  drawer.value = true
}

/**
 * 监听方法
 */
watch(
  () => settingStore.device,
  () => {
    drawer.value = false
  },
)

/**
 * 查看消息详情
 */
const handleShowMsgInfo = async (msgUser: MsgUserRecord) => {
  currentMsgId.value = msgUser.msgId
  const response: any = await getMsg(msgUser.msgId)
  if (response.code === '0000') {
    noticeMsgInfo.value = response.data
  }
  visible.value = true
}

/**
 * 关闭消息
 */
const handleCloseMsg = async (msgUser: MsgUserRecord) => {
  // 标识已经关闭
  await closeUserMsg(msgUser.msgId)
  ElMessage.success({
    message: t('common.success'),
    duration: 1000,
    onClose: async () => {
      await initNoticeMsg()
    },
  })
}

/**
 * 关闭dialog
 */
const handleCloseDialog = async () => {
  // 标识已经读取
  await readUserMsg(currentMsgId.value)
  ElMessage.success({
    message: t('common.success'),
    duration: 1000,
    onClose: async () => {
      visible.value = false
      await initNoticeMsg()
    },
  })
}
</script>

<template>
  <el-badge style="margin: 0 5px" :is-dot="noticeMsg.length > 0">
    <svg-button icon="notice" :circle="true" @svg-btn-click="handleShowMsg" />
  </el-badge>

  <!--  <svg-button style="margin: 0 5px" icon="notice_forbid" :circle="true" @click="handleGetMsg" />-->
  <el-drawer :with-header="false" v-model="drawer" :show-close="false" size="20%" :direction="direction">
    <el-divider>{{ t('common.system_msg') }}</el-divider>
    <div class="msg-box">
      <div class="msg" v-for="(msg, index) in noticeMsg" :key="index">
        <div
          class="msg-content"
          :style="{
            boxShadow: `var(--el-box-shadow-lighter)`,
          }"
          @click="handleShowMsgInfo(msg)"
        >
          <span class="title-text">
            {{ msg.title }}
          </span>
          <div
            @click.stop="handleCloseMsg(msg)"
            class="close"
            @mouseover="msg.isClose = 1"
            @mouseleave="msg.isClose = 0"
          >
            <img :src="msg.isClose || index === 0 ? closeImage : ''" style="width: 10px" />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>

  <el-dialog v-model="visible" width="50%">
    <div style="text-align: center; height: 600px">
      <h1 class="title">
        {{ noticeMsgInfo.title }}
      </h1>
      <div class="msg-content">
        <el-text>
          {{ noticeMsgInfo.content }}
        </el-text>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleCloseDialog">
          {{ t('common.confirm_read') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.title {
  font-size: 1.5em;
  font-weight: bold;
  margin: 30px 10px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

.msg-content {
  margin: 30px 10px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

.msg-box::-webkit-scrollbar {
  width: 0;
}

.msg-box {
  height: 93%;
  overflow-y: scroll;

  .msg {
    display: flex;
    justify-content: space-between;
    justify-items: center;
    flex-wrap: wrap;

    .msg-content {
      position: relative;
      width: 100%;
      margin: 10px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      justify-items: center;
      flex-wrap: wrap;

      .close {
        display: block;
        width: 10px;
        height: 10px;
        background-size: cover;
        cursor: pointer;
        position: absolute;
        top: -5px;
        right: -5px;
        border-radius: 50%;
      }

      .title-text {
        padding: 10px;
        text-align: left;
        width: 100%;
        height: 20px;
      }
    }
  }
}
</style>
