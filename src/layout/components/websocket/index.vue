<!--
 * @author: gaoweixuan
 * @since: 2024-03-17
-->
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'
import { ElNotification } from 'element-plus'
import useUserStore from '@/store/modules/user.ts'
import useMsgStore from '@/store/modules/msg.ts'

let userStore = useUserStore()
let msgStore = useMsgStore()

onMounted(() => {
  initWebSocket()
})

onUnmounted(() => {
  closeWebsocket()
})

/**
 * 关闭
 */
const closeWebsocket = async () => {
  if (!msgStore.stompClient) {
    return
  }
  await msgStore.stompClient?.deactivate()
}

/**
 * 初始化
 */
const initWebSocket = async () => {
  const socket =
    import.meta.env.VITE_APP_WS_API +
    '/ws?X-Tenant-Id=' +
    (userStore.userInfo.tenantId || '1') +
    '&username=' +
    userStore.userInfo.username

  msgStore.stompClient = new Client({
    brokerURL: socket,
    debug: function (str) {
      console.log('stomp js . str:', str)
    },
    connectHeaders: {
      Authorization: userStore.accessToken,
      username: userStore.userInfo.username,
    },
    onWebSocketClose: function () {
      msgStore.stompClient?.deactivate()
    },
    onStompError: function (frame) {
      console.log('onStompError:' + frame.body)
    },
    onConnect: () => {
      subscribeTopic()
      subscribe()
    },
  })
  msgStore.stompClient.activate()
}

/**
 * 点对点订阅 - 订阅用户消息
 * 前缀 /user
 * 前后端确定的广播消息通道/queue/message
 */
const subscribe = () => {
  if (!msgStore.stompClient) {
    console.log('🐛~ stomp Client is null:')
    return
  }
  msgStore.stompClient?.subscribe('/user/queue/message', notice('用户定向消息'))
}

/**
 * 订阅Topic
 * 前缀 /topic
 * 前后端确定的广播消息通道/message
 */
const subscribeTopic = () => {
  if (!msgStore.stompClient) {
    console.log('stomp Client is null:')
    return
  }
  msgStore.stompClient?.subscribe('/topic/message', notice('通知消息'))
}

/**
 * 消息提示
 */
function notice(type: string) {
  return (response: any) => {
    const responseJSON = JSON.parse(response.body)
    const msg = responseJSON.data
    msg.level = msg.level || 'info'
    ElNotification({
      title: msg.title,
      message: ` ${type} - ${msg.content}`,
      type: msg.level,
    })
  }
}
</script>
<template>{{}}</template>
