<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="LoginUserBar">
import { nextTick, onMounted, onUnmounted, ref, reactive, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { statisticLoginUserPie } from '@/api/home'
import { ElMessage, ElLoading } from 'element-plus'
import useSettingStore from '@/store/modules/setting.ts'

const settingStore = useSettingStore()
const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let loadingInstance: any = null

const isDarkMode = computed(() => {
  // 调用 store 中的 isDarkMode 函数，判断是否为暗色模式
  return settingStore.isDarkMode()
})

// 组件状态
const state = reactive({
  isLoading: false,
  error: null,
  chartData: [] as { name: string; value: number }[],
  xAxisLabelRotate: 0, // x轴标签旋转角度
})

// 图表配置（根据主题动态生成）
const chartOptions = computed(() => {
  // 暗色模式配置
  const isDark = isDarkMode.value
  const textColorPrimary = isDark ? '#e5e6eb' : '#333'
  const textColorSecondary = isDark ? '#86909c' : '#666'
  const bgColor = isDark ? 'transparent' : 'rgba(255, 255, 255, 0.95)'
  const axisLineColor = isDark ? '#4e5969' : '#ccc'
  const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#eee'
  const tooltipBgColor = isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
  const tooltipBorderColor = isDark ? '#4e5969' : '#eee'

  return {
    backgroundColor: bgColor,
    title: {
      text: '用户登录统计',
      left: 'center',
      textStyle: {
        color: textColorPrimary,
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          opacity: 0.2,
        },
      },
      backgroundColor: tooltipBgColor,
      textStyle: {
        color: textColorPrimary,
      },
      borderColor: tooltipBorderColor,
      borderWidth: 1,
      padding: 10,
      formatter: (params: any) => {
        const param = params[0]
        return `
          <div style="font-weight: bold;">${param.name}</div>
          <div>${param.seriesName}: <span style="color: ${param.color}">${param.value}</span></div>
        `
      },
    },
    legend: {
      orient: 'horizontal',
      top: '5%',
      left: 'center',
      data: ['用户登录'],
      textStyle: {
        color: textColorSecondary,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.chartData.map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: axisLineColor,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textColorSecondary,
        rotate: state.xAxisLabelRotate,
        interval: 0,
        fontSize: 12,
        formatter: (value: string) => {
          if (value.length > 8 && state.xAxisLabelRotate === 0) {
            return value.substring(0, 6) + '...'
          }
          return value
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textColorSecondary,
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor,
        },
      },
    },
    series: [
      {
        name: '用户登录',
        type: 'bar',
        data: state.chartData.map((item) => item.value),
        barWidth: '40%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: isDark
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#409eff' },
                { offset: 1, color: '#096dd9' },
              ])
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#409eff' },
                { offset: 1, color: '#66b1ff' },
              ]),
        },
        emphasis: {
          itemStyle: {
            color: isDark
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#66b1ff' },
                  { offset: 1, color: '#3a8ee6' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3a8ee6' },
                  { offset: 1, color: '#5cadff' },
                ]),
          },
        },
        label: {
          show: true,
          position: 'top',
          color: textColorPrimary,
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
    ],
  } as echarts.EChartsOption
})

// 初始化图表
const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)
    chartInstance.setOption(chartOptions.value)
    window.addEventListener('resize', handleResize)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
  adjustXAxisLabel()
}

// 调整x轴标签显示
const adjustXAxisLabel = () => {
  if (!chartInstance || state.chartData.length === 0) return

  const xAxisModel = chartInstance.getModel().getComponent('xAxis')[0]
  if (!xAxisModel) return

  const labelWidths = xAxisModel.axis.getLabelWidths()
  const totalLabelWidth = labelWidths.reduce((sum: number, width: number) => sum + width + 10, 0)
  const availableWidth = chartInstance.getWidth() * 0.94

  if (totalLabelWidth > availableWidth) {
    state.xAxisLabelRotate = 45
  } else {
    state.xAxisLabelRotate = 0
  }

  chartInstance.setOption({
    xAxis: {
      axisLabel: {
        rotate: state.xAxisLabelRotate,
      },
    },
  })
}

// 获取数据
const fetchData = async () => {
  state.isLoading = true
  loadingInstance = ElLoading.service({
    lock: true,
    text: '加载数据中...',
    // 加载背景根据主题动态调整
    background: isDarkMode.value ? 'rgba(17, 17, 17, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  })

  try {
    const response: any = await statisticLoginUserPie()
    state.chartData = response.data.series || []

    if (chartInstance) {
      chartInstance.setOption(chartOptions.value)
      adjustXAxisLabel()
    }

    ElMessage.success('数据加载成功')
  } catch (error: any) {
    state.error = error.message || '获取数据失败'
    ElMessage.error(state.error)
  } finally {
    state.isLoading = false
    loadingInstance?.close()
  }
}

// 刷新数据
const refreshData = () => {
  fetchData()
}

// 监听数据和主题变化，更新图表
watch([() => state.chartData, isDarkMode], () => {
  if (chartInstance) {
    chartInstance.setOption(chartOptions.value)
    adjustXAxisLabel()
  }
})

onMounted(async () => {
  await nextTick()
  initChart()
  await fetchData()
})

// 清理函数
onUnmounted(() => {
  if (chartInstance) {
    window.removeEventListener('resize', handleResize)
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<template>
  <div class="chart-wrapper" :class="{ 'dark-mode': isDarkMode }">
    <div class="chart-header">
      <h3 class="chart-title">用户登录统计分析</h3>
      <div class="chart-actions">
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refreshData" :loading="state.isLoading">
          刷新数据
        </el-button>
      </div>
    </div>

    <div class="chart-container" ref="chartContainer"></div>

    <!-- 错误提示 -->
    <div v-if="state.error" class="chart-error">
      <el-alert title="数据加载失败" type="error" :description="state.error" show-icon />
    </div>
  </div>
</template>

<style scoped lang="scss">
// 基础样式
.chart-wrapper {
  padding: 15px;
  margin-bottom: 20px;
  background-color: var(--el-card-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 5%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgb(0 0 0 / 10%);
  }

  // 暗色模式样式
  &.dark-mode {
    border: 1px solid var(--el-border-color-dark);
    box-shadow: 0 4px 15px rgb(0 0 0 / 20%);
  }
}

// 图表头部
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color); // 使用Element的边框色变量
}

.chart-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--el-text-color-primary); // 主文本色，自动适配主题
}

// 图表容器
.chart-container {
  width: 100%;
  height: 450px;
  overscroll-behavior: contain;
  touch-action: none;
}

// 错误提示区域
.chart-error {
  margin-top: 15px;

  :deep(.el-alert) {
    background-color: var(--el-bg-color); // 告警背景色适配主题
    border-color: var(--el-border-color);
  }
}

// 适配暗色模式的额外样式
:deep(.dark-mode) {
  .el-loading-mask .el-loading-text {
    color: var(--el-color-white); // 加载文字颜色
  }

  .el-button--primary {
    border-color: var(--el-color-primary-dark-2); // 按钮边框色
  }
}
</style>
