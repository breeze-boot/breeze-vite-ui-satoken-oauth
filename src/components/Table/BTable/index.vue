<script setup lang="ts">
import { ElMessage, ElMessageBox, ClickOutside as vClickOutside } from 'element-plus'
import { Btn, ColumnSort, Field, HandleBtn as handleType, QueryParams } from '@/components/Table/types/types.ts'
import { watch, unref } from 'vue'
import { onUpdated, onMounted, reactive, ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDict } from '@/hooks/dict'
import { camelCaseToUnderscore, SORT } from '@/utils/common.ts'
import TableItem from '../TableItem/TableItem.vue'
import { VueDraggable } from 'vue-draggable-plus'
import useColumnStore from '@/store/modules/column'
import { useRoute } from 'vue-router'
import { ColumnCacheData } from '@/types/types.ts'
import SvgButton from '@/components/SvgButton/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import { useMessage } from '@/hooks/message'

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
  // 表格使用的字典
  dict: {
    type: Array,
    default: () => [],
  },
  // 导出数据的接口
  exportApi: {
    type: Function,
    required: false,
  },
  // 是否显示序号
  tableIndex: {
    type: Boolean,
    default: false,
  },
  // 选择框样式
  select: {
    type: String,
    default: 'single',
  },
  // 主键
  pk: {
    type: String,
    default: 'id',
  },
  // 选中行数据
  checkedRows: {
    type: Array,
    default: () => [],
  },
  // 表格字段配置
  fieldList: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 表格数据配置
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
  // 操作栏配置
  handleBtn: {
    type: Object,
    default: () => {},
  },
  // 操作按钮是否不可点击
  rowBtnDisable: {
    type: Function,
    default: () => false,
  },
  // 操作按钮是否隐藏
  rowBtnHidden: {
    type: Function,
    default: () => true,
  },
  // 操作按钮是否不可点击
  headerBtnDisable: {
    type: Function,
    default: () => false,
  },
  // 操作按钮是否隐藏
  headerBtnHidden: {
    type: Function,
    default: () => true,
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
    default: () => {},
  },
  // 刷新
  refresh: {
    type: Number,
  },
  // 开启初始化后自动刷新
  mountedRefresh: {
    type: Boolean,
    default: true,
  },
})

const normalTableRef = ref<any>('')
let $route = useRoute()
const columnStore = useColumnStore()
const { theme } = storeToRefs(useSettingStore())
const { t } = useI18n()
const $emit = defineEmits(['handle-row-db-click', 'selection-change', 'init-table-data'])
// 分页信息
const pagerInfo = ref({
  layout: 'total,sizes,prev,pager,next,jumper',
  pageSizes: [10, 20, 50, 100, 200, 300, 500, 600],
})
// 分页查询条件
const pagerQuery = ref({
  // 总条数
  total: 0,
  // 当前页
  current: 1,
  // 每页条数
  size: 10,
})

const tableInfo = ref({
  loading: false,
  // 显示的列
  showFieldList: [] as Field[],
})

const tableData = ref({
  // 表格的值
  rows: [] as any[],
})

let singleSelectValue = ref<undefined | any | number>()
let currentRows = ref<any>()

/**
 * 表格渲染需要的字典
 */
const dict = useDict(...props.dict)

/**
 * 表格数据
 */
const initTableData = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('init-table-data', value)
  },
})

/**
 * 初始化事件
 */
onMounted(() => {
  initColumn()
  refreshData()
})

/**
 * 更新事件
 */
onUpdated(() => {
  return normalTableRef.value.doLayout()
})

/**
 * 刷新数据
 */
const refreshData = () => {
  if (props.mountedRefresh) {
    getList()
  }
}

/**
 * 初始化操作按钮
 */
const initHandleBtn = reactive((props.handleBtn as handleType) || ({} as handleType))

/**
 * 行内按钮
 */
const handleBtnOperate = props.handleBtn || false

/**
 * 初始化事件
 */
const initColumn = async () => {
  tableInfo.value.showFieldList = []
  // 路由名称就是菜单组件名称
  const routeName: string = $route.name as string
  const columns: string[] = (await columnStore.getColumnByMenu(routeName)) as string[]
  ;(props.fieldList as Field[])?.forEach((item: Field, index: number) => {
    let tempItem: Field = {
      ...item,
      key: index,
      fixed: item.fixed || false,
      align: item.align || 'center',
      width: typeof item.width === 'string' ? item.width.replace('px', '').replace('%', '') : item.width || '',
      sliderWidth: item.width as number,
      hidden: item.hidden || false,
      disabled: item.disabled || false,
      visible: item.hidden || true,
    }

    if (columns.indexOf(tempItem.prop) !== -1) {
      tempItem.hidden = true
      tempItem.disabled = true
      tempItem.visible = false
    }
    tableInfo.value.showFieldList.push(tempItem)
  })
}

/**
 * 表格显示列计算属性
 */
const tableField = computed(() => {
  return tableInfo.value.showFieldList.filter((item) => !item.hidden)
})

/**
 * 表格样式计算属性
 */
const tableStyle = computed(() => ({ width: props.tableWidth }))

/**
 * 是否开启分页
 */
const enablePager = ref(props.pager)

/**
 * 初始化表格顶部按钮设置
 */
const initTbHeaderBtn = computed(() => props.tbHeaderBtn as Btn[])

/**
 * 排序列
 */
const sortField = new Map()

const setOrder = (order?: ColumnSort, obj?: QueryParams) => {
  // 检查是否有排序字段和排序顺序
  if (order) {
    // 获取排序顺序（升序或降序）
    const ascSortOrder = SORT.ASE
    const descSortOrder = SORT.DESC
    // 获取当前排序字段列表
    let ascSortProps = sortField.get(ascSortOrder) || ''
    let descSortProps = sortField.get(descSortOrder) || ''

    // 获取当前排序字段
    const prop = camelCaseToUnderscore(order.prop) + '|'
    // 检查当前字段是否已经存在于排序字段列表中
    const propIndexAsc = ascSortProps.indexOf(prop)
    const propIndexDesc = descSortProps.indexOf(prop)

    // 如果字段已存在，则移除
    if (propIndexAsc !== -1 || propIndexDesc !== -1) {
      ascSortProps = ascSortProps.replace(prop, '')
      descSortProps = descSortProps.replace(prop, '')
    }

    const sortOrder = order.order
    if (ascSortOrder === sortOrder) {
      ascSortProps += prop
    } else {
      descSortProps += prop
    }
    sortField.set(ascSortOrder, ascSortProps)
    sortField.set(descSortOrder, descSortProps)
    if (obj) {
      obj['sort'] = Object.fromEntries(sortField)
    }
  }
}

/**
 * 自定义排序
 *
 * @param order
 */
const handleSortChange = (order: ColumnSort) => {
  getList({
    order: order.order,
    prop: order.prop,
  })
}

/**
 * 处理查询条件
 */
const handleParams = (order?: ColumnSort) => {
  const obj = {} as QueryParams
  for (const key in props.query) {
    if (props.query[key] || props.query[key] === 0) {
      obj[key] = props.query[key]
    }
  }

  setOrder(order, obj)

  // 根据分页条件，整个查询
  return props.pager ? { ...obj, ...pagerQuery.value } : obj
}

/**
 * 获取数据
 */
const getList = async (order?: ColumnSort) => {
  singleSelectValue.value = undefined
  currentRows.value = []

  // 父组件传入的数据，直接渲染
  if (initTableData.value.length > 0) {
    tableInfo.value.loading = true
    tableData.value.rows = initTableData.value as any[]
    props.select === 'single' ? setSingleCheckedList() : setMultiCheckedList()
    handleOnEnd()
    tableInfo.value.loading = false
    return
  }

  if (!props.listApi) return

  try {
    tableInfo.value.loading = true
    const response: any = await props.listApi(handleParams(order))
    tableData.value.rows = []
    if (props.pager) {
      tableData.value.rows = response?.data.records
      pagerQuery.value.total = Number(response?.data.total)
    } else {
      tableData.value.rows = response?.data
    }
    props.select === 'single' ? setSingleCheckedList() : setMultiCheckedList()
  } catch (err: any) {
    useMessage().warning(err.message)
  } finally {
    handleOnEnd()
    tableInfo.value.loading = false
  }
}

/**
 * 设置当前选中项
 */
const setMultiCheckedList = () => {
  if (!props.checkedRows) {
    return
  }
  props.checkedRows.forEach((selected: any) => {
    // 传来的值去匹配表格数据
    const row = tableData.value.rows.find(
      (item: any) => item[props.pk] === selected[props.pk] || item[props.pk] + '' === selected,
    )
    nextTick(() => {
      if (!row) return
      normalTableRef.value.toggleRowSelection(row, undefined)
    })
  })
}

/**
 * 设置当前选中项
 */
const setSingleCheckedList = () => {
  if (!props.checkedRows) {
    return
  }
  props.checkedRows.forEach((selected: any) => {
    // 传来的值去匹配表格数据
    const index = (tableData.value.rows as []).findIndex(
      (item: any) => item[props.pk] === selected[props.pk] || item[props.pk] === selected,
    )

    nextTick(() => {
      if (index !== -1) {
        singleSelectValue.value = index
      }
      const rows = tableData.value.rows[index]
      $emit('selection-change', rows)
      currentRows.value = rows
    })
  })
}

/**
 * 页码改变事件
 *
 * @param size
 */
const handleSizeChange = (size: number) => {
  pagerQuery.value.size = size
  getList()
}

/**
 * 当前页改变事件
 *
 * @param current
 */
const handleCurrentChange = (current: number) => {
  pagerQuery.value.current = current
  getList()
}

/**
 * 选中行数据执行
 *
 * @param row
 */
const handleSelectionChange = (row: any) => {
  $emit('selection-change', row)
  currentRows.value = row
}

/**
 * 点击表格的行项目 选中当前行
 *
 * @param row
 */
const handleRowClick = (row: any) => {
  const index = (tableData.value.rows as []).findIndex((item: any) => item[props.pk] === row[props.pk])
  if (index !== -1) {
    singleSelectValue.value = index
  }
  if (props.select === 'single') {
    $emit('selection-change', row)
    currentRows.value = row
    return
  }
  if (row) {
    normalTableRef.value!.toggleRowSelection(row, undefined)
  } else {
    normalTableRef.value!.clearSelection()
  }
}

/**
 * 双击表格的行项目
 *
 * @param row 行数组或者行对象
 */
const handleRowDbClick = (row: any) => {
  $emit('handle-row-db-click', row)
  currentRows.value = row
}

/**
 * 派发按钮点击事件
 *
 * @param btn
 * @param row
 * @param index
 */
const handleTableRowClick = (btn: Btn, row: any, index: number) => {
  switch (btn.event) {
    case 'delete' || 'remove':
      confirmBox(() => {
        btn.eventHandle ? btn.eventHandle(row, index) : useMessage().warning('未配置事件')
      })
      break
    default:
      btn.eventHandle ? btn.eventHandle(row, index) : useMessage().warning('未配置事件')
      break
  }
}

/**
 * 表格头部按钮点击事件
 *
 * @param btn
 * @param rows
 * @param index
 */
const handleHeadBtnClick = (btn: Btn, rows: any, index: number) => {
  switch (btn.event) {
    case 'delete' || 'remove':
      if (!rows) {
        useMessage().warning(t('common.delTip'))
        return
      }
      confirmBox(() => {
        btn.eventHandle ? btn.eventHandle(rows, index) : useMessage().warning(t('common.noHandle'))
      })
      break
    case 'edit':
      handleCheckBeforeClickBtn().then(() => {
        btn.eventHandle ? btn.eventHandle(rows, index) : useMessage().warning(t('common.noHandle'))
      })
      break
    case 'export':
      handleExport(handleParams())
      break
    default:
      btn.eventHandle ? btn.eventHandle(rows, index) : useMessage().warning(t('common.noHandle'))
      break
  }
}

/**
 * 确认删除
 *
 * @param func
 */
const confirmBox = (func: any) => {
  ElMessageBox.confirm(t('common.tableRowConfirmMsg'), t('common.delete'), {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      func()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.cancel'),
      })
    })
}

/**
 * 按钮点击前校验方法
 */
const handleCheckBeforeClickBtn = () => {
  return new Promise((resolve, reject) => {
    if (!currentRows.value || currentRows.value.length === 0) {
      useMessage().warning(t('common.selectLineItem'))
      reject()
      return
    }
    resolve({})
  })
}

/**
 * 后台请求导出数据，处理数据
 *
 * @param query
 */
const handleExport = (query: any) => {
  if (!props.exportApi) {
    useMessage().warning('导出接口未配置')
    return
  }
  console.debug(query)
}

// 表格设置按钮
const tableSettingButtonRef = ref()
const tableSettingsPopoverRef = ref()

const tableColumnPermissionButtonRef = ref()
const tableColumnPermissionPopoverRef = ref()

const tableSettingsOnClickOutside = () => {
  unref(tableSettingsPopoverRef).popperRef?.delayHide?.()
}

const tableColumnPermissionOnClickOutside = () => {
  unref(tableColumnPermissionPopoverRef).popperRef?.delayHide?.()
}

/**
 * 设置菜单列的权限
 *
 * @param value
 * @param field
 */
const handleSetColumnVisible = async (value: boolean, field: Field) => {
  const routeName: string = $route.name as string
  const data: ColumnCacheData = {
    menu: routeName,
    columns: [field.prop],
    // true 后端删除列控制，前端进行展示
    // false 后端增加列控制，前端进行隐藏
    visible: value,
  }
  await columnStore.setColumnByMenu(data)
  getList()
}

/**
 * 监听方法
 */
watch(
  () => props.reloadCurrentPage,
  () => {
    pagerQuery.value.current = 1
    getList()
  },
)
/**
 * 监听方法
 */
watch(
  () => props.refresh,
  () => {
    getList()
  },
)

/**
 * 监听切换选择
 */
watch(
  () => props.checkedRows,
  () => {
    if (!props.checkedRows || props.checkedRows.length <= 0) {
      props.select === 'single' ? (singleSelectValue.value = -1) : normalTableRef.value!.clearSelection()
      return
    }
    // 设置当前选中项
    props.checkedRows.forEach((selected: any) => {
      if (!normalTableRef.value.rows) return
      // 传来的值去匹配表格数据
      const index = (tableData.value.rows as []).findIndex(
        (item: any) => item[props.pk] === selected[props.pk] || item[props.pk] === selected,
      )

      nextTick(() => {
        if (index < 0) return
        const row = tableData.value.rows[index]
        if (props.select === 'single') {
          $emit('selection-change', row)
          currentRows.value = row
          return
        }
        normalTableRef.value.toggleRowSelection(row, true)
      })
    })
  },
)

let tableKey = ref<number>(Math.random())
const handleOnEnd = () => {
  tableKey.value = Math.random()
}

const handleSliderChange = (row: any) => {
  row.width = row.sliderWidth
}
</script>

<template>
  <el-popover
    placement="left-start"
    :popper-style="{
      width: 'auto',
    }"
    ref="tableSettingsPopoverRef"
    :virtual-ref="tableSettingButtonRef"
    trigger="click"
    :title="t('common.tableColumn')"
    virtual-triggering
  >
    <VueDraggable v-model="tableInfo.showFieldList" target="tbody" @end="handleOnEnd">
      <el-table ref="bTableSettings" :data="tableInfo.showFieldList" style="width: 100%" max-height="350">
        <el-table-column fixed prop="prop" :label="t('settings.fields.prop')" width="150" />
        <el-table-column prop="label" :label="t('settings.fields.label')" width="120" />
        <el-table-column prop="hidden" :label="t('settings.fields.hidden')" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.hidden"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              :disabled="row.disabled"
              @change="getList()"
            />
          </template>
        </el-table-column>
        <el-table-column prop="width" :label="t('settings.fields.width')" width="250">
          <template #default="{ row }">
            <el-slider :min="150" :max="500" v-model="row.sliderWidth" @change="handleSliderChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="fixed" :label="t('settings.fields.fixed')" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.fixed"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
      </el-table>
    </VueDraggable>
  </el-popover>

  <el-popover
    placement="left-start"
    :popper-style="{
      width: 'auto',
    }"
    ref="tableColumnPermissionPopoverRef"
    :virtual-ref="tableColumnPermissionButtonRef"
    trigger="click"
    :title="t('common.setTableColumn')"
    virtual-triggering
  >
    <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-direction: column">
      <el-checkbox
        v-for="(item, index) in tableInfo.showFieldList"
        @change="handleSetColumnVisible(item.visible as boolean, item)"
        :label="item.label"
        v-model="item.visible"
        :key="index"
      ></el-checkbox>
    </div>
  </el-popover>

  <el-card shadow="never" style="margin: 10px 0">
    <template #header>
      <div class="tools">
        <div v-if="initTbHeaderBtn" class="table-btn-group">
          <div v-for="(item, index) in initTbHeaderBtn" :key="index" style="margin: 0 0.5rem">
            <svg-button
              :key="index"
              :type="item.type"
              :circle="false"
              :label="item.label"
              :icon="item.icon"
              :disabled="item.disabled || headerBtnDisable(item.event, currentRows)"
              v-if="item.hidden || headerBtnHidden(item.event, currentRows)"
              v-has="item.permission"
              @svg-btn-click="handleHeadBtnClick(item, currentRows, index)"
            />
          </div>
          <slot name="tbHeaderBtn"></slot>
        </div>
        <div class="tool-btn">
          <svg-button
            ref="tableSettingButtonRef"
            v-click-outside="tableSettingsOnClickOutside"
            icon="settings"
            width="1.4rem"
            :circle="true"
          />
          <svg-button
            v-has="['ROLE_ADMIN']"
            ref="tableColumnPermissionButtonRef"
            v-click-outside="tableColumnPermissionOnClickOutside"
            icon="column_permission"
            width="1.4rem"
            :circle="true"
          />
        </div>
      </div>
    </template>

    <div class="table">
      <el-table
        ref="normalTableRef"
        :fit="true"
        :data="tableData.rows"
        :max-height="tableHeight"
        :height="tableHeight"
        v-loading="tableInfo.loading"
        border
        stripe
        row-key="id"
        :key="tableKey"
        :summary-method="props.summaryMethod"
        :span-method="props.spanMethod"
        :style="tableStyle"
        :show-summary="showSummary"
        :highlight-current-row="true"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDbClick"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
      >
        <el-table-column
          v-if="props.select === 'multi'"
          key="selection"
          fixed="left"
          align="center"
          type="selection"
          width="60"
        />

        <el-table-column
          v-else-if="props.select === 'single'"
          key="singleSelect"
          fixed="left"
          type="index"
          align="center"
          width="60"
        >
          <template #default="scope">
            <el-radio v-model="singleSelectValue" :label="scope.$index">{{}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('common.no')"
          fixed
          align="center"
          v-if="props.tableIndex"
          type="index"
          :width="tableField.length === 0 ? '' : 66"
        />

        <el-table-column
          v-for="(item, index) in tableField"
          class-name="input-column"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :sortable="item.sortable"
          :header-align="item.align || 'center'"
          :width="item.width || ''"
          :min-width="item.minWidth || ''"
          :show-overflow-tooltip="item.showOverflowTooltip"
          :fixed="item.fixed"
        >
          <template #default="scope">
            <template v-if="item.children">
              <!-- 多级表头 -->
              <el-table-column
                v-for="(_item, _index) in item.children"
                class-name="input-column"
                :key="_index"
                :label="_item.label"
                :sortable="_item.sortable"
                :align="_item.align || 'center'"
                :header-align="_item.align || 'center'"
                :width="_item.width || ''"
                :min-width="_item.minWidth || ''"
                :show-overflow-tooltip="_item.showOverflowTooltip"
                :fixed="_item.fixed"
              >
                <template #default="_">
                  <!-- slot自定义列 -->
                  <template v-if="_item.type === 'slot'">
                    <slot :name="`col-${_item.prop}`" :row="scope.row" :index="scope.$index" />
                  </template>

                  <table-item
                    @reload-data-list="getList"
                    :scope="{
                      row: _.row[item.prop],
                      $index: _.$index,
                      column: _.column,
                    }"
                    :dict="dict"
                    :table-field="_item"
                    :key="_index"
                  />
                </template>
              </el-table-column>
            </template>

            <!-- slot自定义列 -->
            <template v-else-if="item.type === 'slot'">
              <slot :name="`col-${item.prop}`" :row="scope.row" :index="scope.$index" :key="index" />
            </template>

            <table-item @reload-data-list="getList" :dict="dict" :scope="scope" :table-field="item" :key="index" />
          </template>
        </el-table-column>

        <el-table-column
          v-if="handleBtnOperate"
          key="handle"
          :fixed="initHandleBtn.fixed"
          :align="initHandleBtn.align || 'center'"
          :label="initHandleBtn.label || t('common.operate')"
          :width="initHandleBtn.width"
          :min-width="initHandleBtn.minWidth"
        >
          <template #default="scope">
            <template v-for="(item, index) in initHandleBtn.btList" :key="index">
              <!-- 自定义操作类型 -->
              <slot v-if="item.slot" :name="`${item.slotName}`" :data="{ item, row: scope.row }"></slot>
              <!-- 操作按钮 -->
              <svg-button
                :key="index"
                :circle="false"
                v-has="item.permission"
                :link="initHandleBtn.link || item.link"
                :icon="item.icon"
                :type="item.type"
                :label="item.label"
                :disabled="item.disabled || rowBtnDisable(item.event, scope.row)"
                v-if="item.hidden || rowBtnHidden(item.event, scope.row)"
                @svg-btn-click="handleTableRowClick(item, scope.row, scope.$index)"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="enablePager">
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagerQuery.current"
          v-model:page-size="pagerQuery.size"
          :size="theme.size"
          :total="pagerQuery.total"
          :page-sizes="pagerInfo.pageSizes"
          :layout="pagerInfo.layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.tools {
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  height: auto;

  .table-btn-group {
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    padding: 0 5px;
  }
}

.table-pagination {
  padding: 10px;
}
</style>
