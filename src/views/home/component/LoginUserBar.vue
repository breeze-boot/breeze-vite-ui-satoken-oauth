<script setup lang="ts" name="PureEChartsBar">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import { statisticLoginUserPie } from '@/api/home'

const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)

    // 初始图表配置（可以是空的，后续从后端获取数据后更新）
    const option: echarts.EChartsOption = {
      title: {
        text: '用户登录统计',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      // 禁用鼠标滚轮缩放
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        data: [], // 初始 x 轴数据为空数组
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '用户登录',
          type: 'bar',
          data: [], // 初始数据为空数组
        },
      ],
    }
    chartInstance.setOption(option)
  }
}

const fetchData = async () => {
  try {
    const response: any = await statisticLoginUserPie()
    const data = response.data.series // 假设后端返回的数据格式为 { name: string, value: number }[]

    const xAxisData = data.map((item: any) => item.name)
    const seriesData = data.map((item: any) => item.value)

    // 更新图表数据
    if (chartInstance) {
      chartInstance.setOption({
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            // 这里只更新 series 数组中的第一个元素（即我们的柱状图）
            data: seriesData,
          },
        ],
      })
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(async () => {
  await nextTick() // 确保 DOM 已经渲染完毕
  initChart() // 初始化图表
  await fetchData() // 发起异步请求获取数据
})

/**
 * 清理函数（可选，用于在组件卸载时销毁 ECharts 实例）
 */
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null // 将引用置为空，避免内存泄漏
  }
})
</script>

<template>
  <div ref="chartContainer" class="chart-container" style="width: 100%; height: 500px"></div>
</template>

<style scoped>
.chart-container {
  touch-action: none; /* 禁用触摸滚动穿透 */
  overscroll-behavior: contain; /* 禁用滚动溢出行为 */
}
</style>
