<!--
 * @author: gaoweixuan
 * @since: 2024-04-13
 -->
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
  right: 20px;
  bottom: 20px;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 16px;
  color: white;
  background-color: var(--el-color-primary);
  border-radius: 50%;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.chat-button.active {
  background-color: #dc3545;
  transform: rotate(180deg);
}
</style>
