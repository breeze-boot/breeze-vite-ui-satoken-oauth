<!--
* @author: gaoweixuan
* @since: 2025-02-01
-->
<template>
  <div class="query-builder">
    <!-- 添加条件按钮 -->
    <el-row :gutter="24">
      <el-col :span="2">
        <el-button @click="addCondition" v-if="props.visible">添加</el-button>
      </el-col>
    </el-row>
    <!-- 条件组循环 -->
    <el-row v-for="(item, index) in conditionsTemp" :key="index" :gutter="24" class="condition-group">
      <!-- 删除条件按钮 -->
      <div class="close-button">
        <svg-icon v-if="props.visible" name="remove" @svg-click="removeCondition(index)" />
      </div>
      <!-- 条件逻辑选择 -->
      <el-col
        v-show="item.condition && index !== 0"
        style="height: 25px; line-height: 25px; text-align: center; cursor: pointer"
        @click="handleChangeCondition(item)"
        :span="1"
      >
        <span>{{ item?.condition }}</span>
      </el-col>
      <el-col v-show="item.condition && index === 0" :span="1"></el-col>
      <!-- 嵌套条件渲染 -->
      <template v-if="item.conditions">
        <el-col :span="21">
          <ConditionItem
            @update-conditions="previewConditionsItem"
            :currentField="props.currentField"
            :condition-select="props.conditionSelect"
            :visible="item.conditions.length !== 1"
            :current-condition="item.conditions"
          />
        </el-col>
      </template>
      <!-- 普通条件渲染 -->
      <template v-else>
        <el-col :span="6">
          <el-select @change="handleChangeField" v-model="item.field" placeholder="选择字段">
            <el-option
              v-for="(item, index) in props.conditionSelect"
              :key="index"
              :label="item.label"
              :value="camelCaseToUnderscore(item.prop)"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select @change="handleChangeOperator" v-model="item.operator" placeholder="选择操作符">
            <el-option label="等于" value="eq" />
            <el-option label="大于" value="gt" />
            <el-option label="小于" value="lt" />
            <el-option label="大于等于" value="gte" />
            <el-option label="小于等于" value="lte" />
            <el-option label="不等于" value="neq" />
            <el-option label="包含" value="contain" />
            <el-option label="不包含" value="notContain" />
            <el-option label="以...开头" value="startWith" />
            <el-option label="以...结尾" value="endWith" />
            <el-option label="为空" value="isNull" />
            <el-option label="不为空" value="isNotNull" />
            <el-option label="在列表中" value="in" />
            <el-option label="不在列表中" value="notIn" />
            <el-option label="区间范围" value="between" />
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-select v-if="item.type === 'dict'" @change="handleChangeValue" v-model="item.value" placeholder="输入值">
            <el-option v-for="(value, key) in item.dict" :key="key" :label="value.label" :value="key" />
          </el-select>

          <el-date-picker
            style="width: 300px"
            v-else-if="item.type === 'date'"
            v-model="item.value"
            format="YYYY/MM/DD hh:mm:ss"
            value-format="YYYY-MM-DD hh:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />

          <el-input v-else @change="handleChangeValue" v-model="item.value" placeholder="输入值" />
        </el-col>
        <el-col :span="1">
          <el-button style="margin: 0 10px" v-if="!item.conditions" @click="addNestedCondition(index)">
            添加嵌套条件
          </el-button>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import ConditionItem from '@/components/QueryBuilder/ConditionItem/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { camelCaseToUnderscore } from '@/utils/common.ts'
import { useDict } from '@/hooks/dict'

// 定义组件接收的属性
const props = defineProps({
  // 内部递归+外层初始化值使用
  currentCondition: {
    type: Array as () => Condition[],
    default: () => [],
  },
  // 当前点击的列
  currentField: {
    type: Object as () => Record<string, any>,
    default: () => null,
  },
  // 所有列的下拉列表
  conditionSelect: {
    type: Array as () => { label: string; prop: string }[],
    default: () => [],
  },
  // 内部递归使用：是否展示添加按钮
  visible: {
    type: Boolean,
    default: true,
  },
})

// 定义组件触发的事件
const $emit = defineEmits(['update-conditions'])

// 定义条件对象的类型
interface Condition {
  field: string
  operator: string
  value: string
  condition: string
  dict?: any
  type?: string
  conditions?: Condition[]
}

// 提取创建新条件的函数
const createNewCondition = (): Condition => {
  return {
    field: camelCaseToUnderscore(props.currentField.prop),
    operator: 'eq',
    value: '',
    condition: 'and',
  }
}

// 初始化条件列表
let conditionsTemp = reactive<Condition[]>(
  props.currentCondition.length > 0 ? props.currentCondition : [createNewCondition()],
)

// 监听 currentField 的变化
watch(
  () => props.currentField,
  () => {
    const newCondition = createNewCondition()
    if (props.currentField.type === 'dict') {
      newCondition.dict = useDict(props.currentField.dict)[props.currentField.dict].value
    }
    newCondition.type = props.currentField.type
    conditionsTemp.push(newCondition)
    $emit('update-conditions', conditionsTemp)
  },
)
// 监听 currentCondition 的变化
watch(
  () => props.currentCondition,
  () => {
    conditionsTemp = reactive<Condition[]>(
      props.currentCondition.length > 0 ? props.currentCondition : [createNewCondition()],
    )
  },
)

// 添加条件
const addCondition = () => {
  conditionsTemp.push(createNewCondition())
  $emit('update-conditions', conditionsTemp)
}

// 添加嵌套条件
const addNestedCondition = (index: number) => {
  const newCondition = createNewCondition()
  const currentCondition = conditionsTemp[index]
  if (currentCondition.conditions) {
    // 如果当前条件已经是嵌套分组，直接添加新条件到该分组
    currentCondition.conditions.push(newCondition)
  } else {
    // 如果当前条件不是嵌套分组，创建一个新的嵌套分组
    const newNestedGroup: Condition = {
      field: '',
      operator: '',
      value: '',
      condition: currentCondition.condition,
      conditions: [currentCondition, newCondition],
    }
    // 用新的嵌套分组替换当前条件
    conditionsTemp.splice(index, 1, newNestedGroup)
  }
  $emit('update-conditions', conditionsTemp)
}

// 删除条件
const removeCondition = (index: number) => {
  conditionsTemp.splice(index, 1)
  $emit('update-conditions', conditionsTemp)
}

// 预览条件更新
const previewConditionsItem = () => {
  $emit('update-conditions', conditionsTemp)
}

// 切换条件逻辑
const handleChangeCondition = (condition: Condition) => {
  condition.condition = condition.condition === 'or' ? 'and' : 'or'
  $emit('update-conditions', conditionsTemp)
}

// 操作符改变时触发更新
const handleChangeOperator = () => {
  $emit('update-conditions', conditionsTemp)
}

// 值改变时触发更新
const handleChangeValue = () => {
  $emit('update-conditions', conditionsTemp)
}

// 字段改变时触发更新
const handleChangeField = () => {
  $emit('update-conditions', conditionsTemp)
}
</script>

<style scoped>
.condition-group {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}

.query-builder {
  z-index: 999;
  height: auto;
  border-radius: 6px;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 30px;
  padding: 5px;
}
</style>
