<template>
  <ChatButton :isChatVisible="isChatVisible" @toggleChat="toggleChat" />

  <transition name="fade">
    <div v-show="isChatVisible" ref="chatContainer" class="chat-container">
      <ChatHeader v-model:isHistoryVisible="isHistoryVisible" @toggleChat="toggleChat" @startDrag="startDrag" />
      <div class="chat-main">
        <ChatMessages :activities="activities" />
        <ChatSidebar v-model:isHistoryVisible="isHistoryVisible" @loadHistory="loadHistory" />
      </div>
      <ChatInput v-model="msg" :is-sending="isSending" @sendMsg="sendMsg" @handleSendOrStop="handleSendOrStop" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatButton from './components/ChatButton.vue'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessages from './components/ChatMessages.vue'
import ChatSidebar from './components/ChatSidebar.vue'
import ChatInput from './components/ChatInput.vue'
import useUserStore from '@/store/modules/user.ts'
import { createChat, historyChatDetail } from '@/api/ai/chat'
import { useMessage } from '@/hooks/message'

const userStore = useUserStore()
const { error } = useMessage()

interface Activity {
  content: string
  timestamp: string
  color?: string
  size?: string
  type?: string
  icon?: string
  hollow?: boolean
}

const activities = ref<Activity[]>([
  {
    content: '⭐欢迎使用智能管家！请问有什么可以帮您的?',
    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    color: '#0bbd87',
  },
])
const msg = ref('')
let count = 2
let eventSource = ref()
const chatContainer = ref()
const isSending = ref(false)
const isChatVisible = ref(false)
const isHistoryVisible = ref(false)
const selectedConversationId = ref('')

// 每次打开聊天框都会生成新的会话ID
let conversationId = ref<string>('')

// 拖动相关变量
let isDragging = false
let offsetX = 0
let offsetY = 0

// 切换聊天框显示
const toggleChat = async () => {
  if (!isChatVisible.value) {
    // 生成新的会话ID
    const response: any = await createChat(userStore.userInfo.id)
    conversationId.value = response.data
    // 清空当前消息列表
    activities.value = [
      {
        content: '⭐欢迎使用智能管家！请问有什么可以帮您的?',
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        color: '#0bbd87',
      },
    ]
  }
  isChatVisible.value = !isChatVisible.value
  if (isChatVisible.value) {
    scrollToBottom()
  }
}

// 滚动到聊天容器底部
const scrollToBottom = () => {
  const messagesDiv = chatContainer.value?.querySelector('.chat-messages')
  if (messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight
  }
}

// 发送消息
const sendMsg = async () => {
  if (msg.value === '') {
    return
  }
  if (eventSource.value) {
    eventSource.value.close()
  }
  activities.value.push({
    content: `你:${msg.value}`,
    timestamp: new Date().toLocaleString(),
    size: 'large',
    type: 'primary',
  })

  activities.value.push({
    content: 'waiting...',
    timestamp: new Date().toLocaleString(),
    color: '#0bbd87',
  })

  // sse: 服务端推送 Server-Sent Events
  eventSource.value = new EventSource(
    `${import.meta.env.VITE_APP_BASE_SERVER}/ai/v1/ragChat?message=${encodeURIComponent(msg.value)}&conversationId=${conversationId.value}&token=${userStore.accessToken}`,
  )
  msg.value = ''
  isSending.value = true
  eventSource.value.onmessage = (event: any) => {
    if (event.data === '[complete]') {
      count = count + 2
      eventSource.value.close()
      isSending.value = false
      // 每次对话完后刷新列表
      return
    }
    activities.value[count].content += event.data
    scrollToBottom()
  }
  eventSource.value.onopen = () => {
    activities.value[count].content = ''
  }
}

// 停止发送消息
const stopSending = () => {
  if (eventSource.value) {
    eventSource.value.close()
    isSending.value = false
  }
}

// 处理发送或停止操作
const handleSendOrStop = () => {
  if (isSending.value) {
    stopSending()
  } else {
    if (msg.value.trim()) {
      sendMsg()
    }
  }
}

// 开始拖动
const startDrag = (e: MouseEvent) => {
  isDragging = true
  const rect = chatContainer.value?.getBoundingClientRect()
  if (rect) {
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
  }
}

// 拖动过程
const onDrag = (e: MouseEvent) => {
  if (isDragging) {
    const x = e.clientX - offsetX
    const y = e.clientY - offsetY
    if (chatContainer.value) {
      chatContainer.value.style.left = `${x}px`
      chatContainer.value.style.top = `${y}px`
    }
  }
}

// 停止拖动
const stopDrag = () => {
  isDragging = false
}

// 加载历史消息
const loadHistory = async (id: string) => {
  if (!id) return
  selectedConversationId.value = id

  try {
    // 调用后端历史查询接口
    const response: any = await historyChatDetail(id)
    const historyMessages = response.data

    // 清空当前消息列表
    activities.value = []

    // 添加历史消息
    historyMessages.forEach((msg: { content: string; timestamp: string; isUser: boolean }) => {
      activities.value.push({
        content: msg.content,
        timestamp: msg.timestamp,
        color: msg.isUser ? '#0bbd87' : '#409eff',
      })
    })

    isHistoryVisible.value = false
    scrollToBottom()
  } catch (err: any) {
    console.error('加载历史消息失败:', err)
    error('加载历史消息失败')
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
/* 聊天容器样式 */
.chat-container {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 800px;
  /* 修改为固定高度 */
  height: 600px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 聊天主区域样式 */
.chat-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 1100px) {
  .chat-container {
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    border-radius: 0;
  }

  .chat-messages-wrapper {
    max-height: calc(100vh - 320px);
  }
}

/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f8f9fa;
}

::-webkit-scrollbar-thumb {
  background-color: #c8c8c8;
  border-radius: 3px;
}
</style>
