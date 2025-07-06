<template>
  <div ref="fullscreenDiv" class="fullscreen-div">
    <div class="header">
      <h1>SRM系统数据大屏</h1>
      <div class="time-info">
        <span>{{ currentDate }}</span>
        <el-button circle :icon="FullScreen" @click="toggleFullscreen" />
      </div>
    </div>

    <div class="dashboard-container">
      <!-- 数据概览卡片 -->
      <div class="overview-cards">
        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>供应商总数</span>
              <i class="el-icon-s-shop"></i>
            </div>
          </template>
          <div class="card-content">
            <div class="value">{{ totalSuppliers }}</div>
            <div class="trend">
              <span class="increase">↑ 12%</span>
              <span class="text">较上月</span>
            </div>
          </div>
        </el-card>

        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>活跃供应商</span>
              <i class="el-icon-s-cooperation"></i>
            </div>
          </template>
          <div class="card-content">
            <div class="value">{{ activeSuppliers }}</div>
            <div class="trend">
              <span class="increase">↑ 8%</span>
              <span class="text">较上月</span>
            </div>
          </div>
        </el-card>

        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>准时交付率</span>
              <i class="el-icon-truck"></i>
            </div>
          </template>
          <div class="card-content">
            <div class="value">{{ deliveryRate }}%</div>
            <div class="trend">
              <span class="decrease">↓ 2%</span>
              <span class="text">较上月</span>
            </div>
          </div>
        </el-card>

        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>质量合格率</span>
              <i class="el-icon-goods"></i>
            </div>
          </template>
          <div class="card-content">
            <div class="value">{{ qualityRate }}%</div>
            <div class="trend">
              <span class="increase">↑ 3%</span>
              <span class="text">较上月</span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <div class="chart-item">
          <el-card shadow="hover">
            <template #header>
              <div class="chart-header">
                <span>供应商业绩评分分布</span>
                <el-select v-model="performanceTimeRange" size="small" @change="updatePerformanceChart">
                  <el-option label="近6个月" value="6m"></el-option>
                  <el-option label="近12个月" value="12m"></el-option>
                  <el-option label="全年" value="year"></el-option>
                </el-select>
              </div>
            </template>
            <div ref="performanceChartRef" class="chart"></div>
          </el-card>
        </div>

        <div class="chart-item">
          <el-card shadow="hover">
            <template #header>
              <div class="chart-header">
                <span>供应商品类分布</span>
                <el-select v-model="categoryType" size="small" @change="updateCategoryChart">
                  <el-option label="按数量" value="quantity"></el-option>
                  <el-option label="按金额" value="amount"></el-option>
                </el-select>
              </div>
            </template>
            <div ref="categoryChartRef" class="chart"></div>
          </el-card>
        </div>

        <div class="chart-item">
          <el-card shadow="hover">
            <template #header>
              <div class="chart-header">
                <span>供应商交付趋势</span>
                <el-select v-model="deliveryTimeRange" size="small" @change="updateDeliveryChart">
                  <el-option label="近3个月" value="3m"></el-option>
                  <el-option label="近6个月" value="6m"></el-option>
                  <el-option label="近12个月" value="12m"></el-option>
                </el-select>
              </div>
            </template>
            <div ref="deliveryChartRef" class="chart"></div>
          </el-card>
        </div>

        <div class="chart-item">
          <el-card shadow="hover">
            <template #header>
              <div class="chart-header">
                <span>供应商风险预警</span>
                <el-select v-model="riskLevel" size="small" @change="updateRiskChart">
                  <el-option label="全部级别" value="all"></el-option>
                  <el-option label="高风险" value="high"></el-option>
                  <el-option label="中风险" value="medium"></el-option>
                  <el-option label="低风险" value="low"></el-option>
                </el-select>
              </div>
            </template>
            <div ref="riskChartRef" class="chart"></div>
          </el-card>
        </div>
      </div>

      <!-- 供应商表格 -->
      <div class="supplier-table">
        <el-card shadow="hover">
          <template #header>
            <div class="table-header">
              <span>重点供应商监控</span>
              <div class="search-box">
                <el-input v-model="searchKeyword" placeholder="搜索供应商" size="small" @keyup.enter="searchSupplier">
                  <template #append>
                    <el-button icon="el-icon-search" size="small" @click="searchSupplier"></el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </template>
          <el-table :data="supplierList" stripe border fit highlight-current-row>
            <el-table-column prop="name" label="供应商名称" width="180"></el-table-column>
            <el-table-column prop="category" label="所属类别" width="120"></el-table-column>
            <el-table-column prop="performance" label="绩效评分" width="100">
              <template #default="scope">
                <el-tag :type="getPerformanceTagType(scope.row.performance)">{{ scope.row.performance }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deliveryRate" label="交付准时率" width="120"></el-table-column>
            <el-table-column prop="qualityRate" label="质量合格率" width="120"></el-table-column>
            <el-table-column prop="riskLevel" label="风险等级" width="100">
              <template #default="scope">
                <el-tag :type="getRiskTagType(scope.row.riskLevel)">{{ scope.row.riskLevel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="text" size="small" @click="viewDetails(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="supplierList.length"
            ></el-pagination>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 全屏相关
let fullscreenDiv = ref()

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    if (fullscreenDiv.value && fullscreenDiv.value.requestFullscreen) {
      fullscreenDiv.value.requestFullscreen().catch((err: any) => {
        alert(`无法进入全屏模式: ${err.message}`)
      })
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        alert(`无法退出全屏模式: ${err.message}`)
      })
    }
  }
}

// 数据相关
const currentDate = ref(new Date().toLocaleDateString())
const totalSuppliers = ref(245)
const activeSuppliers = ref(189)
const deliveryRate = ref(96.7)
const qualityRate = ref(98.2)

// 图表引用
const performanceChartRef = ref()
const categoryChartRef = ref()
const deliveryChartRef = ref()
const riskChartRef = ref()

// 图表配置和实例
let performanceChart: echarts.ECharts | null = null
let categoryChart: echarts.ECharts | null = null
let deliveryChart: echarts.ECharts | null = null
let riskChart: echarts.ECharts | null = null

// 图表选项
const performanceTimeRange = ref('6m')
const categoryType = ref('quantity')
const deliveryTimeRange = ref('6m')
const riskLevel = ref('all')

// 表格数据
const searchKeyword = ref('')
const supplierList = ref([
  {
    name: '鑫源电子科技有限公司',
    category: '电子元件',
    performance: 95,
    deliveryRate: '98.2%',
    qualityRate: '99.5%',
    riskLevel: '低风险',
  },
  {
    name: '华通精密制造有限公司',
    category: '机械配件',
    performance: 88,
    deliveryRate: '96.7%',
    qualityRate: '97.8%',
    riskLevel: '低风险',
  },
  {
    name: '恒信化工材料有限公司',
    category: '化工原料',
    performance: 82,
    deliveryRate: '94.3%',
    qualityRate: '96.2%',
    riskLevel: '中风险',
  },
  {
    name: '德盛物流服务有限公司',
    category: '物流运输',
    performance: 90,
    deliveryRate: '97.6%',
    qualityRate: '100%',
    riskLevel: '低风险',
  },
  {
    name: '星辰包装材料有限公司',
    category: '包装材料',
    performance: 78,
    deliveryRate: '92.1%',
    qualityRate: '95.3%',
    riskLevel: '中风险',
  },
  {
    name: '远大信息技术有限公司',
    category: 'IT服务',
    performance: 93,
    deliveryRate: '98.5%',
    qualityRate: '99.1%',
    riskLevel: '低风险',
  },
  {
    name: '瑞丰塑胶制品有限公司',
    category: '塑胶制品',
    performance: 76,
    deliveryRate: '91.8%',
    qualityRate: '94.7%',
    riskLevel: '中风险',
  },
  {
    name: '金辉金属制品有限公司',
    category: '金属制品',
    performance: 85,
    deliveryRate: '95.4%',
    qualityRate: '97.3%',
    riskLevel: '低风险',
  },
  {
    name: '绿源环保科技有限公司',
    category: '环保材料',
    performance: 80,
    deliveryRate: '93.5%',
    qualityRate: '96.8%',
    riskLevel: '中风险',
  },
  {
    name: '佳禾食品原料有限公司',
    category: '食品原料',
    performance: 92,
    deliveryRate: '97.9%',
    qualityRate: '99.3%',
    riskLevel: '低风险',
  },
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)

// 初始化图表
const initCharts = () => {
  // 初始化供应商业绩评分图表
  performanceChart = echarts.init(performanceChartRef.value)
  performanceChart.setOption({
    title: {
      text: '评分分布',
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    radar: {
      indicator: [
        { name: '质量', max: 100 },
        { name: '交付', max: 100 },
        { name: '服务', max: 100 },
        { name: '价格', max: 100 },
        { name: '创新', max: 100 },
      ],
      shape: 'circle',
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      splitArea: {
        show: false,
      },
      radius: '70%',
    },
    series: [
      {
        name: '供应商评分',
        type: 'radar',
        data: [
          {
            value: [95, 90, 85, 80, 75],
            name: '优质供应商',
          },
          {
            value: [70, 80, 75, 90, 65],
            name: '平均水平',
          },
          {
            value: [50, 60, 65, 70, 55],
            name: '需改进',
          },
        ],
        areaStyle: {},
      },
    ],
  })

  // 初始化供应商品类分布图表
  categoryChart = echarts.init(categoryChartRef.value)
  categoryChart.setOption({
    title: {
      text: '品类分布',
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['电子元件', '机械配件', '化工原料', '包装材料', '金属制品', '其他'],
    },
    series: [
      {
        name: '品类占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 35, name: '电子元件' },
          { value: 25, name: '机械配件' },
          { value: 15, name: '化工原料' },
          { value: 10, name: '包装材料' },
          { value: 10, name: '金属制品' },
          { value: 5, name: '其他' },
        ],
      },
    ],
  })

  // 初始化供应商交付趋势图表
  deliveryChart = echarts.init(deliveryChartRef.value)
  deliveryChart.setOption({
    title: {
      text: '交付准时率趋势',
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['准时交付率', '目标值'],
      top: 'bottom',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {
      type: 'value',
      min: 90,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: '准时交付率',
        type: 'line',
        data: [94.5, 95.2, 96.1, 95.8, 96.7, 97.3],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' },
          ],
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }],
        },
      },
      {
        name: '目标值',
        type: 'line',
        data: [95, 95, 95, 95, 95, 95],
        lineStyle: {
          type: 'dashed',
        },
      },
    ],
  })

  // 初始化供应商风险预警图表
  riskChart = echarts.init(riskChartRef.value)
  riskChart.setOption({
    title: {
      text: '风险预警分布',
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['高风险', '中风险', '低风险'],
      top: 'bottom',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: ['财务风险', '质量风险', '交付风险', '合规风险', '产能风险'],
    },
    series: [
      {
        name: '高风险',
        type: 'bar',
        data: [5, 3, 2, 4, 1],
      },
      {
        name: '中风险',
        type: 'bar',
        data: [12, 8, 7, 9, 6],
      },
      {
        name: '低风险',
        type: 'bar',
        data: [25, 18, 22, 15, 19],
      },
    ],
  })
}

// 更新图表
const updatePerformanceChart = () => {
  // 根据时间范围更新供应商业绩评分图表
  // 这里可以根据performanceTimeRange的值来动态更新图表数据
  console.log('更新供应商业绩评分图表，时间范围: ', performanceTimeRange.value)
}

const updateCategoryChart = () => {
  // 根据类型更新供应商品类分布图表
  // 这里可以根据categoryType的值来动态更新图表数据
  console.log('更新供应商品类分布图表，类型: ', categoryType.value)
}

const updateDeliveryChart = () => {
  // 根据时间范围更新供应商交付趋势图表
  // 这里可以根据deliveryTimeRange的值来动态更新图表数据
  console.log('更新供应商交付趋势图表，时间范围: ', deliveryTimeRange.value)
}

const updateRiskChart = () => {
  // 根据风险级别更新供应商风险预警图表
  // 这里可以根据riskLevel的值来动态更新图表数据
  console.log('更新供应商风险预警图表，风险级别: ', riskLevel.value)
}

// 表格相关方法
const getPerformanceTagType = (performance: number) => {
  if (performance >= 90) return 'success'
  if (performance >= 75) return 'info'
  if (performance >= 60) return 'warning'
  return 'danger'
}

const getRiskTagType = (riskLevel: string) => {
  if (riskLevel === '高风险') return 'danger'
  if (riskLevel === '中风险') return 'warning'
  return 'success'
}

const searchSupplier = () => {
  console.log('搜索供应商: ', searchKeyword.value)
  // 这里可以添加搜索逻辑
}

const viewDetails = (row: any) => {
  console.log('查看供应商详情: ', row.name)
  // 这里可以添加查看详情的逻辑
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 监听窗口大小变化，调整图表尺寸
const handleResize = () => {
  performanceChart?.resize()
  categoryChart?.resize()
  deliveryChart?.resize()
  riskChart?.resize()
}

onMounted(() => {
  // 初始化图表
  nextTick(() => {
    initCharts()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })
})

// 组件销毁时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  // 销毁图表实例
  performanceChart?.dispose()
  categoryChart?.dispose()
  deliveryChart?.dispose()
  riskChart?.dispose()
})
</script>

<style lang="scss" scoped>
.fullscreen-div {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 20px;
  margin-top: 0;
  background: #f5f7fa;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
      color: #333;
    }

    .time-info {
      display: flex;
      align-items: center;

      span {
        margin-right: 10px;
      }
    }
  }

  .dashboard-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      .card-item {
        height: 120px;
        padding: 10px;

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;

          i {
            color: #909399;
          }
        }

        .card-content {
          display: flex;
          flex-direction: column;

          .value {
            margin-bottom: 5px;
            font-size: 28px;
            font-weight: bold;
            color: #303133;
          }

          .trend {
            display: flex;
            align-items: center;

            .increase {
              margin-right: 5px;
              color: #67c23a;
            }

            .decrease {
              margin-right: 5px;
              color: #f56c6c;
            }

            .text {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }

    .charts-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      .chart-item {
        .chart {
          height: 300px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .supplier-table {
      .table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
    }
  }

  .tabbar {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
