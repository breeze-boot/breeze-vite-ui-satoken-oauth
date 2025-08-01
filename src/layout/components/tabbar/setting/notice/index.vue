<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted, ref, unref } from 'vue'
import { closeUserMsg, listUsersMsg, readUserMsg } from '@/api/system/messages/msgUser'
import useUserStore from '@/store/modules/user'
import closePng from '@/assets/images/close.png'
import { MsgUserRecord } from '@/api/system/messages/msgUser/type.ts'
import { useI18n } from 'vue-i18n'
import { getMsg } from '@/api/system/messages/msg'
import { MsgRecord } from '@/api/system/messages/msg/type.ts'
import SvgButton from '@/components/SvgButton/index.vue'
import { useMessage } from '@/hooks/message'

const userStore = useUserStore()
const noticeMsg = ref<MsgUserRecord[]>([])
const noticeMsgInfo = ref<MsgRecord>({ code: '', content: '', level: '', title: '', type: 0 })
const closeImage = ref(closePng)
const { t } = useI18n()
const visible = ref<boolean>(false)
const currentMsgId = ref<number>(0)
import { ClickOutside as vClickOutside } from 'element-plus'

const buttonRef = ref()
const popoverRef = ref() // 用于绑定el-popover的ref

onMounted(() => {
  initNoticeMsg()
})

/**
 * 初始化消息
 */
const initNoticeMsg = async () => {
  try {
    const response: any = await listUsersMsg(userStore.userInfo.username)
    noticeMsg.value = response.data
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 查看消息
 */
const handleShowMsg = async () => {
  await initNoticeMsg()
  unref(popoverRef)?.popperRef?.delayHide?.()
}

/**
 * 查看消息详情
 */
const handleShowMsgInfo = async (msgUser: MsgUserRecord) => {
  try {
    currentMsgId.value = msgUser.msgId
    const response: any = await getMsg(msgUser.msgId)
    noticeMsgInfo.value = response.data
  } catch (err: any) {
    useMessage().error(err.message)
  } finally {
    visible.value = true
  }
}

/**
 * 关闭消息
 */
const handleCloseMsg = async (msgUser: MsgUserRecord) => {
  // 标识已经关闭
  try {
    await closeUserMsg(msgUser.msgId)
    useMessage().success(`${t('common.close') + t('common.success')}`)
    await initNoticeMsg()
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 关闭dialog
 */
const handleCloseDialog = async () => {
  // 标识已经读取
  try {
    await readUserMsg(currentMsgId.value)
    useMessage().success(`${t('common.mark_read') + t('common.success')}`)
    await initNoticeMsg()
  } catch (err: any) {
    useMessage().error(err.message)
  }
}
</script>

<template>
  <el-badge style="margin: 0 5px" :is-dot="noticeMsg.length > 0">
    <svg-button ref="buttonRef" icon="notice" v-click-outside="handleShowMsg" :circle="true" />
  </el-badge>

  <el-popover
    :popper-style="{ width: '400px' }"
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    title=""
    virtual-triggering
  >
    <div class="msg-box">
      <el-empty v-if="noticeMsg.length === 0" />
      <div v-else class="msg" v-for="(msg, index) in noticeMsg" :key="index">
        <div class="msg-content" :style="{ boxShadow: `var(--el-box-shadow-lighter)` }" @click="handleShowMsgInfo(msg)">
          <span class="title-text">{{ msg.title }}</span>
          <div
            @click.stop="handleCloseMsg(msg)"
            class="close"
            @mouseover="msg.isClose = 1"
            @mouseleave="msg.isClose = 0"
          >
            <img :src="msg.isClose ? closeImage : ''" style="width: 10px" />
          </div>
        </div>
      </div>
    </div>
  </el-popover>

  <el-dialog v-model="visible">
    <div style="height: 600px; text-align: center">
      <h1 class="title">{{ noticeMsgInfo.title }}</h1>
      <div class="msg-content">
        <el-text>{{ noticeMsgInfo.content }}</el-text>
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
/* 样式保持不变 */
.title {
  margin: 30px 10px;
  font-family:
    Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
  font-size: 1.5em;
  font-weight: bold;
}

.msg-content {
  margin: 30px 10px;
  font-family:
    Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
}

.msg-box::-webkit-scrollbar {
  width: 0;
}

.msg-box {
  height: 93%;
  overflow-y: scroll;

  .msg {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    justify-items: center;

    .msg-content {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      justify-items: center;
      width: 100%;
      height: 50px;
      margin: 10px;

      .close {
        position: absolute;
        top: -5px;
        right: -5px;
        display: block;
        width: 10px;
        height: 10px;
        cursor: pointer;
        background-size: cover;
        border-radius: 50%;
      }

      .title-text {
        width: 100%;
        height: 20px;
        padding: 10px;
        text-align: left;
      }
    }
  }
}
</style>
