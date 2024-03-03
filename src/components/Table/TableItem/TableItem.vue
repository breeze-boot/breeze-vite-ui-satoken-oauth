<!--
 * @author: gaoweixuan
 * @since: 2024-02-28
-->
<script setup lang="ts" name="TableItem">
import { Field, QueryParams } from '@/components/Table/types/types.ts'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

interface Scope {
  row: any
  column: Field
  $index: number
}

const props = defineProps(['tableField', 'scope', 'dict'])
const $router = useRouter()

/**
 * 表格字段
 */
const tableField = ref<Field>(props.tableField as Field)
const dict = ref(props.dict)
const scope = ref<Scope>(props.scope)

interface switchType {
  switchStatus: boolean
}

let switchState = reactive<switchType>({
  switchStatus: false,
})

const switchLoading = ref(false)
const beforeSwitchChange = () => {
  ElMessage.info('点击按钮...')
  switchState.switchStatus = true
  switchLoading.value = false
  return switchState.switchStatus
}

/**
 * switch切换事件
 */
const handleChangeSwitch = (row: any, item: any) => {
  if (switchState.switchStatus) {
    switchLoading.value = true
    if (!item.api) return
    const _data: any = {}
    _data[item.pk] = row[item.pk]
    _data[item.status] = row[item.status]
    item.api(_data).then((response: any) => {
      switchLoading.value = false
      ElMessage.success(response.message)
    })
  }
}

const objToQueryString = (obj: any) => {
  let pairs = []
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      pairs.push(`${key}=${obj[key]}`)
    }
  }
  return `?${pairs.join('&')}`
}

/**
 * 打开链接
 *
 * @param item
 * @param row
 */
const openLink = (item: any, row: any) => {
  // 构造参数
  let query = {} as QueryParams
  // 行数据上获取的参数
  if (item.linkInfo && item.linkInfo.rowParam && item.linkInfo.rowParam.length) {
    item.linkInfo.rowParam.forEach((el: string) => {
      query[el] = row[el]
    })
  }
  if (item.linkInfo && item.linkInfo.query) {
    item.linkInfo.query = {
      ...item.linkInfo.query,
      ...query,
    }
  }
  if (item.linkInfo.routeName.startsWith('http')) {
    item.linkInfo.routeName = objToQueryString(item.linkInfo.query)
    window.open(item.linkInfo.routeName)
  } else {
    $router.push({
      name: item.linkInfo.routeName,
      query: {
        ...item.linkInfo.query,
      },
    })
  }
}
</script>

<template>
  <!-- slot自定义列 -->
  <template v-if="tableField.type === 'slot'">
    <slot :name="`col-${tableField.prop}`" :row="scope.row"></slot>
  </template>

  <!-- 长文本 -->
  <template v-else-if="tableField.type === 'longText'">
    <el-tooltip effect="light" placement="top">
      <template #content>
        <el-input
          :autosize="{ minRows: tableField.textarea?.minRows || 12, maxRows: tableField.textarea?.maxRows || 24 }"
          :style="{ width: tableField.textarea?.width || '1000px' }"
          type="textarea"
          v-model="scope.row[tableField.prop]"
          readonly
        />
      </template>
      <el-button icon="view" :link="true" v-if="scope.row[tableField.prop]" type="success" />
    </el-tooltip>
  </template>

  <!-- 链接 -->
  <template v-else-if="tableField.type === 'link'">
    <a style="cursor: pointer; color: #00b8fa" @click="openLink(tableField, scope.row)">
      {{ scope?.row?.[tableField.prop] }}
    </a>
  </template>

  <!-- 自定义链接名称-->
  <template v-else-if="tableField.type === 'customLink'">
    <a style="cursor: pointer; color: #00b8fa" @click="openLink(tableField, scope.row)">
      {{ tableField.linkName }}
    </a>
  </template>

  <!-- input-->
  <template v-else-if="tableField.type === 'input'">
    <el-input type="text" v-model="scope.row[tableField.prop]" :readonly="tableField.input?.readonly" />
  </template>

  <!-- upload-->
  <template v-else-if="tableField.type === 'dialogUpload'">
    <el-button>上传</el-button>
  </template>

  <!-- switch-->
  <template v-else-if="tableField.type === 'switch'">
    <el-tooltip :content="'switch value: ' + scope.row[tableField.prop]" placement="top">
      <el-switch
        :loading="switchLoading"
        v-model="scope.row[tableField.prop]"
        :style="tableField.switch?.style || '--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'"
        :active-value="tableField.switch?.activeValue || 1"
        :inactive-value="tableField.switch?.inactiveValue || 0"
        :before-change="beforeSwitchChange"
        @change="handleChangeSwitch(scope.row, tableField.switch)"
      />
    </el-tooltip>
  </template>

  <template v-else-if="tableField.type === 'tag' && tableField.tagOptions">
    <el-tag :type="tableField.tagOptions[scope.row?.[tableField.prop]]?.type || 'success'">
      {{ tableField.tagOptions?.[scope.row?.[tableField.prop]]?.name }}
    </el-tag>
  </template>

  <div v-else-if="tableField.type === 'dict' && tableField.dict">
    <el-tag :type="dict[tableField.dict]?.[scope.row?.[tableField.prop]]?.type || 'success'">
      {{ dict[tableField.dict]?.[scope.row?.[tableField.prop]]?.label }}
    </el-tag>
  </div>

  <!-- 简单标签 -->
  <template v-else-if="tableField.type === 'tag' && !tableField.tagOptions && scope.row[tableField.prop]">
    <el-tag>
      {{ scope.row[tableField.prop] }}
    </el-tag>
  </template>

  <!-- 图片 -->
  <template v-else-if="tableField.type === 'image' && scope.row?.[tableField.prop]">
    <el-popover placement="top-start" :width="200" trigger="hover">
      <template #default>
        <div style="display: flex; gap: 16px; flex-direction: column">
          <el-image
            :close-on-press-escape="true"
            :preview-src-list="[scope.row?.[tableField.prop]]"
            :src="scope.row?.[tableField.prop]"
            fit="contain"
          />
        </div>
      </template>
      <template #reference>
        <el-button icon="view" :link="true" v-if="scope.row[tableField.prop]" type="success" />
      </template>
    </el-popover>
  </template>

  <!-- icon -->
  <template v-else-if="tableField.type === 'icon'">
    <svg-icon :name="scope.row[tableField.prop]" />
  </template>

  <!-- 数组文本 -->
  <template v-else-if="scope.row[tableField.prop] instanceof Array">
    <el-tag style="margin: 0 2px" v-for="(item, index) in scope.row[tableField.prop]" :key="index">
      {{ item }}
    </el-tag>
  </template>

  <!-- 文本 -->
  <template v-else>
    {{ scope.row[tableField.prop] }}
  </template>
</template>
