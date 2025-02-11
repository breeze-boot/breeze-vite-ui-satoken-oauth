<!--
* @author: gaoweixuan
* @since: 2025-02-01
-->
<template>
  <div class="query-builder">
    <el-row :gutter="24">
      <el-col :span="2">
        <el-button @click="addCondition" v-if="props.visible">添加</el-button>
      </el-col>
    </el-row>
    <el-row v-for="(item, index) in conditionsTemp" :key="index" :gutter="24" class="condition-group">
      <div class="close-button">
        <svg-icon v-if="props.visible" name="remove" @svg-click="removeCondition(index)" />
      </div>
      <el-col
        v-show="item.condition && index !== 0"
        style="height: 25px; cursor: pointer; text-align: center; line-height: 25px"
        @click="handleChangeCondition(item)"
        :span="1"
      >
        <span>{{ item?.condition }}</span>
      </el-col>
      <el-col v-show="item.condition && index === 0" :span="1"></el-col>
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-input @change="handleChangeValue" v-model="item.value" placeholder="输入值" />
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
import { reactive, watch, defineProps } from 'vue'
import ConditionItem from '@/components/QueryBuilder/ConditionItem/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { camelCaseToUnderscore } from '@/utils/common.ts'

const props = defineProps({
  // 内部递归+外层初始化值使用
  currentCondition: {
    type: Array,
    default: () => [],
  },
  // 当前点击的列
  currentField: {
    type: Object,
    default: () => null,
  },
  // 所有列的下拉列表
  conditionSelect: {
    type: Array,
    default: () => [],
  },
  // 内部递归使用：是否展示添加按钮
  visible: {
    type: Boolean,
    default: true,
  },
})

const $emit = defineEmits(['update-conditions'])
interface Condition {
  field: string
  operator: string
  value: string
  condition: string
  conditions?: Condition[]
}
let temp = { field: camelCaseToUnderscore(props.currentField.prop), operator: 'eq', value: '', condition: 'and' }
let conditionsTemp = reactive<Condition[]>([])
conditionsTemp =
  props.currentCondition.length > 0 ? (props.currentCondition as Condition[]) : reactive([{ ...temp } as Condition])
/**
 * 监听方法
 */
watch(
  () => props.currentField,
  () => {
    temp = { field: camelCaseToUnderscore(props.currentField.prop), operator: 'eq', value: '', condition: 'and' }
    conditionsTemp.push(temp)
    $emit('update-conditions', conditionsTemp)
  },
)

const addCondition = () => {
  debugger
  let temp = { field: camelCaseToUnderscore(props.currentField.prop), operator: 'eq', value: '', condition: 'and' }
  conditionsTemp.push(temp)
  $emit('update-conditions', conditionsTemp)
  debugger
}

const addNestedCondition = (index: number) => {
  debugger
  let temp = { field: camelCaseToUnderscore(props.currentField.prop), operator: 'eq', value: '', condition: 'and' }
  const currentCondition = conditionsTemp[index]
  if (currentCondition.conditions) {
    // 如果当前条件已经是嵌套分组，直接添加新条件到该分组
    currentCondition.conditions.push(temp)
  } else {
    // 如果当前条件不是嵌套分组，创建一个新的嵌套分组
    const newNestedGroup = {
      condition: currentCondition.condition,
      conditions: [currentCondition, temp],
    } as Condition
    // 用新的嵌套分组替换当前条件
    conditionsTemp.splice(index, 1, newNestedGroup)
    debugger
  }
  $emit('update-conditions', conditionsTemp)
  debugger
}

const removeCondition = (index: number) => {
  conditionsTemp.splice(index, 1)
  $emit('update-conditions', conditionsTemp)
}

const previewConditionsItem = () => {
  $emit('update-conditions', conditionsTemp)
}

const handleChangeCondition = (_condition: any) => {
  // 触发预览条件更新
  if (_condition.condition === 'or') {
    _condition.condition = 'and'
  } else {
    _condition.condition = 'or'
  }
  $emit('update-conditions', conditionsTemp)
}

const handleChangeOperator = () => {
  // 触发预览条件更新
  $emit('update-conditions', conditionsTemp)
}

const handleChangeValue = () => {
  // 触发预览条件更新
  $emit('update-conditions', conditionsTemp)
}

const handleChangeField = () => {
  // 触发预览条件更新
  $emit('update-conditions', conditionsTemp)
}
</script>

<style scoped>
.condition-group {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.query-builder {
  z-index: 999;
  border-radius: 6px;
  height: auto;
}

.close-button {
  width: 30px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
