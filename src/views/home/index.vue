<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.ts'
import LoginUserBar from '@/views/home/component/LoginUserBar.vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const settingStore = useSettingStore()

// 获取用户信息和设置
const userInfo = computed(() => userStore.userInfo)
const settings = computed(() => settingStore.settings)

// 页面加载动画状态
const isLoading = ref(true)

// 统计数据
const stats = ref({
  onlineUsers: 0,
  totalUsers: 0,
  todayVisits: 0,
  serverStatus: 'online',
})

// 加载统计数据
const loadStats = async () => {
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))

    stats.value = {
      onlineUsers: 142,
      totalUsers: 5243,
      todayVisits: 872,
      serverStatus: 'online',
    }

    // 显示成功消息
    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('数据加载失败，请重试')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStats()
})

// 卡片悬停效果状态
const cardHoverStates = ref({
  onlineStats: false,
  overview: false,
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-card">
      <div class="welcome-content">
        <div class="avatar-container">
          <el-avatar :size="120" :src="userInfo?.avatar || settings?.logoUrl" class="avatar" />
        </div>
        <div class="greeting-container">
          <h3 class="welcome-title">
            {{ loadGreetings() }}~
            <span class="gradient-text">欢迎回来，{{ userInfo?.username || '管理员' }}！</span>
          </h3>
          <p class="welcome-subtitle">
            <el-icon><i class="fa fa-calendar-check-o"></i></el-icon>
            今天是
            {{
              new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })
            }}
          </p>
          <p class="welcome-message">
            <el-icon><i class="fa fa-line-chart"></i></el-icon>
            每一天，都是您迈向卓越的新起点！
          </p>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-grid">
      <!-- 在线统计卡片 -->
      <el-card
        class="stats-card"
        :class="cardHoverStates.onlineStats ? 'card-hover' : ''"
        @mouseenter="cardHoverStates.onlineStats = true"
        @mouseleave="cardHoverStates.onlineStats = false"
      >
        <template #header>
          <div class="card-header">
            <el-icon><i class="fa fa-users"></i></el-icon>
            <span>在线统计</span>
          </div>
        </template>
        <div class="card-content">
          <login-user-bar />
        </div>
      </el-card>

      <!-- 系统总览卡片 -->
      <el-card
        class="stats-card"
        :class="cardHoverStates.overview ? 'card-hover' : ''"
        @mouseenter="cardHoverStates.overview = true"
        @mouseleave="cardHoverStates.overview = false"
      >
        <template #header>
          <div class="card-header">
            <el-icon><i class="fa fa-dashboard"></i></el-icon>
            <span>系统总览</span>
          </div>
        </template>
        <div class="card-content">
          <div v-if="isLoading" class="loading-content">
            <el-skeleton animated />
          </div>
          <div v-else class="overview-stats">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">{{ stats.onlineUsers }}</div>
                <div class="stat-label">在线用户</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats.totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">{{ stats.todayVisits }}</div>
                <div class="stat-label">今日访问</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  <el-tag :type="stats.serverStatus === 'online' ? 'success' : 'danger'">
                    {{ stats.serverStatus === 'online' ? '运行中' : '维护中' }}
                  </el-tag>
                </div>
                <div class="stat-label">服务器状态</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 引入Element Plus变量（确保已配置暗色模式）
@use 'element-plus/theme-chalk/src/common/var.scss' as *;

/* 基础样式 - 适配明暗模式 */
.dashboard-container {
  min-height: calc(100vh - 60px);
  padding: 20px;

  // 使用Element Plus的背景色变量（自动适配明暗模式）
  background-color: var(--el-bg-color);
  transition: background-color 0.3s ease;
}

/* 欢迎卡片样式 */
.welcome-card {
  margin-bottom: 24px;
  color: var(--el-color-white);

  // 渐变背景在暗色模式下加深
  background: linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgb(0 0 0 / 15%);
  }

  // 暗色模式下调整欢迎卡片对比度
  :deep(.dark-mode) & {
    background: linear-gradient(135deg, #165dff 0%, #0a2463 100%);
    box-shadow: 0 4px 20px rgb(0 0 0 / 30%);
  }
}

.welcome-content {
  display: flex;
  align-items: center;
  padding: 30px;

  @media (width <= 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.avatar-container {
  margin-right: 30px;

  @media (width <= 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
}

.avatar {
  border: 3px solid rgb(255 255 255 / 20%);
  box-shadow: 0 0 0 4px rgb(255 255 255 / 10%);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.greeting-container {
  flex: 1;
}

.welcome-title {
  margin-bottom: 10px;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.5;

  .gradient-text {
    font-weight: 700;
    color: transparent;
    background: linear-gradient(90deg, #fff, #bbdefb);
    -webkit-background-clip: text;
    background-clip: text;
  }
}

.welcome-subtitle,
.welcome-message {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 1rem;

  // 文字透明度适配暗色模式
  opacity: 0.9;

  i {
    margin-right: 8px;
  }
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (width <= 1024px) {
    grid-template-columns: 1fr;
  }
}

/* 统计卡片样式 - 核心适配逻辑 */
.stats-card {
  // 使用Element Plus的卡片背景色（自动切换明暗模式）
  background-color: var(--el-card-bg-color);
  border-radius: 12px;

  // 阴影在暗色模式下更淡
  box-shadow: 0 4px 15px rgb(0 0 0 / 5%);
  transition: all 0.3s ease;

  .card-header {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;

    // 标题颜色使用Element变量（明暗模式自动切换）
    color: var(--el-text-color-primary);

    i {
      margin-right: 8px;
      color: var(--el-color-primary);
    }
  }

  .card-content {
    padding: 20px;
  }

  // 暗色模式下卡片样式调整
  :deep(.dark-mode) & {
    border: 1px solid var(--el-border-color-dark);
    box-shadow: 0 4px 15px rgb(0 0 0 / 20%);
  }
}

.card-hover {
  box-shadow: 0 8px 25px rgb(0 0 0 / 10%);
  transform: translateY(-5px);

  :deep(.dark-mode) & {
    box-shadow: 0 8px 25px rgb(0 0 0 / 30%);
  }
}

/* 加载中样式 */
.loading-content {
  min-height: 200px;
}

/* 总览统计样式 */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  .stats-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stat-item {
    padding: 15px;
    text-align: center;

    // 子项背景色使用Element变量
    background-color: var(--el-fill-color);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .stat-value {
      margin-bottom: 5px;
      font-size: 1.8rem;
      font-weight: 700;

      // 数值颜色适配明暗模式
      color: var(--el-text-color-primary);
    }

    .stat-label {
      font-size: 0.9rem;

      // 标签颜色使用次要文本色
      color: var(--el-text-color-secondary);
    }

    // 暗色模式下子项样式
    :deep(.dark-mode) & {
      background-color: var(--el-fill-color-dark);

      .stat-value {
        color: var(--el-color-white);
      }

      .stat-label {
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
