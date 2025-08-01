<!--
* @author: gaoweixuan
* @since: 2025-02-01
-->
<template>
  <!-- 查询构建器容器，根据 visible 状态显示 -->
  <div :style="{ position: visible ? 'absolute' : 'relative' }" v-if="visible" @mousedown.stop class="query-builder">
    <!-- 提交查询按钮 -->
    <div class="query-button">
      <el-button type="info" @click="resetQuery">清除条件</el-button>
      <el-button type="primary" @click="submitQuery">提交查询</el-button>
    </div>
    <!-- 关闭按钮 -->
    <div class="close-button">
      <svg-icon v-if="visible" name="remove" @svg-click="handleCloseDiv" />
    </div>
    <!-- 条件组 -->
    <div class="condition-group">
      <ConditionItem
        ref="conditionItemRef"
        :currentField="props.currentField"
        :condition-select="props.tableFields"
        :current-condition="currentSqlConditions"
        @update-conditions="previewConditions"
      />
    </div>
  </div>
  <!-- SQL 预览区域 -->
  <div class="sql-preview" title="鼠标滑轮滚动">
    <!-- 预览文本区域，支持滚动 -->
    <div @wheel="handleWheel" ref="textRef" class="text">
      {{ previewText }}
    </div>
    <!-- 提交查询按钮 -->
    <div style="width: 200px">
      <el-button size="small" type="info" @click="resetQuery">清除条件</el-button>
      <el-button size="small" type="primary" @click="submitQuery">提交查询</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入 Vue 相关的 API
import { ref, computed } from 'vue'
// 导入自定义组件
import ConditionItem from '@/components/QueryBuilder/ConditionItem/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 定义组件的 props
const props = defineProps({
  currentField: {
    type: Object as () => Record<string, any>,
    default: () => ({}),
  },
  tableFields: {
    type: Array as () => { label: string; prop: string }[],
    default: () => [],
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
})

// 定义组件的 emits 事件
const emits = defineEmits(['update:modelValue', 'sqlParamsSubmit'])

// 定义组件内的响应式变量
const conditionItemRef = ref<InstanceType<typeof ConditionItem> | null>(null)
const previewText = ref('')
const textRef = ref<HTMLDivElement | null>(null)
let currentSqlConditions = ref<any>()

// 处理鼠标滚轮事件，实现横向滚动
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (textRef.value) {
    textRef.value.scrollLeft = textRef.value.scrollLeft + e.deltaY
  }
}

// 计算属性，用于控制组件的可见性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

// 提交查询的方法
const submitQuery = async () => {
  const queryData = {
    conditions: currentSqlConditions.value,
  }
  try {
    emits('sqlParamsSubmit', queryData)
    console.log('生成的 参数:', queryData)
  } catch (error) {
    console.error('请求出错:', error)
  }
}

const resetQuery = async () => {
  previewText.value = ''
  currentSqlConditions.value = []
  await submitQuery()
}

// 关闭查询构建器的方法
const handleCloseDiv = () => {
  visible.value = false
}

// 格式化条件的方法
const formatCondition = (condition: any): string => {
  if (condition.conditions) {
    const subConditionsText = condition.conditions.map(formatCondition).join(` ${condition.condition.toUpperCase()} `)
    return `(${subConditionsText})`
  }

  // 定义操作符对应的文本
  const operatorMap: Record<string, string> = {
    eq: '等于',
    gt: '大于',
    lt: '小于',
    gte: '大于等于',
    lte: '小于等于',
    neq: '不等于',
    contain: '包含',
    notContain: '不包含',
    startWith: '以...开头',
    endWith: '以...结尾',
    isNull: '为空',
    isNotNull: '不为空',
    in: '在列表中',
    notIn: '不在列表中',
    between: '区间范围',
  }

  const operatorText = operatorMap[condition.operator] || condition.operator
  return `${condition.field} ${operatorText} '${condition.value}'`
}

// 预览条件并提交查询的方法
const previewConditions = (temp: any[]) => {
  if (temp.length === 0) {
    previewText.value = ''
    return
  }

  let result = formatCondition(temp[0])
  for (let i = 1; i < temp.length; i++) {
    const conditionObj = temp[i]
    const formattedCondition = formatCondition(conditionObj)
    result += ` ${conditionObj.condition.toUpperCase()} ${formattedCondition}`
  }

  previewText.value = result
  currentSqlConditions.value = temp
}
</script>

<style scoped>
.query-builder {
  top: 0;
  right: 0;
  z-index: 999;
  width: 80%;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 20px;
  background-color: rgb(255 255 255 / 93%);
  border-radius: 6px;
}

.condition-group {
  display: flex;
  place-content: center flex-start;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.sql-preview {
  display: flex;
  place-content: center flex-start;
  width: 100%;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.sql-preview .text {
  display: flex;
  align-content: center;
  align-items: center;
  width: 93%;
  padding: 0 10px;
  margin-right: 1%;
  overflow: scroll hidden;
  font-family: 'Operator Mono', 'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 0.8rem;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  background: rgb(248 248 248 / 71%);
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sql-preview .text::-webkit-scrollbar {
  display: none;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 30px;
  height: 30px;
  padding: 5px;
}

.query-button {
  position: absolute;
  z-index: 9999;
  display: flex;
  align-items: end;
  justify-content: flex-end;
  width: 97%;
  height: 30px;
}
</style>
