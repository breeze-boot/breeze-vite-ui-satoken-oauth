<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="LoginUserBar">
import { nextTick, onMounted, onUnmounted, ref, reactive, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { statisticLoginUserPie } from '@/api/home'
import { ElMessage, ElLoading } from 'element-plus'

const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let loadingInstance: any = null

// 组件状态
const state = reactive({
  isLoading: false,
  error: null,
  chartData: [] as { name: string; value: number }[],
  xAxisLabelRotate: 0, // x轴标签旋转角度
})

// 图表配置
const chartOptions = computed(() => {
  return {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    title: {
      text: '用户登录统计',
      left: 'center',
      textStyle: {
        color: '#333',
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
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      textStyle: {
        color: '#333',
      },
      borderColor: '#eee',
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
        color: '#666',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%', // 增加底部边距，避免标签被遮挡
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.chartData.map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#666',
        rotate: state.xAxisLabelRotate, // 使用动态旋转角度
        interval: 0,
        fontSize: 12,
        // 标签超出处理
        formatter: (value: string) => {
          if (value.length > 8 && state.xAxisLabelRotate === 0) {
            return value.substring(0, 6) + '...' // 长标签省略显示
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
        color: '#666',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#eee',
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#66b1ff' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3a8ee6' },
              { offset: 1, color: '#5cadff' },
            ]),
          },
        },
        label: {
          show: true,
          position: 'top',
          color: '#333',
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

    // 监听窗口大小变化，调整图表
    window.addEventListener('resize', handleResize)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
  adjustXAxisLabel() // 窗口变化时重新调整标签
}

// 调整x轴标签显示
const adjustXAxisLabel = () => {
  // 修复：增加更严格的检查，确保图表和数据都已准备好
  if (!chartInstance || state.chartData.length === 0) return

  // 获取x轴组件，添加存在性检查
  const xAxisModel = chartInstance.getModel().getComponent('xAxis')[0]
  if (!xAxisModel) return

  const labelWidths = xAxisModel.axis.getLabelWidths()
  const totalLabelWidth = labelWidths.reduce((sum: number, width: number) => sum + width + 10, 0) // 加上间距
  const availableWidth = chartInstance.getWidth() * 0.94 // 可用宽度

  // 如果标签总宽度超过可用宽度，自动旋转标签
  if (totalLabelWidth > availableWidth) {
    state.xAxisLabelRotate = 45 // 旋转45度
  } else {
    state.xAxisLabelRotate = 0 // 恢复水平显示
  }

  // 更新图表配置
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
    background: 'rgba(255, 255, 255, 0.7)',
  })

  try {
    const response: any = await statisticLoginUserPie()
    state.chartData = response.data.series || []

    // 更新图表
    if (chartInstance) {
      chartInstance.setOption(chartOptions.value)
      adjustXAxisLabel() // 数据更新后调整标签
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

// 监听数据变化，自动调整标签
watch(
  () => state.chartData,
  () => {
    if (chartInstance) {
      adjustXAxisLabel()
    }
  },
)

onMounted(async () => {
  await nextTick() // 确保DOM已经渲染完毕
  initChart() // 初始化图表
  await fetchData() // 获取数据
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
  <div class="chart-wrapper">
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
.chart-wrapper {
  padding: 15px;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 5%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgb(0 0 0 / 10%);
  }
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.chart-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #303133;
}

.chart-actions {
  display: flex;
  gap: 10px;
}

.chart-container {
  width: 100%;
  height: 450px;
  overscroll-behavior: contain;
  touch-action: none;
}

.chart-error {
  margin-top: 15px;
}
</style>
