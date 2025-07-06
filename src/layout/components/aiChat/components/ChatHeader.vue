<!--
 * @author: gaoweixuan
 * @since: 2024-04-13
 -->
<template>
  <div class="chat-header" @mousedown="startDrag">
    <div>
      <h3>智能客服聊天</h3>
    </div>
    <div>
      <el-button icon="Close" class="close-button" @click="toggleChat">关闭</el-button>
      <el-button icon="History" @click="isHistoryVisible = true" class="history-button">历史记录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isHistoryVisible: boolean
}>()

const isHistoryVisible = computed({
  get: () => {
    return props.isHistoryVisible
  },
  set: (value) => {
    emits('update:isHistoryVisible', value)
  },
})
const emits = defineEmits(['toggleChat', 'startDrag', 'update:isHistoryVisible'])

const toggleChat = () => {
  emits('toggleChat')
}

const startDrag = (e: MouseEvent) => {
  emits('startDrag', e)
}
</script>

<style scoped>
/* 聊天头部样式 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: grab;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  color: #6c757d;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.history-button {
  margin-left: 10px;
  color: #6c757d;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.3s ease;
}

.history-button:hover {
  color: #333;
}
</style>
