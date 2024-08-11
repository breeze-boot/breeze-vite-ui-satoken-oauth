<!--
 * @author: gaoweixuan
 * @since: 2024-03-17
-->
<script setup lang="ts">
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import useUserStore from '@/store/modules/user'
import { onMounted, onUnmounted } from 'vue'
import { ElNotification } from 'element-plus'
import useMsgStore from '@/store/modules/msg.ts'

let userStore = useUserStore()
let msgStore = useMsgStore()

let reConnectTime: any = () => {}

onMounted(() => {
  initWebSocket()
})

onUnmounted(() => {
  closeWebsocket()
})

/**
 * 点对点订阅 - 订阅用户消息
 * 前缀 /user
 * 前后端确定的广播消息通道/queue/userMsg
 */
const subscribe = () => {
  msgStore.stompClient.subscribe('/user/queue/userMsg', notice())
}

/**
 * 关闭
 */
const closeWebsocket = () => {
  clearInterval(reConnectTime)
  if (msgStore.stompClient !== null) {
    msgStore.stompClient.disconnect(() => {
      msgStore.stompClient = undefined
      console.debug('关闭连接')
    })
  }
}
/**
 * 初始化
 */
const initWebSocket = () => {
  const header = {
    Authorization: localStorage.getItem('access_token'),
    username: userStore.userInfo.username,
  }
  const socket = new SockJS('/ws?X-Tenant-Id=' + userStore.userInfo.tenantId || '1')
  msgStore.stompClient = Stomp.over(socket)
  msgStore.stompClient.connect(
    header,
    () => {
      subscribeTopic()
      subscribe()
    },
    (err: any) => {
      // 监听错误信息并且发起重连
      console.error('socketErrorMsg : ', err)
      if (reConnectTime) {
        clearInterval(reConnectTime)
      }
      // 重新连接一次
      reConnectTime = setTimeout(() => {
        console.debug('重新连接>>>>>>>>>>')
        initWebSocket()
      }, 60000)
    },
  )
}

/**
 * 订阅Topic
 * 前缀 /topic
 * 前后端确定的广播消息通道/msg
 */
const subscribeTopic = () => {
  msgStore.stompClient.subscribe('/topic/msg', notice())
}

/**
 * 消息提示
 */
function notice() {
  return (response: any) => {
    const responseJSON = JSON.parse(response.body)
    const msg = responseJSON.data
    msg.level = msg.level || 'info'
    console.debug('msg => {}', msg)
    ElNotification({
      title: msg.title,
      message: msg.content,
      type: msg.level,
    })
  }
}
</script>
<template></template>
