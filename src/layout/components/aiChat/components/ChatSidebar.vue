<!--
 * @author: gaoweixuan
 * @since: 2024-04-13
 -->
<template>
  <div class="chat-sidebar" v-if="isHistoryVisible">
    <div class="sidebar-header sticky-header">
      <h3>历史会话</h3>
      <el-button icon="Close" @click="isHistoryVisible = false" class="close-sidebar">关闭</el-button>
    </div>
    <div class="history-list" @scroll="handleScroll">
      <el-card
        v-for="conv in historyConversations"
        :key="conv.id"
        :body-style="{ padding: '10px' }"
        @click="loadHistory(conv.id)"
        :class="{ active: selectedConversationId === conv.id }"
        class="custom-card"
      >
        <div class="card-title sticky-title">{{ conv.title }}</div>
        <div class="card-last-message">{{ conv.lastMessage }}</div>
      </el-card>
      <!-- 加载更多提示 -->
      <div v-if="isLoadingMore" class="loading-more">正在加载更多...</div>
      <div v-else-if="historyPage < totalPage" class="loading-more">最多 {{ MAX_PAGES }} 页最近数据</div>
      <div v-else class="loading-more">已加载全部数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { historyChat } from '@/api/ai/chat'
import useUserStore from '@/store/modules/user.ts'

const props = defineProps<{
  isHistoryVisible: boolean
}>()

interface HistoryConversations {
  id: string
  title: string
  lastMessage: string
  loaded: boolean
}

const selectedConversationId = ref<string>('')
const historyConversations = ref<HistoryConversations[]>([])
const emits = defineEmits(['loadHistory', 'update:isHistoryVisible'])

const isHistoryVisible = computed({
  get: () => {
    return props.isHistoryVisible
  },
  set: (value) => {
    emits('update:isHistoryVisible', value)
  },
})

const isLoadingMore = ref(false)
const historyPage = ref<number>(0)
const totalPage = ref<number>(0)
const MAX_PAGES = 6 // 定义最大页数为 6
const userStore = useUserStore()

const loadHistory = (id: string) => {
  selectedConversationId.value = id
  emits('loadHistory', id)
}

const handleScroll = async (e: Event) => {
  const target = e.target as HTMLElement
  console.log('Scroll position:', target.scrollTop, target.clientHeight, target.scrollHeight)
  // 修正后的滚动到底部判断逻辑
  if (
    target.scrollTop + target.clientHeight >= target.scrollHeight - 100 &&
    !isLoadingMore.value &&
    historyPage.value < Math.min(totalPage.value, MAX_PAGES) // 限制最多加载到第 6 页
  ) {
    console.log('Triggering load more...')
    isLoadingMore.value = true
    const newHistoryPage = historyPage.value + 1
    try {
      const response: any = await historyChat(userStore.userInfo.id, newHistoryPage, 10)
      if (response.data.content.length > 0) {
        historyConversations.value = [...historyConversations.value, ...response.data.content]
        historyPage.value = newHistoryPage
        totalPage.value = Math.min(response.data.totalPages, MAX_PAGES) // 确保总页数不超过 6
      }
    } catch (error) {
      console.error('加载更多历史会话失败:', error)
    } finally {
      isLoadingMore.value = false
    }
  }
}
// 新增watch
watch(isHistoryVisible, async (newVal) => {
  if (newVal) {
    // 组件显示时触发
    try {
      historyConversations.value = [] // 清空原有数据
      const response = await historyChat(userStore.userInfo.id, 0, 10)
      totalPage.value = Math.min(response.data.totalPages, MAX_PAGES)
      historyConversations.value = response.data.content
    } catch (error) {
      console.error('显示时加载数据失败:', error)
    }
  }
})
</script>

<style scoped>
/* 侧边栏样式 */
.chat-sidebar {
  position: relative; /* 新增，为了让子元素的定位相对于侧边栏 */
  width: 300px;
  padding: 0 16px 16px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border-left: 1px solid #e9ecef;
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.close-sidebar {
  color: #6c757d;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.3s ease;
}

.close-sidebar:hover {
  color: #333;
}

.history-list {
  /* 设置固定高度，确保可以滚动 */
  height: 90%;

  /* 解决边框被挡住的问题，设置内边距 */
  padding: 8px;
  overflow-y: auto;
  background: rgb(236 234 234 / 49%);
}

/* 自定义卡片样式 */
.custom-card {
  position: relative; /* 为了让标题定位相对卡片 */
  margin-bottom: 15px;
  border: 1px solid #e9ecef; /* 确保有边框 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}

.custom-card:hover {
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  transform: translateY(-2px);
}

.custom-card.active {
  background-color: #e6f7ff;
  box-shadow:
    0 2px 4px rgb(0 0 0 / 10%),
    0 0 0 2px #409eff;
}

.card-title {
  margin-bottom: 5px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-last-message {
  font-size: 14px;
  color: #666;
}

/* 标题固定样式 */
.sticky-title {
  position: sticky;
  top: 0;
  z-index: 1; /* 确保标题在上方 */
  padding: 10px 0; /* 适当的内边距 */
  background-color: #fff; /* 确保背景颜色覆盖下方内容 */
}

/* 侧边栏头部固定样式 */
.sticky-header {
  position: sticky;
  top: 0;
  right: 0; /* 新增，确保头部在右侧对齐 */
  left: 0; /* 新增，确保头部在左侧对齐 */
  z-index: 2; /* 确保在卡片标题之上 */
  padding: 16px;
  margin: -16px -16px 16px; /* 调整内边距以覆盖原有的 */
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

/* 加载更多提示样式 */
.loading-more {
  padding: 10px;
  font-size: 0.8rem;
  color: #6c757d;
  text-align: center;
}
</style>
