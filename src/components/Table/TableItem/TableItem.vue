<!--
 * @author: gaoweixuan
 * @since: 2024-02-28
-->
<script setup lang="ts">
import { Columns, Field, QueryParams, SwitchOption, UploadOption } from '@/components/Table/types/types.ts'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import FileUploadButton from '@/components/FileUploadButton/index.vue'
import useTabsStore from '@/store/modules/tabs.ts'

defineOptions({
  name: 'TableItem',
  inheritAttrs: false,
})

interface Scope {
  row: any
  column: Field
  $index: number
}

const $router = useRouter()
const $route = useRoute()
const tabStore = useTabsStore()
const props = defineProps(['tableField', 'scope', 'dict'])
const $emit = defineEmits(['reloadDataList'])

/**
 * 表格字段
 */
const tableField = ref<Field>(props.tableField as Field)
const dict = ref(props.dict)
const scope = ref<Scope>(props.scope)

interface switchType {
  switchStatus: boolean
}

/**
 * switch状态
 */
let switchState = reactive<switchType>({
  switchStatus: false,
})

const editId = ref(undefined)

/**
 * input点击事件
 */
const handleInputViewClick = (item: any, row: any) => {
  editId.value = row.id
}

/**
 * 失去焦点
 */
const inputBlur = (item: any, row: any) => {
  if (row[item.prop]) {
    editId.value = undefined
    return
  }
  ElMessage.warning('请输入正确的值')
}

/**
 * 保存行
 */
const saveRow = () => {}

const switchLoading = ref(false)

/**
 * switch点击事件
 */
const beforeSwitchChange = (): boolean => {
  ElMessage.info('click...')
  switchState.switchStatus = true
  switchLoading.value = false
  return switchState.switchStatus
}

/**
 * switch切换事件
 */
const handleChangeSwitch = async (row: any, switchOption: SwitchOption) => {
  if (switchState.switchStatus) {
    switchLoading.value = true
    if (!switchOption.api) return
    const _data: any = {}
    _data[switchOption.pk] = row[switchOption.pk]
    _data[switchOption.status] = row[switchOption.status]
    const response: any = await switchOption.api(_data)
    switchLoading.value = false
    ElMessage.success(response.message)
  }
}

/**
 * 构造参数
 *
 * @param obj
 * @returns
 */
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
const openLink = async (item: any, row: any) => {
  // 构造参数
  let query = {} as QueryParams
  // 从当前行数据获取参数
  item.linkInfo.rowParam?.forEach((paramName: string) => {
    query[paramName] = row[paramName]
  })

  // 获取传入的参数
  item.linkInfo.query = {
    ...item.linkInfo.query,
    ...query,
  }

  const httpUrl = row[item.linkInfo.linkUrlProp]
  if (httpUrl && httpUrl.startsWith('http')) {
    // 外部链接
    window.open(httpUrl + objToQueryString(item.linkInfo.query))
  } else {
    // 路由跳转
    await $router.push({
      path: item.linkInfo.routePath,
      query: {
        ...item.linkInfo.query,
      },
    })
    tabStore.setTab($route)
  }
}

/**
 * 上传事件完成后回调
 */
const handleUploadCallback = async (row: any, uploadOption: UploadOption) => {
  if (uploadOption.callback && !uploadOption.api) {
    uploadOption.callback(row)
    return
  }

  if (!uploadOption.pk) {
    console.error('ERROR: pk data')
    return
  }
  if (!uploadOption.api) {
    console.error('ERROR: api data')
    return
  }
  if (uploadOption.fileLimit !== 1) {
    console.error('ERROR: Please customize the upload method when limit > 1')
    return
  }
  const _data: any = {}
  _data[uploadOption?.pk] = row[uploadOption?.pk]
  const columns: Columns = uploadOption?.columns || {}
  Object.keys(columns).forEach((key: string) => {
    const attr = columns[key] || ''
    _data[attr] = row.fileUpload[0][key]
  })

  const response: any = await uploadOption.api(_data)
  ElMessage.success(response.message)
  if (uploadOption.callback) {
    uploadOption.callback(row)
  }
  if (uploadOption.uploadRefresh) {
    $emit('reloadDataList')
  }
}
</script>

<template>
  <!-- slot自定义列 -->
  <template v-if="tableField.type === 'slot'">
    <slot :name="`col-${tableField.prop}`" :row="scope.row" />
  </template>

  <!-- 长文本 -->
  <template v-else-if="tableField.type === 'longText'">
    <el-tooltip effect="light" placement="top">
      <template #content>
        <el-input
          v-if="scope.row[tableField.prop]"
          :autosize="{ minRows: tableField.textarea?.minRows || 12, maxRows: tableField.textarea?.maxRows || 24 }"
          :style="{ width: tableField.textarea?.width || '1000px' }"
          type="textarea"
          v-model="scope.row[tableField.prop]"
          readonly
        />
      </template>
      <el-button icon="view" :link="true" :disabled="!scope.row[tableField.prop]" type="success" />
    </el-tooltip>
  </template>

  <!-- 链接 -->
  <template v-else-if="tableField.type === 'rowLink'">
    <a style="cursor: pointer; color: #00b8fa" @click="openLink(tableField, scope.row)">
      {{ scope?.row?.[tableField.prop] }}
    </a>
  </template>

  <!-- 自定义链接名称-->
  <template v-else-if="tableField.type === 'customRowLink'">
    <a style="cursor: pointer; color: #00b8fa" @click="openLink(tableField, scope.row)">
      {{ scope?.row[tableField?.linkInfo?.columnName || ''] || tableField.linkInfo?.fixColumnName }}
    </a>
  </template>

  <!-- file upload -->
  <template v-else-if="tableField.type === 'fileUpload' && tableField.upload">
    <file-upload-button
      :file-limit="tableField.upload?.fileLimit"
      :biz-type="tableField.upload.bizType"
      :file-size="tableField.upload?.fileSize"
      :file-type="tableField.upload?.fileType"
      v-model="scope.row[tableField.type]"
      @upload-callback="handleUploadCallback(scope.row, tableField.upload)"
    />
  </template>

  <!-- file list 展示 -->
  <template v-else-if="tableField.type === 'fileList'">
    <el-popover placement="top-start" :width="200" trigger="hover">
      <template #default>
        <div v-if="scope.row[tableField.prop]" style="display: flex; gap: 16px; flex-direction: column">
          <el-tag style="margin: 0 2px" v-for="(item, index) in scope.row['fileUpload']" :key="index">
            {{ item.name }}
          </el-tag>
        </div>
      </template>
      <template #reference>
        <el-button icon="view" :link="true" :disabled="!scope.row['fileUpload']" type="success" />
      </template>
    </el-popover>
  </template>

  <!-- 行内input -->
  <template v-else-if="tableField.type === 'input'">
    <el-form-item
      label-width="0"
      :rules="tableField.formOptions?.rules"
      :prop="`rows[${scope.$index}][${tableField.prop}]`"
    >
      <span v-if="editId != scope.row.id" class="input-span" @click="handleInputViewClick(tableField, scope.row)">
        {{ scope.row[tableField.prop] }}
      </span>
      <el-input v-else v-model="scope.row[tableField.prop]" @blur="inputBlur(tableField, scope.row)" />
    </el-form-item>
  </template>

  <!-- 行内下拉框 -->
  <template v-else-if="tableField.type === 'select'">
    <el-form-item
      label-width="0"
      :rules="tableField.formOptions?.rules"
      :prop="'ruleForm.' + scope.$index + '.' + tableField.prop"
      :label="tableField.label"
    >
      <el-select
        v-model="scope.row[tableField.prop]"
        :placeholder="tableField.formOptions?.placeholder"
        style="width: 100%"
        @change="saveRow"
      >
        <el-option
          v-for="_ in tableField.formOptions?.tagSelect
            ? tableField.formOptions?.tagSelect
            : scope.row[tableField.formOptions?.selectOptionKey || 'select']"
          :key="_.value"
          :label="_.label"
          :value="_.value"
        />
      </el-select>
    </el-form-item>
  </template>

  <!-- switch-->
  <template v-else-if="tableField.type === 'switch' && tableField.switch">
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

  <!-- tag -->
  <template v-else-if="tableField.type === 'tag' && tableField.tag">
    <el-tag v-if="scope.row?.[tableField.prop]" :type="tableField.tag[scope.row?.[tableField.prop]]?.type || 'info'">
      {{ tableField.tag?.[scope.row?.[tableField.prop]]?.name }}
    </el-tag>
  </template>

  <!-- 字典 -->
  <div v-else-if="tableField.type === 'dict' && tableField.dict">
    <el-tag
      v-if="scope.row?.[tableField.prop] !== undefined"
      :type="dict[tableField.dict]?.[scope.row?.[tableField.prop]]?.type || 'info'"
    >
      {{ dict[tableField.dict]?.[scope.row?.[tableField.prop]]?.label }}
    </el-tag>
  </div>

  <!-- 简单标签 -->
  <template v-else-if="tableField.type === 'tag' && !tableField.tag && scope.row[tableField.prop] !== undefined">
    <el-tag v-if="scope.row?.[tableField.prop]">
      {{ scope.row[tableField.prop] }}
    </el-tag>
  </template>

  <!-- 图片 -->
  <template v-else-if="tableField.type === 'image' && scope.row?.[tableField.prop]">
    <el-popover placement="top-start" :width="200" trigger="hover">
      <template #default>
        <div v-if="scope.row[tableField.prop]" style="display: flex; gap: 16px; flex-direction: column">
          <el-image
            :close-on-press-escape="true"
            :preview-src-list="[scope.row?.[tableField.prop]]"
            :src="scope.row?.[tableField.prop]"
            fit="contain"
          />
        </div>
      </template>
      <template #reference>
        <el-button icon="view" :link="true" :disabled="!scope.row[tableField.prop]" type="success" />
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
<style lang="scss">
.input-column {
  padding: 0 !important;

  .el-form-item {
    --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);

    .input-span {
      cursor: pointer;
      width: 100%;
      display: block;
      height: var(--el-input-inner-height);
      line-height: var(--el-input-inner-height);
    }

    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0 !important;
  }
}
</style>
