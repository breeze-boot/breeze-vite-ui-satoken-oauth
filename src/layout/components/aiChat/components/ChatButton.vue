<template>
  <el-button class="chat-button" @click="toggleChat" :class="{ active: isChatVisible }">
    <svg-icon name="ai-chat" />
  </el-button>
</template>

<script setup lang="ts">
defineProps<{
  isChatVisible: boolean
}>()

const emits = defineEmits(['toggleChat'])

const toggleChat = () => {
  emits('toggleChat')
}
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
</style>
