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
  overflow-y: auto;
  max-height: calc(100vh - 240px);
}

.chat-messages {
  padding: 16px;
}

.message-content {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
  font-size: 14px;
  color: #333;
}

.message-content :deep(.hljs) {
  background-color: #9f9e9e;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  margin: 16px;
  overflow-x: auto;
  position: relative;
  font-size: 13px; /* 调整代码块字体大小 */
}

.message-content pre code {
  font-family: 'Courier New', Courier, monospace;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 12px; /* 调整复制按钮字体大小 */
}

.copy-button:hover {
  background-color: #0056b3;
}

.link-card {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
  background-color: #f9f9f9;
}

.link-card a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.link-card p {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
