<!--
* @author: gaoweixuan
* @since: 2025-02-01
-->
<template>
  <div :style="{ position: visible ? 'absolute' : 'relative' }" v-if="visible" @mousedown.stop class="query-builder">
    <div class="close-button">
      <svg-icon v-if="visible" name="remove" @svg-click="handleCloseDiv" />
    </div>
    <div class="condition-group">
      <ConditionItem
        :currentField="props.currentField"
        :condition-select="props.tableFields"
        ref="conditionItemRef"
        :current-condition="initCondition"
        @update-conditions="previewConditions"
      />
    </div>
  </div>
  <div class="sql-preview" title="鼠标滑轮滚动">
    <div @wheel="handleWheel" ref="textRef" class="text">
      {{ previewText }}
    </div>
    <div style="width: 5%">
      <el-button @click="submitQuery">提交查询</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue'
import ConditionItem from '@/components/QueryBuilder/ConditionItem/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
  currentField: {
    type: Object,
    default: () => {},
  },
  tableFields: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
})

const $emit = defineEmits(['update:modelValue', 'sqlParamsSubmit'])

const conditionItemRef = ref()
const previewText = ref('')
const initCondition = ref<any[]>([])
const textRef = ref<HTMLDivElement | null>(null)
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (textRef.value) {
    textRef.value.scrollLeft = textRef.value.scrollLeft + e.deltaY
  }
}

onMounted(() => {})
const visible = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('update:modelValue', value)
  },
})

const submitQuery = async (params: any) => {
  const queryData = {
    conditions: params,
  }
  try {
    debugger
    $emit('sqlParamsSubmit', queryData)
    initCondition.value = params.value
    console.log('生成的 参数:', queryData)
  } catch (error) {
    console.error('请求出错:', error)
  }
}

const handleCloseDiv = () => {
  visible.value = false
}

const formatCondition = (condition: any) => {
  if (condition.conditions) {
    const subConditionsText = condition.conditions.map(formatCondition).join(` ${condition.condition.toUpperCase()} `)
    return `(${subConditionsText})`
  } else {
    let operatorText
    switch (condition.operator) {
      case 'eq':
        operatorText = '等于'
        break
      case 'gt':
        operatorText = '大于'
        break
      case 'lt':
        operatorText = '小于'
        break
      case 'gte':
        operatorText = '大于等于'
        break
      case 'lte':
        operatorText = '小于等于'
        break
      case 'neq':
        operatorText = '不等于'
        break
      case 'contain':
        operatorText = '包含'
        break
      case 'notContain':
        operatorText = '不包含'
        break
      case 'startWith':
        operatorText = '以...开头'
        break
      case 'endWith':
        operatorText = '以...结尾'
        break
      case 'isNull':
        operatorText = '为空'
        break
      case 'isNotNull':
        operatorText = '不为空'
        break
      case 'in':
        operatorText = '在列表中'
        break
      case 'notIn':
        operatorText = '不在列表中'
        break
      case 'between':
        operatorText = '区间范围'
        break
      default:
        operatorText = condition.operator
    }
    return `${condition.field} ${operatorText} '${condition.value}'`
  }
}

const previewConditions = (temp: any) => {
  debugger
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
  console.log(previewText.value)
  submitQuery(temp)
}
</script>

<style scoped>
.query-builder {
  z-index: 999;
  top: 0;
  right: 0;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  width: 80%;
  height: auto;
  background-color: rgba(255, 255, 255, 0.93);
}

.condition-group {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  border-radius: 6px;
  border: 1px solid #ccc;
}
/* 定义 .sql-preview 样式 */
.sql-preview {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.sql-preview {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.sql-preview .text {
  cursor: pointer;
  width: 93%;
  margin-right: 1%;
  font-size: 0.8rem;
  font-family: 'Operator Mono', 'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace;
  vertical-align: middle;
  overflow-y: hidden;
  background: rgba(248, 248, 248, 0.71);
  padding: 0 10px;
  display: flex;
  align-items: center; /* 添加这一行，让文本垂直居中 */
  align-content: center;
  /* 添加横向滚动条及隐藏样式 */
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  /* 禁止文本自动换行 */
  white-space: nowrap;
}
.sql-preview .text::-webkit-scrollbar {
  display: none;
}
.close-button {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
