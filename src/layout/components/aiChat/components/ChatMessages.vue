<!--
 * @author: gaoweixuan
 * @since: 2024-04-13
 -->
<template>
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
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

defineProps<{
  activities: {
    content: string
    timestamp: string
    color?: string
    size?: string
    type?: string
    icon?: string
    hollow?: boolean
  }[]
}>()

// 配置 markdown-it 并集成 highlight.js 进行代码高亮
const md = new MarkdownIt({
  highlight: function (str: string, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs"><code data-lang="${lang}">` +
          hljs.highlight(str, { language: lang }).value +
          '</code></pre>'
        )
      } catch (__) {
        console.error('Error highlighting code:', lang)
        console.error('Error Msg:', __)
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

// 渲染 Markdown 文本
const renderMarkdown = (text: string) => {
  return md.render(text)
}
</script>

<style scoped>
/* 聊天消息区域样式 */
.chat-messages-wrapper {
  flex: 1;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
}

.chat-messages {
  padding: 16px;
}

.message-content {
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  border-radius: 8px;
}

.message-content :deep(.hljs) {
  position: relative;
  padding: 16px;
  margin: 16px;
  overflow-x: auto;
  font-size: 13px; /* 调整代码块字体大小 */
  background-color: #9f9e9e;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.message-content pre code {
  font-family: 'Courier New', Courier, monospace;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  font-size: 12px; /* 调整复制按钮字体大小 */
  color: white;
  cursor: pointer;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.copy-button:hover {
  background-color: #0056b3;
}

.link-card {
  padding: 16px;
  margin: 8px 0;
  background-color: #f9f9f9;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.link-card a {
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.link-card p {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
