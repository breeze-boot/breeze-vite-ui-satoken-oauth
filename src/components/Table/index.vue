<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { btn, field, handle as handleType, queryParams } from './types/types.ts'
import { watch } from 'vue'
import { onUpdated, onMounted, reactive, ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { useDict } from '@/hooks/dict'
import { DictHook } from '@/types/types.ts'

defineOptions({
  name: 'BTable',
  inheritAttrs: false,
})

const props = defineProps({
  // 表格顶部按钮
  tbHeaderBtn: {
    type: Array,
    default: () => [],
  },
  // 表格使用的字典
  dicts: {
    type: Array,
    default: () => [],
  },
  // 表格宽度，默认100%
  tableWidth: {
    type: String,
    default: '100%',
  },
  // 表格高度，默认60%
  tableHeight: {
    type: String,
    default: '60%',
  },
  // 是否展示合并行
  showSummary: {
    type: Boolean,
    default: false,
  },
  // 合计行方法
  summaryMethod: {
    type: Function,
    default: () => {},
  },
  // 合并行或者列方法
  spanMethod: {
    type: Function,
  },
  // 获取数据的接口
  listApi: {
    type: Function,
    required: true,
  },
  // 导出数据的接口
  exportApi: {
    type: Function,
    required: true,
  },
  // 是否显示序号
  tableIndex: {
    type: Boolean,
    default: false,
  },
  // 是否有选择框
  selection: {
    type: Boolean,
    default: false,
  },
  // 选择框是否单选
  singleSelect: {
    type: Boolean,
    default: false,
  },
  // 主键
  pk: {
    type: String,
    default: 'id',
  },
  // 选中行数据
  checkedList: {
    type: Array,
    default: () => [],
  },
  // 表格字段配置
  fieldList: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 操作栏配置
  handle: {
    type: Object,
  },
  // 操作按钮集合disabled
  btnDisableSets: {
    type: Function,
    default: () => false,
  },
  // 是否分页
  pager: {
    type: Boolean,
    default: true,
  },
  // 重置到第一页
  reloadCurrentPage: {
    type: Number,
  },
  // 查询条件
  query: {
    type: Object,
    default: () => ({}),
  },
  // 刷新
  refresh: {
    type: Number,
  },
})

let dict: DictHook = reactive<DictHook>({})
const table = ref<null | any>()
const $router = useRouter()
const $emit = defineEmits([
  'handle-table-header-btn-click',
  'handle-row-db-click',
  'selection-change',
  'handle-table-row-btn-click',
])
const { initDict } = useDict()
const tableInfo = reactive({
  tbHeaderBtn: [] as btn[],
  currentRows: [] as any,
  loading: ref(false),
  singleSelectValue: undefined as undefined | any | number,
  enablePager: false,
  // 分页信息
  pagerQuery: {
    // 总条数
    total: 0,
    // 分页数量列表
    layout: 'total,sizes,prev,pager,next,jumper',
    pageSizes: [10, 20, 50, 100, 200, 300, 500, 600],
    // 查询条件
    query: {
      // 当前页
      current: 1,
      // 每页条数
      size: 10,
    },
  },
  showFieldList: [] as field[],
  handle: {} as handleType,
  rows: [],
})

const showColumns = computed(() =>
  tableInfo.showFieldList.filter((item: field) => {
    console.debug(`设置表格列的显示隐藏`)
    return !item.hidden || false
  }),
)

/**
 * 表格样式计算属性
 */
const tableStyle = computed(() => {
  console.debug(`设置表格样式`)
  return { width: props.tableWidth }
})

/**
 * 更新事件
 */
onUpdated(() => {
  console.debug(`表格重置布局`)
  return table.value.doLayout()
})

/**
 * 初始化事件
 */
onMounted(() => {
  console.debug(`表格初始化`)
  initDict(props.dicts).then((response: any) => {
    dict = response.value
    initColumns()
    initBtnGroup()
    initHandle()
    initPager()
  })
})

/**
 * 初始化分页组件
 */
const initHandle = () => {
  tableInfo.handle = props.handle as handleType
}

/**
 * 初始化分页组件
 */
const initPager = () => {
  tableInfo.enablePager = props.pager
}

/**
 * 初始化列设置
 */
const initColumns = () => {
  tableInfo.showFieldList = props.fieldList as field[]
}

/**
 * 初始化表格顶部按钮设置
 */
const initBtnGroup = () => {
  tableInfo.tbHeaderBtn = props.tbHeaderBtn as btn[]
}

/**
 * 处理查询条件
 */
const handleParams = () => {
  console.debug(`处理查询条件`)
  const obj = {} as queryParams
  for (const key in props.query) {
    if (props.query[key] || props.query[key] === 0) {
      obj[key] = props.query[key]
    }
  }
  // 根据分页条件，整个查询
  return props.pager ? { ...obj, ...tableInfo.pagerQuery.query } : obj
}

/**
 * 获取数据
 */
const getList = () => {
  tableInfo.singleSelectValue = undefined
  if (!props.listApi) return
  props.listApi(handleParams()).then((response: any) => {
    if (response.code === '0000') {
      tableInfo.rows = []
      if (props.pager) {
        tableInfo.rows = response.data.records
        tableInfo.pagerQuery.total = Number(response.data.total)
      } else {
        tableInfo.rows = response.data.records
      }
      // 设置当前选中项
      if (!props.checkedList) {
        return
      }
      props.checkedList.forEach((selected: any) => {
        const row = tableInfo.rows.find(
          (item) => item[props.pk] === selected[props.pk] || item[props.pk] + '' === selected[props.pk].toString(),
        )
        nextTick(() => {
          if (!row) return
          table.value.toggleRowSelection(row, true)
        })
      })
    } else {
      ElMessage.warning(response.message)
    }
  })
}

/**
 * 页码改变事件
 *
 * @param val
 */
const handleSizeChange = (val: number) => {
  tableInfo.pagerQuery.query.size = val
  getList()
}

/**
 * 当前页改变事件
 *
 * @param val
 */
const handleCurrentChange = (val: number) => {
  tableInfo.pagerQuery.query.current = val
  getList()
}

/**
 * 单选选中行数据
 *
 * @param row
 */
const singleSelectionChange = (row: any) => {
  $emit('selection-change', cloneDeep(row))
  tableInfo.currentRows = [row]
}

/**
 * 多选选中行数据
 *
 * @param rows
 */
const handleSelectionChange = (rows: any) => {
  $emit('selection-change', rows)
  tableInfo.currentRows = rows
}

/**
 * 点击选中当前行
 *
 * @param row
 */
const handleRowClick = (row: any) => {
  const index = (tableInfo.rows as []).findIndex((item: any) => item[props.pk] === row[props.pk])
  if (index !== -1) {
    tableInfo.singleSelectValue = index
  }
  $emit('selection-change', cloneDeep(row))
}

/**
 * 双击行事件
 *
 * @param row
 */
const handleRowDbClick = (row: any) => {
  $emit('handle-row-db-click', row)
}

/**
 * 派发按钮点击事件
 *
 * @param event
 * @param row
 * @param index
 */
const handleTableRowClick = (event: string, row: any, index: number) => {
  switch (event) {
    case 'delete' || 'remove':
      confirmBox(() => {
        $emit('handle-table-row-btn-click', event, row, index)
      })
      break
    default:
      $emit('handle-table-row-btn-click', event, row, index)
      break
  }
}

/**
 * 确认删除
 *
 * @param func
 */
const confirmBox = (func: any) => {
  ElMessageBox.alert('确认删除当前选择行项目', '删除', {
    confirmButtonText: '',
    callback: () => {
      func()
    },
  })
}

/**
 * 派发表格顶部按钮点击事件
 *
 * @param event
 * @param rows
 */
const handleTableHeaderClick = (event: string, rows: any) => {
  switch (event) {
    case 'del':
      checkBeforeClickBtn().then(() => {
        confirmBox(() => {
          $emit('handle-table-header-btn-click', event, rows)
        })
      })
      break
    case 'add':
      $emit('handle-table-header-btn-click', event, rows)
      break
    case 'export':
      handleExport(props.query)
      break
    default:
      $emit('handle-table-header-btn-click', event, rows)
      break
  }
}

/**
 * 按钮点击前校验方法
 */
const checkBeforeClickBtn = () => {
  return new Promise((resolve, reject) => {
    if (!tableInfo.currentRows || tableInfo.currentRows.length === 0) {
      ElMessage.warning('请先选择操作的行项目')
      reject()
      return
    }
    resolve({})
  })
}

/**
 * 打开链接
 *
 * @param item
 * @param row
 */
const openLink = (item: any, row: any) => {
  // 构造参数
  let query = {} as queryParams
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
const objToQueryString = (obj: any) => {
  let pairs = []
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      pairs.push(`${key}=${obj[key]}`)
    }
  }
  return `?${pairs.join('&')}`
}

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

/**
 * 后台请求导出数据，处理数据
 *
 * @param query
 */
const handleExport = (query: any) => {
  if (!props.exportApi) {
    ElMessage.warning('导出数据错误')
    return
  }
  console.debug(query)
}

/**
 * 监听方法
 */
watch(
  () => props.reloadCurrentPage,
  () => {
    tableInfo.pagerQuery.query.current = 1
    getList()
  },
)
/**
 * 监听方法
 */
watch(
  () => props.refresh,
  () => {
    console.debug(props.refresh)
    getList()
  },
)
</script>

<template>
  <el-card shadow="never" style="margin: 10px 0">
    <template #header>
      <div class="table-btn-group">
        <el-button
          v-for="(item, index) in tableInfo.tbHeaderBtn"
          :key="index"
          :type="item.type"
          v-has="item.permission"
          @click="handleTableHeaderClick(item.event, tableInfo.currentRows)"
        >
          {{ item.label }}
        </el-button>
        <slot name="tbHeaderBtn"></slot>
      </div>
    </template>

    <div class="table">
      <el-table
        ref="table"
        :data="tableInfo.rows"
        :max-height="tableHeight"
        :height="tableHeight"
        v-loading="tableInfo.loading"
        border
        stripe
        :summary-method="summaryMethod"
        :span-method="spanMethod"
        :style="tableStyle"
        :show-summary="showSummary"
        :highlight-current-row="true"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDbClick"
        @row-click="handleRowClick"
      >
        <el-table-column v-if="selection" key="selection" align="center" fixed="left" type="selection" width="55" />
        <el-table-column v-if="singleSelect" key="singleSelect" fixed="left" align="center" width="55">
          <template #default="scope">
            <el-radio
              v-model="tableInfo.singleSelectValue"
              :label="scope.$index"
              @change="singleSelectionChange(scope.row)"
            >
              {{}}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="序号" v-if="tableIndex" type="index" :width="fieldList.length === 0 ? '' : 80" />

        <el-table-column
          v-for="(item, index) in showColumns"
          :key="index"
          v-show="item.hidden"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :width="item.width"
          :min-width="item.minWidth || '100px'"
          :show-overflow-tooltip="item.showOverflowTooltip"
          :fixed="item.fixed"
        >
          <template #default="scope">
            <!-- slot自定义列 -->
            <template v-if="item.type === 'slot'">
              <slot :name="`col-${item.prop}`" :row="scope.row"></slot>
            </template>

            <!-- 长文本 -->
            <template v-else-if="item.type === 'longText'">
              <el-tooltip effect="light" placement="top">
                <template #content>
                  <el-input type="textarea" rows="10" v-model="scope.row[item.prop]" readonly />
                </template>
                <el-button icon="view" :link="true" v-if="scope.row[item.prop]" type="success" />
              </el-tooltip>
            </template>

            <!-- 链接 -->
            <template v-else-if="item.type === 'link'">
              <a style="cursor: pointer; color: #00b8fa" @click="openLink(item, scope.row)">
                {{ scope?.row?.[item.prop] }}
              </a>
            </template>

            <!-- 自定义链接名称-->
            <template v-else-if="item.type === 'customLink'">
              <a style="cursor: pointer; color: #00b8fa" @click="openLink(item, scope.row)">{{ item.linkName }}</a>
            </template>

            <!-- input-->
            <template v-else-if="item.type === 'input'">
              <el-input type="text" rows="10" v-model="scope.row[item.prop]" :readonly="item.input?.readonly" />
            </template>

            <!-- upload-->
            <template v-else-if="item.type === 'dialogUpload'">
              <el-button>上传</el-button>
            </template>

            <!-- switch-->
            <template v-else-if="item.type === 'switch'">
              <el-tooltip :content="'switch value: ' + scope.row[item.prop]" placement="top">
                <el-switch
                  :loading="switchLoading"
                  v-model="scope.row[item.prop]"
                  :style="item.switch?.style || '--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'"
                  :active-value="item.switch?.activeValue || 1"
                  :inactive-value="item.switch?.inactiveValue || 0"
                  :before-change="beforeSwitchChange"
                  @change="handleChangeSwitch(scope.row, item.switch)"
                />
              </el-tooltip>
            </template>

            <!-- 嵌套表格 -->
            <template v-else-if="item.children">
              <el-table-column
                v-for="(childItem, childIndex) in item.children"
                :key="childIndex"
                :prop="childItem.prop"
                :label="childItem.label"
                :align="childItem.align || 'center'"
                :width="childItem.width"
                :min-width="childItem.minWidth || '85px'"
                :show-overflow-tooltip="childItem.showOverflowTooltip"
                :fixed="childItem.fixed"
              />
            </template>

            <template v-else-if="item.type === 'tag' && item.tagOptions">
              <el-tag :type="item.tagOptions[scope.row?.[item.prop]]?.type || 'success'">
                {{ item.tagOptions?.[scope.row?.[item.prop]]?.name }}
              </el-tag>
            </template>

            <div v-else-if="item.type === 'tag' && item.dictCode">
              <el-tag :type="dict[item.dictCode]?.[scope.row?.[item.prop]]?.type || 'success'">
                {{ dict[item.dictCode]?.[scope.row?.[item.prop]]?.label }}
              </el-tag>
            </div>

            <!-- 简单标签 -->
            <template v-else-if="item.type === 'tag' && !item.tagOptions">
              <el-tag>
                {{ scope.row[item.prop] }}
              </el-tag>
            </template>

            <!-- 图片 -->
            <template v-else-if="item.type === 'image' && scope.row?.[item.prop]">
              <el-image height="50px" :src="scope.row?.[item.prop]" />
            </template>
          </template>
        </el-table-column>

        <el-table-column
          v-if="tableInfo.handle"
          key="handle"
          :fixed="tableInfo.handle.fixed"
          :align="tableInfo.handle.align || 'center'"
          :label="tableInfo.handle.label || '操作'"
          :width="tableInfo.handle.width"
          :min-width="tableInfo.handle.minWidth"
        >
          <template #default="scope">
            <template v-for="(item, index) in tableInfo.handle.btList" :key="index">
              <!-- 自定义操作类型 -->
              <slot v-if="item.slot" :name="`${item.slotName}`" :data="{ item, row: scope.row }"></slot>
              <!-- 操作按钮 -->
              <el-button
                v-has="item.permission"
                style="padding: 0 5px !important; margin: 1px !important"
                :link="tableInfo.handle.link"
                :icon="item.icon"
                :type="item.type"
                :disabled="item.disabled || btnDisableSets(item.event, scope.row)"
                @click="handleTableRowClick(item.event, scope.row, scope.$index)"
              >
                {{ item.label }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="tableInfo.enablePager">
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="tableInfo.pagerQuery.query.current"
          :page-size="tableInfo.pagerQuery.query.size"
          :page-sizes="tableInfo.pagerQuery.pageSizes"
          :layout="tableInfo.pagerQuery.layout"
          :total="tableInfo.pagerQuery.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.table-btn-group {
  display: flex;
  justify-content: flex-start;
  padding: 0 20px;
}

.table-pagination {
  padding: 10px;
}
</style>
