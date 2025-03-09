<!--
 * @author: gaoweixuan
 * @since: 2025-03-09
-->
<template>
  <el-button class="chat-button" @click="toggleChat" :class="{ active: isChatVisible }">
    <svg-icon name="ai-chat" />
  </el-button>

  <transition name="fade">
    <div v-show="isChatVisible" ref="chatContainer" class="chat-container">
      <div class="chat-header" @mousedown="startDrag">
        <h3>智能客服聊天</h3>
        <el-button icon="Close" class="close-button" @click="toggleChat"></el-button>
      </div>
      <div class="chat-messages-wrapper">
        <div class="chat-messages">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :hollow="activity.hollow"
              :timestamp="activity.timestamp"
            >
              <div class="message-content" v-html="renderMarkdown(activity.content)"></div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="msg" placeholder="请输入消息..." @keydown.enter="sendMsg()"></el-input>
        <el-button @click="handleSendOrStop()" class="send-button">
          {{ isSending ? '停止' : '发送' }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

// 配置 markdown-it 并集成 highlight.js 进行代码高亮
const md = new MarkdownIt({
  highlight: function (str: any, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang }).value + '</code></pre>'
      } catch (__) {
        console.error('Error highlighting code:', lang)
        console.error('Error Msg:', __)
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

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

// 拖动相关变量
let isDragging = false
let offsetX = 0
let offsetY = 0

// 切换聊天框显示
const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value
  if (isChatVisible.value) {
    scrollToBottom()
  }
}

// 滚动到聊天容器底部
const scrollToBottom = () => {
  const messagesDiv = chatContainer.value.querySelector('.chat-messages')
  if (messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight
  }
}

// 渲染 Markdown 文本
const renderMarkdown = (text: string) => {
  return md.render(text)
}

// 发送消息
const sendMsg = () => {
  if (eventSource.value) {
    eventSource.value.close()
  }

  activities.value.push({
    content: `你:${msg.value}`,
    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    size: 'large',
    type: 'primary',
  })

  activities.value.push({
    content: 'waiting...',
    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    color: '#0bbd87',
  })

  // sse: 服务端推送 Server-Sent Events
  eventSource.value = new EventSource(`http://localhost:9000/ai/chat?message=${msg.value}`)
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
  const rect = chatContainer.value.getBoundingClientRect()
  offsetX = e.clientX - rect.left
  offsetY = e.clientY - rect.top
}

// 拖动过程
const onDrag = (e: MouseEvent) => {
  if (isDragging) {
    const x = e.clientX - offsetX
    const y = e.clientY - offsetY
    chatContainer.value.style.left = `${x}px`
    chatContainer.value.style.top = `${y}px`
  }
}

// 停止拖动
const stopDrag = () => {
  isDragging = false
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
/* 聊天按钮样式 */
.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999999;
  background-color: var(--el-color-primary);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.chat-button.active {
  transform: rotate(180deg);
  background-color: #dc3545;
}

/* 聊天容器样式 */
.chat-container {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 500px;
  max-height: 700px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 聊天头部样式 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  cursor: grab;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

/* 聊天消息区域样式 */
.chat-messages-wrapper {
  flex: 1;
  overflow-y: auto;
}

.chat-messages {
  padding: 16px;
}

.message-content {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.message-content pre {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

/* 输入区域样式 */
.chat-input {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
}

.chat-input el-input {
  flex: 1;
  margin-right: 8px;
}

.send-button {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #0056b3;
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
</style>
