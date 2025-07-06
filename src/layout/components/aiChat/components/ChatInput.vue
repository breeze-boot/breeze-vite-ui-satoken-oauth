<!--
 * @author: gaoweixuan
 * @since: 2024-04-13
 -->
<template>
  <div class="chat-input">
    <el-input
      v-model="msg"
      placeholder="请输入消息..."
      @keydown.enter="sendMsg($event)"
      @paste="handlePaste"
      type="textarea"
      :rows="4"
      resize="none"
    />
    <el-button @click="handleSendOrStop()" class="send-button" :class="{ 'is-loading': isSending }" ref="buttonRef">
      <template #default>
        <svg-icon v-if="!isSending" name="nolive" />
        <svg-icon v-if="isSending" name="living" />
      </template>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus' // 引入消息提示组件

const props = defineProps<{
  modelValue: string
  isSending: boolean
}>()

const emits = defineEmits(['sendMsg', 'handleSendOrStop', 'update:modelValue', 'update:isSending'])

const msg = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emits('update:modelValue', value)
  },
})
const isSending = computed({
  get: () => {
    return props.isSending
  },
  set: (value) => {
    emits('update:isSending', value)
  },
})

const buttonRef = ref<HTMLElement | null>(null)
let sendTimer: any = null // 用于存储发送定时器

const sendMsg = (event: KeyboardEvent) => {
  if (msg.value.trim() === '') {
    return
  }
  event.preventDefault()
  startSending()
}

const startSending = () => {
  isSending.value = true
  emits('sendMsg')
  // 模拟发送过程，这里可以替换为实际的发送请求
  sendTimer = setTimeout(() => {
    isSending.value = false
    ElMessage.success('消息发送成功')
  }, 5000)
}

const handleSendOrStop = () => {
  if (isSending.value) {
    // 停止发送操作
    if (sendTimer) {
      clearTimeout(sendTimer) // 清除定时器
      sendTimer = null
    }
    isSending.value = false
    emits('handleSendOrStop')
    ElMessage.warning('消息发送已停止')
  } else {
    if (msg.value.trim() !== '') {
      // 开始发送操作
      startSending()
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const clipboardData = event.clipboardData
  const pastedText = clipboardData?.getData('text')
  if (pastedText) {
    const cursorPosition = msg.value.length
    const newValue = msg.value.slice(0, cursorPosition) + pastedText + msg.value.slice(cursorPosition)
    msg.value = newValue
  }
}
</script>

<style scoped>
/* 输入区域样式 */
.chat-input {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 -2px 4px rgb(0 0 0 / 10%);
}

.chat-input .el-textarea {
  flex: 1;
  height: 100px;
  margin-right: 16px;
}

.chat-input .el-textarea__inner {
  height: 100%;
  padding: 12px;
  font-size: 14px;
  resize: none;
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.chat-input .el-textarea__inner:focus {
  border-color: #007bff;
  outline: none;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  font-size: 14px;
  color: white;
  background-color: #007bff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}

.send-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: scale(1.1);
}

.send-button:active {
  box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
  transform: scale(0.9);
}

.send-button.is-loading {
  pointer-events: auto; /* 允许点击事件 */
  animation: spin 1.5s linear infinite; /* 旋转动画 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
